import React from "react";
import Qty from "js-quantities/esm";
import polyUtil from "polyline-encoded";
import { flattenDepth } from "lodash";
import {
  isDomAvailable,
  getStepsFromRoute,
  getStepsMetadata,
} from "../lib/util";

let ExtendedMarker;

// mostly taken from https://raw.githubusercontent.com/openplans/Leaflet.AnimatedMarker/master/src/AnimatedMarker.js
export const getAnimatedMarker = (options) => {
  console.debug("getAnimatedMarker");
  if (ExtendedMarker) return ExtendedMarker;

  if (!isDomAvailable) return {};

  ExtendedMarker = window.L.Marker.extend({
    options: {
      // meters
      distance: 200,
      // ms
      interval: 1000,
      // animate on add?
      autoStart: true,
      // callback onend
      onEnd: function () {},
      // per-loop callback gets destination coords and the amount of time to get there
      listener: (dest = [0, 0, 0], time) => {},
      // marker isn't clickable
      clickable: false,
    },

    initialize: function (latlngs, options) {
      this.setLine(latlngs);
      window.L.Marker.prototype.initialize.call(this, latlngs[0], options);
    },

    onAdd: function (map) {
      window.L.Marker.prototype.onAdd.call(this, map);

      // Start animating when added to the map
      if (this.options.autoStart) {
        this.start();
      }
    },

    animate: function () {
      var self = this,
        len = this._latlngs.length,
        speed = this.options.interval;

      // Normalize the transition speed from vertex to vertex
      if (this._i < len && this._i > 0) {
        speed =
          (this._latlngs[this._i - 1].distanceTo(this._latlngs[this._i]) /
            this.options.distance) *
          this.options.interval;
      }

      // Only if CSS3 transitions are supported
      if (window.L.DomUtil.TRANSITION) {
        if (this._icon) {
          this._icon.style[window.L.DomUtil.TRANSITION] =
            "all " + speed + "ms linear";
        }
        if (this._shadow) {
          this._shadow.style[window.L.DomUtil.TRANSITION] =
            "all " + speed + "ms linear";
        }
      }

      console.debug("animate: @" + this._latlngs[this._i]);
      // Move to the next vertex
      this.setLatLng(this._latlngs[this._i]);
      // call the listener
      this.options.listener(this._latlngs[this._i], speed);

      this._i++;

      // Queue up the animation to the next next vertex
      this._tid = setTimeout(function () {
        if (self._i === len) {
          self.options.onEnd.apply(self, Array.prototype.slice.call(arguments));
        } else {
          self.animate();
        }
      }, speed);
    },

    // Start the animation
    start: function (fn) {
      console.debug("start", {
        totalDistance: this.options.distance,
        totalTime: this.options.interval,
      });
      this.options.listener = fn;
      this.animate();
    },

    // Stop the animation in place
    stop: function () {
      console.debug("stop");
      if (this._tid) {
        clearTimeout(this._tid);
      }
    },

    setLine: function (latlngs) {
      this._latlngs = latlngs;
      this._i = 0;
    },
  });

  // factory function that produces an AnimatedMarker from the given trip information
  ExtendedMarker.fromTrip = function (trip) {
    if (!isDomAvailable()) return;
    // if we don't have good data, don't do anything
    if (trip.status !== "OK") throw new Error("trip has no data");

    const steps = getStepsFromRoute(trip);
    const vertices = flattenDepth(
      steps.map((s) => polyUtil.decode(s.polyline.points)),
      1
    );
    const metadata = getStepsMetadata(trip);
    // calculate distance in meters
    const unconvertedDistance = new Qty(metadata.distance.text);
    const distance = unconvertedDistance.to("m").format((n) => n);
    // calculate interval in ms
    const interval = metadata.duration.value * 10;
    const polyLine = window.L.polyline(vertices);
    return new ExtendedMarker(polyLine.getLatLngs(), {
      distance,
      interval,
      autostart: false,
    });
  };
};
