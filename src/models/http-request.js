/**
 * Http Request model.
 *
 * Models a request sent to the built-in web server.
 * @module "models.httpRequest"
 */

export const schema = {
  request_id: {  type: "string" },
  request_values: {
    // Body could be an array (of chunks) for post requests
    body: { type: "anySupportedType" },
    cookies: { type: "simpleObject" },
    headers: { type: "simpleObject" },
    query_string_values: { type: "simpleObject" },
    raw_request: { type: "simpleObject" },
  },
  route: {
    component_domain: { type: "string" },
    component_root_url: { type: "string" },
    custom_domain: { type: "string" },
    file_friendly_route: { type: "string" },
    raw_url: { type: "string" },
    url: { type: "string" },
  }
};
