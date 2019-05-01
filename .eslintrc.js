module.exports = {
  root: true,
  parserOptions: {
    parser: require.resolve('babel-eslint'),
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
  rules: {
    'no-console': process.env.NODE_ENV !== 'production' ? 0 : 2,
    'no-useless-escape': 0,
    'no-empty': 0
  }
};
