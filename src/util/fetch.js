import axios from 'axios';

/**
 * Fetch
 *
 * @param {String} url
 *
 * @returns {Promise<Object|null>}
 */
export default url => axios.get(url, {
  baseURL: process.env.API_URL
}).then(response => response.data).catch(error =>
{
  console.error(error);

  return null;
});
