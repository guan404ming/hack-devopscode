/** @type {import("prettier").Config} */
module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^react', '^next', '<THIRD_PARTY_MODULES>', '^@\\/', '^\\.\\/'],
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  arrowParens: 'always',
  printWidth: 80,
  endOfLine: 'auto',
};
