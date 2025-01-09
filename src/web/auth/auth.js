/*eslint complexity: "off"*/
/*eslint new-cap: "off"*/
/*eslint no-magic-numbers : "off"*/

/**
 * Web Authorization and authentication.
 * @module "web.auth"
 */

// Modules from this component
import { schema as authorizationSchema } from "../../models/authorization.js";
import { schema as httpRequestSchema } from "../../models/http-request.js";
import { schema as httpResponseSchema } from "../../models/http-response.js";
import * as cryptoHelper from "../../helpers/crypto-helper.js";
import * as jsonHelper from "../../helpers/json-helper.js";
import { generateModel } from "../../model/model.js";
import { HTTP_CODE, HTTP_RESPONSE_TYPE } from "../../enums/enums.js";

// Primitive constants (settings)
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Attempt to authorize an http request using a supplied function.
 * Set a Redis session key if the supplied function returns a successful authorization.
 * @param {Function} customFunction The custom function used for authenticating the request.
 * @param {object} httpRequestObject Http Request.
 * @param {object} config Component config.
 * @param {string} packageName Name as per package.json. Used to create redis session key.
 * @param {object} redisClient Initialized redis client.
 * @returns {object} An object conforming to the authorization model schema.
 */
export async function authorizeAndCreateSession(customFunction, httpRequestObject, config, packageName, redisClient) {

    // Ensure our httpRequest paramter conforms to the http-request model schema
    const httpRequest = generateModel(httpRequestObject, httpRequestSchema);

    // Call the custom function supplied, passing the http request and the config parameter
    let authorization = await customFunction(httpRequestObject, config);

    if (authorization.authorized) {

        // Create a secure session id
        const sessionId = cryptoHelper.generateRandomString(32);

        // The custom function may or may not attach a session to its authorization object returned
        // Append the date created and session id to this authorization object
        const session = authorization.session ?? {};
        Object.assign(session, {
            date_created: new Date().toISOString(),
            id: sessionId
        });

        // Create a cookie string using the Session Id and append it to the authorization object
        authorization.cookie = getCookieString('voyzu_session_id', sessionId, httpRequest.route.component_domain, COOKIE_EXPIRY_DAYS);

        await redisClient.connect();
        // Set a redis key using our randomly generated settion Id
        await redisClient.SET(`${packageName}:sessions:${sessionId}`, JSON.stringify(session));
        await redisClient.quit();

        authorization.session = session;
    }

    return generateModel(authorization, authorizationSchema);
}

/**
 * Check whether an http request is authorized, based on the config "authorizationKeys" section and the auth_key* supplied in the query string
 * Note that "authorizationKeys" paths are greedy, meaning that path authorization will automatically authorize all sub-paths.
 * @param {object} httpRequestObject The http request to authorize.
 * @param {object} config Web component configuration.
 * @returns {object} An object conforming to the authorization model schema.
 */
export async function getPathAuthorization(httpRequestObject, config) {

    // Ensure the http request conforms to the http-requst schema
    const httpRequest = generateModel(httpRequestObject, httpRequestSchema);

    // Initialize an authorization object
    const authorization = {};
    authorization.authenticated = false;

    // Check if an authorization key has been supplied, and attempt to authorize if it has
    let authKeys = Object.keys(httpRequest.request_values?.query_string_values ?? {});
    authKeys = authKeys.filter(key => key.startsWith('auth_key'));
    if (authKeys.length > 0) {

        authorization.allow_unauthenticated_reason = 'Authorization attempt by way of auth key in query string';

        const authKey = authKeys[0];
        let configEntryName = authKey;
        if (authKey === 'auth_key') {
            configEntryName = 'auth_key_default';
        }
        configEntryName = configEntryName.replace('auth_key_', '');

        const configEntry = config.authorizationKeys[configEntryName];

        if (configEntry) {
            if (configEntry.secret === httpRequest.request_values.query_string_values[authKey]) {
                if (httpRequest.route.file_friendly_route.startsWith(configEntry.scope)) {
                    authorization.authorized = true;
                } else {
                    authorization.authorized = false;
                    authorization.authorization_fail_reason = `Invalid authorization scope`;
                }
            } else {
                authorization.authorized = false;
                authorization.authorization_fail_reason = `Configuration for ${authKey} not valid`;
            }
        } else {
            authorization.authorized = false;
            authorization.authorization_fail_reason = `Configuration for ${authKey} not found`;
        }
    } else {
        authorization.authorized = false;
        authorization.authorization_fail_reason = `No authorization key was supplied`;
    }

    return generateModel(authorization, authorizationSchema);
}

/**
 * Check whether an http request is authorized, based on session information in the http request.
 * @param {object} httpRequestObject The http request to authorize.
 * @param {object} config Web component configuration.
 * @param {string} packageName Name of the component package.
 * @param {string} redisClient An initialized retis client.
 * @returns {object} An object conforming to the authorization model schema.
 */
