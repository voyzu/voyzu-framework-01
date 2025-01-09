/**
 * JSON helper.
 * @module "helpers.jsonHelper"
 */

// Import third party libraries
import parseJson from "parse-json";

/**
 * Receives an object or stringified JSON and returns a parsed JSON object.
 * If the input is already a JSON object then it will be returned unchanged
 * If an error occurs a detailed JSON parsing error will be thrown.
 * @param {any} input The input to parse.
 * @returns {object} The parsed JSON object.
 */
export function parse(input) {

  if (Array.isArray(input)) {
    return input;
  }

  try {
    // Use npm library 'parse-json', this returns much more meaninfull error messages than JSON.parse(..)
    return parseJson(input);
  } catch (error) {

    if (error.name === "JSONError" && error.message.includes("[object Object]")) {
      // Input is a JavaScript object literal, simply return the input
      return input;
    } else if (error.name === "TypeError" && error.message.includes("string.lastIndexOf is not a function")) {
      // Input is a JavaScript object literal, simply return the input
      return input;
    } 
      throw error;
    
  }
}
