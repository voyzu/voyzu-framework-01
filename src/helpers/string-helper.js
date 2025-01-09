/**
 * String helper.
 * @module "helpers.stringHelper"
 */

/**
 * Checks whether a string is alphanumeric.
 * @param {string} str The string to check.
 * @returns {boolean} A boolean with the results of the check.
 */
export function isAlphanumeric(str) {
  return /^[\dA-Za-z]+$/.test(str);
}

/**
 * Checks whether a string is alphanumeric, accepting also the underscore (_) character.
 * @param {string} str The string to check.
 * @returns {boolean} A boolean with the results of the check.
 */
export function isAlphanumericIncUnderscore(str) {
  return /^\w+$/.test(str);
}

/**
 * Takes a raw input of cookes and returns an object of key/value pairs.
 * @param {any} cookieArrayOrString The raw cookie input.
 * @returns {object} The parsed cookie.
 */
export function parseCookies(cookieArrayOrString) {
  const cookieStrings = Array.isArray(cookieArrayOrString) ? cookieArrayOrString : cookieArrayOrString.split(";");

  const cookie = {};
  for (const cookieString of cookieStrings) {
    const [name, value] = cookieString.trim().split("=");
    cookie[name] = value;
  }

  return cookie;
}

/**
 * Check if a string is a valid email.
 * @param {string} email The email string to check.
 * @returns {boolean} A boolean with the results of the check.
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
