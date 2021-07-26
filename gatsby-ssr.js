const React = require("react");
const StoreContextProvider = require("./src/store").StoreContextProvider;

const wrapContext = ({ element }) => {
  return <StoreContextProvider>{element}</StoreContextProvider>;
};

exports.wrapRootElement = wrapContext;
