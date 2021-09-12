export default {
	testEnvironment: 'node',
	testMatch: [ '<rootDir>/lib/**/*.test.ts' ],
	collectCoverageFrom: [ '<rootDir>/lib/**' ],
	collectCoverage: true,
	coveragePathIgnorePatterns: [ '/node_modules/' ],
	coverageReporters: [ 'lcov', 'text', 'html' ],
}
