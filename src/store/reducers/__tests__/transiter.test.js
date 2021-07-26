import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  actionTypes,
  loadStation,
  transiterNYCSubway,
  initialState,
} from "../transiter";
import fetchMock from "fetch-mock";
import responseData from "./transiter.response.json";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Transiter", () => {
  describe("loadStation thunk", () => {
    afterEach(() => {
      fetchMock.restore();
    });

    test(`dispatches correct actions`, () => {
      global.window = {
        localStorage: {
          getItem: () => {
            return "some-token";
          },
        },
      };
      fetchMock.getOnce(`${transiterNYCSubway}/stops/${responseData.id}`, {
        body: responseData,
        headers: { "content-type": "application/json" },
      });

      const expectedActions = [
        {
          type: actionTypes.LOADING_DATA,
        },
        {
          type: actionTypes.DATA_LOADED,
        },
        {
          type: actionTypes.SET_STATION,
          station: responseData,
        },
      ];

      const store = mockStore(initialState);

      return store.dispatch(loadStation(responseData.id)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("reducer", () => {
    test(`adds fetched data to state`, () => {
      expect(
        reducer(initialState, {
          type: actionTypes.SET_STATION,
          station: responseData,
        })
      ).toMatchObject(
        Object.assign({}, initialState, {
          stops: {
            [responseData.id]: responseData,
          },
        })
      );
    });
  });
});
