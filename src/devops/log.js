/*eslint no-shadow: "off"*/

/**
 * Logging functions.
 * @module "devops.log"
 */

// Import core node modules
import path from 'node:path';
import util from 'node:util';

// Import third party libraries
import {format} from 'date-fns';
import chalk from 'chalk';
import pino from 'pino';

// Import modules from this component
import * as errors from '../errors/errors.js';

// Module variables
let pkg;
let logger;

/**
 * Initialize logger.
 * @param {string} logDir The directory in which to store logs.
 * @param {object} pkgIn The component package json file.
 */
export function initLog(logDir, pkgIn) {
    pkg = pkgIn;

    let logName = format(Date.now(), 'yyyy-MM-dd').toString();
    logName += '_onwards.log';
    const logFilePath = path.join(logDir, logName);

    console.log (`[${pkg.name}] [logger] Logging to ${logFilePath}`);

    logger = pino({
        level: 'trace',
        mkDir: true,
        timestamp: pino.stdTimeFunctions.isoTime,
        transport: {
            targets: [
                {
                    level: 'trace',
                    options: {
                        destination: logFilePath,
                        mkdir: true
                    },
                    target: 'pino/file'
                }
            ]
        }
    });
}

/**
 * Log to console and file (info).
 * @param {string} message The message to log. Will be logged to console (stdout) and file.
 * @param {*} requestId The request id.
 * @param {*} objToLogToFile An object to log to file. Will be logged to file only.
 */
export function info(message, requestId, objToLogToFile) {
    if (!message) {
        throw new errors.InvalidConfigurationError('You must supply a message to log');
    }

    let msgToLog = `[${pkg.name}] [info] ${message}`;
    if (requestId) {
        msgToLog += ` (${requestId})`;
    }

    console.log(msgToLog);
    logger.info(msgToLog);

    if (objToLogToFile) {
        objToLogToFile.requestId = requestId;
        logger.debug({ objToLogToFile });
    }
}

/**
 * Log to console and file (debug).
 * @param {string} message The message to log. Will be logged to console (stdout) and file.
 * @param {*} requestId The request id.
 * @param {*} objToLogToFile An object to log to file. Will be logged to file only.
 */
export function debug(message, requestId, objToLogToFile) {
    if (!message) {
        throw new errors.InvalidConfigurationError('You must supply a message to log');
    }

    let msgToLog = `[${pkg.name}] [debug] ${message}`;
    if (requestId) {
        msgToLog += ` (${requestId})`;
    }

    console.log(chalk.gray(msgToLog));
    logger.debug(msgToLog);

    if (objToLogToFile) {
        const obj = structuredClone (objToLogToFile);
        obj.requestId = requestId;
        logger.info({ obj });
    }
}

/**
 * Log to console and file (error).
 * @param {string} message The message to log. Will be logged to console (stdout) and file.
 * @param {*} requestId The request id.
 * @param {object} error The error to log.
 * @param {object} extraErrorData Extra data to append to the error, for logging purposes.
 */
export function error(message, requestId, error, extraErrorData) {
    if (!message) {
        throw new errors.InvalidConfigurationError('You must supply a message to log');
    }

    if (extraErrorData && !error) {
        throw new errors.InvalidConfigurationError('You cannot supply extraErrorData without supplying an error');
    }

    let msgToLog = `[${pkg.name}] [error] ${message}`;
    if (requestId) {
        msgToLog += ` (${requestId})`;
    }

    console.log(chalk.redBright(msgToLog));
    logger.error(msgToLog);

    if (error) {
        error.commentary = message;
        error.extraData = extraErrorData;
        error.requestId = requestId;
        logger.error(error);

        console.error (chalk.redBright (util.inspect(error)));
    }
}