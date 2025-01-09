/**
 * Session model.
 *
 * Models a web session.
 * @module "models.session"
 */

export const schema = {
  data: { type: "simpleObject" },
  date_created: { required: true, type: "string" },
  id: { required: true, type: "string" },
  user: { type: "simpleObject" }
};
