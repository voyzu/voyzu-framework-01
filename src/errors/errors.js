/**
 * Errors.
 * @module "errors"
 */

/**
 * Invalid Configuration Error.
 * 
 * Throw this error when Application configuration is not expected.
 */
export class InvalidConfigurationError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "InvalidConfigurationError";
    this.isVoyzuError = true;
  }
}

/**
 * Invalid Parameters Error.
 * 
 * Throw this error when function parameters are not correct.
 */
export class InvalidParametersError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "InvalidParametersError";
    this.isVoyzuError = true;
  }
}

/**
 * Model Schema Validation Error.
 * 
 * This error is thrown by model.generateModel() if the schemas passed in is not valid.
 * 
 */ 
export class SchemaMetaValidationError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "SchemaMetaValidationError";
    this.isVoyzuError = true;
  }
}

/**
 * Model Validation Error.
 * 
 * This error is thrown by model.generateModel() if the object passed in does not match the schema passed in.
 * 
 */
export class SchemaValidationError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "SchemaValidationError";
    this.isVoyzuError = true;
  }
}
