/*eslint new-cap: "off"*/
/*eslint no-empty: "off"*/
/*eslint require-atomic-updates: "off"*/

/**
 * Workflow.
 *
 * Functions for working with Redis publication and subscription.
 * @module "workflow.pubsub"
 */

// Core node modules
import path from 'node:path';
import * as url from 'node:url';

// Third party libraries
import chalk from 'chalk';

// Import files from this component
import * as cache from '../caching/cache.js';
import * as log from '../devops/log.js';
import * as model from '../model/model.js';
import * as waitHelper from '../helpers/wait-helper.js';
import { schema as workflowJobSchema } from '../models/workflow-job.js';

// Module variables (cache)
let redisClientPub;

// Module primitives (settings)
const WAIT_MS = 2000;

/**
 * Listen for events published to the Redis channel applicable to this application
 * And process these events by calling the workflow router "fulfill" method, passing in the event.
 */
export async function subscribe() {

    // Requires that the application has first been initialized
    const config = cache.get('config');
    const pkg = cache.get('pkg');
    const redisClient = cache.get('redisClient');
    const workflowDir = cache.get('workflowDir');
    const channelName = pkg.name;

    // Route all events received to the workflow router
    const fulfillRoutePath = path.join(workflowDir, 'router.js');

    let filePath = url.pathToFileURL(fulfillRoutePath);
    filePath = filePath.href;
    if (config.hotReload) {
        filePath += `?cachebust=${Date.now()}`;
    }

    const fulfillRoute = await import(filePath);

    // Initialize our Redis subscriber client
    const redisClientSub = await redisClient.duplicate();
    redisClientSub.connect();

    // If the Redis client errors out, attept to restart by calling this function
    redisClientSub.on('error', async (error) => {
        log.error(`Redis subscriber client error for channel ${channelName}. Will attempt to resume `, undefined, error);
        try {
            redisClientSub.quit();
        } catch {}

        await waitHelper.wait(WAIT_MS);
        subscribe();
    });

    redisClientSub.on('end', () => {
        log.error(`Disconnected from Redis Client in ${channelName}, not attempting to reconnect...`);
    });

    // The listener for this channel.  Calls the workflow router 'fulfill' method and passes the published message as the only parameter
    const listener = async (message, channel) => {
        try {
            if (config.logEvent) {
                console.log(`[${channel}] received message ${message}`);
            }

            // Process the message. Don't await this, just fire it off
            fulfillRoute.fulfillRequest(message);
        } catch (error) {
            log.error(`there was an error fulfilling ${fulfillRoutePath} with message ${message}`, undefined, error);
        }
    };

    // Subscribe to the application Redis channel, attaching the above lister
    await redisClientSub.subscribe(channelName, listener);

    console.log(chalk.blueBright(`[${channelName}] [pubsub] subscribed to Redis channel ${channelName}`));
}

/**
 * Create a Redis Key using the framework naming convention for the key name, and the workflow job as
 * the key data. Publishes an event to the application Redis channel (channel name is simply package.json name).
 * The key name is published as the event data.
 * @param {string} workflowName The name of the workflow that will consume the workflow job.
 * @param {string} stepName The workflow step that will consume the job. Defaults to "default".
 * @param {object} workflowJob The workflow job to publish. Must conform to the Workflow Job schema.
 * @param {string} pkgName The package.json application name. This is the channel name.
 * @param {object} redisClient Redis client. Does not need to be connected.
 */
export async function publishWorkflowJob(workflowName, stepName = 'default', workflowJob, pkgName, redisClient) {

    const thisWorkflowJob = model.generateModel(workflowJob, workflowJobSchema);

    // The Redis channel to publish the event to
    const channel = pkgName;

    // The name of the Redis key to create
    // Example: voyzu-flights-01:workflows:process-flights:12345:01-first-two
    const keyName = `${channel}:workflows:${workflowName}:${thisWorkflowJob.request_id}:${stepName}`;
    thisWorkflowJob.key_name = keyName;

    // Connect up to redis
    if (!redisClientPub) {
        redisClientPub = await redisClient.duplicate();
    }

    // Connect up our Redis publisher client
    await redisClientPub.connect();

    // Create our key
    await redisClientPub.SET(keyName, JSON.stringify(thisWorkflowJob));

    // Publish to channel, passing the key name as the event data
    await redisClientPub.PUBLISH(channel, keyName);

    // And close Redis connection
    await redisClientPub.quit();
}