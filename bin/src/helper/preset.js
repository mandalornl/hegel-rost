import { readFile } from 'fs/promises';
import { URL } from 'url';

/**
 * Load presets
 *
 * @returns {Promise<Object[]>}
 */
export const loadPresets = async () => {
  try {
    const filename = new URL('../../presets.json', import.meta.url);
    const json = await readFile(filename, 'utf-8');

    return JSON.parse(json);
  } catch (error) {
    console.error(error.message);

    return [];
  }
};
