const globals = require('globals')
const { defineConfig } = require('eslint/config')

module.exports = defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    ignores: ['dist/**'],
    languageOptions: { globals: globals.node, sourceType: 'commonjs' },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    }
  }
])