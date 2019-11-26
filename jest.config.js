module.exports = {
  verbose: true,
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  coverageReporters: [
    'html',
    'json',
    'lcov',
    'text',
    'clover'
  ],
  modulePathIgnorePatterns: ['<rootDir>/node_modules'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/interface.d.ts', '!src/**/*interfaces.d.ts'],
  coverageThreshold: {
    global: {
      'branches': 30,
      'functions': 30,
      'lines': 30,
      'statements': 35
    }
  },
  testEnvironment: 'node'
};
