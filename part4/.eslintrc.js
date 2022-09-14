module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    indent: [
      'error',
      2,
    ],
    semi: [
      'error',
      'never',
    ],
    'no-console': 0,
    'prefer-destructuring': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-else-return': 0,
  },
}
