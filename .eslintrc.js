module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
	],
	plugins: ['@typescript-eslint', 'prettier'],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'no-nested-ternary': 'off',
		'no-console': 2,
		'no-underscore-dangle': 'off',
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
			},
		],
		'import/no-unresolved': 'off',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: ['**/*.test.ts', '**/*.test.tsx'],
			},
		],
	},
};
