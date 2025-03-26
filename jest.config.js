module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.[tj]s$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    // Uncomment if you need to transform certain node_modules packages:
    // transformIgnorePatterns: ['/node_modules/']
  };
  