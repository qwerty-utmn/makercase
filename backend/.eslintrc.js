module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    // Warn
    'no-console': 'warn',
    'prefer-const': 'warn',

    // Off
    'radix': 'off',
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'camelcase': 'off',
    'no-param-reassign': 'off',
    'import/no-dynamic-require': 'off',
    'consistent-return': 'off',
    'func-names': 'off',
    'no-underscore-dangle': 'off',
    'no-return-await': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-shadow': 'off',
    'no-confusing-arrow': 'off',
    'no-restricted-syntax':'off',
    'no-await-in-loop': 'off',
    'no-unused-expressions': 'off',
    'array-callback-return': 'off',
    'comma-dangle': 'off',
    'react/destructuring-assignment': 'off',
    'global-require': 'off',
    'guard-for-in': 'off'
  },
};
