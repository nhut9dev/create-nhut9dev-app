// Dùng shared Expo ESLint config từ @repo/eslint-config
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['unused-imports', 'prettier'],
  rules: {
    // Code style
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-console': 'warn',

    // Prettier integration
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // Unused imports
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
