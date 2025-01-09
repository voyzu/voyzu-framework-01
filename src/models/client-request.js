/**
 * Client Request model.
 *
 * Models a client / server message.
 * @module "models.clientRequest"
 */

// Modules from this component
import { MESSAGE_LEVEL } from "../enums/enums.js";

export const schema = {
  data: { type: "simpleObject" },
  id: { type: "string" },
  message: { type: "string" },
  message_heading: { type: "string" },
  message_level: { allowedValues: Object.keys(MESSAGE_LEVEL).join(","), type: "string" },
  request_code: { type: "string" },
};
