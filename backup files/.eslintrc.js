module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    'react/prop-types': 0,
    'no-unused-vars': 1,
    'no-undef': 1,
    'no-lone-blocks': 1,
    semi: 1,
  },
}
