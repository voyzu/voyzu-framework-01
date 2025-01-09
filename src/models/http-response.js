/**
 * Http Response model.
 *
 * Models a response sent to the built-in web server.
 * @module "models.httpRequest"
 */

// Modules from this component
import { HTTP_RESPONSE_TYPE } from "../enums/enums.js";

export const schema = {
  allow_cross_origin: { type: "boolean" },
  content_type_extension: { defaultFunction: getExtension, type: "string" },
  http_code: { required: true, type: "number" },
  http_headers: { type: "simpleObject" },
  is_base64_encoded: { type: "boolean" },
  response_content_type: { defaultFunction: getContentType, type: "string" },
  response_data: {  type: "anySupportedType" },
  response_type: { allowedValues: Object.keys(HTTP_RESPONSE_TYPE).join(","), required: true, type: "string" },
};

function getContentType(value, schemaNode, baseObject) {
  switch (baseObject.response_type) {
    case HTTP_RESPONSE_TYPE.CSS: {
      return "text/css";
    }
    case HTTP_RESPONSE_TYPE.HTML: {
      return "text/html";
    }
    case HTTP_RESPONSE_TYPE.IMAGE: {
      return "image/jpeg";
    }
    case HTTP_RESPONSE_TYPE.JAVASCRIPT: {
      return "application/javascript";
    }
    case HTTP_RESPONSE_TYPE.JSON: {
      return "application/json";
    }
    case HTTP_RESPONSE_TYPE.OTHER: {
      return;
    }
    case HTTP_RESPONSE_TYPE.TEXT: {
      return "text/plain";
    }
    default: {
      return "unknown";
    }
  }
}

function getExtension(value, schemaNode, baseObject) {
  switch (baseObject.response_type) {
    case HTTP_RESPONSE_TYPE.CSS: {
      return ".css";
    }
    case HTTP_RESPONSE_TYPE.HTML: {
      return ".html";
    }
    case HTTP_RESPONSE_TYPE.IMAGE: {
      return ".jpeg";
    }
    case HTTP_RESPONSE_TYPE.JAVASCRIPT: {
      return ".js";
    }
    case HTTP_RESPONSE_TYPE.JSON: {
      return ".json";
    }
    case HTTP_RESPONSE_TYPE.OTHER: {
      return;
    }
    case HTTP_RESPONSE_TYPE.TEXT: {
      return ".txt";
    }
    default:
    
  }
}
