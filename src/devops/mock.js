/*eslint complexity: "off"*/
/*eslint no-magic-numbers: "off"*/
/*eslint max-lines: "off"*/

/**
 * Mocking functions.
 * @module "devops.mock"
 */

// Require core node modules
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import * as url from "node:url";

// Third party libraries
import chalk from "chalk";
import yargs from "yargs";

// Voyzu framework
import { schema as httpRequestSchema } from "../models/http-request.js";
import { schema as httpResponseSchema } from "../models/http-response.js";
import { schema as workflowJobSchema } from "../models/workflow-job.js";
import { HTTP_RESPONSE_TYPE } from "../enums/enums.js";
import { generateModel } from "../model/model.js";
import { generateRandomString } from "../helpers/crypto-helper.js";
import { publishWorkflowJob } from "../workflow/pubsub.js";

// Module constants
const require = createRequire(import.meta.url);

// Primitive constants (settings)
const ENTRY_FUNCTION_FILE_NAME = 'router';
const ENTRY_FUNCTION_METHOD_NAME = 'fulfillRequest';
const REQUEST_ID_LENGTH = 6;

/**
 * Publish a mock event to the Redis subscriber.
 * @param {string} cmdName Name of the command calling mock.
 * @param {string}componentDir Component directory.
 * @param {object} pkg Component package.
 * @param {object} args Arguments passed in calling mock.
 * @param {object} redisClient Initialized (but not connected) Redis cliient.
 */
export async function mockWorkflowRequest(cmdName, componentDir, pkg, args, redisClient) {

  // Validate and parse the event to pass in
  let eventName = args._[0] ? args._[0].toString() : "default";
  if (!eventName.endsWith(".json")) {
    eventName += ".json";
  }

  const eventPath = path.join(componentDir, "mock", "events", eventName);

  if (!fs.existsSync(eventPath)) {
    console.error(chalk.redBright(`[${cmdName}] Error: ${eventPath} does not exist. The directory you are executing ${cmdName} from must contain a folder named "mock" with a sub-folder named "events" containing the mock event`));
    return;
  }

  let workflowJob;
  try {
    workflowJob = require(eventPath);
  } catch (error) {
    console.error(chalk.redBright(`[${cmdName}] Error parsing ${eventPath}. Is this file valid JSON? ${error}`));
    return;
  }

  workflowJob = generateModel(workflowJob, workflowJobSchema);
  if (!workflowJob.request_id) {
    workflowJob.request_id = generateRandomString(REQUEST_ID_LENGTH);
  }

  console.log(`[${cmdName}] called from "${pkg.name}", passing in event "${eventName}"`);

  const start = new Date();

  const pathSegments = workflowJob.key_name.split(':');
  const workflow = pathSegments[2];
  const workflowStep = pathSegments[4];

  await publishWorkflowJob(workflow, workflowStep, workflowJob, pkg.name, redisClient);

  const duration = Date.now() - start;

  console.log(`[${cmdName}] workflow job ${workflowJob.key_name} published in ${duration}. The subscriber service must be running to process this event`);
};

/**
 * Pass a mock event to the component and receive the result.
 * @param {string} cmdName Name of the command calling mock.
 * @param {string}componentDir Component directory.
 * @param {string} webDir Website sub-directory (containing routes).
 * @param {object} pkg Component package.
 * @param {object} args Arguments passed in calling mock.
 */
