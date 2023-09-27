var fs = require('fs')

// use the same items as the .prettierignore file
const ignorePatterns = fs.readFileSync('.prettierignore').toString().split('\n').filter(Boolean)

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns,
  plugins: ['import', 'prettier'],
  extends: ['eslint:recommended', 'next/core-web-vitals', 'prettier'],
  rules: {
    'no-console': 'warn',
    'no-alert': 'warn',
    'max-len': [
      'warn',
      {
        code: 100,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts?(x)'],
      plugins: ['@typescript-eslint', 'prettier'],
      extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
      parser: '@typescript-eslint/parser',
      parserOptions: { project: ['./tsconfig.json'] },
      settings: { 'import/resolver': { typescript: { alwaysTryTypes: true } } },
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'warn',
        '@typescript-eslint/consistent-type-definitions': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', args: 'after-used' }],
        '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
      },
    },
  ],
}