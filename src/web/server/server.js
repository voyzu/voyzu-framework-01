/*eslint complexity: "off"*/
/*eslint max-lines: "off"*/

/**
 * Built-in http server.
 * @module "web.server"
 */

// Import core node modules
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import * as url from "node:url";
import * as util from "node:util";
import { Readable } from "node:stream";

// Import installed libraries
import chalk from "chalk";

// Voyzu framework
import * as cache from '../../caching/cache.js';
import { schema as httpRequestSchema } from "../../models/http-request.js";
import { schema as httpResponseSchema } from "../../models/http-response.js";
import { HTTP_CODE, HTTP_RESPONSE_TYPE } from "../../enums/enums.js";
import { generateModel } from "../../model/model.js";
import { toPojo } from "../../helpers/object-helper.js";
import { generateRandomString } from "../../helpers/crypto-helper.js";

// Module primitive constants (settings)
const HOSTNAME = 'localhost';
const HTTP_CODE_VOYZU_ERROR = HTTP_CODE.ERROR;
const ENTRY_FUNCTION_FILE_NAME = 'router';
const ENTRY_FUNCTION_METHOD_NAME = 'fulfillRequest';

// Module constants (settings)
const REQUEST_ID_LENGTH = 6;

/**
 * 
 * Creates a NodeJS server using http.createServer().
 * 
 * Incoming requests are converted to a [http-request model schema](./src/models/http-request.js) object and passed to web/router.js. 
 * 
 * [http-responses](./src/models/http-response.js) returned from web/router.js are converted to NodeJS http responses and written out.
 * 
 * Requires the application to have been initialized.
 * 
 */
export async function listen() {

    // Requires that the application has first been initialized
    const config = cache.get('config');
    const pkg = cache.get('pkg');
    const webDir = cache.get('webDir');

    if (!config) {
        throw new Error('No config file. You must first initialize the component before calling the web server');
    }

    // Component source directory for web files

    if (!fs.existsSync(webDir)) {
        console.error(chalk.redBright(`[${pkg.name}] ${webDir} not found. Are you calling ${pkg.name} from a Voyzu component?`));
        return;
    }

    // The component's entry point (file)
    const entryFunctionFileName = path.join(webDir, `${ENTRY_FUNCTION_FILE_NAME}.js`,);
    if (!fs.existsSync(entryFunctionFileName)) {
        console.error(chalk.redBright(`Error: ${entryFunctionFileName} does not exist.`));
        return;
    }

    // The module we will call to pass httpRequest and receive httpResponse
    const entryModulePath = (url.pathToFileURL(entryFunctionFileName)).href;

    let entryModule;
    try {
        entryModule = await import(entryModulePath);
    } catch (error) {
        console.error(`[${pkg.name}] error importing ${entryModulePath}, check that your component is working correctly`);
        console.error(error);
        return;
    }

    // (mock) context to pass in
    const context = {
        caller: pkg.name
    };

    console.log(chalk.gray(`[${pkg.name}] [server] [debug] calling ${entryModulePath}:${ENTRY_FUNCTION_METHOD_NAME}}`));
    console.log(chalk.gray(`[${pkg.name}] [server] [debug] passing context: ${JSON.stringify(context)}`));

    if (config.hotReload === true) {
        console.warn(chalk.yellowBright(`[${pkg.name}] [server] [warning] hotReload is on, this WILL degrade performance, leak memory and eventually crash your server! Do not use this config setting in production`));
    }

    if (config.bypassAuth === true) {
        console.warn(chalk.yellowBright(`[${pkg.name}] [server] [warning] bypassAuth is true. Your application is available to the world! Use caution when using this config setting in production`));
    }

    console.log();

    // Create Server, the "processRequest" function is called to process server requests
    const server = http.createServer(async (req, res) => {
        req.on("error", (error) => {
            console.log(chalk.redBright(`[${pkg.name}] [server] [error] vserve req.on error event`));
            console.log(util.inspect(error, { depth: null }));
            console.error(chalk.redBright(error));
        });

        // Ignore requests for favicon
        if (req.url.endsWith("favicon.ico")) {
            res.end();
            return;
        }

        // Parse body for POST, PUT and PATCH requests
        let body;
        if (
            req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
            body = [];
            req
                .on("data", (chunk) => {
                    body.push(chunk);
                })
                .on("end", () => {
                    body = Buffer.concat(body).toString();
                    processRequest(req, res, body, entryModule, entryModulePath, context, config, pkg);
                })
                .on("error", (error) => {
                    console.error(chalk.magenta(`${req.method} error`));
                    console.error(chalk.magenta(error));
                });
        } else {
            processRequest(req, res, undefined, entryModule, entryModulePath, context, config, pkg);
        }
    });

    // With our NodeJS http server created and set to process requests we can now call "listen()"
    server.listen(config.port, HOSTNAME, () => {
        console.log(chalk.blue(`[${pkg.name}] [server] server running at http://${HOSTNAME}:${config.port}/`));
        console.log();
    });
};

