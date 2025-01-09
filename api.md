## Modules

<dl>
<dt><a href="#module_caching.cache">caching.cache</a></dt>
<dd><p>Get and set items to and from the in-memory cache</p>
</dd>
<dt><a href="#module_devops.deploy">devops.deploy</a></dt>
<dd><p>Application deployment</p>
</dd>
<dt><a href="#module_devops.exec">devops.exec</a></dt>
<dd><p>Functions to execute commands on localhost and on a remote server via SSH</p>
</dd>
<dt><a href="#module_devops.init">devops.init</a></dt>
<dd><p>Application initialization</p>
</dd>
<dt><a href="#module_devops.log">devops.log</a></dt>
<dd><p>Logging functions</p>
</dd>
<dt><a href="#module_devops.mock">devops.mock</a></dt>
<dd><p>Mocking functions</p>
</dd>
<dt><a href="#module_devops.templates.getCode">devops.templates.getCode</a></dt>
<dd><p>Get template source code</p>
</dd>
<dt><a href="#module_enums">enums</a></dt>
<dd><p>Emums</p>
</dd>
<dt><a href="#module_errors">errors</a></dt>
<dd><p>Errors</p>
</dd>
<dt><a href="#module_helpers.booleanHelper">helpers.booleanHelper</a></dt>
<dd><p>Boolean helper</p>
</dd>
<dt><a href="#module_helpers.cryptoHelper">helpers.cryptoHelper</a></dt>
<dd><p>Cryptography helper</p>
</dd>
<dt><a href="#module_helpers.jsonHelper">helpers.jsonHelper</a></dt>
<dd><p>JSON helper</p>
</dd>
<dt><a href="#module_helpers.objectHelper">helpers.objectHelper</a></dt>
<dd><p>Object helper</p>
</dd>
<dt><a href="#module_helpers.stringHelper">helpers.stringHelper</a></dt>
<dd><p>String helper</p>
</dd>
<dt><a href="#module_helpers.typeHelper">helpers.typeHelper</a></dt>
<dd><p>Type helper</p>
</dd>
<dt><a href="#module_helpers.waitHelper">helpers.waitHelper</a></dt>
<dd><p>Wait helper</p>
</dd>
<dt><a href="#module_model">model</a></dt>
<dd><p>Object generation and validation based on supplied Voyzu Framework model schema definition</p>
</dd>
<dt><a href="#module_models.authorization">models.authorization</a></dt>
<dd><p>Authorization model.</p>
<p>Models a web authorization attempt</p>
</dd>
<dt><a href="#module_models.clientRequest">models.clientRequest</a></dt>
<dd><p>Client Request model.</p>
<p>Models a client / server message</p>
</dd>
<dt><a href="#module_models.httpRequest">models.httpRequest</a></dt>
<dd><p>Http Request model.</p>
<p>Models a request sent to the built-in web server</p>
</dd>
<dt><a href="#module_models.httpRequest">models.httpRequest</a></dt>
<dd><p>Http Response model.</p>
<p>Models a response sent to the built-in web server</p>
</dd>
<dt><a href="#module_models.session">models.session</a></dt>
<dd><p>Session model.</p>
<p>Models a web session</p>
</dd>
<dt><a href="#module_models.workflowJob">models.workflowJob</a></dt>
<dd><p>Workflow Job model.</p>
<p>Models a request to be fulfilled asynchronously</p>
</dd>
<dt><a href="#module_web.auth">web.auth</a></dt>
<dd><p>Web Authorization and authentication</p>
</dd>
<dt><a href="#module_web.response">web.response</a></dt>
<dd><p>Web Response.</p>
<p>Standardized web response functions</p>
</dd>
<dt><a href="#module_web.routing">web.routing</a></dt>
<dd><p>Routing.</p>
<p>Maps http requests to their corresponding file friendly route</p>
</dd>
<dt><a href="#module_web.server">web.server</a></dt>
<dd><p>Built-in http server</p>
</dd>
<dt><a href="#module_web.ui.alert">web.ui.alert</a></dt>
<dd><p>Web UI Alert.</p>
<p>Client side JavaScript functions for working with the Shoelace alert component</p>
</dd>
<dt><a href="#module_web.ui.binding">web.ui.binding</a></dt>
<dd><p>Web UI Binding.</p>
<p>Client side JavaScript functions for binding objects to and from Shoelace controls</p>
</dd>
<dt><a href="#module_web.ui.validation">web.ui.validation</a></dt>
<dd><p>Web UI Validation.</p>
<p>Client side JavaScript functions for data validation using Shoelace controls</p>
</dd>
<dt><a href="#module_workflow.pubsub">workflow.pubsub</a></dt>
<dd><p>Workflow.</p>
<p>Functions for working with Redis publication and subscription</p>
</dd>
</dl>

<a name="module_caching.cache"></a>

## caching.cache
Get and set items to and from the in-memory cache


