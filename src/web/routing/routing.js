/**
 * Routing.
 *
 * Maps http requests to their corresponding file friendly route.
 * @module "web.routing"
 */

// Import core node modules
import path from "node:path";
import * as url from "node:url";

/**
 * Attept to find a directory matching the supplied file friendly path.
 * Matching path parameters such as /contacts/{contactId} are returned in the `pathParams` property returned.
 * @param {string} fileFriendlyRoute The path to match. For example "#contacts#123#GET".
 * @param {Array} routes An array of directory names. For example "[#contacts#{contactId}#GET ... Etc]".
 * @param {string} componentRoutePath The full path of the calling component, up unto the folder containing the routes. For example "C:/ ... /my-web-app/web/routes".
 * @returns {object} Details of the matching path.
 */
export function matchRoute(fileFriendlyRoute, routes, componentRoutePath) {
  const fileFriendlyRouteSegments = fileFriendlyRoute.split("#");

  const matchingRoutes = [];
  const pathParams = {};

  loopThruRoutes: for (const route of routes) {
    const routeSegments = route.split("#");

    if (fileFriendlyRouteSegments.length !== routeSegments.length) {
      continue; // Next route
    }

    for (const [i, routeSegment] of routeSegments.entries()) {
      const fileFriendlyRouteSegment = fileFriendlyRouteSegments[i];

      if (routeSegment.startsWith("{")) {
        pathParams[routeSegment.replace("{", "").replace("}", "")] = fileFriendlyRouteSegment;
      } else if (routeSegment !== fileFriendlyRouteSegment) {
        // Console.log(`route segment ${routeSegment} does not match the target segment ${fileFriendlyRouteSegment}, will disregard this route`)
        continue loopThruRoutes; // Next route
      }
    } // Next route segment

    matchingRoutes.push(route);
  } // Next route

  if (matchingRoutes.length === 0) {
    console.error(`Error: there were no routes matching ${fileFriendlyRoute}`);
  } else if (matchingRoutes.length > 1) {
    const matchingNonGreedyRoutes = [];
    for (const matchingRoute of matchingRoutes) {
      if (!matchingRoute.includes("{")) {
        matchingNonGreedyRoutes.push(matchingRoute);
      }
    }

    if (matchingNonGreedyRoutes.length === 1) {
      // Path to our matching route
      const routePath = path.join(componentRoutePath, matchingNonGreedyRoutes[0], "index.js");

      // Parse the path (e.g. 'add "file://" on windows devices)
      let filePath = url.pathToFileURL(routePath);
      filePath = filePath.href;

      return {
        matchingRoute: matchingNonGreedyRoutes[0],
        matchingRouteFilePath: filePath,
        pathParams,
      };
    }
    console.error(`Error: there was more than one route matching ${fileFriendlyRoute}. Matching routes:`);
    console.log(matchingRoutes);
  } else {
    // Path to our matching route
    const routePath = path.join(componentRoutePath, matchingRoutes[0], "index.js");

    // Parse the path (e.g. 'add "file://" on windows devices)
    let filePath = url.pathToFileURL(routePath);
    filePath = filePath.href;

    return {
      matchingRoute: matchingRoutes[0],
      matchingRouteFilePath: filePath,
      pathParams,
    };
  }
}
