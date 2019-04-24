/**
 * @type {Number}
 */
let power = 0;

/**
 * @type {Number}
 */
let volume = 20;

/**
 * @type {Number}
 */
let mute = 0;

/**
 * @type {Number}
 */
let input = 4;

/**
 * @type {Number|String}
 */
let reset = 2;

export default {
	power: {
		on: () => power = 1,
		off: () => power = 0,
		toggle: () => power = power ? 0 : 1,
		status: () => power
	},
	volume: {
		up: () => volume = Math.min(volume + 1, 100),
		down: () => volume = Math.max(volume - 1, 0),
		set: value => volume = Math.min(Math.max(Number(value), 0), 100),
		status: () => volume
	},
	mute: {
		on: () => mute = 1,
		off: () => mute = 0,
		toggle: () => mute = mute ? 0 : 1,
		status: () => mute
	},
	input: {
		set: value => input = Math.min(Math.max(Number(value), 1), 9),
		status: () => input
	},
	reset: {
		set: value => reset = Math.min(Math.max(Number(value), 1), 255),
		stop: () => reset = '~',
		status: () => reset
	}
};
