/* eslint-disable */
// switch eslint off, if its on it capitalizes the first line of comments which stuffs up our commented out variables

import defaultConfig from './config-default.js';

const config = {
    ...defaultConfig, // Spread operator to include all properties from config-default.js

    // bypassAuth: true, // bypass authorization - do not use this setting in production
    // hotReload: true, // reload router.js and the route called with every page load. Do not use this setting in production
    // logAuth: true, // log to file the authorization object returned
    // logEvent: true, // log to file the event received by the web router
    // logPublicRoutes: false, // log calls to paths that contain '/public'
    // logResponse: true, // log to file the response returned by the web router
    redis: {
        default: {
            host: '127.0.0.1',
            password: '',
            port: '6379',
            username: '',
        }
    },
    ssh: {
        default: {
            host: '123.456.789.123', // SSH server address
            port: 22, // SSH server port
            privateKeyPath: '~/.ssh/prod-rsa', // Path to the private key
            username: 'username', // SSH username
        }
    },
    // throwErrors: true, // display errors and the stack trace directly on the web page. Do not use this setting in production
};

export default config;