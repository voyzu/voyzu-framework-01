/**
 * Workflow Job model.
 *
 * Models a request to be fulfilled asynchronously.
 * @module "models.workflowJob"
 */

// Modules from this component
import { WORKFLOW_REQUEST_ORIGIN } from "../enums/enums.js";

export const schema = {
    key_name: { type: "string" },
    origin: { allowedValues: Object.keys(WORKFLOW_REQUEST_ORIGIN).join(","), required: true, type: "string", },
    request_data: { type: "simpleObject" },
    request_id: { required: true, type: "string" },
    step_data: { type: "anySupportedType" }
};