export async function getSessionAuthorization(httpRequestObject, config, packageName, redisClient) {

    // Ensure the http request conforms to the http-requst schema
    const httpRequest = generateModel(httpRequestObject, httpRequestSchema);

    // Initialize an authorization object
    const authorization = {};
    authorization.authenticated = false;

    // Check to see if we need to authorize
    if (config.bypassAuth) {
        authorization.allow_unauthenticated_reason = 'bypassAuth is true! We are not authorizing any requests!!';
    } else if (httpRequest.route.file_friendly_route.split('#').includes('login')) {
        authorization.allow_unauthenticated_reason = `request for ${httpRequest.route.url} - don't attept to authorize this route as its the login page`;
    } else if (httpRequest.route.file_friendly_route.split('#').includes('auth')) {
        authorization.allow_unauthenticated_reason = `request for ${httpRequest.route.url} - don't attept to authorize this route as its the auth path itself`;
    } else if (httpRequest.route.file_friendly_route.split('#').includes('loaderio')) {
        authorization.allow_unauthenticated_reason = `request for ${httpRequest.route.url} - don't attept to authorize this route as it is used for load testing`;
    } else if (httpRequest.route.file_friendly_route.split('#').includes('public')) {
        authorization.allow_unauthenticated_reason = `request for ${httpRequest.route.url} - don't attept to authorize this route as its a public path`;
    }

    if (authorization.allow_unauthenticated_reason) {
        authorization.authorized = true;
    } else {
        // We are authorizing

        const voyzuSessionId = httpRequest.request_values?.query_string_values?.voyzu_session_id || httpRequest.request_values?.headers?.voyzu_session_id ||
            httpRequest.request_values?.cookie?.voyzu_session_id;

        if (voyzuSessionId === undefined) {
            authorization.authorized = false;
            authorization.authorization_fail_reason = "A voyzu session id was not found in cookie, header or querystring";
        } else {
            await redisClient.connect();
            // Attempt to get the redis key that maches the sessionId
            const session = await redisClient.GET(`${packageName}:sessions:${voyzuSessionId}`);
            await redisClient.quit();
            if (session) {
                // This is the only path whereby the user is authenticated
                authorization.authorized = true;
                authorization.authenticated = true;
                authorization.session = jsonHelper.parse(session);
            } else {
                authorization.authorized = false;
                authorization.authorization_fail_reason = `The voyzu session id session:${voyzuSessionId} was not found`;
            }
        }
    }

    return generateModel(authorization, authorizationSchema);
}

/**
 * Set authorization in Redis and return authorization object that includes a cookie string.
 * @param {object} httpRequest The http requst we are authorizing.
 * @param {object} packageName The component package name, used in Redis key name.
 * @param {object} redisClient An initialized redis client.
 * @returns {object} An object conforming to the authorization model schema.
 */
export async function setAnonymousAuthorization(httpRequest, packageName, redisClient) {

    const authorization = {};
    authorization.authorized = true;
    authorization.authenticated = false;

    const sessionId = cryptoHelper.generateRandomString(32);
    authorization.session = {
        id: sessionId,
        date_created: new Date().toISOString()
    };
    authorization.cookie = getCookieString('voyzu_session_id', sessionId, httpRequest.route.component_domain, COOKIE_EXPIRY_DAYS);

    await redisClient.connect();
    await redisClient.SET(`${packageName}:sessions:${sessionId}`, JSON.stringify(authorization.session));
    await redisClient.quit();

    return generateModel(authorization, authorizationSchema);

}

/**
 * Generate a standard success http response in JSON format.
 * @param {string} cookie The cookie to place in the Set-Cookie header.
 * @param {string} path The Url path to pass in response data.
 * @returns {object} An object conforming to the http-request model schema.
 */
export function generateJsonSuccessResponse(cookie, path) {
    return generateModel({
        http_code: HTTP_CODE.SUCCESS,
        http_headers: {
            'Set-Cookie': cookie,
        },
        response_data: {
            location: path
        },
        response_type: HTTP_RESPONSE_TYPE.JSON
    }, httpResponseSchema);
}

/**
 * Generate a standard error http response in JSON format.
 * @param {string} errorMessage The error message to pass back in response data.
 * @returns {object} An object conforming to the http-request model schema.
 */
export function generateJsonFailResponse(errorMessage) {
    return generateModel({
        http_code: HTTP_CODE.UNAUTHORIZED,
        response_data: {
            errorMessage
        },
        response_type: HTTP_RESPONSE_TYPE.JSON
    }, httpResponseSchema);
}

/**
 * Generate a standard error http response in HTML format (redirect).
 * @param {string} path The location header to pass back in http headers.
 * @returns {object} An object conforming to the http-request model schema.
 */
export function generateFailRedirect(path) {
    return generateModel({
        http_code: HTTP_CODE.FOUND,
        http_headers: {
            'location': path,
        },
        response_type: HTTP_RESPONSE_TYPE.OTHER
    }, httpResponseSchema);
}

/**
 * Generate a standard success http response in HTML format (redirect).
 * @param {string} path The location header to pass back in http headers.
 * @param {string} cookie The cookie to place in the Set-Cookie header.
 * @returns {object} An object conforming to the http-request model schema.
 */
export function generateSuccessRedirect(path, cookie) {
    return generateModel({
        http_code: HTTP_CODE.FOUND,
        http_headers: {
            'Set-Cookie': cookie,
            'location': path
        },
        response_type: HTTP_RESPONSE_TYPE.OTHER
    }, httpResponseSchema);
}

function getCookieString(name, value, domain, days) {
    let cookie = `${name}=${value}`;
    cookie += `;domain=${domain}`;

    if (days && days > 0) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        cookie += `;expires=${date.toUTCString()}`;
    }

    cookie += ';path=/;SameSite=Strict; Secure;';
    cookie += 'HttpOnly;';

    return cookie;
}
