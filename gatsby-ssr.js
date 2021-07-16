const React = require("react")
const GlobalContextProvider = require("./src/context/GlobalContextProvider")
  .default

const wrapContext = ({ element }) => {
  return <GlobalContextProvider>{element}</GlobalContextProvider>
}

exports.wrapRootElement = wrapContext;
