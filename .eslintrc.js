module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 10,
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true,
    browser: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'no-console': 0
  }
};
