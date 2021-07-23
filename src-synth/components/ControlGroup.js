import React from "react";
import "../styles/controls/ControlGroup.scss";

const ControlGroup = ({ label, children }) => (
  <div className="control-group">
    <div className="top-border">
      <div className="left" />
      <label>{label}</label>
      <div className="right" />
    </div>
    <div className="controls">{children}</div>
  </div>
);

export default ControlGroup;
