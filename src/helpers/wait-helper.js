/**
 * Wait helper.
 * @module "helpers.waitHelper"
 */

/*eslint no-promise-executor-return: "off"*/ 

/**
 * Wait for the specified number of milliseconds.
 * @param {number} msToWait How many milliseconds to wait.
 */
export async function wait (msToWait){

    await new Promise(resolve => setTimeout(resolve, msToWait));
}