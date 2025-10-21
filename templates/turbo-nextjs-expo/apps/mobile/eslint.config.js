// https://docs.expo.dev/guides/using-eslint/
import { expoConfig } from '@repo/eslint-config/expo';

export default [
  ...expoConfig,
  {
    ignores: ['dist/*'],
  },
];
