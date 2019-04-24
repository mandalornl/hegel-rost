/**
 * Normalize
 *
 * @param {Buffer|String} buffer
 *
 * @returns {string}
 */
export default buffer => buffer.toString().replace(/\r\n|\r|\n/gm, '');
