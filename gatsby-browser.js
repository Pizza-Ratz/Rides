import React from "react";
import { StoreContextProvider } from "./src/store";

export const wrapRootElement = ({ element }) => {
  return <StoreContextProvider>{element}</StoreContextProvider>;
};
