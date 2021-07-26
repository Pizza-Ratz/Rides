import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import StoreContext, { StoreContextProvider } from "..";

const TestComponent = () => {
  const [store, dispatch] = React.useContext(StoreContext);

  return (
    <div>
      <p id="dispatch">typeof dispatch is {typeof dispatch}</p>
      <p id="keys">store has keys {Object.keys(store)}</p>
    </div>
  );
};

describe("store", () => {
  test("exposes state and dispatch appropriately", () => {
    const { container } = render(
      <StoreContextProvider>
        <TestComponent />
      </StoreContextProvider>
    );
    const dispatch = container.querySelector("#dispatch");
    const keys = container.querySelector("#keys");
    expect(dispatch.textContent).toMatch(/function/);
    expect(keys.textContent).toMatch(/(trip|stations|transiter)/);
  });
});
