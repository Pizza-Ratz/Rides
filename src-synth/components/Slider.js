import React from "react";
import "../styles/controls/Slider.scss";

const Slider = ({ volume, onChange, max, min, ...rest }) => {
  const getValue = (evt) => {
    value = +evt.target.value;
    return value;
  };

  let value = 50;
  return (
    <div className="slider-container">
      <input
        type="range"
        className="slider"
        onChange={(evt) =>
          onChange ? onChange((max || 100) - getValue(evt)) : 0
        }
        max={max}
        min={min}
        {...rest}
        aria-orientation="vertical"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={100 - value} // because the slider is upside-down
      />
      <label>{volume}</label>
    </div>
  );
};

export default Slider;
