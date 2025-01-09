/**
 * Object generation and validation based on supplied Voyzu Framework model schema definition.
 * @module "model"
 */

/* eslint-disable */

// Third party libraries
import traverse from "traverse";

// Modules from this component
import { SchemaMetaValidationError, SchemaValidationError } from "../errors/errors.js";
import { getType, isString, isNumber, isNumberLike, isUndefined } from "../helpers/type-helper.js";
import { isEmpty } from "../helpers/object-helper.js";
import { isAlphanumericIncUnderscore } from "../helpers/string-helper.js";

/**
 * Gemerates a model from the supplied base object and schema. The base object is not modified.
 * @param {object} baseObject The object to use as the basis of the generated model.
 * @param {object} schema The voyzu model schema to apply.
 * @returns {object} A validated object model matching the supplied schema.
 */
export function generateModel(baseObject, schema) {
  // Basic validation of schema and object

  const schemaType = getType(schema);
  if (schemaType !== "array" && schemaType !== "simpleObject") {
    throw new SchemaMetaValidationError("Schema must be an array or a simple object", `Expected an array or a simple object but found ${schemaType}`);
  }

  if (isEmpty(schema)) {
    throw new SchemaMetaValidationError("Schema cannot be empty");
  }

  const objectType = getType(baseObject);
  if (objectType !== "array" && objectType !== "simpleObject") {
    throw new SchemaMetaValidationError("Base object must be an array or a simple object", `Expected an array or a simple object but found ${objectType}`);
  }

  // Deal with MongoDB's "_id" field which is actually a function that returns a string, it also causes traverse.clone to bug out
  traverse(baseObject).forEach(function (value) {
    if (this.key === "_id" && !isUndefined(value)) {
      this.update(value.toString());
    }
  });

  const object = traverse(baseObject).clone();

  /*
   * Traverse the schema
   * get the parent nodes of the leaf nodes and do some core validation
   */
  const parentMap = new Map();
  traverse(schema).forEach(function (value) {
    if (this.circular) {
      throw new SchemaMetaValidationError("circular reference in schema", { schemaPath: this.path, schemaNode: value });
    }

    if (!isAlphanumericIncUnderscore(this.key)) {
      throw new SchemaMetaValidationError("Only include letters, numbers and the underscore (_) are permitted in key names", { schemaPath: this.path, schemaNode: value });
    }

    if (this.isLeaf) {
      parentMap.set(this.parent.path.join("/"), this.parent.key);
    }
  });

  /*
   * Iterate over the parent path set
   * build a schema map from the parent paths
   */
  const schemaMap = new Map();
  for (const [key, value] of parentMap) {
    if (value === "allowedValues") {
      // This happens if the allowedValues is an array
      throw new SchemaMetaValidationError("allowedValues cannot be an array or an object", { reason: "allowedValues appears to be an array or an object. Use a comma separated string instead", schemaPath: this.path, schemaNode: value });
    }

    const node = {};
    node.schemaNode = traverse(schema).get(key.split("/"));

    const strippedPath = [];
    const segments = [];
    for (const path of key.split("/")) {
      if (path === "") {
        throw new SchemaMetaValidationError("Schema node not found", { reason: "A valid schema node was not found. Make sure the schema node is an object", schemaPath: key, schemaNode: value });
      }

      if (isNumberLike(path)) {
        node.isArray = true;
        node.matchingObjectPaths = [];
        segments.push(["{n}"]);
        node.isNPath = true;
      } else {
        strippedPath.push(path);
        segments.push(path);
      }
    }
    node.strippedPath = strippedPath;
    node.key = value;

    schemaMap.set(segments.join("/"), node);
  }

  // Console.log(schemaMap)

  /*
   * Iterate over the schema map
   * some validation of internal schema logic
   */
  const validTypes = ["string", "number", "boolean", "simpleObject", "function", "anySupportedType"];
  for (const [key, value] of schemaMap) {
    const { schemaNode } = value;

    if (!schemaNode.type) {
      throw new SchemaMetaValidationError('No "type" property', { reason: 'a "type" property must be present in the schema node. Make sure your schema node includes a "type" property and does not include any arrays or objects.', schemaPath: key, schemaNode: value });
    }

    if (!validTypes.includes(schemaNode.type)) {
      throw new SchemaMetaValidationError("Unexpected schema node type", { reason: `schema node type  "${schemaNode.type}" is invalid. Value must be one of "${validTypes.join(", ")}"`, schemaPath: key, schemaNode: value });
    }

    const validProps = ["type", "required", "defaultValue", "defaultFunction", "allowedValues", "friendlyName", "validationFunction"];
    for (const prop of Object.keys(schemaNode)) {
      if (!prop.toLowerCase().startsWith("custom") && !validProps.includes(prop)) {
        throw new SchemaMetaValidationError("Unexpected schema node property", { reason: `schema node property "${prop}" is invalid. Value must begin with "custom" or be one of "${validProps.join(", ")}"`, schemaPath: key, schemaNode: value });
      }
    }

    if (schemaNode.defaultValue !== undefined && schemaNode.defaultFunction !== undefined) {
      throw new SchemaMetaValidationError("Invalid schema node attribute combination", { reason: 'a "defaultValue" and a "defaultFunction" cannot both be present in a schema node', schemaPath: key, schemaNode: value });
    }

    if (schemaNode.allowedValues !== undefined && schemaNode.validationFunction !== undefined) {
      throw new SchemaMetaValidationError("Invalid schema node attribute combination", { reason: 'both "allowedValues" and "validationFunction" cannot both be present in a schema node', schemaPath: key, schemaNode: value });
    }
  }

  const validationErrors = {
    errors: [],
    userFriendlyErrors: [],
  };

  /*
   * Traverse the object
   * add matching array paths to the schema map as matchingObjectPaths
   */
  traverse(object).forEach(function (value) {
    if (this.circular) {
      throw new SchemaValidationError("Circular reference in base object", { reason: "circular reference in object", objectPath: this.path, objectValue: value });
    }

    if (this.isLeaf) {
      let isArrayPath = false;
      const strippedPath = [];
      for (const path of this.path) {
        if (isNumber(Number.parseInt(path))) {
          isArrayPath = true;
        } else {
          strippedPath.push(path);
        }
      }

      if (isArrayPath) {
        for (const [, schemaValue] of schemaMap) {
          if (strippedPath.join("/") === schemaValue.strippedPath.join("/")) {
            schemaValue.matchingObjectPaths.push(this.path.join("/"));
          }
        } // Next schema map item
      }
    } // End is leaf node
  }); // Next object path

  const schemaMapCloned = new Map(JSON.parse(JSON.stringify([...schemaMap])));

  /*
   * Iterate over the schema map
   * build up array paths, based on possible combinations of matching object paths
   */
  for (const [key, node] of schemaMapCloned) {
    if (node.isNPath) {
      const segments = key.split("/");
      const lineTemplate = JSON.parse(JSON.stringify(segments));
      for (const [i, segment] of segments.entries()) {
        if (segment === "{n}") {
          let highestN = 0;

          for (const matchingObjectPath of node.matchingObjectPaths) {
            const matchingObjectPathSegments = matchingObjectPath.split("/");

            if (Number.parseInt(matchingObjectPathSegments[i]) > highestN) {
              highestN = Number.parseInt(matchingObjectPathSegments[i]);
            }
          }
          lineTemplate[i] = { max: highestN };
        }
      } // Next segment in the schema path

      const combinations = generateCombinations(lineTemplate);

      for (const combination of combinations) {
        const clonedNode = JSON.parse(JSON.stringify(node));
        delete clonedNode.matchingObjectPaths;
        clonedNode.isNPath = false;
        clonedNode.syntheticPath = true;
        schemaMap.set(combination.join("/"), clonedNode);
      } // Next combination
    } // End value is nPath
  } // Next key,value in our cloned schemaMap

  // console.log (schemaMap)

  /*
   * Traverse object.
   * leaf nodes must be present in the schema map
   * if there is no matching schema path then that is a validation error
   * (allowing for the fact that simple objects are not described in the schema)
   * as the schema fully describes the complete object shape
   */
  traverse(object).forEach(function (objectValue) {
    if (this.isLeaf && !this.isRoot) {
      const matchingSchemaNode = schemaMap.get(this.path.join("/"));

      if (!matchingSchemaNode) {
        let struck = false;
        const paths = JSON.parse(JSON.stringify(this.path));
        while (paths.length > 0) {
          const path = paths.pop();

          // console.log (`********************  checking path ${path}`)

          for (const [, value] of schemaMap) {
            // console.log (`checking schema map`)
            // console.log (value)
            // debugging workflow task schema getting rejected with object path not found in schema
            // changed "if (value.key === path" ... to the below
            // Oct 24, debugging talofa voucher.  agent ( a simpleObject) was present in the schema but was undefined
            // removed the below condition which cam after if (value.strippedPath.includes(path) 

            //&& (value.schemaNode.type === "simpleObject" || value.schemaNode.type === "anySupportedType")
            if (value.strippedPath.includes(path) ) {
              // console.log(`path ${this.path.join('/')} was not found in the schema map, but its key or upstream key ${path} matched with ${value.schemaNode.type} path "${path}" so it has been allowed`)
              struck = true;
              break;
            }
          }
        }

        if (!struck) {
          validationErrors.errors.push({ reason: `object path ${this.path.join("/")} not found in schema`, objectValue });
          validationErrors.userFriendlyErrors.push(`${this.key} is not valid`);
        }
      }
    }
  });

  /*
   * Iterate the schema map
   * final iteration
   * validate and set defaults
   */
  for (const [key, node] of schemaMap) {
    if (node.isNPath) {
      continue;
    }

    node.path = key.split("/");
    const { schemaNode } = node;

    const objectNodeExists = traverse(object).has(node.path);
    let primitiveValue = traverse(object).get(node.path);

    // Set any defaults (if there is no value already set)
    if (primitiveValue === undefined && (schemaNode.defaultValue !== undefined || schemaNode.defaultFunction !== undefined)) {
      let newPrimitiveValue;
      if (schemaNode.defaultValue !== undefined) {
        newPrimitiveValue = schemaNode.defaultValue;
      } else if (schemaNode.defaultFunction !== undefined) {
        const functionType = getType(schemaNode.defaultFunction);
        if (functionType !== "function") {
          throw new SchemaMetaValidationError("defaultFunction is not a function", { reason: `expected a type of "function" but found "${functionType}"`, schemaPath: key, schemaNode: node });
        }
        try {
          // Execute the default function
          newPrimitiveValue = schemaNode.defaultFunction(primitiveValue, schemaNode, baseObject);
        } catch (error) {
          throw new SchemaMetaValidationError("defaultFunction errors out", { reason: `default function "${schemaNode.defaultFunction.name}" errored out`, schemaPath: key, schemaNode: node, error: error.message });
        }
      }

      /*
       * Validate that our new default value has a valid type
       * node that "undefined" is not a valid type
       */
      const defaultType = getType(newPrimitiveValue);
      if (!["null", "boolean", "string", "number", "undefined"].includes(defaultType)) {
        throw new SchemaMetaValidationError("defaultFunction returns unexpected type", { reason: `unexptexted default value type "${defaultType}"`, schemaPath: key, schemaNode: node, defaultValueAttempted: newPrimitiveValue });
      }

      // Go ahead and set our new primitive value
      if (objectNodeExists) {
        /*
         * An object node exists but its undefined.
         * in this case we update the node, as simply calling traverse(object).set(...) would change the order of keys in our object
         */
        traverse(object).forEach(function () {
          if (this.path.join("/") === key) {
            this.update(newPrimitiveValue, true);
          }
        });
      } else {
        // Default value node is not present in the object
        traverse(object).set(node.path, newPrimitiveValue);
      }

      // Console.debug(`default value of ${key} has been set from ${primitiveValue} to ${newPrimitiveValue}`)

      primitiveValue = newPrimitiveValue;
    } // End there is either a defaultValue or a defaultFunction // End primitive value is undefined

    // Having set any defaults, and values we can now validate

    // Is it required
    if (schemaNode.required && primitiveValue === undefined) {
      let hasUndefinedParent = false;
      const paths = key.split("/");
      while (paths.length > 0) {
        paths.pop();

        if (paths.length > 0) {
          const uplineValue = traverse(object).get(paths);

          if (isUndefined(uplineValue)) {
            hasUndefinedParent = true;
          }
        }
      }

      if (hasUndefinedParent) {
        // Console.log(`${key} is required and is undefined. But it has an upline parent which is undefined, so we're allowing it`)
      } else {
        validationErrors.errors.push({ reason: `${key} is required`, schemaPath: key, schemaNode: node, objectValue: primitiveValue });

        if (node.isArray) {
          validationErrors.userFriendlyErrors.push(`${node.schemaNode.friendlyName ?? node.strippedPath.join("/")} is required`);
        } else {
          validationErrors.userFriendlyErrors.push(`"${node.schemaNode.friendlyName ?? node.key} is required`);
        }
      }
    }

    // If allowedValues are present, does it match
    if (primitiveValue !== undefined && schemaNode.allowedValues) {
      const allowedValues = [];
      for (const allowedValue of schemaNode.allowedValues.split(",")) {
        allowedValues.push(allowedValue.trim());
      }

      if (!allowedValues.includes(primitiveValue)) {
        validationErrors.errors.push({ reason: `"${primitiveValue}" was not found in "${allowedValues.join(", ")}"`, schemaPath: key, schemaNode: node, objectValue: primitiveValue });

        if (node.isArray) {
          validationErrors.userFriendlyErrors.push(`${node.schemaNode.friendlyName ?? node.strippedPath.join("/")} must be one of "${allowedValues.join(", ")}"`);
        } else {
          validationErrors.userFriendlyErrors.push(`"${node.schemaNode.friendlyName ?? node.key}" must be one of "${allowedValues.join(", ")}"`);
        }
      }
    }

    // What does validationFunction return?
    if (schemaNode.validationFunction !== undefined) {
      const functionType = getType(schemaNode.validationFunction);
      if (functionType !== "function") {
        throw new SchemaMetaValidationError("validationFunction is not a function", { reason: `expected "function" but found "${functionType}"`, schemaPath: key, schemaNode: node, objectValue: primitiveValue });
      }
      let validationFunctionResult;
      try {
        // Execute the function, passing the node and the entire object
        validationFunctionResult = schemaNode.validationFunction(primitiveValue, schemaNode, baseObject);
      } catch (error) {
        throw new SchemaMetaValidationError("validationFunction errors out", { reason: `validation function "${schemaNode.validationFunction.name}" errored out`, schemaPath: key, schemaNode: node, objectValue: primitiveValue, error: error.message });
      }

      if (validationFunctionResult !== true && !isString(validationFunctionResult)) {
        throw new SchemaMetaValidationError("validationFunction returns an invalid type", { reason: `validation function "${schemaNode.validationFunction.name}" did not return "true" or a string`, schemaPath: key, schemaNode: node, objectValue: primitiveValue, validationFunctionResult });
      }

      if (validationFunctionResult !== true) {
        validationErrors.errors.push({ reason: `validationFunction"${schemaNode.validationFunction.name}" did not return a string`, schemaPath: key, schemaNode: node, objectValue: primitiveValue, validationFunctionResult });
        validationErrors.userFriendlyErrors.push(validationFunctionResult);
      }
    } // End there is a validation function

    // Is the type correct
    if (primitiveValue !== undefined) {
      const primitiveType = getType(primitiveValue);

      if (schemaNode.type === "anySupportedType") {
        if (!validTypes.includes(primitiveType) && primitiveType !== "array") {
          validationErrors.errors.push({ reason: `"${primitiveType}" is not a supported type. Supported types are ${validTypes.join(", ")}, array`, schemaPath: key, schemaNode: node, objectValue: primitiveValue });
          if (node.isArray) {
            validationErrors.userFriendlyErrors.push(`"${primitiveValue}" is not valid for ${node.schemaNode.friendlyName ?? node.strippedPath.join("/")}`);
          } else {
            validationErrors.userFriendlyErrors.push(`"${primitiveValue}" is not valid for ${node.schemaNode.friendlyName ?? node.key}`);
          }
        }
      } else if (primitiveType !== schemaNode.type) {
        validationErrors.errors.push({ reason: `value type is "${primitiveType}" whereas the schema specifies "${schemaNode.type}"`, schemaPath: key, schemaNode: node, objectValue: primitiveValue });

        if (node.isArray) {
          validationErrors.userFriendlyErrors.push(`"invalid value for ${node.schemaNode.friendlyName ?? node.strippedPath.join("/")}`);
        } else {
          validationErrors.userFriendlyErrors.push(`"invalid value for ${node.schemaNode.friendlyName ?? node.key}`);
        }
      }
    }

    if (isString(primitiveValue) && primitiveValue.trim() === "") {
      validationErrors.errors.push({ reason: `empty string values are not supported`, schemaPath: key, schemaNode: node, objectValue: primitiveValue });
      if (node.isArray) {
        validationErrors.userFriendlyErrors.push(`"${primitiveValue}" is not valid for ${node.schemaNode.friendlyName ?? node.strippedPath.join("/")}`);
      } else {
        validationErrors.userFriendlyErrors.push(`"${primitiveValue}" is not valid for ${node.schemaNode.friendlyName ?? node.key}`);
      }
    }
  }

  if (validationErrors.errors.length > 0) {
    const error = validationErrors.errors.length === 1 ? new SchemaValidationError(`There was 1 validation error`, validationErrors) : new SchemaValidationError(`There were ${validationErrors.errors.length} validation errors`, validationErrors);
    throw error;
  }

  return object;
}

function generateCombinations(startArray) {
  // This function generates all combinations for one placeholder based on its "max" value
  function getPlaceholderCombinations(maxValue) {
    return Array.from({ length: maxValue + 1 }, (_, i) => i);
  }

  // This function recursively generates all combinations
  function generate(startArray, index = 0, currentCombination = [], result = []) {
    if (index === startArray.length) {
      // If we've processed all items, add the current combination to the result
      result.push(currentCombination);
      return;
    }

    const currentItem = startArray[index];
    if (typeof currentItem === "object" && currentItem.hasOwnProperty("max")) {
      // If the current item is a placeholder, generate combinations for it
      const combinations = getPlaceholderCombinations(currentItem.max);
      for (const combination of combinations) {
        // For every possible value, proceed with recursion
        generate(startArray, index + 1, [...currentCombination, combination], result);
      }
    } else {
      // If the current item is not a placeholder, simply add it to the current combination
      generate(startArray, index + 1, [...currentCombination, currentItem], result);
    }

    return result;
  }

  // Start the recursive combination generation process
  return generate(startArray);
}
