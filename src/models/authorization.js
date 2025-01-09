/**
 * Authorization model.
 *
 * Models a web authorization attempt.
 * @module "models.authorization"
 */

// Modules from this component
import { schema as sessionSchema } from "./session.js";

export const schema = {
  allow_unauthenticated_reason : { type: "string"},
  authenticated: {  type: "boolean" },
  authorization_fail_reason: { type: "string" },
  authorized: { required: true, type: "boolean" },
  cookie: {type:"string"},
  session: sessionSchema,
};
