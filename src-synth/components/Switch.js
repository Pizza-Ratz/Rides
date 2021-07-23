import React from "react";
import nouislider from "nouislider";
// import "nouislider/dist/nouislider.css";
import "../styles/controls/Switch.css";

const Switch = ({
  orientation = "vertical",
  start = [0],
  range = {
    min: [0, 1],
    max: 1,
  },
  // format = wNumb({
  //   decimals: 0
  // }),
  className = "switch",
}) => {
  const toggle = React.useRef();
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    if (toggle && toggle.current && !initialized) {
      nouislider.create(toggle.current, {
        orientation,
        start,
        range,
      });

      toggle.current.addEventListener("click", function (values, handle) {
        if (values[handle] === "1") {
          toggle.current.classList.add("off");
        } else {
          toggle.current.classList.remove("off");
        }
      });
      setInitialized(true);
    }
  }, [initialized, orientation, start, range]);
  return <div ref={toggle} className={className} />;
};

export default Switch;
