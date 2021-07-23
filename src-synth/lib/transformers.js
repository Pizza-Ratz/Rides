const INFINITY = 2500;

// Converts knob output values (0-1000) into decibel values in the range -infinity to 3 db
export function knobToDB(knob = 0, max = 1000) {
  if (knob <= 1) return -INFINITY;
  return (knob - max) / 20;
}

// linear value that yields approximately 0dB
export const LINEAR_ZERO_dB = 767;

export function dBToKnob(dB = -INFINITY, max = 1000) {
  if (dB < -2400) return 0;
  return dB * 20 + max;
}
