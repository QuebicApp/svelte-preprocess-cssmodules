module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    "plugin:import/typescript",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'comma-dangle': ['error', "only-multiline"],
    'import/extensions': [
      'error',
      'never',
      {
        ignorePackages: true
      }
    ],
    'import/no-import-module-exports': "off",
    "import/no-unresolved": "off",
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true
      }
    ],
    'no-const-assign': 'error',
    'no-use-before-define': 'off',
  }
};
