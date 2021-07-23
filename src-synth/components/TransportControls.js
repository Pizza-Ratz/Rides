// adapted from https://codepen.io/praktikdan/pen/jbqBWm?limit=all&page=9&q=synth

import React from "react";
import * as Tone from "tone";
// import PropTypes from 'prop-types'
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import "../styles/TransportControls.scss";

const TransportControls = ({ transport = Tone.getTransport(), ...rest }) => {
  const transControlsEl = React.useRef();

  const doTheThing = (thing) => {
    switch (thing) {
      case "play":
        return transport.start();
      case "pause":
        return transport.pause();
      case "stop":
        return transport.stop();
      default:
        console.warn("no idea what just happened: ", thing);
    }
  };

  const handleButtonClick = (evt) => {
    let butt = evt.target;
    while (butt.tagName !== "BUTTON") {
      butt = butt.parentElement;
    }
    if (!butt.classList.contains("selected")) {
      transControlsEl.current
        .querySelector("button.button.selected")
        .classList.remove("selected");
      butt.classList.add("selected");
      doTheThing(butt.id);
    }
  };

  React.useEffect(() => {
    if (
      transControlsEl &&
      transControlsEl.current &&
      typeof window !== "undefined"
    ) {
      transControlsEl.current
        .querySelectorAll("button.button")
        .forEach((button) =>
          button.addEventListener("click", handleButtonClick)
        );
    }
  });

  return (
    <div ref={transControlsEl} className="transport-controls" {...rest}>
      <div className="buttons-wrapper">
        <button id="stop" className="button selected">
          <FaStop className="fa" />
        </button>
        <button id="play" className="button">
          <FaPlay className="fa" />
        </button>
        <button id="pause" className="button">
          <FaPause className="fa" />
        </button>
      </div>
    </div>
  );
};

export default TransportControls;
