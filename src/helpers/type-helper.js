/**
 * Type helper.
 * @module "helpers.typeHelper"
 */

/**
 * Check the type of a given value. Type in this context is informal, i.e. A best effort to determine an informal
 * way of describing a given value in terms of its type.
 * @param {any} value The value to check.
 * @returns {string} The value type.
 */
export function getType(value) {
  if (isUndefined(value)) {
    return "undefined";
  } else if (isNull(value)) {
    return "null";
  } else if (isNaN(value)) {
    return "NaN";
  } else if (isArray(value)) {
    return "array";
  } else if (isBoolean(value)) {
    return "boolean";
  } else if (isString(value)) {
    return "string";
  } else if (isNumber(value)) {
    return "number";
  } else if (isClass(value)) {
    return "class";
  } else if (isSimpleObject(value)) {
    return "simpleObject";
  } else if (isClassInstance(value)) {
    return "classInstance";
  } else if (isFunction(value)) {
    return "function";
  }
  return Object.prototype.toString.call(value);
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isBoolean(value) {
  return Object.prototype.toString.call(value) === "[object Boolean]";
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isClassInstance(value) {
  return typeof value === "object" && !Reflect.ownKeys(value).includes("prototype");
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isNaN(value) {
  return Number.isNaN(value);
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isUndefined(value) {
  return value === undefined;
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isFunction(value) {
  return typeof value === "function";
}

/**
 * Check whether a given value is of a given type.
 * @param {object} obj The value to check.
 * @returns {boolean} The results of the check.
 */
export function isClass(obj) {
  // If not a function, return false.
  if (typeof obj !== "function") {
    return false;
  }

  const descriptor = Object.getOwnPropertyDescriptor(obj, "prototype");

  // Functions like `Promise.resolve` do have NO `prototype`.
  if (!descriptor) {
    return false;
  }

  return !descriptor.writable;
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isNull(value) {
  return value === null;
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isNumber(value) {
  return Object.prototype.toString.call(value) === "[object Number]" && Math.abs(value) !== 1 / 0 && !Number.isNaN(value);
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isNumberLike(value) {
  return isNumber(Number(value));
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}

/**
 * Check whether a given value is of a given type.
 * @param {any} value The value to check.
 * @returns {boolean} The results of the check.
 */
export function isSimpleObject(value) {
  const objectConstructor = {}.constructor;
  return Object.prototype.toString.call(value) === "[object Object]" && value !== null && value.constructor === objectConstructor;
}
