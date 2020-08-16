module.exports = {
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**'],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
};
