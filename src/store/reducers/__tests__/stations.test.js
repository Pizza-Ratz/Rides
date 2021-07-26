import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  actionTypes,
  initialState,
  flattenGeoJSON,
} from "../stations";
import fetchMock from "fetch-mock";

const smallGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Astor Pl",
        url: "http://web.mta.info/nyct/service/",
        line: "4-6-6 Express",
        objectid: "1",
        notes:
          "4 nights, 6-all times, 6 Express-weekdays AM southbound, PM northbound",
      },
      geometry: {
        type: "Point",
        coordinates: [-73.99106999861966, 40.73005400028978],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Canal St",
        url: "http://web.mta.info/nyct/service/",
        line: "4-6-6 Express",
        objectid: "2",
        notes:
          "4 nights, 6-all times, 6 Express-weekdays AM southbound, PM northbound",
      },
      geometry: {
        type: "Point",
        coordinates: [-74.00019299927328, 40.71880300107709],
      },
    },
  ],
};

const convertedGeoJSON = {
  1: {
    name: "Astor Pl",
    url: "http://web.mta.info/nyct/service/",
    line: "4-6-6 Express",
    objectid: "1",
    classList: { station: 1 },
    start: false,
    end: false,
    notes:
      "4 nights, 6-all times, 6 Express-weekdays AM southbound, PM northbound",
    latlng: [40.73005400028978, -73.99106999861966],
  },
  2: {
    name: "Canal St",
    url: "http://web.mta.info/nyct/service/",
    line: "4-6-6 Express",
    objectid: "2",
    notes:
      "4 nights, 6-all times, 6 Express-weekdays AM southbound, PM northbound",
    classList: { station: 1 },
    start: false,
    end: false,
    latlng: [40.71880300107709, -74.00019299927328],
  },
};

describe("stations", () => {
  test("flattenGeoJSON works", () =>
    expect(flattenGeoJSON(smallGeoJSON)).toMatchObject(convertedGeoJSON));

  describe("reducer", () => {
    test.todo("marks one and only one start");
    test.todo("marks one and only one end");
    test.todo("adds a class");
    test.todo("removes a class");
  });
});