export async function mockHttpRequest(cmdName, componentDir, webDir, pkg, args) {

  // Validate and parse the event to pass in
  let eventName = args._[0] ? args._[0].toString() : "default";
  if (!eventName.endsWith(".json")) {
    eventName += ".json";
  }

  const eventPath = path.join(componentDir, "mock", "events", eventName);

  if (!fs.existsSync(eventPath)) {
    console.error(chalk.redBright(`[${cmdName}] Error: ${eventPath} does not exist. The directory you are executing ${cmdName} from must contain a folder named "mock" with a sub-folder named "events" containing the mock event`));
    return;
  }

  let httpRequest;
  try {
    httpRequest = require(eventPath);
  } catch (error) {
    console.error(chalk.redBright(`[${cmdName}] Error parsing ${eventPath}. Is this file valid JSON? ${error}`));
    return;
  }

  httpRequest = generateModel(httpRequest, httpRequestSchema);
  if (!httpRequest.request_id) {
    httpRequest.request_id = generateRandomString(REQUEST_ID_LENGTH);
  }

  // The  index file to call
  const indexPath = path.join(webDir, `${ENTRY_FUNCTION_FILE_NAME}.js`);

  if (!fs.existsSync(indexPath)) {
    console.error(chalk.redBright(`[${cmdName}] Error: ${indexPath} does not exist. The directory you are in must contain a directory named "${webDir}" containing a "${`${ENTRY_FUNCTION_FILE_NAME}.js`}" file`));
    return;
  }

  // Load up the target component "index" file using dynamic import
  const filePath = url.pathToFileURL(indexPath);
  const index = await import(filePath.href);

  // (mock) context to pass in
  const context = {
    caller: cmdName
  };

  console.log(`[${cmdName}] called from "${pkg.name}", passing in event "${eventName}". Context is:`);
  console.log(chalk.gray(`${JSON.stringify(context)}\n`));

  const timesToRun = args.twice ? 2 : 1;
  let duration;
  for (let i = 1; i <= timesToRun; i++) {
    if (i === 2) {
      console.log(chalk.blue(`\n[${cmdName}]  second execution >>>\n`));
    }

    const start = new Date();

    // Pass the event and the context object to the handler function of the dynamically imported index file and receive the response
    const response = await index[ENTRY_FUNCTION_METHOD_NAME](httpRequest, context);

    duration = Date.now() - start;

    if (response) {
      // Assumption here is that any component response is an http response
      let httpResponse;
      try {
        httpResponse = generateModel(response, httpResponseSchema);
      } catch (error) {
        console.error(chalk.redBright(`[${cmdName}] Error: converting response to an httpResponse model`));
        console.error(error);
        return;
      }

      let subDir;
      if (httpRequest.route?.file_friendly_route) {
        // Logic to save the output in a logical place
        let aRoutes = httpRequest.route?.file_friendly_route.split("#");
        aRoutes.pop(); // Remove the trailing #
        if (aRoutes.at(-1).includes(".")) {
          // Route includes an extension, discard this segment of the route
          aRoutes.pop();
        }

        if (aRoutes.length === 1) {
          // Give #GET its own folder so the relative paths work
          aRoutes = ['index'];
        } else if (aRoutes.length > 2) {
          // Nested folders won't work as the relative links will be wrong. Flatten
          aRoutes = aRoutes.slice(0, 2);
        }
        subDir = aRoutes.join(path.sep);
      } else {
        subDir = eventName.replace(".json", "");
      }

      const outputDir = path.join(componentDir, "mock", "output", subDir);

      let outputName = eventName.replace(".json", "");
      if (httpResponse.response_type === HTTP_RESPONSE_TYPE.HTML) {
        outputName = 'index';
      }

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Content_type_extension includes the dot, e.g. ".html", ".txt" etc
      const outputFilePath = path.join(outputDir, `${outputName}${httpResponse.content_type_extension}`);

      switch (httpResponse.response_type) {
        case HTTP_RESPONSE_TYPE.JSON: {
          console.log(httpResponse.response_data);
          if (args.saveOutput) {
            fs.writeFileSync(outputFilePath, JSON.stringify(response.response_data));
            console.log(`[${cmdName}] JSON response saved to: "${outputFilePath}"`);
          }

          break;
        }

        case HTTP_RESPONSE_TYPE.CSS:
        case HTTP_RESPONSE_TYPE.TEXT: {

          fs.writeFileSync(outputFilePath, response.response_data);
          console.log(httpResponse.response_data);
          console.log(`[${cmdName}] TEXT response saved to: "${outputFilePath}"`);

          break;
        }

        case HTTP_RESPONSE_TYPE.IMAGE: {
          if (args.saveOutput) {
            console.log(`[${cmdName}] WARNING: Saving IMAGE type responses is not supported`);
          }
          break;
        }

        case HTTP_RESPONSE_TYPE.HTML: {
          fs.writeFileSync(outputFilePath, response.response_data);
          if (args.printHtml) {
            console.log(httpResponse.response_data);
          }
          console.log(`[${cmdName}] response saved to: "${outputFilePath}"`);
          break;
        }

        default: {
          if (httpResponse.response_data) {
            console.log(httpResponse.response_data);
          }
          if (args.saveOutput) {
            fs.writeFileSync(outputFilePath, JSON.stringify(response.response_data));
            console.log(`[${cmdName}] ${httpResponse.response_type} response saved to: "${outputFilePath}"`);
          }

          break;
        }
      }

      console.log(`[${cmdName}] received ${httpResponse.response_type} ${httpResponse.http_code} in ${duration}.`);

    } // End if response
  } // Next mock execution

  console.log(`[${cmdName}] completed in ${duration}.`);
};

