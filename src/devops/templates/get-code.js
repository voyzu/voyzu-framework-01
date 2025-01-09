import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';

/**
 * Get template source code.
 * @module "devops.templates.getCode"
 */

/**
 * Return the contents of [config.js](https://github.com/voyzu/voyzu-framework-01/blob/main/src/devops/templates/config.js).
 * @returns {string} The config.js contents in string format.
 */
export  function getConfigCode(){
    const dirname = url.fileURLToPath(new URL('.', import.meta.url));
    const codePath = path.join (dirname,'config.js');
    const code = fs.readFileSync (codePath).toString();

    return code;
}