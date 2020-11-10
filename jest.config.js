module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: [ '<rootDir>/lib/**/*.spec.ts' ],
	collectCoverageFrom: [ '<rootDir>/lib/**' ],
	collectCoverage: true,
	coveragePathIgnorePatterns: [ '/node_modules/' ],
	coverageReporters: [ 'lcov', 'text', 'html' ],
};