/**
 * Validate arguments passed to mock function.
 * @param {string} cmdName The calling command name.
 * @returns {object} Parsed arguments.
 */
export function parseMockWebArgs(cmdName) {
  // Parse and validate arguments passed in
  const args = yargs(process.argv.slice(2))
    .usage(`${cmdName} [event] [args]\nExample: "${cmdName} mock-event --twice" - passes mock/mock-event.json and a mock context object to the web router and runs twice`)
    .option("print-html", { describe: "print HTML output to console" })
    .option("save-output", { describe: 'save the mock output (to "/mock/events/output"). Note that HTML output is always saved.' })
    .option("twice", { describe: `run ${cmdName} twice.  Handy for testing things like in-memory caching` })
    .argv;

  if (args._.length > 1) {
    console.error(chalk.redBright(`[${cmdName}] Error: invalid syntax.  Format is "${cmdName} [event name] [--options]"`));
    return;
  }

  const validArgs = [
    "_",
    "$0",
    "save-output",
    "saveOutput",
    "twice",
    "print-html",
    "printHtml"
  ];

  const filteredArgs = validArgs.filter(arg => arg !== "_" && arg !== "$0");

  for (const key of Object.keys(args)) {
    if (!validArgs.includes(key) && !key.toLowerCase().startsWith("custom")) {
      console.error(chalk.redBright(`[${cmdName}] Error: invalid parameter "${key}".  Parameters must be one oe "${filteredArgs.join(", ")} or start with "custom"`));
      return;
    }
  }

  return args;
}

/**
 * Validate arguments passed to mock function.
 * @param {string} cmdName The calling command name.
 * @returns {object} Parsed arguments.
 */
export function parseMockWorkflowArgs(cmdName) {
  // Parse and validate arguments passed in
  const args = yargs(process.argv.slice(2))
    .usage(`${cmdName} [event]\nExample: "${cmdName} mock-event.`)
    .argv;

  if (args._.length > 1) {
    console.error(chalk.redBright(`[${cmdName}] Error: invalid syntax.  Format is "${cmdName} [event name]"`));
    return;
  }

  const validArgs = [
    "_",
    "$0",
  ];

  const filteredArgs = validArgs.filter(arg => arg !== "_" && arg !== "$0");

  for (const key of Object.keys(args)) {
    if (!validArgs.includes(key) && !key.toLowerCase().startsWith("custom")) {
      console.error(chalk.redBright(`[${cmdName}] Error: invalid parameter "${key}".  Parameters must be one oe "${filteredArgs.join(", ")} or start with "custom"`));
      return;
    }
  }

  return args;
}
