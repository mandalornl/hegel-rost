/**
 * Normalize
 *
 * @param {Buffer} buffer
 *
 * @returns {string}
 */
export const normalize = (buffer) => (
  buffer.toString().replace(/\r\n|\r|\n/gm, '')
);
