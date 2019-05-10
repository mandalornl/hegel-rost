import fs from 'fs';
import path from 'path';

export default (() => {
  try {
    const filename = path.resolve(process.cwd(), 'config/presets.json');

    return JSON.parse(fs.readFileSync(filename));
  } catch (error) {
    console.error('No presets found');
  }

  return [];
})();
