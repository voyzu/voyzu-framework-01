# The Voyzu Framework

The Voyzu Framework is a simple, minimalist NodeJS framework for developing robust, performant web applications. The framework has enabling Rapid Application Development and simplicity at its core. The framework includes its own model schema engine, its own web server and a built in async processing engine built on top of Redis pub / sub, as well as other helpful functionality like web authentication, configuration management and logging.

The framework in itself doesn't "do" anything. Rather it is designed to be used by a Voyzu Framework compatible web application. One such application is [Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01), a sample web application that makes use of the Voyzu Framework.

# Links

[Voyzu Flights - Voyzu Framework sample application and template](https://github.com/voyzu/voyzu-flights-01)

[Voyzu Flights online](https://voyzu-flights.voyzu.net)

[API documentation](./api.md)

[voyzu.com](https://voyzu.com) Voyzu is the company behind the framework. The voyzu.com website is built on the Voyzu Framework

## Prerequisites

- [NodeJS](https://NodeJS.org/en/download/package-manager). Version 18 and above is supported
- npm. Version 10 and above is supported. Npm 10 ships with NodeJS 18
- [Redis](https://Redis.io/docs/latest/operate/oss_and_stack/install/install-Redis/) 

## Install

- make sure you have the prerequisites above installed.
- clone this repo
- cd voyzu-framework-01
- npm install
- that's it :-)

Of course at this point the framework is not a whole lot of use to you, it is simply a repo sitting on your machine. To leverage the framework you will need to write a Voyzu Framework compatible web application. This is a component that "plays nicely" with the Voyzu Framework in that it conforms to the framework's specifications, and it makes use of framework capabilities like using its web server for serving web pages.

Fortunately you do not need to author a framework compatible app from scratch, [Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01) is a sample application that showcases much of the framework's functionality and that can also be used as a template for creating new Voyzu Framework web apps.

This documentation, and the documentation for Voyzu Flights work hand in hand. This document outlines the framework capabilities, and the Voyzu Flights documentation describes how to make practical use of the capabilities.

## Using the framework in your code

The best way to get started with the Voyzu Framework is to use the sample application ([Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01)) as a base. Instructions on how to create a Voyzu Framework application using Voyzu Flights as a starting template are available there. The Voyzu Framework requires that your application has a predefined structure so if you simply want to get started using the framework then the  [Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01) documentation is the place to start.

That said, below are some high level instructions to use the framework within your code

- Create a NodeJS application as a peer of voyzu-framework-01
- Add a link to the framework in the application's package.JSON file:

```JSON
    "dependencies": {
      "voyzu-framework-01": "file:../voyzu-framework-01"
```

- Run `npm install`. This will create a symbolic link to the Voyzu Framework.

Then within a code file import the framework as you would any other library

```javascript
import framework from 'voyzu-framework-01';
```

The framework uses a logical grouping of its functionality. So if you type `framework.` and you have code completion enabled you should see the various framework sub-libraries.

![Framework code complete](https://static-assets.voyzu.com/img/framework_screenshot_landscape.png)

From an architecture perspective, your application is in control and is responsible for authenticating and serving HTTP requests, running async processes etc. The Voyzu Framework is a library that works behind the scenes to empower you application.

## Caching

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01#the-in-memory-cache)

The framework in-memory cache is a simple key / value cache. Values are set to the cache by calling `framework.cache.get (<key (string)>, <value (any)>)` and retrieved from the cache by calling `framework.cache.get (<key (string)>)`.

The Voyzu Framework's caching module is powered by [lru cache](https://github.com/isaacs/node-lru-cache). 

Maximum cache size is set to 1,000,000

**Code snippet from [caching/cache.js](https://github.com/Voyzu/voyzu-framework-01/blob/main/src/caching/cache.js):**
```javascript
// Primitive constants (settings)
const lruCacheOptions = {
  max: 1_000_000,
};
```

## Working with models

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01?tab=readme-ov-file#working-with-models)

A model as the Voyzu Framework defines it, is a simple JSON object that represents the structure of a business object. The framework includes its own model schema definition engine. The framework defines a number of models, which it uses throughout the framework. For example the [http-request](https://github.com/Voyzu/voyzu-framework-01/blob/main/src/models/http-request.js) model represents a request passed by the built-in web server to your application's router. You can also define your own models.

Models are a powerful feature that let you define object defaults and validate object fields. For an example model demonstrating some model functionality see example Contact object:

**Code snippet from [models/examples/contact.js](https://github.com/Voyzu/voyzu-framework-01/blob/main/src/models/examples/contact.js):**

```javascript
export const schema = {
  city: { defaultFunction: defaultCity, type: "string" },
  email: [
    {
      label: { defaultValue: "example label", required: true, type: "string" },
      value: { required: true, type: "string" },
    },
  ],
  hard_type: { allowedValues: "HARD_VALUE", defaultValue: "HARD_VALUE", required: true, type: "string" },
  id: { required: true, type: "string" },
  name: { defaultFunction: getName, required: true, type: "string" },
  notes: { type: "string", validationFunction: validateNotes },
  person_name: {
    first_name: { required: true, type: "string" },
    last_name: { defaultValue: "gentleman", type: "string" },
  },
  record_type: { allowedValues: "ORGANIZATION,PERSON", defaultValue: "PERSON", required: true, type: "string" },
  tags: [{ type: "string" }],
  work_details: {
    company: { type: "string" },
    job_title: { type: "string" },
  }
};
```

To validate a model create the object that matches your target model and call

```javascript
framework.model.generateModel (object, targetSchema);
```

### Web server and routing

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01?tab=readme-ov-file#web-server-and-routing)

The Voyzu Framework includes a built in web server, which can be utilized in your code by calling `framework.web.server.listen();`

The `listen` function will pass control to a `router.js` file within your application that must reside in a `web` sub-directory.  The job of the router file is to receive an HTTP request, authorize it, route it to the matching path for fulfillment, and return an HTTP response.

Your application is responsible for this router file, which can in turn make use of built in framework functionaity like logging and authentication.

The [router.js](https://github.com/Voyzu/voyzu-flights-01/blob/main/web/router.js) file in Voyzu Flights can be used as a starting point. You would only need to modify this file if you wanted to do things like serve a custom 404 or error page, or had other custom code you wanted to exectute at the point of receiving and serving web requests.

All web paths must live inside your application's `/web/routes` folder. A simple naming convention is used to match HTTP requests to routes: Url forward slashes (`/`) are replaced with hashes (`#`). The HTTP verb (`GET`, `POST` etc) is then appended. In the Voyzu Framework this name is known as the "file friendly route". Your router.js file, using framework functionality, will automatically match urls to routes using this convention. For example:

- A folder in /routes named `#GET` will match a GET request to path `/`. This is the index page of your application
- A folder in /routes named `#flights#GET` will match a GET request to path `/`
- A folder in /routes named `#api#flights#POST` will match a POST request to path `/api/flights`

### Path parameters

Web paths support path parameters. Any parameter you enclose in curley braces (`{}`) will be matched based on path structure.  For example:

- A folder in /routes named `#api#workflow#process-flights#{requestId}#GET` will match a GET request to `/api/workflow/process-flights/123` and will pass `123` into the `requestId` parameter.
- A folder in flights named `#api#flights#{id}#DELETE` will match a DELETE request to `/api/flights/456` and will pass `456` into the `id` parameter.

Multiple parameters are supported. Paths are matched soley on route structure and HTTP verb. Parameters will match any data type passed, but parameters are not greedy.  For example:

- A folder in /routes named `#api/flights#{takeoff}#landing#GET` will NOT match a GET request to `/api/flights/123` (but WILL match a request to `/api/flights/123/landing`)
- A folder in /routes named `#api#flights#{takeoff}#GET` will NOT match a GET request to `/api/flights/123/landing` (but WILL match a request to `/api/flights/123`)

## Serving web pages

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01?tab=readme-ov-file#serving-web-pages)

The flow of a web request to a framework compatible app is as follows:

- A NodeJS HTTP request is received by the Voyzu Framework web server
- This request is processed and an http-request object is passed to your component's `web/router.js` file for fulfillment
- The router.js file will examine the HTTP request's `route` section to find the file_friendly_route property
- The router.js file will pass the HTTP request to the `index.js` file that resides in the matching file friendly route
. This index.js file will process the request and pass an http-response object back to the router. For html type requests the HTTP response object will contain the html to render in the browser in its `response_data` field
- The router passes the HTTP response back to the framework server
- The framework server converts the HTTP response into a node js HTTP response and outputs it

From the above flow you can see that the matching route's index page is free to use any method it likes to compose the html to serve back.

The approach that Voyzu Flights takes is to store the html page template as a peer of the index file. This file is then read, transformed using run time data and then served back.

The Voyzu Framework does contain three useful modules that make development using the shoelace web component library faster:

- `framework.web.ui.alert` which can display alert type messages
- `framework.web.ui.binding` which can be used to bind data objects to input fields and vice versa
- `framework.web.ui.validation` which can validate form data and output validation warnings.

## Workflows

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01?tab=readme-ov-file#workflows)

Workflows are a powerful feature of the Voyzu Framework that allow asynchronous processing. For example if you have a long running operation like processing documents, sending emails etc you generally do not want to do those operations within a website page serve. Doing this risks a timeout error and can slow down your entire app. A better approach is to fire a message to a service, and have that service fulfill the request. The Voyzu Framework uses the Redis pub/sub feature to achieve this. You can see an example of this asynchronous processing in the Voyzu Flights sample application 'Process Flights' screen.

If your applicaiton includes asyncronous functionality the `framework.workflow.pubsub.subscribe()` method can be called upon application launch. This method will subscribe to a Redis channel with the same name as your application. So if your application is named `voyzu-flights-01` a listener will be attached to Redis subscription channel `voyzu-flights-01`.

To process asynchronous jobs your application must have a top level `workflow` folder that contains a `router.js` file. The [Voyzu Flights router file](https://github.com/voyzu/voyzu-flights-01/blob/main/workflow/router.js) can be used for this purpose, you would not generally need to modify this file. The workflows themselves are placed in a `worfklows` sub folder. The `router.js` file receives all events published to the application's Redis channel, and routes them to the applicable workflow for processing.

To create and publish a workflow event for processing call `framework.workflow.pubsub.publishWorkflowJob(...)`

```javascript

/**
 * Create a Redis Key using the framework naming convention for the key name, and the workflow job as
 * the key data. Publishes an event to the application Redis channel (channel name is simply package.json name).
 * The key name is published as the event data.
 * @param {string} workflowName The name of the workflow that will consume the workflow job.
 * @param {string} stepName The workflow step that will consume the job. Defaults to "default".
 * @param {object} workflowJob The workflow job to publish. Must conform to the Workflow Job schema
 * @param {string} pkgName The package.json application name. This is the channel name
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
```

## Mocking

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01?tab=readme-ov-file#mocking)

Sometimes rather than run a web server locally you want instead to pass an event and receive a response. This can be useful for example in troubleshooting - you can copy the problematic event from production logs and replay that event locally.

The Voyzu Framework allows you to mock web events and workflow events. When a workflow event is mocked the event is published to the application's Redis channel. Thus the application must be running to sucessfully mock workflow events

They Voyzu Framework provides a mocking library for this purpose.
See [Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01?tab=readme-ov-file#mocking) for more information on how to use the Voyzu Framework mocking capability

## Authorization

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01?tab=readme-ov-file#authorization)

Note that the framework makes a distinction between a request being _authenticated_ meaning that the caller identity has been established, and a request being _authorized_ meaning the request is permitted.

### Authorizing requests

Authorization in the Voyzu Framework refers to the process of checking supplied credentials and creating a session within Redis if authorization succeeds. A single function is provided for this purpose `framework.web.auth.authorizeAndCreateSession (customFunction, httpRequestObject, config, packageName, redisClient)`

There are many ways of authorizing a call to your web application, you may adopt a simple username and password approach or use a third party authentication service like oAuth. If you roll your own authorization you may store user data in the database of your choice, e.g. mysql or PostgreSQL. For this reason the Voyzu Framework does not provide a one size fits all approach but rather allows you to authenticate using your own custom function. Supply this function as the first parameter in your call to `framework.web.auth.authorizeUsingCustomFunction`

The [`framework.web.auth.authorizeUsingCustomFunction`]('./src/web/auth/auth.js) call will examine the authorization object returned from your custom function, and if sucessful create a session within Redis. The function will generate a secure random session Id, add this key to Redis and append it to the authorization object returned by your custom function. A `cookie` string property containing the session id is also added to the authorization object returned by your custom function, this can be passed in your HTTP response to set a cookie on the browser.

### Checking whether a request is authorized

The framework provides two methods of checking whether an HTTP request is authorized: **session based authorization** which checks whether a Voyzu Session Id, which can be passed in the query string, header or in a cookie exists in the Redis session store and **path and password based authorization** which checks whether an authorization key in the query string matches its corresponding value in your config file. These two methods can be used however you wish, for example you may require only one or both. Most applications will require only session based authorization. Path based authorization can be useful for certain use cases such as securing an application api path which is called by a third party.

#### Session based authorization

Session based authorization will be used for most application use cases. The most common way to secure your application is to have an initial authorization gateway, for example a login screen where the user must supply their user name and a password and to use the framework to create a secure random string that can then be supplied by the caller in future requests.

The framework provides the following method to check whether an HTTP request is authorized by way of session id:
```javascript
framework.web.auth.getSessionAuthorization(httpRequestObject, config, packageName, redisClient)
```

Note that if `bypassAuth` is set to true in your application config then the request will not attempt to be authorized and all requests will be allowed. Also note that authorization is not required for paths that contain:

- `login`, as the login form itself is generally not protected
- `auth` which allows your application to establish api authentication at a path such as `/api/auth`
- `loader` which allows you to use the web based performance tool [loader.io](https://loader.io/)
- `public` which is designed for serving files that do not require authorization such as javascript and css files served to the client

Your application is responsible for checking requests to see if they are authorized and handling authorization failure. This is most commonly done in the router.js file.

#### Path and password based authorization

Using this method a path is protected by a password - with both the path and password stored in your config.js file. Requests are not authenticated they are simply authorized by determining whether the path is protected and if so has the correct password been supplied in the query string. A naming convention is used: `auth_key_<key name>` passed in the query string maps to `<key name>` in the .config file "authorizationKeys" section.

For example using the example configuration below, to authorize a call to `/api/flights` would require a call to `api/flights?auth_key_api=api-secret`. For convenience, `auth_key` passed on its own in the query string is equivalent to `auth_key_default`

An example configuration:

```javascript
authorizationKeys:{
        default:{
            secret:'default-secret',
            scope:'#'
        },
        api:{
            secret:'api-secret',
            scope:'#api'
        },
```

Scopes (which map to file friendly routes) are greedy by default.  So a scope of `#`, which maps to path `/` means that all requests to the application require a password (`default-secret` in the example above). Requests to `/api` for example `/api/flights`, `/api/process-flights` etc can be authorized using the api password (`api-secret` in the example above). This "greedy" behaviour also means that a key that authorizes a route will also authorize all its sub-routes. In the above example our `default` key will also authorize all calls to `/api`. However the `api` key will only authorise routes that start with `/api`.

The framework provides the following method to check whether an HTTP request is authorized by way auth key:

```javascript
framework.web.auth.getPathAuthorization(httpRequestObject, config)
```

Note that simply having a valid `authorizationKeys` section in your config does not in and of itself mean that any of your application paths are protected. You must explicity call `getPathAuthorization` and handle authorization failure. This is most commonly done in the router.js file.

## Configuration

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01/tree/main#configuration)

A Voyzu Framework app has two configuration files: `config-default.js` and `config.js` which inherits from config-default.js. The config.js file only is used as the source of application configuration data. This meains that all config-default.js values will flow through to config.js, unless specifically over-ridden in the config.js file.

The default .gitignore file igores config.js as it may contain sensitive data such as application passwords, meaning that config.js will not automatically be pushed to production if you are pulling from github. In general you should store configuration data in config-default.js unless:

- The data is sensitive in which case you should put the data in config.js and make sure you do not commit or deploy config.js
- The data needs to be different between development and production environments.

An example config file with all properties consumed by the Voyzu Framework:

```javascript
import defaultConfig from './config-default.js';

const config = {
    ...defaultConfig, // Spread operator to include all properties from config-default.js

    bypassAuth: true, // bypass authorization - do not use this setting in production
    hotReload: true, // reload router.js and the route called with every page load. Do not use this setting in production
    logAuth: true, // log to file the authorization object returned
    logEvent: true, // log to file the event received by the web router
    logPublicRoutes: false, // log calls to paths that contain '/public'
    logResponse: true, // log to file the response returned by the web router
    redis: {
        default: {
            username: '',
            password: '',
            host: '127.0.0.1',
            port: '6379'
        }
    },
    ssh: {
        default: {
            host: '123.456.789.123', // SSH server address
            port: 22, // SSH server port
            username: 'username', // SSH username
            privateKeyPath: '~/.ssh/prod-rsa' // Path to the private key
        }
    },
    throwErrors: true, // Display errors and the stack trace directly on the web page. Do not use this setting in production
};

export default config;

```

Note that in line with its "your application is in control" design, the framework does actually use any of these values itself. Rather the above documentation, and the default config file created on start up, provide a set of helpful keys that your application can use.

## Logging

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01/tree/main#logging)

The framework allows logging from any part of an application through the `framework.devops.log` module.  This allows logging at three levels of severity: `debug`, `info` and `error`. Any call to a log method is always logged to stdout (e.g. the console). All calls are also logged to a file residing in the 'logs' folder of your web application. In addition all methods support an `objToLogToFile` parameter, this allows you to pass an object for example for troubleshooting purposes. Object passed through this parameter will be logged only to the log file (i.e. not to stdout).

## Helper classes

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01/tree/main?tab=readme-ov-file#helper-classes)

The framework includes a number of helper classes, these can be used anywhere in your application. The framework itself also makes use of many of these helper functions

## Deployment to production

[This capability in action at Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01/tree/main?tab=readme-ov-file#deployment-to-production)

The Voyzu Framework itself can be deployed to any environment by simply following the install instructions above.

In addition the framework contains a number of functions that are useful for deploying Voyzu Framework compatible applications to a production environment e.g. a Virtual Server. The [Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01/tree/main?tab=readme-ov-file#deployment-to-production) sample application contains step by step instructions describing how to deploy a framework compatible app to production.

## FAQs

### What Operating Systems does the Voyzu Framework run on?

Because the framework has only NodeJS and Redis as prerequisites it could be exected to run on any platform that supports NodeJS and Redis. It has been tested for local development on later versions of Ubuntu and Windows, and for production use on Ubuntu 24 LTS

### Why javascript and not typescript?

The javascript vs typescript debate has been going on for many years, and will no doubt continue until a best of both worlds solution is found. The Voyzu Framework has taken the approach of enforcing types at run time, though its own model schema engine.

### Why the "-01"?

The framework is under active development. At some point a "voyzu-framework-02" may appear, which will share the same design philosopy and will probably contain breaking changes. If a repository maintainer becomes available a more conventional versionning strategy may be adopted.

### Does the framework support a monolith or microservices approach?

The framework is agnostic as to whether you take a monolith or microservices approach. It is possible to separate or combine functionality. In general a framework application is designed to map one to one with a domain name, so this may be a consideration for you (e.g. if you want multiple domains or don't want multiple domains) Voyzu Flights, the framework sample application is written as a monolith, with web pages, the api and the async processing engine all residing in a single repository.

### What database does the framework support?

The framework is database agnostic. The sample application uses an in-memory datastore for simplicity. To use a persistant database you will need to write CRUD code to map your database models to database tables.

In the future it is possible that database persistance functionality comes into the framework, in which case PostgresSQL will most probably be the database technology used.

### Why include a model validation engine rather than use a standard schema validation tool like ajv?

There is a difference between a schema that describes validation criteria for a model, and a schema that describes the model. The difference can be subtle but it is important. Validation is about checking that a given model conforms to a certain schema. However model definition seeks to define an object more fully. The Voyzu Framework required a model definition schema. Another reason is performance, in testing for example AJV took up to 80 ms to validate a model, however the Voyzu Framework is able to parse most models in single digit miliiseconds.

### Why does the Voyzu Framework not leverage an existing front end framework (e.g. react, vue, svelte etc)?

Not using a front end framework is in line with the Voyzu Framework's simplicity ethos. Frameworks introduce complexity. Framworks also introduce abstraction, and abstractions incur an inevitable performance hit.

Of course there is an irony in making these statements in the readme of a framework! The point here is that it is simpler to use a framework with minimal dependancies than a framework that depends on other frameworks.  Also the Voyzu Framework aims to introduce only a very basic level of abstraction.

The approach this framework takes in terms of web page UI is to leverage web component technology, in particular the [shoelace](https://shoelace.style) web component library.

### How large is the Voyzu Framework when installed?

- Including runtime only dependencies (`npm install --omit=dev`) the framework is less than 36Mb un-compressed
- Including dev dependencies the framework is less than 76Mb un-compressed

### How can I get involved?

The best way to get involved is to first download and run the [Voyzu Flights](https://github.com/Voyzu/voyzu-flights-01) demo application, and when you are ready, create your own Voyzu Framework compatible web application. We'd love to hear your questions and feedback. Use the 'issues' tab in this repo to ask a question or to give feedback.
