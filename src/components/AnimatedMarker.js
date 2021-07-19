import React from "react";
import Qty from "js-quantities/esm";
import polyUtil from "polyline-encoded";
import {
  isDomAvailable,
  getStepsFromRoute,
  getStepsMetadata,
} from "../lib/util";
import { useMap } from "react-leaflet";
import { GlobalTripStateContext } from "../context/GlobalContextProvider";
import { animatedMarker } from "leaflet";

// copied from https://raw.githubusercontent.com/openplans/Leaflet.AnimatedMarker/master/src/AnimatedMarker.js
const setup = () => {
  console.log("setup");
  return window.L.Marker.extend({
    options: {
      // meters
      distance: 200,
      // ms
      interval: 1000,
      // animate on add?
      autoStart: true,
      // callback onend
      onEnd: function () {},
      clickable: false,
    },

    initialize: function (latlngs, options) {
      console.log("initialize");
      this.setLine(latlngs);
      window.L.Marker.prototype.initialize.call(this, latlngs[0], options);
    },

    // Breaks the line up into tiny chunks (see options) ONLY if CSS3 animations
    // are not supported._chunk

    // _chunk: function (latlngs) {
    //   console.log("_chunk");
    //   var i,
    //     len = latlngs.length,
    //     chunkedLatLngs = [];

    //   for (i = 1; i < len; i++) {
    //     var cur = latlngs[i - 1],
    //       next = latlngs[i],
    //       dist = cur.distanceTo(next),
    //       factor = this.options.distance / dist,
    //       dLat = factor * (next.lat - cur.lat),
    //       dLng = factor * (next.lng - cur.lng);

    //     if (dist > this.options.distance) {
    //       while (dist > this.options.distance) {
    //         cur = new window.L.LatLng(cur.lat + dLat, cur.lng + dLng);
    //         dist = cur.distanceTo(next);
    //         chunkedLatLngs.push(cur);
    //       }
    //     } else {
    //       chunkedLatLngs.push(cur);
    //     }
    //   }
    //   chunkedLatLngs.push(latlngs[len - 1]);

    //   return chunkedLatLngs;
    // },

    onAdd: function (map) {
      console.log("onAdd");
      window.L.Marker.prototype.onAdd.call(this, map);

      // Start animating when added to the map
      if (this.options.autoStart) {
        this.start();
      }
    },

    animate: function () {
      console.log("animate");
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

      // Move to the next vertex
      this.setLatLng(this._latlngs[this._i]);
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
    start: function () {
      this.animate();
    },

    // Stop the animation in place
    stop: function () {
      if (this._tid) {
        clearTimeout(this._tid);
      }
    },

    setLine: function (latlngs) {
      console.log("setLine");
      // if (window.L.DomUtil.TRANSITION) {
      // No need to to check up the line if we can animate using CSS3
      this._latlngs = latlngs;
      // } else {
      //   // Chunk up the lines into options.distance bits
      //   this._latlngs = this._chunk(latlngs);
      //   this.options.distance = 10;
      //   this.options.interval = 30;
      // }
      this._i = 0;
    },
  });

  // window.L.animatedMarker = function (latlngs, options) {
  //   return new window.L.AnimatedMarker(latlngs, options);
  // };
};

const AnimatedMarker = ({ running = false }) => {
  console.log("running: " + running);
  const map = useMap();
  const trip = React.useContext(GlobalTripStateContext);
  const [tripAnimation, setTripAnimation] = React.useState();

  // set up a new trip whenever we get new directions
  React.useEffect(() => {
    console.log("first useEffect");
    // don't do anything if not in the browser
    if (!isDomAvailable()) return;
    // if we don't have good data, don't do anything
    if (!trip.status === "OK") return;
    // remove prior trip if it exists
    // if (tripAnimation) {
    //   console.log("prior marker teardown");
    //   tripAnimation.stop();
    //   map.removeLayer(tripAnimation);
    // }

    const steps = getStepsFromRoute(trip);
    const lines = steps.map((s) => polyUtil.decode(s.polyline.points));
    const metadata = getStepsMetadata(trip);
    // calculate distance in meters
    const unconvertedDistance = new Qty(metadata.distance.text);
    const distance = unconvertedDistance.to("m");
    // calculate interval in ms
    const interval = metadata.duration.value * 1000;
    const polyLine = window.L.polyline(lines);
    // only set up animation mixin once
    const AnimatedMarkerClass = setup();
    const animatedMarker = new AnimatedMarkerClass(polyLine.getLatLngs(), {
      distance,
      interval,
      autostart: false,
    });
    setTripAnimation(animatedMarker);
    return () => {
      console.log("second useEffect marker teardown");
      map.removeLayer(tripAnimation);
      tripAnimation.stop();
    };
  }, [map, trip]);

  React.useEffect(() => {
    console.log("second useeffect");
    if (tripAnimation) {
      if (running) {
        tripAnimation.start();
        map.addLayer(animatedMarker);
      } else {
        tripAnimation.stop();
      }
    }
  }, [running]);

  return <></>;
};

export default AnimatedMarker;
