import React from "react";
import PropTypes from "prop-types";
// import "nouislider/dist/nouislider.css";
import noUiSlider from "nouislider";
import "../styles/controls/Fader.scss";

const Fader = (props) => {
  props = Object.assign(
    {
      range: { min: [0], max: [100] },
      start: [0],
      className: "",
      orientation: "vertical",
      direction: "rtl",
      label: "fader",
      tooltips: false,
      onValueChange: () => {},
    },
    props
  );

  const fader = React.useRef();
  const [initialized, setInitialized] = React.useState(false);
  let { className, onValueChange, orientation, label } = props;

  React.useEffect(() => {
    if (!(fader && fader.current)) return;

    if (!initialized) {
      noUiSlider.create(fader.current, props);

      fader.current
        .querySelector(".noUi-handle")
        .addEventListener("mousemove", () =>
          onValueChange(fader.current.noUiSlider.get(true))
        );

      setInitialized(true);
    }
  }, [props, onValueChange, initialized]);

  if (orientation === "vertical") {
    className += " vertical";
  }
  if (props.pips) {
    className += " has-ticks";
  }

  const snowflake = Math.floor(Math.random() * 1000);

  return (
    <div className="fader-container">
      <div className={"fader " + className}>
        <div
          type="range"
          aria-labelledby={`fader-label-${snowflake}`}
          ref={fader}
        />
      </div>
      <label id={`fader-label-${snowflake}`} className="label">
        {label}
      </label>
    </div>
  );
};

Fader.propTypes = {
  range: PropTypes.shape({
    min: PropTypes.arrayOf(PropTypes.number),
    max: PropTypes.arrayOf(PropTypes.number),
  }),
  pips: PropTypes.shape({
    mode: PropTypes.oneOf(["range", "steps", "positions", "count", "values"]),
    values: PropTypes.number,
    density: PropTypes.number,
    stepped: PropTypes.bool,
  }),
  start: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  direction: PropTypes.oneOf(["ltr", "rtl"]),
  tooltips: PropTypes.bool,
};

export default Fader;
