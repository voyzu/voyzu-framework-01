// Cache
import * as cachingCache from "./src/caching/cache.js";

// Devops
import * as devopsInit from "./src/devops/init.js";
import * as devopsMock from "./src/devops/mock.js";
import * as devopsDeploy from "./src/devops/deploy.js";
import * as devopsExec from "./src/devops/exec.js"
import * as devopsLog from "./src/devops/log.js";
// second level
import * as devopsTemplatesGetCode from "./src/devops/templates/get-code.js"

// Enums
import * as enumsEnums from "./src/enums/enums.js";

// Errors
import * as errorsErrors from "./src/errors/errors.js";

// Helpers
import * as helpersBooleanHelper from "./src/helpers/boolean-helper.js";
import * as helpersCryptoHelper from "./src/helpers/crypto-helper.js";
import * as helpersJsonHelper from "./src/helpers/json-helper.js";
import * as helpersObjectHelper from "./src/helpers/object-helper.js";
import * as helpersStringHelper from "./src/helpers/string-helper.js";
import * as helpersTypeHelper from "./src/helpers/type-helper.js";
import * as HelpersWaitHelper from "./src/helpers/wait-helper.js";

// Model
import * as modelModel from "./src/model/model.js";

// Model schemas
import { schema as modelsAuthorization } from "./src/models/authorization.js";
import { schema as modelsSession } from "./src/models/session.js";
import { schema as modelsHttpRequest } from "./src/models/http-request.js";
import { schema as modelsHttpResponse } from "./src/models/http-response.js";
import { schema as modelsExamplesContact } from "./src/models/examples/contact.js";
import { schema as modelsClientRequest } from "./src/models/client-request.js";
import { schema as modelsWorkflowJob } from "./src/models/workflow-job.js";

// Web
import * as webAuthAuth from './src/web/auth/auth.js';
import * as webResponseResponse from './src/web/response/response.js'
import * as webServerServer from './src/web/server/server.js'
import * as webRouting from "./src/web/routing/routing.js";
import * as webUiAlert from './src/web/ui/alert.js'
import * as webUiBinding from './src/web/ui/binding.js'
import * as webUiValidation from './src/web/ui/validation.js'

// Workflow
import * as workflowPubsub from './src/workflow/pubsub.js';

/**
 * Voyzu Framework methods
 */
export const framework = {
  /**
   * Cache - in memory datastore
   */
  cache: cachingCache,
  // Devops
  devops: {
    init: devopsInit,
    mock: devopsMock,
    deploy: devopsDeploy,
    exec: devopsExec,
    log: devopsLog,
    templates: {
      getCode: devopsTemplatesGetCode
    }
  },
  // Enums
  enums: enumsEnums,
  // Errors
  errors: errorsErrors,
  //Helpers
  helpers: {
    booleanHelper: helpersBooleanHelper,
    cryptoHelper: helpersCryptoHelper,
    jsonHelper: helpersJsonHelper,
    objectHelper: helpersObjectHelper,
    stringHelper: helpersStringHelper,
    typeHelper: helpersTypeHelper,
    waitHelper: HelpersWaitHelper
  },
  // Model
  model: modelModel,
  // Models
  models: {
    authorization: modelsAuthorization,
    clientRequest: modelsClientRequest,
    examples: {
      contact: modelsExamplesContact,
    },
    httpRequest: modelsHttpRequest,
    httpResponse: modelsHttpResponse,
    session: modelsSession,
    workflowJob:modelsWorkflowJob
  },
  /**
   * Voyzu Framework Web Modules
   */
  web: {
    /**
     * Web Authorization methods.
     */
    auth: webAuthAuth,
    /**
     * Web routing methods
     */
    routing: webRouting,
    response: webResponseResponse,
    server: webServerServer,
    ui: {
      alert: webUiAlert,
      binding: webUiBinding,
      validation: webUiValidation
    }
  },
  // Workflow
  workflow: {
    pubsub:workflowPubsub
  }
};

export default framework;
