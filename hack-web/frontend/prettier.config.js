/** @type {import("prettier").Config} */
export default {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrder: ['^react', '^next', '<THIRD_PARTY_MODULES>', '^@\\/', '^\\.\\/'],
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  arrowParens: 'always',
  printWidth: 80,
  endOfLine: 'auto',
};
