import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Expo/React Native ESLint configuration
 * Shared config cho Expo apps với Prettier và TypeScript
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const expoConfig = [
  ...compat.extends('expo', 'prettier'),
  ...compat.plugins('unused-imports', 'prettier'),
  {
    rules: {
      // Code style
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
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

      // React Native specific
      'react-native/no-inline-styles': 'warn',
    },
  },
];

export default expoConfig;