* [caching.cache](#module_caching.cache)
    * [.get(key)](#module_caching.cache.get) ⇒ <code>any</code>
    * [.set(key, value)](#module_caching.cache.set)

<a name="module_caching.cache.get"></a>

### caching.cache.get(key) ⇒ <code>any</code>
Get item from in-memory cache.

**Kind**: static method of [<code>caching.cache</code>](#module_caching.cache)  
**Returns**: <code>any</code> - Object with the supplied key. Returns undefined if the key is not present.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | Cache key to retrieve. |

<a name="module_caching.cache.set"></a>

### caching.cache.set(key, value)
Set item into in-memory cache.

**Kind**: static method of [<code>caching.cache</code>](#module_caching.cache)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The cache key to store the item against. |
| value | <code>any</code> | The value to store. |

<a name="module_devops.deploy"></a>

## devops.deploy
Application deployment


* [devops.deploy](#module_devops.deploy)
    * [.gitAddCommitPush(version, buildNumber)](#module_devops.deploy.gitAddCommitPush)
    * [.incrementBuildNumber(buildFilePath)](#module_devops.deploy.incrementBuildNumber) ⇒ <code>number</code>
    * [.parseDeploymentArgs(cmdName)](#module_devops.deploy.parseDeploymentArgs) ⇒ <code>object</code>
    * [.getDeployContext(config, pkg)](#module_devops.deploy.getDeployContext) ⇒ <code>object</code>

<a name="module_devops.deploy.gitAddCommitPush"></a>

### devops.deploy.gitAddCommitPush(version, buildNumber)
Simple git commands to add and commit
Git commit message is automatically created.

**Kind**: static method of [<code>devops.deploy</code>](#module_devops.deploy)  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>string</code> | Component package version. |
| buildNumber | <code>number</code> | Build number at time of commit. |

<a name="module_devops.deploy.incrementBuildNumber"></a>

### devops.deploy.incrementBuildNumber(buildFilePath) ⇒ <code>number</code>
Increment the build number that resides in build.json.

**Kind**: static method of [<code>devops.deploy</code>](#module_devops.deploy)  
**Returns**: <code>number</code> - The incremented build number.  

| Param | Type | Description |
| --- | --- | --- |
| buildFilePath | <code>string</code> | The full path of the build.json file. |

<a name="module_devops.deploy.parseDeploymentArgs"></a>

### devops.deploy.parseDeploymentArgs(cmdName) ⇒ <code>object</code>
Validate arguments passed to deploy function.

**Kind**: static method of [<code>devops.deploy</code>](#module_devops.deploy)  
**Returns**: <code>object</code> - Parsed arguments.  

| Param | Type | Description |
| --- | --- | --- |
| cmdName | <code>string</code> | The calling command name. |

<a name="module_devops.deploy.getDeployContext"></a>

### devops.deploy.getDeployContext(config, pkg) ⇒ <code>object</code>
Get deployment context by parsing out the SSH key
and checking we are on the main branch.

**Kind**: static method of [<code>devops.deploy</code>](#module_devops.deploy)  
**Returns**: <code>object</code> - The SSH configuration with the private key contents.  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Component config json. |
| pkg | <code>object</code> | Component package.json file. |

<a name="module_devops.exec"></a>

## devops.exec
Functions to execute commands on localhost and on a remote server via SSH


* [devops.exec](#module_devops.exec)
    * [.execRemote(cmd, sshConfig, isLiteral)](#module_devops.exec.execRemote) ⇒ <code>string</code>
    * [.execLocalPs(cmd, isLiteral)](#module_devops.exec.execLocalPs) ⇒ <code>string</code>

<a name="module_devops.exec.execRemote"></a>

### devops.exec.execRemote(cmd, sshConfig, isLiteral) ⇒ <code>string</code>
Execute a shell command via SSH.

**Kind**: static method of [<code>devops.exec</code>](#module_devops.exec)  
**Returns**: <code>string</code> - Stdout.  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>string</code> | The powershell command to execute. Accepts multiline commands. |
| sshConfig | <code>string</code> | An ssh2 configuration object, specificing the SSH host and connection parameters. |
| isLiteral | <code>boolean</code> | If true, don't convert multiline commands to individual chained (with &&) commands. |

<a name="module_devops.exec.execLocalPs"></a>

### devops.exec.execLocalPs(cmd, isLiteral) ⇒ <code>string</code>
Execute a powershell command.

UNTESTED.

**Kind**: static method of [<code>devops.exec</code>](#module_devops.exec)  
**Returns**: <code>string</code> - Stdout.  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>string</code> | The powershell command to execute. Accepts multiline commands. |
| isLiteral | <code>boolean</code> | If true, don't convert multiline commands to individual chained (with &&) commands. |

<a name="module_devops.init"></a>

## devops.init
Application initialization

<a name="module_devops.init.initializeComponent"></a>

### devops.init.initializeComponent(createConfig, createRedisClient, componentDirIn) ⇒ <code>object</code>
Initialize a Voyzu Framework Component.

**Kind**: static method of [<code>devops.init</code>](#module_devops.init)  
**Returns**: <code>object</code> - Various handy values.  

| Param | Type | Description |
| --- | --- | --- |
| createConfig | <code>boolean</code> | Create a (development) config.js file if none exists. |
| createRedisClient | <code>boolean</code> | Create a redis client (don't attept to connect, just create the client). |
| componentDirIn | <code>string</code> | Component directory. |

<a name="module_devops.log"></a>

## devops.log
Logging functions


* [devops.log](#module_devops.log)
    * [.initLog(logDir, pkgIn)](#module_devops.log.initLog)
    * [.info(message, requestId, objToLogToFile)](#module_devops.log.info)
    * [.debug(message, requestId, objToLogToFile)](#module_devops.log.debug)
    * [.error(message, requestId, error, extraErrorData)](#module_devops.log.error)

<a name="module_devops.log.initLog"></a>

### devops.log.initLog(logDir, pkgIn)
Initialize logger.

**Kind**: static method of [<code>devops.log</code>](#module_devops.log)  

| Param | Type | Description |
| --- | --- | --- |
| logDir | <code>string</code> | The directory in which to store logs. |
| pkgIn | <code>object</code> | The component package json file. |

<a name="module_devops.log.info"></a>

### devops.log.info(message, requestId, objToLogToFile)
Log to console and file (info).

**Kind**: static method of [<code>devops.log</code>](#module_devops.log)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message to log. Will be logged to console (stdout) and file. |
| requestId | <code>\*</code> | The request id. |
| objToLogToFile | <code>\*</code> | An object to log to file. Will be logged to file only. |

<a name="module_devops.log.debug"></a>

### devops.log.debug(message, requestId, objToLogToFile)
Log to console and file (debug).

**Kind**: static method of [<code>devops.log</code>](#module_devops.log)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message to log. Will be logged to console (stdout) and file. |
| requestId | <code>\*</code> | The request id. |
| objToLogToFile | <code>\*</code> | An object to log to file. Will be logged to file only. |

<a name="module_devops.log.error"></a>

### devops.log.error(message, requestId, error, extraErrorData)
Log to console and file (error).

**Kind**: static method of [<code>devops.log</code>](#module_devops.log)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | The message to log. Will be logged to console (stdout) and file. |
| requestId | <code>\*</code> | The request id. |
| error | <code>object</code> | The error to log. |
| extraErrorData | <code>object</code> | Extra data to append to the error, for logging purposes. |

<a name="module_devops.mock"></a>

## devops.mock
Mocking functions


* [devops.mock](#module_devops.mock)
    * [.mockWorkflowRequest(cmdName, componentDir, pkg, args, redisClient)](#module_devops.mock.mockWorkflowRequest)
    * [.mockHttpRequest(cmdName, componentDir, webDir, pkg, args)](#module_devops.mock.mockHttpRequest)
    * [.parseMockWebArgs(cmdName)](#module_devops.mock.parseMockWebArgs) ⇒ <code>object</code>
    * [.parseMockWorkflowArgs(cmdName)](#module_devops.mock.parseMockWorkflowArgs) ⇒ <code>object</code>

<a name="module_devops.mock.mockWorkflowRequest"></a>

### devops.mock.mockWorkflowRequest(cmdName, componentDir, pkg, args, redisClient)
Publish a mock event to the Redis subscriber.

**Kind**: static method of [<code>devops.mock</code>](#module_devops.mock)  

| Param | Type | Description |
| --- | --- | --- |
| cmdName | <code>string</code> | Name of the command calling mock. |
| componentDir | <code>string</code> | Component directory. |
| pkg | <code>object</code> | Component package. |
| args | <code>object</code> | Arguments passed in calling mock. |
| redisClient | <code>object</code> | Initialized (but not connected) Redis cliient. |

<a name="module_devops.mock.mockHttpRequest"></a>

### devops.mock.mockHttpRequest(cmdName, componentDir, webDir, pkg, args)
Pass a mock event to the component and receive the result.

**Kind**: static method of [<code>devops.mock</code>](#module_devops.mock)  

| Param | Type | Description |
| --- | --- | --- |
| cmdName | <code>string</code> | Name of the command calling mock. |
| componentDir | <code>string</code> | Component directory. |
| webDir | <code>string</code> | Website sub-directory (containing routes). |
| pkg | <code>object</code> | Component package. |
| args | <code>object</code> | Arguments passed in calling mock. |

<a name="module_devops.mock.parseMockWebArgs"></a>

### devops.mock.parseMockWebArgs(cmdName) ⇒ <code>object</code>
Validate arguments passed to mock function.

**Kind**: static method of [<code>devops.mock</code>](#module_devops.mock)  
**Returns**: <code>object</code> - Parsed arguments.  

| Param | Type | Description |
| --- | --- | --- |
| cmdName | <code>string</code> | The calling command name. |

<a name="module_devops.mock.parseMockWorkflowArgs"></a>

### devops.mock.parseMockWorkflowArgs(cmdName) ⇒ <code>object</code>
Validate arguments passed to mock function.

**Kind**: static method of [<code>devops.mock</code>](#module_devops.mock)  
**Returns**: <code>object</code> - Parsed arguments.  

| Param | Type | Description |
| --- | --- | --- |
| cmdName | <code>string</code> | The calling command name. |

<a name="module_devops.templates.getCode"></a>

## devops.templates.getCode
Get template source code

<a name="module_devops.templates.getCode.getConfigCode"></a>

### devops.templates.getCode.getConfigCode() ⇒ <code>string</code>
Return the contents of [config.js](https://github.com/voyzu/voyzu-framework-01/blob/main/src/devops/templates/config.js).

**Kind**: static method of [<code>devops.templates.getCode</code>](#module_devops.templates.getCode)  
**Returns**: <code>string</code> - The config.js contents in string format.  
<a name="module_enums"></a>

## enums
Emums


* [enums](#module_enums)
    * [.MESSAGE_LEVEL](#module_enums.MESSAGE_LEVEL) : <code>enum</code>
    * [.HTTP_CODE](#module_enums.HTTP_CODE) : <code>enum</code>
    * [.HTTP_RESPONSE_TYPE](#module_enums.HTTP_RESPONSE_TYPE) : <code>enum</code>
    * [.WORKFLOW_REQUEST_ORIGIN](#module_enums.WORKFLOW_REQUEST_ORIGIN) : <code>enum</code>
    * [.PROCESS_STATUS](#module_enums.PROCESS_STATUS) : <code>enum</code>

<a name="module_enums.MESSAGE_LEVEL"></a>

### enums.MESSAGE\_LEVEL : <code>enum</code>
**Kind**: static enum of [<code>enums</code>](#module_enums)  
**Read only**: true  
<a name="module_enums.HTTP_CODE"></a>

### enums.HTTP\_CODE : <code>enum</code>
**Kind**: static enum of [<code>enums</code>](#module_enums)  
**Read only**: true  
<a name="module_enums.HTTP_RESPONSE_TYPE"></a>

### enums.HTTP\_RESPONSE\_TYPE : <code>enum</code>
**Kind**: static enum of [<code>enums</code>](#module_enums)  
**Read only**: true  
<a name="module_enums.WORKFLOW_REQUEST_ORIGIN"></a>

### enums.WORKFLOW\_REQUEST\_ORIGIN : <code>enum</code>
**Kind**: static enum of [<code>enums</code>](#module_enums)  
**Read only**: true  
<a name="module_enums.PROCESS_STATUS"></a>

### enums.PROCESS\_STATUS : <code>enum</code>
**Kind**: static enum of [<code>enums</code>](#module_enums)  
**Read only**: true  
<a name="module_errors"></a>

## errors
Errors


* [errors](#module_errors)
    * [.InvalidConfigurationError](#module_errors.InvalidConfigurationError)
    * [.InvalidParametersError](#module_errors.InvalidParametersError)
    * [.SchemaMetaValidationError](#module_errors.SchemaMetaValidationError)
    * [.SchemaValidationError](#module_errors.SchemaValidationError)

<a name="module_errors.InvalidConfigurationError"></a>

### errors.InvalidConfigurationError
Invalid Configuration Error

Throw this error when Application configuration is not expected

**Kind**: static class of [<code>errors</code>](#module_errors)  
<a name="module_errors.InvalidParametersError"></a>

### errors.InvalidParametersError
Invalid Parameters Error

Throw this error when function parameters are not correct

**Kind**: static class of [<code>errors</code>](#module_errors)  
<a name="module_errors.SchemaMetaValidationError"></a>

### errors.SchemaMetaValidationError
Model Schema Validation Error

This error is thrown by model.generateModel() if the schemas passed in is not valid

**Kind**: static class of [<code>errors</code>](#module_errors)  
<a name="module_errors.SchemaValidationError"></a>

### errors.SchemaValidationError
Model Validation Error

This error is thrown by model.generateModel() if the object passed in does not match the schema passed in

**Kind**: static class of [<code>errors</code>](#module_errors)  
<a name="module_helpers.booleanHelper"></a>

## helpers.booleanHelper
Boolean helper

<a name="module_helpers.booleanHelper.isTrue"></a>

### helpers.booleanHelper.isTrue(input) ⇒ <code>boolean</code>
Receives an input and attempts to parse into a boolean.
Input that cannot be converted to a boolean returns false.

**Kind**: static method of [<code>helpers.booleanHelper</code>](#module_helpers.booleanHelper)  
**Returns**: <code>boolean</code> - Boolean value true or false.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>any</code> | The value to test whether it is true or not. |

<a name="module_helpers.cryptoHelper"></a>

## helpers.cryptoHelper
Cryptography helper


* [helpers.cryptoHelper](#module_helpers.cryptoHelper)
    * [.encrypt(text, key)](#module_helpers.cryptoHelper.encrypt) ⇒ <code>string</code>
    * [.decrypt(text, key)](#module_helpers.cryptoHelper.decrypt) ⇒ <code>string</code>
    * [.generateRandomString(length)](#module_helpers.cryptoHelper.generateRandomString) ⇒ <code>string</code>
    * [.generateUuid()](#module_helpers.cryptoHelper.generateUuid) ⇒ <code>string</code>

<a name="module_helpers.cryptoHelper.encrypt"></a>

### helpers.cryptoHelper.encrypt(text, key) ⇒ <code>string</code>
Encrypt text using AES encryption. The output will be URL safe.

**Kind**: static method of [<code>helpers.cryptoHelper</code>](#module_helpers.cryptoHelper)  
**Returns**: <code>string</code> - The encrypted text, URL-encoded.  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The text to encrypt. |
| key | <code>string</code> | The key to use to encrypt the text. Must be 256 bits (32 characters). |

<a name="module_helpers.cryptoHelper.decrypt"></a>

### helpers.cryptoHelper.decrypt(text, key) ⇒ <code>string</code>
Decrypt text using AES encryption.

**Kind**: static method of [<code>helpers.cryptoHelper</code>](#module_helpers.cryptoHelper)  
**Returns**: <code>string</code> - The decrypted text.  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | The text to decrypt, URL-encoded. |
| key | <code>string</code> | The key to use to encrypt the text. Must be 256 bits (32 characters). |

<a name="module_helpers.cryptoHelper.generateRandomString"></a>

### helpers.cryptoHelper.generateRandomString(length) ⇒ <code>string</code>
Generate a random string of specified length.

**Kind**: static method of [<code>helpers.cryptoHelper</code>](#module_helpers.cryptoHelper)  
**Returns**: <code>string</code> - The generated random string.  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | The length of the random string. |

<a name="module_helpers.cryptoHelper.generateUuid"></a>

### helpers.cryptoHelper.generateUuid() ⇒ <code>string</code>
Generate a random UUID using node:crypto.

**Kind**: static method of [<code>helpers.cryptoHelper</code>](#module_helpers.cryptoHelper)  
**Returns**: <code>string</code> - A UUID.  
<a name="module_helpers.jsonHelper"></a>

## helpers.jsonHelper
JSON helper

<a name="module_helpers.jsonHelper.parse"></a>

### helpers.jsonHelper.parse(input) ⇒ <code>object</code>
Receives an object or stringified JSON and returns a parsed JSON object.
If the input is already a JSON object then it will be returned unchanged
If an error occurs a detailed JSON parsing error will be thrown.

**Kind**: static method of [<code>helpers.jsonHelper</code>](#module_helpers.jsonHelper)  
**Returns**: <code>object</code> - The parsed JSON object.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>any</code> | The input to parse. |

<a name="module_helpers.objectHelper"></a>

## helpers.objectHelper
Object helper


* [helpers.objectHelper](#module_helpers.objectHelper)
    * [.isEmpty(obj)](#module_helpers.objectHelper.isEmpty) ⇒ <code>boolean</code>
    * [.toPojo(object)](#module_helpers.objectHelper.toPojo) ⇒ <code>object</code>

<a name="module_helpers.objectHelper.isEmpty"></a>

### helpers.objectHelper.isEmpty(obj) ⇒ <code>boolean</code>
Check if ojbect is empty (has no keys).

**Kind**: static method of [<code>helpers.objectHelper</code>](#module_helpers.objectHelper)  
**Returns**: <code>boolean</code> - A boolean indicating whether the object is an empty object.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | Object to check. |

<a name="module_helpers.objectHelper.toPojo"></a>

### helpers.objectHelper.toPojo(object) ⇒ <code>object</code>
Convert an object to a Plain Old Javascript Object (POJO).

**Kind**: static method of [<code>helpers.objectHelper</code>](#module_helpers.objectHelper)  
**Returns**: <code>object</code> - A POJO object.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | The object to convert to a POJO. |

<a name="module_helpers.stringHelper"></a>

## helpers.stringHelper
String helper


* [helpers.stringHelper](#module_helpers.stringHelper)
    * [.isAlphanumeric(str)](#module_helpers.stringHelper.isAlphanumeric) ⇒ <code>boolean</code>
    * [.isAlphanumericIncUnderscore(str)](#module_helpers.stringHelper.isAlphanumericIncUnderscore) ⇒ <code>boolean</code>
    * [.parseCookies(cookieArrayOrString)](#module_helpers.stringHelper.parseCookies) ⇒ <code>object</code>
    * [.validateEmail(email)](#module_helpers.stringHelper.validateEmail) ⇒ <code>boolean</code>

<a name="module_helpers.stringHelper.isAlphanumeric"></a>

### helpers.stringHelper.isAlphanumeric(str) ⇒ <code>boolean</code>
Checks whether a string is alphanumeric.

**Kind**: static method of [<code>helpers.stringHelper</code>](#module_helpers.stringHelper)  
**Returns**: <code>boolean</code> - A boolean with the results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to check. |

<a name="module_helpers.stringHelper.isAlphanumericIncUnderscore"></a>

### helpers.stringHelper.isAlphanumericIncUnderscore(str) ⇒ <code>boolean</code>
Checks whether a string is alphanumeric, accepting also the underscore (_) character.

**Kind**: static method of [<code>helpers.stringHelper</code>](#module_helpers.stringHelper)  
**Returns**: <code>boolean</code> - A boolean with the results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to check. |

<a name="module_helpers.stringHelper.parseCookies"></a>

### helpers.stringHelper.parseCookies(cookieArrayOrString) ⇒ <code>object</code>
Takes a raw input of cookes and returns an object of key/value pairs.

**Kind**: static method of [<code>helpers.stringHelper</code>](#module_helpers.stringHelper)  
**Returns**: <code>object</code> - The parsed cookie.  

| Param | Type | Description |
| --- | --- | --- |
| cookieArrayOrString | <code>any</code> | The raw cookie input. |

<a name="module_helpers.stringHelper.validateEmail"></a>

### helpers.stringHelper.validateEmail(email) ⇒ <code>boolean</code>
Check if a string is a valid email.

**Kind**: static method of [<code>helpers.stringHelper</code>](#module_helpers.stringHelper)  
**Returns**: <code>boolean</code> - A boolean with the results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | The email string to check. |

<a name="module_helpers.typeHelper"></a>

## helpers.typeHelper
Type helper


* [helpers.typeHelper](#module_helpers.typeHelper)
    * [.getType(value)](#module_helpers.typeHelper.getType) ⇒ <code>string</code>
    * [.isArray(value)](#module_helpers.typeHelper.isArray) ⇒ <code>boolean</code>
    * [.isBoolean(value)](#module_helpers.typeHelper.isBoolean) ⇒ <code>boolean</code>
    * [.isClassInstance(value)](#module_helpers.typeHelper.isClassInstance) ⇒ <code>boolean</code>
    * [.isNaN(value)](#module_helpers.typeHelper.isNaN) ⇒ <code>boolean</code>
    * [.isUndefined(value)](#module_helpers.typeHelper.isUndefined) ⇒ <code>boolean</code>
    * [.isFunction(value)](#module_helpers.typeHelper.isFunction) ⇒ <code>boolean</code>
    * [.isClass(obj)](#module_helpers.typeHelper.isClass) ⇒ <code>boolean</code>
    * [.isNull(value)](#module_helpers.typeHelper.isNull) ⇒ <code>boolean</code>
    * [.isNumber(value)](#module_helpers.typeHelper.isNumber) ⇒ <code>boolean</code>
    * [.isNumberLike(value)](#module_helpers.typeHelper.isNumberLike) ⇒ <code>boolean</code>
    * [.isString(value)](#module_helpers.typeHelper.isString) ⇒ <code>boolean</code>
    * [.isSimpleObject(value)](#module_helpers.typeHelper.isSimpleObject) ⇒ <code>boolean</code>

<a name="module_helpers.typeHelper.getType"></a>

### helpers.typeHelper.getType(value) ⇒ <code>string</code>
Check the type of a given value. Type in this context is informal, i.e. A best effort to determine an informal
way of describing a given value in terms of its type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>string</code> - The value type.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isArray"></a>

### helpers.typeHelper.isArray(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isBoolean"></a>

### helpers.typeHelper.isBoolean(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isClassInstance"></a>

### helpers.typeHelper.isClassInstance(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isNaN"></a>

### helpers.typeHelper.isNaN(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isUndefined"></a>

### helpers.typeHelper.isUndefined(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isFunction"></a>

### helpers.typeHelper.isFunction(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isClass"></a>

### helpers.typeHelper.isClass(obj) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | The value to check. |

<a name="module_helpers.typeHelper.isNull"></a>

### helpers.typeHelper.isNull(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isNumber"></a>

### helpers.typeHelper.isNumber(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isNumberLike"></a>

### helpers.typeHelper.isNumberLike(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isString"></a>

### helpers.typeHelper.isString(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.typeHelper.isSimpleObject"></a>

### helpers.typeHelper.isSimpleObject(value) ⇒ <code>boolean</code>
Check whether a given value is of a given type.

**Kind**: static method of [<code>helpers.typeHelper</code>](#module_helpers.typeHelper)  
**Returns**: <code>boolean</code> - The results of the check.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to check. |

<a name="module_helpers.waitHelper"></a>

## helpers.waitHelper
Wait helper

<a name="module_helpers.waitHelper.wait"></a>

### helpers.waitHelper.wait(msToWait)
Wait for the specified number of milliseconds.

**Kind**: static method of [<code>helpers.waitHelper</code>](#module_helpers.waitHelper)  

| Param | Type | Description |
| --- | --- | --- |
| msToWait | <code>number</code> | How many milliseconds to wait. |

<a name="module_model"></a>

## model
Object generation and validation based on supplied Voyzu Framework model schema definition

<a name="module_model.generateModel"></a>

### model.generateModel(baseObject, schema) ⇒ <code>object</code>
Gemerates a model from the supplied base object and schema. The base object is not modified.

**Kind**: static method of [<code>model</code>](#module_model)  
**Returns**: <code>object</code> - A validated object model matching the supplied schema.  

| Param | Type | Description |
| --- | --- | --- |
| baseObject | <code>object</code> | The object to use as the basis of the generated model. |
| schema | <code>object</code> | The voyzu model schema to apply. |

<a name="module_models.authorization"></a>

## models.authorization
Authorization model.

Models a web authorization attempt

<a name="module_models.clientRequest"></a>

## models.clientRequest
Client Request model.

Models a client / server message

<a name="module_models.httpRequest"></a>

## models.httpRequest
Http Request model.

Models a request sent to the built-in web server

<a name="module_models.httpRequest"></a>

## models.httpRequest
Http Response model.

Models a response sent to the built-in web server

<a name="module_models.session"></a>

## models.session
Session model.

Models a web session

<a name="module_models.workflowJob"></a>

## models.workflowJob
Workflow Job model.

Models a request to be fulfilled asynchronously

<a name="module_web.auth"></a>

## web.auth
Web Authorization and authentication


* [web.auth](#module_web.auth)
    * [.authorizeAndCreateSession(customFunction, httpRequestObject, config, packageName, redisClient)](#module_web.auth.authorizeAndCreateSession) ⇒ <code>object</code>
    * [.getPathAuthorization(httpRequestObject, config)](#module_web.auth.getPathAuthorization) ⇒ <code>object</code>
    * [.getSessionAuthorization(httpRequestObject, config, packageName, redisClient)](#module_web.auth.getSessionAuthorization) ⇒ <code>object</code>
    * [.setAnonymousAuthorization(httpRequest, packageName, redisClient)](#module_web.auth.setAnonymousAuthorization) ⇒ <code>object</code>
    * [.generateJsonSuccessResponse(cookie, path)](#module_web.auth.generateJsonSuccessResponse) ⇒ <code>object</code>
    * [.generateJsonFailResponse(errorMessage)](#module_web.auth.generateJsonFailResponse) ⇒ <code>object</code>
    * [.generateFailRedirect(path)](#module_web.auth.generateFailRedirect) ⇒ <code>object</code>
    * [.generateSuccessRedirect(path, cookie)](#module_web.auth.generateSuccessRedirect) ⇒ <code>object</code>

<a name="module_web.auth.authorizeAndCreateSession"></a>

### web.auth.authorizeAndCreateSession(customFunction, httpRequestObject, config, packageName, redisClient) ⇒ <code>object</code>
Attempt to authorize an http request using a supplied function.
Set a Redis session key if the supplied function returns a successful authorization.

**Kind**: static method of [<code>web.auth</code>](#module_web.auth)  
**Returns**: <code>object</code> - An object conforming to the authorization model schema.  

| Param | Type | Description |
| --- | --- | --- |
| customFunction | <code>function</code> | The custom function used for authenticating the request. |
| httpRequestObject | <code>object</code> | Http Request. |
| config | <code>object</code> | Component config. |
| packageName | <code>string</code> | Name as per package.json. Used to create redis session key. |
| redisClient | <code>object</code> | Initialized redis client. |

<a name="module_web.auth.getPathAuthorization"></a>

### web.auth.getPathAuthorization(httpRequestObject, config) ⇒ <code>object</code>
Check whether an http request is authorized, based on the config "authorizationKeys" section and the auth_key* supplied in the query string
Note that "authorizationKeys" paths are greedy, meaning that path authorization will automatically authorize all sub-paths.

**Kind**: static method of [<code>web.auth</code>](#module_web.auth)  
**Returns**: <code>object</code> - An object conforming to the authorization model schema.  

| Param | Type | Description |
| --- | --- | --- |
| httpRequestObject | <code>object</code> | The http request to authorize. |
| config | <code>object</code> | Web component configuration. |

<a name="module_web.auth.getSessionAuthorization"></a>

### web.auth.getSessionAuthorization(httpRequestObject, config, packageName, redisClient) ⇒ <code>object</code>
Check whether an http request is authorized, based on session information in the http request.

**Kind**: static method of [<code>web.auth</code>](#module_web.auth)  
**Returns**: <code>object</code> - An object conforming to the authorization model schema.  

| Param | Type | Description |
| --- | --- | --- |
| httpRequestObject | <code>object</code> | The http request to authorize. |
| config | <code>object</code> | Web component configuration. |
| packageName | <code>string</code> | Name of the component package. |
| redisClient | <code>string</code> | An initialized retis client. |

<a name="module_web.auth.setAnonymousAuthorization"></a>

### web.auth.setAnonymousAuthorization(httpRequest, packageName, redisClient) ⇒ <code>object</code>
Set authorization in Redis and return authorization object that includes a cookie string.

**Kind**: static method of [<code>web.auth</code>](#module_web.auth)  
**Returns**: <code>object</code> - An object conforming to the authorization model schema.  

| Param | Type | Description |
| --- | --- | --- |
| httpRequest | <code>object</code> | The http requst we are authorizing. |
| packageName | <code>object</code> | The component package name, used in Redis key name. |
| redisClient | <code>object</code> | An initialized redis client. |

<a name="module_web.auth.generateJsonSuccessResponse"></a>

### web.auth.generateJsonSuccessResponse(cookie, path) ⇒ <code>object</code>
Generate a standard success http response in JSON format.

**Kind**: static method of [<code>web.auth</code>](#module_web.auth)  
**Returns**: <code>object</code> - An object conforming to the http-request model schema.  

| Param | Type | Description |
| --- | --- | --- |
| cookie | <code>string</code> | The cookie to place in the Set-Cookie header. |
| path | <code>string</code> | The Url path to pass in response data. |

<a name="module_web.auth.generateJsonFailResponse"></a>

### web.auth.generateJsonFailResponse(errorMessage) ⇒ <code>object</code>
Generate a standard error http response in JSON format.

**Kind**: static method of [<code>web.auth</code>](#module_web.auth)  
**Returns**: <code>object</code> - An object conforming to the http-request model schema.  

| Param | Type | Description |
| --- | --- | --- |
| errorMessage | <code>string</code> | The error message to pass back in response data. |

<a name="module_web.auth.generateFailRedirect"></a>

### web.auth.generateFailRedirect(path) ⇒ <code>object</code>
Generate a standard error http response in HTML format (redirect).

**Kind**: static method of [<code>web.auth</code>](#module_web.auth)  
**Returns**: <code>object</code> - An object conforming to the http-request model schema.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The location header to pass back in http headers. |

<a name="module_web.auth.generateSuccessRedirect"></a>

### web.auth.generateSuccessRedirect(path, cookie) ⇒ <code>object</code>
Generate a standard success http response in HTML format (redirect).

**Kind**: static method of [<code>web.auth</code>](#module_web.auth)  
**Returns**: <code>object</code> - An object conforming to the http-request model schema.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The location header to pass back in http headers. |
| cookie | <code>string</code> | The cookie to place in the Set-Cookie header. |

<a name="module_web.response"></a>

## web.response
Web Response.

Standardized web response functions


* [web.response](#module_web.response)
    * [.getErrorResponse(httpRequest, error)](#module_web.response.getErrorResponse) ⇒ <code>object</code>
    * [.getOptionsResponse()](#module_web.response.getOptionsResponse) ⇒ <code>object</code>

<a name="module_web.response.getErrorResponse"></a>

### web.response.getErrorResponse(httpRequest, error) ⇒ <code>object</code>
Generate an error response for a supplied request.

**Kind**: static method of [<code>web.response</code>](#module_web.response)  
**Returns**: <code>object</code> - An http resonse.  

| Param | Type | Description |
| --- | --- | --- |
| httpRequest | <code>object</code> | An http request. |
| error | <code>object</code> | The error. |

<a name="module_web.response.getOptionsResponse"></a>

### web.response.getOptionsResponse() ⇒ <code>object</code>
Generate a response to an OPTIONS request.

**Kind**: static method of [<code>web.response</code>](#module_web.response)  
**Returns**: <code>object</code> - An Http Response.  
<a name="module_web.routing"></a>

## web.routing
Routing.

Maps http requests to their corresponding file friendly route

<a name="module_web.routing.matchRoute"></a>

### web.routing.matchRoute(fileFriendlyRoute, routes, componentRoutePath) ⇒ <code>object</code>
Attept to find a directory matching the supplied file friendly path.
Matching path parameters such as /contacts/{contactId} are returned in the `pathParams` property returned.

**Kind**: static method of [<code>web.routing</code>](#module_web.routing)  
**Returns**: <code>object</code> - Details of the matching path.  

| Param | Type | Description |
| --- | --- | --- |
| fileFriendlyRoute | <code>string</code> | The path to match. For example "#contacts#123#GET". |
| routes | <code>Array</code> | An array of directory names. For example "[#contacts#{contactId}#GET ... Etc]". |
| componentRoutePath | <code>string</code> | The full path of the calling component, up unto the folder containing the routes. For example "C:/ ... /my-web-app/web/routes". |

<a name="module_web.server"></a>

## web.server
Built-in http server

<a name="module_web.server.listen"></a>

### web.server.listen()
Creates a NodeJS server using http.createServer().

Incoming requests are converted to a [http-request model schema](./src/models/http-request.js) object and passed to web/router.js. 

[http-responses](./src/models/http-response.js) returned from web/router.js are converted to NodeJS http responses and written out.

Requires the application to have been initialized

**Kind**: static method of [<code>web.server</code>](#module_web.server)  
<a name="module_web.ui.alert"></a>

## web.ui.alert
Web UI Alert.

Client side JavaScript functions for working with the Shoelace alert component

<a name="module_web.ui.alert.getCode"></a>

### web.ui.alert.getCode() ⇒ <code>string</code>
Javascript code that can be injected into an HTML page.

**Kind**: static method of [<code>web.ui.alert</code>](#module_web.ui.alert)  
**Returns**: <code>string</code> - Alert JavaScript code.  
<a name="module_web.ui.binding"></a>

## web.ui.binding
Web UI Binding.

Client side JavaScript functions for binding objects to and from Shoelace controls

<a name="module_web.ui.binding.getCode"></a>

### web.ui.binding.getCode() ⇒ <code>string</code>
Javascript code that can be injected into an HTML page.

**Kind**: static method of [<code>web.ui.binding</code>](#module_web.ui.binding)  
**Returns**: <code>string</code> - Binding JavaScript code.  
<a name="module_web.ui.validation"></a>

## web.ui.validation
Web UI Validation.

Client side JavaScript functions for data validation using Shoelace controls

<a name="module_web.ui.validation.getCode"></a>

### web.ui.validation.getCode() ⇒ <code>string</code>
Javascript code that can be injected into an HTML page.

**Kind**: static method of [<code>web.ui.validation</code>](#module_web.ui.validation)  
**Returns**: <code>string</code> - Validation JavaScript code.  
<a name="module_workflow.pubsub"></a>

## workflow.pubsub
Workflow.

Functions for working with Redis publication and subscription


* [workflow.pubsub](#module_workflow.pubsub)
    * [.subscribe()](#module_workflow.pubsub.subscribe)
    * [.publishWorkflowJob(workflowName, stepName, workflowJob, pkgName, redisClient)](#module_workflow.pubsub.publishWorkflowJob)

<a name="module_workflow.pubsub.subscribe"></a>

### workflow.pubsub.subscribe()
Listen for events published to the Redis channel applicable to this application
And process these events by calling the workflow router "fulfill" method, passing in the event.

**Kind**: static method of [<code>workflow.pubsub</code>](#module_workflow.pubsub)  
<a name="module_workflow.pubsub.publishWorkflowJob"></a>

### workflow.pubsub.publishWorkflowJob(workflowName, stepName, workflowJob, pkgName, redisClient)
Create a Redis Key using the framework naming convention for the key name, and the workflow job as
the key data. Publishes an event to the application Redis channel (channel name is simply package.json name).
The key name is published as the event data.

**Kind**: static method of [<code>workflow.pubsub</code>](#module_workflow.pubsub)  

| Param | Type | Description |
| --- | --- | --- |
| workflowName | <code>string</code> | The name of the workflow that will consume the workflow job. |
| stepName | <code>string</code> | The workflow step that will consume the job. Defaults to "default". |
| workflowJob | <code>object</code> | The workflow job to publish. Must conform to the Workflow Job schema |
| pkgName | <code>string</code> | The package.json application name. This is the channel name |
| redisClient | <code>object</code> | Redis client. Does not need to be connected. |

