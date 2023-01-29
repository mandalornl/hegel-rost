let power = 0;
let volume = 0;
let mute = 0;
let input = 0;
let reset = '~';

/**
 * Update power
 *
 * @param {number} value
 *
 * @returns {number}
 */
const updatePower = (value) => {
  volume = 20;
  mute = 0;
  input = 4;
  reset = '~';

  return power = value;
};

/**
 * Update volume
 *
 * @param {number} value
 *
 * @returns {number}
 */
const updateVolume = (value) => {
  mute = 0;

  return volume = Math.min(100, Math.max(0, Number(value)));
};

export const device = {
  power: {
    on: () => updatePower(1),
    off: () => updatePower(0),
    toggle: () => updatePower(power === 1 ? 0 : 1),
    status: () => power
  },
  volume: {
    up: () => updateVolume(volume + 1),
    down: () => updateVolume(volume - 1),
    set: (value) => updateVolume(value),
    status: () => volume
  },
  mute: {
    on: () => mute = 1,
    off: () => mute = 0,
    toggle: () => mute = mute === 1 ? 0 : 1,
    status: () => mute
  },
  input: {
    set: (value) => input = Math.min(9, Math.max(1, Number(value))),
    status: () => input
  },
  reset: {
    set: (value) => reset = Math.min(255, Math.max(0, Number(value))),
    stop: () => reset = '~',
    status: () => reset
  }
};