async function processRequest(req, res, body, entryModule, entryModulePath, context, config, pkg) {
    const start = new Date();

    // Log details of request received
    let commentary = `received ${req.method} ${req.url}`;
    if (body) {
        commentary += `, body has ${body.length} character length`;
    }

    const parsedUrl = url.parse(req.url, true);
    if (Object.keys(parsedUrl.query).length > 0) {
        commentary += `, query string values: ${JSON.stringify(parsedUrl.query)}`;
    }

    console.log(chalk.gray(`[${pkg.name}] [server] [debug] ${commentary}`));

    // Construct route
    let urlPath = parsedUrl.pathname;
    if (urlPath.endsWith("/")) {
        urlPath = urlPath.slice(0, -1);
    }

    let httpMethod = req.method;
    if (httpMethod === 'HEAD') {
        httpMethod = 'GET';
    }
    let fileFriendlyRoute = urlPath.replaceAll("/", "#");
    fileFriendlyRoute += `#${httpMethod}`;

    const httpRequestBase = {
        headers: req.headers,
        request_id: req.headers?.['x-request-id'] || generateRandomString(REQUEST_ID_LENGTH),
        request_values: {
            body,
            cookie: parseCookies(req.headers.cookie),
            query_string_values: toPojo(parsedUrl.query)
        },
        route: {
            component_domain: req.headers.host.split(":")[0],
            component_root_url: req.headers.host,
            file_friendly_route: fileFriendlyRoute,
            raw_url: req.url,
            url: req.url.startsWith('/') ? req.headers.host + req.url : `${req.headers.host}/${req.url}`
        }
    };

    // The httpRequest to pass to our component
    let httpRequest;

    try {
        httpRequest = generateModel(httpRequestBase, httpRequestSchema);
    } catch (error) {
        console.error(chalk.magenta(`[${pkg.name}] There was an error parsing the http request`));
        console.error(error);
        res.setHeader("Content-Type", "text/html");
        res.writeHead(HTTP_CODE_VOYZU_ERROR, "Voyzu component error");

        res.end("null");
        return;
    }

    // And call the components entry point function, passing in our httpRequest and our constructed context
    const entryModuleToServe = config.hotReload ? (await import(`${entryModulePath}?cachebust=${Date.now()}`)) : entryModule;

    // The http respponse to send back
    let response;
    try {
        response = await entryModuleToServe[ENTRY_FUNCTION_METHOD_NAME](httpRequest, context);
    } catch (error) {
        console.error(chalk.magenta(`There was an error calling ${entryModulePath}`));
        let err = util.inspect(error, { depth: null });
        console.error(chalk.magenta(err));

        if (req.headers["user-agent"].toLowerCase().startsWith("mozilla")) {
            err = err.replaceAll(/\r?\n/g, "<br>");
            err = err.replaceAll('\t', "&nbsp;");
            err = err.replaceAll(" ", "&nbsp;");

            res.setHeader("Content-Type", "text/html");
            res.writeHead(HTTP_CODE_VOYZU_ERROR, "Voyzu component error");
        }

        res.end(err);
        return;
    }

    if (!response) {
        console.error(chalk.magenta(`[${pkg.name}] No response was received from the server, sending null`));
        res.setHeader("Content-Type", "text/html");
        res.writeHead(HTTP_CODE_VOYZU_ERROR, "Voyzu component error");

        res.end("null");
        return;
    }

    // Validate that response conforms to httpResponse model format
    let httpResponse;
    try {
        httpResponse = generateModel(response, httpResponseSchema);
    } catch (error) {
        console.error(chalk.magenta(`[${pkg.name}] There was an error parsing the http response`));
        console.error(error);
        res.setHeader("Content-Type", "text/html");
        res.writeHead(HTTP_CODE_VOYZU_ERROR, "Voyzu component error");

        res.end("null");
        return;
    }

    // And serve the response
    for (const [key, value] of Object.entries(httpResponse.http_headers ?? [])) {
        res.setHeader(key, value);
    }

    if (httpResponse.response_content_type) {
        try {
            res.setHeader("Content-Type", httpResponse.response_content_type);
        } catch {
            console.error(chalk.magenta(`[${pkg.name}] Header could not be set for media type ${httpResponse.response_content_type}`));
        }
    }

    try {
        res.writeHead(httpResponse.http_code);
    } catch {
        console.error(chalk.magenta(`[${pkg.name}] response header could not be written for http code${httpResponse.http_code}`));
    }

    if (httpResponse.is_base64_encoded) {
        console.log(chalk.gray(`[${pkg.name}] [server] [debug] response is base64 encoded`));
        const buffer = Buffer.from(httpResponse.response_data, "base64");
        const readable = Readable.from(buffer);
        readable.pipe(res);
    } else if (httpResponse.response_type === HTTP_RESPONSE_TYPE.JSON) {
        res.end(JSON.stringify(httpResponse.response_data));
    } else {
        try {
            res.end(httpResponse.response_data);
        } catch (error) {
            // this error can occur if the response data is an object and not a string or Buffer.
            console.error(chalk.magenta(`There was an error serving the httpResponse.response_data. Is it the correct type?`));
            let err = util.inspect(error, { depth: null });
            console.error(chalk.magenta(err));

            if (req.headers["user-agent"].toLowerCase().startsWith("mozilla")) {
                err = err.replaceAll(/\r?\n/g, "<br>");
                err = err.replaceAll('\t', "&nbsp;");
                err = err.replaceAll(" ", "&nbsp;");
            }

            res.end(err);
            return;
        }
    }

    console.log(chalk.gray(`[${pkg.name}] [server] [debug] served ${req.method} ${req.url} with ${httpResponse.http_code} in ${Date.now() - start} ms`));
}

function parseCookies(cookieArrayOrString) {

    if (!cookieArrayOrString) {
        return;
    }

    const cookieStrings = Array.isArray(cookieArrayOrString) ? cookieArrayOrString : cookieArrayOrString.split(';');

    const cookie = {};
    for (const cookieString of cookieStrings) {
        const [name, value] = cookieString.trim().split('=');
        cookie[name] = value;
    }

    return cookie;
}
