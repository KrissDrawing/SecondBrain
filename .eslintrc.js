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
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'import/prefer-default-export': 'off',
		'import/extensions': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/no-unstable-nested-components': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/jsx-no-useless-fragment': 'off',
		'no-void': 'off',
		'no-param-reassign': ["error", { "props": false }],
	},
};
