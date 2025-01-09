/**
 * Emums.
 * @module "enums"
 */

//                                            Client messaging

/**
 * @readonly
 * @enum {string}
 */
export const MESSAGE_LEVEL = {
  DANGER: "DANGER",
  INFO: "INFO",
  OTHER: "OTHER",
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
};

//                                            Web and routing

/**
 * @readonly
 * @enum {string}
 */
export const HTTP_CODE = {
  ACCEPTED:202,
  CREATED:201,
  ERROR:540,
  FOUND:302,
  NOT_FOUND: 404,
  NO_CONTENT:204,
  SUCCESS: 200,
  UNAUTHORIZED: 401
};

/**
 * @readonly
 * @enum {string}
 */
export const HTTP_RESPONSE_TYPE = {
  CSS: "CSS",
  HTML: "HTML",
  IMAGE: "IMAGE",
  JAVASCRIPT: "JAVASCRIPT",
  JSON: "JSON",
  OTHER: "OTHER",
  TEXT: "TEXT",
};

//                                            Workflow

/**
 * @readonly
 * @enum {string}
 */
export const WORKFLOW_REQUEST_ORIGIN = {
  BROWSER: "BROWSER",
  SCHEDULED_EVENT: "SCHEDULED_EVENT",
};

/**
 * @readonly
 * @enum {string}
 */
export const PROCESS_STATUS = {
  FAIL: "FAIL",
  PROCESSED: "PROCESSED",
  PROCESSING: "PROCESSING",
};
