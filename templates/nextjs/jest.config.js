// jest.config.js
module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  testMatch: ['**/__tests__/**/*.[tj]s?(x)', '<rootDir>/src/tests/**/*.(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^~(api|app|assets|components|constants|hooks|i18n|lib|models|store|utils|types)/(.*)$':
      '<rootDir>/src/$1/$2',
    '^~/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './jest-results/',
        outputName: 'jest-results.xml',
      },
    ],
    [
      'jest-html-reporter',
      {
        pageTitle: 'Jest Results',
        outputPath: './jest-results/jest-results.html',
      },
    ],
  ],
};
