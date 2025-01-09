/**
 * Functions to execute commands on localhost and on a remote server via SSH.
 * @module "devops.exec"
 */

// Core node modules
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

// Third party libararies
import { Client } from 'ssh2';
import chalk from "chalk";

// Module constants
const execPromise = promisify(exec);

/**
 * Execute a shell command via SSH.
 * @param {string} cmd The powershell command to execute. Accepts multiline commands.
 * @param {string} sshConfig An ssh2 configuration object, specificing the SSH host and connection parameters.
 * @param {boolean} isLiteral If true, don't convert multiline commands to individual chained (with &&) commands.
 * @returns {string} Stdout.
 */
export function execRemote(cmd, sshConfig, isLiteral = false) {
    return new Promise((resolve, reject) => {
        const conn = new Client();

        // Establish SSH connection
        conn.on('ready', () => {

            let commandToExec;

            if (isLiteral) {
                commandToExec = cmd;
            } else {
                // Split the command into an array of lines
                const commands = cmd.split('\n').map(line => line.trim()).filter(line => line !== '' && !line.startsWith('#'));; // Trim and remove empty lines and comments
                commandToExec = commands.join(' && ');
            }

            console.log();
            console.log(chalk.cyanBright.bold(`>> EXECUTING ON ${sshConfig.host}: ${commandToExec}`));

            // Execute the command
            conn.exec(commandToExec, (err, stream) => {
                if (err) {
                    conn.end();
                    console.error(chalk.redBright(err));
                    reject(err);
                }

                let stdoutData = '';
                let stderrData = '';

                // Handle the output of the command
                stream.on('close', (code, signal) => {

                    if (stderrData && code !== 0) {
                        conn.end();

                        const sErr = `command(s) exited with error code ${code} ${stderrData}`;
                        console.error(chalk.redBright(sErr));
                        reject(sErr);
                    }
                    if (stderrData && stderrData.includes('fatal')) {
                        console.log(chalk.redBright(`fatal (git?) error ${stderrData}`));
                        conn.end();
                        reject(stderrData);
                    }
                    conn.end(); // Close the connection
                    resolve(stdoutData); // Resolve with stdout data
                }).on('data', (data) => {
                    console.log(chalk.cyan.dim(data.toString()));
                    stdoutData += data.toString(); // Accumulate stdout
                }).stderr.on('data', (data) => {
                    console.log(chalk.blue(data.toString()));
                    stderrData += data.toString(); // Accumulate stderr
                });
            });
        }).connect(sshConfig);
    });
}

/**
 * Execute a powershell command.
 *
 * UNTESTED.
 * @param {string} cmd The powershell command to execute. Accepts multiline commands.
 * @param {boolean} isLiteral If true, don't convert multiline commands to individual chained (with &&) commands.
 * @returns {string} Stdout.
 */
export function execLocalPs(cmd, isLiteral = false) {
    return new Promise((resolve, reject) => {
        const runCommand = async () => {
            let commandToExec;

            if (isLiteral) {
                commandToExec = cmd;
            } else {
                // Split the command into an array of lines
                const commands = cmd.split('\n').map(line => line.trim()).filter(line => line !== '' && !line.startsWith('#')); // Trim and remove empty lines and comments
                commandToExec = commands.join(' && ');
            }

            console.log();
            console.log(chalk.blueBright.bold(`>> EXECUTING ON LOCALHOST: ${commandToExec}`));

            let stderr, stdout;
            try {
                ({ stdout, stderr } = await execPromise(`pwsh -Command "${commandToExec}"`));
            } catch (error) {
                if (stderr) {
                    console.log(chalk.redBright(`Command fails ${commandToExec}`));
                    console.log(chalk.redBright(stderr));
                    reject(error);
                } else {
                    //Stderr is not present, simply log the error and return stdout (if any)
                    console.log(chalk.blue.dim(JSON.stringify(error)));
                    resolve(stdout?.trim());
                }
            }

            if (stderr) {
                if (stderr.startsWith('fatal')) {
                    console.log(chalk.redBright(`fatal (git?) error ${stderr}`));
                    reject(stderr);
                }
                console.log(chalk.blue(stderr));
            }

            if (stdout?.trim()) {
                console.log(chalk.blue.dim(stdout.trim()));
            }

            resolve(stdout?.trim());
        };

        runCommand();
    });
}
