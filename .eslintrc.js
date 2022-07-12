module.exports = {
	root: true,
	extends: [
		'airbnb',
		'airbnb-typescript',
		'airbnb/hooks',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: { project: ['./tsconfig.json'] },
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['src/**/*.test.ts', 'src/frontend/generated/*'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react/no-unstable-nested-components': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'import/prefer-default-export': 'off',
		'react/jsx-props-no-spreading': 'off',
	},
};
