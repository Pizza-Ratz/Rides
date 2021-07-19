/**
 * isDomAvailable
 * @description Checks to see if the DOM is available by checking the existence of the window and document
 * @see https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/ExecutionEnvironment.js#L12
 */

export function isDomAvailable() {
  return (
    typeof window !== "undefined" &&
    !!window.document &&
    !!window.document.createElement
  );
}

export function getStepsFromRoute(results) {
  // use the first set of directions provided
  const selectedRoute = results.routes[0];
  // there will only be one leg in our trip
  const { steps } = selectedRoute.legs[0];
  return steps;
}
