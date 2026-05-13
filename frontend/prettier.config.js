// @ts-check

/** @type {import('prettier').Config} */
const config = {
  // Basics
  semi: false,
  singleQuote: true,
 jsxSingleQuote: false,
  trailingComma: 'all',

  // Formatting
  printWidth: 90,
  tabWidth: 2,
  useTabs: false,

  // Objects / Arrays / Functions
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // JSX
  jsxBracketSameLine: false,

  // Markdown / HTML
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',

  // Misc
  quoteProps: 'as-needed',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',

  // Better for large Tailwind + React projects
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
