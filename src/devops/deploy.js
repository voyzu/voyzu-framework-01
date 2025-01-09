/**
 * Application deployment.
 * @module "devops.deploy"
 */

// Core node modules
import fs from 'node:fs';

// Third party libraries
import chalk from "chalk";
import yargs from "yargs";
import { simpleGit } from 'simple-git';

// Module constants
const git = simpleGit();

/**
 *
 * Simple git commands to add and commit
 * Git commit message is automatically created.
 * @param {string} version Component package version.
 * @param {number} buildNumber Build number at time of commit.
 */
export async function gitAddCommitPush(version, buildNumber) {

    const commitMsg = `auto deploy version ${version} build ${buildNumber}`;
    await git.add('.');
    await git.commit(commitMsg);
    await git.push();

    console.log(`git add, commit, push with message "${commitMsg}"`);
}

/**
 * Increment the build number that resides in build.json.
 * @param {string} buildFilePath The full path of the build.json file.
 * @returns {number} The incremented build number.
 */
export function incrementBuildNumber(buildFilePath) {
    // Check if the file exists
    if (!fs.existsSync(buildFilePath)) {
        // File does not exist, create it with buildNumber = 0
        const defaultContent = JSON.stringify({ buildNumber: 0 }, null, 2);
        fs.writeFileSync(buildFilePath, defaultContent, 'utf8');
        console.log('build.json created with buildNumber set to 0.');
    }

    // Read the current content of the file
    const data = fs.readFileSync(buildFilePath);
    const jsonData = JSON.parse(data);

    // Increment the build number
    jsonData.buildNumber += 1;

    // Write the updated content back to the file
    fs.writeFileSync(buildFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`buildNumber incremented to ${jsonData.buildNumber}.`);

    return Number.parseInt(jsonData.buildNumber);
}

/**
 * Validate arguments passed to deploy function.
 * @param {string} cmdName The calling command name.
 * @returns {object} Parsed arguments.
 */
export async function parseDeploymentArgs(cmdName) {
    // Parse and validate arguments passed in
    const args = yargs(process.argv.slice(2))
        .usage(`${cmdName} [args]\nExample: "${cmdName} -- -- new"\ndeploys the specified deploy script`)
        .option("new", { describe: "install a new component, including dependencies" })
        .option("deps", { describe: 'install dependencies' })
        .option("replace-service", { describe: 'replace the systemd service' })
        .argv;

    if (args._.length > 0) {
        console.error(chalk.redBright(`[${cmdName}] Error: invalid syntax.  Format is "${cmdName} [--options]"`));
        return;
    }

    const validArgs = [
        "_",
        "$0",
        "new",
        "deps",
        "replace-service",
        "replaceService"
    ];

    const filteredArgs = validArgs.filter(arg => arg !== "_" && arg !== "$0");
    const parsedArgs = {};

    for (const [key, value] of Object.entries(args)) {
        if (!validArgs.includes(key) && !key.toLowerCase().startsWith("custom")) {
            console.error(chalk.redBright(`[${cmdName}] Error: invalid parameter "${key}".  Parameters must be one of "${filteredArgs.join(", ")}" or start with "custom"`));
            return;
        }

        if (filteredArgs.includes(key)) {
            parsedArgs[key] = value;
        }
    }

    return parsedArgs;
}

/**
 * Get deployment context by parsing out the SSH key
 * and checking we are on the main branch.
 * @param {object} config Component config json.
 * @param {object} pkg Component package.json file.
 * @returns {object} The SSH configuration with the private key contents.
 */
export async function getDeployContext(config, pkg) {

    // Validate and parse repo from package.json

    const repo = pkg.repository?.url;
    if (!repo) {
        console.error(chalk.redBright(`[${pkg.name}] Could not find section 'url' in section 'repository' in the package.json file provided`));
        return;
    }

    if (!repo.endsWith(`${pkg.name}.git`)) {
        console.error(chalk.redBright(`[${pkg.name}] Repository name mis-match. Your repository url must end with the package name. Expected ${pkg.name}.git`));
        return;
    }

    // Validate and parse ssh config from config file

    const sshConfig = config.ssh?.default;

    if (!sshConfig) {
        console.error(chalk.redBright(`[${pkg.name}] Could not find section 'default' in section 'ssh' in the config file provided`));
        return;
    }

    const user = sshConfig.username;
    if (!user) {
        console.error(chalk.redBright(`[${pkg.name}] Could not find section 'username' in section 'ssh' in the config file provided`));
        return;
    }

    try {
        sshConfig.privateKey = fs.readFileSync(sshConfig.privateKeyPath);
    } catch (error) {
        console.error(chalk.redBright(`[${pkg.name}] Could not read private key "${sshConfig.privateKeyPath}", readFile fails with ${error}`));
        return;
    }

    // Validate git branch

    let branch = await git.branch();
    branch = branch.current;

    if (branch !== 'main') {
        console.log(chalk.redBright(`You have branch ${branch} as your current branch. Only "main" branch deployments are supported`));
        return;
    }

    return {
        repo,
        sshConfig,
        user
    };
}