/**
 * Boolean helper.
 * @module "helpers.booleanHelper"
 */

/**
 * Receives an input and attempts to parse into a boolean.
 * Input that cannot be converted to a boolean returns false.
 * @param {any} input The value to test whether it is true or not.
 * @returns {boolean} Boolean value true or false.
 */
export function isTrue(input) {
  try {
    return Boolean(JSON.parse(input));
  } catch {
    return false;
  }
}
