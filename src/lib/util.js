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
  if (results.status !== "OK") throw new Error("unusable directions");
  // use the first set of directions provided
  const selectedRoute = results.routes[0];
  // there will only be one leg in our trip
  const { steps } = selectedRoute.legs[0];
  return steps;
}

export function getStepsMetadata(results) {
  if (results.status !== "OK") return;
  // use the first set of directions provided
  const selectedRoute = results.routes[0];
  const leg = selectedRoute.legs[0];
  const { arrival_time, departure_time, distance, duration } = leg;
  return {
    arrival_time,
    departure_time,
    distance,
    duration,
  };
}

export const scaleCoord = (coord) => (coord % 10) * 1000;
