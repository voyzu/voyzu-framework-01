/**
 * Object helper.
 * @module "helpers.objectHelper"
 */

/**
 * Check if ojbect is empty (has no keys).
 * @param {object} obj Object to check.
 * @returns {boolean} A boolean indicating whether the object is an empty object.
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Convert an object to a Plain Old Javascript Object (POJO).
 * @param {object} object The object to convert to a POJO.
 * @returns {object} A POJO object.
 */
export function toPojo(object) {
  const pojo = {};
  for (const [key, value] of Object.entries(object)) {
    pojo[key] = value;
  }

  return pojo;
}
