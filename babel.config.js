const path = require('path');

module.exports = {
  presets: ['@babel/env'],
  plugins: [
    ['@babel/transform-runtime'],
    ['module-resolver', {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }]
  ]
};
