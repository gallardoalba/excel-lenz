module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  testTimeout: 30000,
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        moduleResolution: 'node',
        target: 'ES2022',
        esModuleInterop: true,
        skipLibCheck: true,
        resolveJsonModule: true,
        types: ['jest', 'node'],
        strict: true,
      },
    }],
  },
};
