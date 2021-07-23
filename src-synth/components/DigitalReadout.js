import React from "react";
import "../styles/controls/DigitalReadout.scss";

const DigitalReadout = ({ children, ...rest }) => (
  <div className="digital-readout" {...rest}>
    <div className="display">{children}</div>
  </div>
);

export default DigitalReadout;
