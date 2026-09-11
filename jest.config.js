const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // tests/*.test.ts are framework-free scripts run standalone via `npx tsx`
  // (see MEMORY — reference_test-convention) — they have no describe/it
  // blocks and must never be picked up by Jest's runner. Jest specs live
  // under __tests__/ instead, with their own suffix so the two conventions
  // can never collide even if a file strays into the wrong directory.
  testMatch: ['<rootDir>/__tests__/**/*.jest.test.[jt]s?(x)'],
}

module.exports = createJestConfig(customJestConfig)
