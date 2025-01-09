/* eslint default-param-last: "off" */

/**
 * Application initialization.
 * @module "devops.init"
 */

// Import core nodejs functions
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import * as url from "node:url";

// Third party libraries
import chalk from "chalk";
import { createClient } from 'redis';

// Module constants
const require = createRequire(import.meta.url);

// Modules from this component
import * as cache from '../caching/cache.js';
import * as getCode from './templates/get-code.js';
import * as log from './log.js';

/**
 *
 * Initialize a Voyzu Framework Component.
 * @param {boolean} createConfig Create a (development) config.js file if none exists.
 * @param {boolean} createRedisClient Create a redis client (don't attept to connect, just create the client).
 * @param {string} componentDirIn Component directory.
 * @returns {object} Various handy values.
 */
export async function initializeComponent(createConfig = false, createRedisClient = true, componentDirIn) {

    const thisPkg = require('../../package.json'); //Top level package
    console.log(`[${thisPkg.name}] Welcome to Voyzu Framework version ${thisPkg.version} :-)`);

    // Calling component
    const componentDir = componentDirIn ?? process.cwd();

    const logDir = path.join(componentDir, 'logs');
    const webDir = path.join(componentDir, 'web');
    const workflowDir = path.join(componentDir, 'workflow');

    // Name of the package.json script key
    const cmdName = process.env.npm_lifecycle_event;

    // Component package.json file
    const componentPkgPath = path.join(componentDir, "package.json");
    if (!fs.existsSync(componentPkgPath)) {
        console.error(chalk.redBright(`[${cmdName}] Error: could not load component  package.json file. ${componentPkgPath} does not exist.`));
        return;
    }

    let pkg;
    try {
        pkg = require(componentPkgPath);
    } catch (error) {
        console.error(chalk.redBright(`[${cmdName}] Error: could not parse component package.json file. Error parsing ${componentPkgPath}. Is this file valid JSON? ${error} `));
        return;
    }

    // Component config file

    const configPath = path.join(componentDir, 'config.js');
    if (!fs.existsSync(configPath)) {
        if (createConfig) {
            console.log(chalk.yellow(`[${pkg.name}] ${configPath} not found. Creating this file from a template`));
            const code = getCode.getConfigCode();
            fs.writeFileSync(configPath, code);
            console.log(code);
            console.log(chalk.yellow(`[${pkg.name}] config.js file created. Uncomment values as needed for development`));
        } else {
            console.log(chalk.red(`[${pkg.name}] ${configPath} not found.`));
            return;
        }
    }

    let config;
    try {
        config = await import((url.pathToFileURL(configPath)).href);
    } catch (error) {
        console.error(chalk.redBright(`[${pkg.name}] error importing ${configPath}, check that your config file is correct`));
        console.error(error);
        return;
    }

    if (config === undefined || config.default === undefined) {
        console.error(chalk.redBright(`[${pkg.name}] error retrieving ${configPath}, check that your config file is correct`));
        return;
    }

    config = config.default;

    // Build number
    let buildNumber = 0;
    if (fs.existsSync(path.join(componentDir, 'build.json'))) {
        const buildFile = fs.readFileSync(path.join(componentDir, 'build.json'));
        const buildJson = JSON.parse(buildFile);
        buildNumber = buildJson.buildNumber;
    }

    // Initialize the redis client

    let redisClient;
    if (createRedisClient) {
        redisClient = await createClient({
            password: config.redis.default.password,
            socket: {
                host: config.redis.default.host,
                port: config.redis.default.port
            },
            username: config.redis.default.username,
        }).on('error', error => {
            log.error('redis client on error event');
            log.error(error);
        });
    }

    log.initLog(logDir,pkg);

    // Set these things into cache so they are available anywhere in component code
    cache.set('buildNumber', buildNumber);
    cache.set('cmdName', cmdName);
    cache.set('componentDir', componentDir);
    cache.set('config', config);
    cache.set('logDir', logDir);
    cache.set('pkg', pkg);
    cache.set('redisClient', redisClient);
    cache.set('webDir', webDir);
    cache.set('workflowDir', workflowDir);

    console.log(`[${pkg.name}] [init] initialized application version ${pkg.version}`);

    // Also return them for convenience
    return {
        buildNumber,
        cmdName,
        componentDir,
        config,
        logDir,
        pkg,
        redisClient,
        webDir,
        workflowDir
    };

}