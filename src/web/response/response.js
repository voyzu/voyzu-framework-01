/**
 * Web Response.
 *
 * Standardized web response functions.
 * @module "web.response"
 */

//Import modules from this component
import { schema as httpResponseSchema } from "../../models/http-response.js";
import { HTTP_CODE, HTTP_RESPONSE_TYPE } from "../../enums/enums.js";
import { generateModel } from "../../model/model.js";

/**
 * Generate an error response for a supplied request.
 * @param {object} httpRequest An http request.
 * @param {object} error The error.
 * @returns {object} An http resonse.
 */
export function getErrorResponse(httpRequest,error) {

    const httpResponse = httpRequest.route.file_friendly_route.split('#').includes('api') ? {
            http_code: HTTP_CODE.ERROR,
            response_data: { error: error.message },
            response_type: HTTP_RESPONSE_TYPE.JSON
        } : {
            http_code: HTTP_CODE.ERROR,
            response_data: `<html><body><h1>${HTTP_CODE.ERROR} Internal Voyzu Error</h1></body></html>`,
            response_type: HTTP_RESPONSE_TYPE.HTML
        };

    return generateModel(httpResponse, httpResponseSchema);
}

/**
 * Generate a response to an OPTIONS request.
 * @returns {object} An Http Response.
 */
export function getOptionsResponse() {

    const httpResponse = generateModel({
        allow_cross_origin: true,
        http_code: HTTP_CODE.SUCCESS,
        response_type: HTTP_RESPONSE_TYPE.OTHER,
    }, httpResponseSchema);

    httpResponse.headers = {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': '*',
        'X-Requested-With': '*'
    };

    return httpResponse;
}