import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
// @ts-expect-error eslint-plugin-jsdoc does not have type definitions
import json from 'eslint-plugin-json';
// @ts-expect-error eslint-plugin-import does not have type definitions
import imports from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import wc from 'eslint-plugin-wc';
import globals from 'globals';
// eslint-disable-next-line import/no-unresolved
import ts from 'typescript-eslint';

/**
 * @typedef {Readonly<import('eslint').Linter.Config>} Config
 */

/** @type {Config[]} */
const config = [
	// Ignores
	{
		ignores: [
			'node_modules',
			'package-lock.json',
			'package.json',
			'tsconfig.json',
			'.vscode',
			'dist',
		],
	},
	// Logic plugins
	js.configs.recommended,
	(/** @type {Config} */ (ts.configs.eslintRecommended)),
	...(/** @type {Config[]} */ (ts.configs.strictTypeChecked)),
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				// @ts-expect-error import.meta.dirname is not defined but works in NodeJS
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	(/** @type {Config} */ (imports.flatConfigs.recommended)),
	{
		plugins: { wc: wc },
		rules: { ...wc.configs.recommended.rules },
	},
	{
		plugins: { unicorn: unicorn },
	},
	jsdoc.configs['flat/recommended-typescript-flavor'],

	// Stylistic plugins
	(/** @type {Config} */ (stylistic.configs.customize({
		arrowParens: false,
		braceStyle: 'stroustrup',
		commaDangle: 'always-multiline',
		indent: 'tab',
		jsx: false,
		quoteProps: 'consistent',
		quotes: 'single',
		semi: true,
	}))),
	(/** @type {Config} */ (perfectionist.configs['recommended-natural'])),

	// Custom config
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.builtin,
				...globals.es2022,
				...globals.browser,
			},
			parserOptions: {
				ecmaFeatures: {
					impliedStrict: true,
				},
			},
			sourceType: 'module',
		},
		rules: {
			// Imports
			'import/exports-last': 'error',
			'import/extensions': ['error', 'always', { ignorePackages: true }],
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-absolute-path': 'error',
			'import/no-amd': 'error',
			'import/no-commonjs': 'error',
			'import/no-cycle': 'error',
			'import/no-default-export': 'error',
			'import/no-deprecated': 'error',
			'import/no-dynamic-require': 'error',
			'import/no-import-module-exports': 'error',
			'import/no-nodejs-modules': 'error',
			'import/no-relative-packages': 'error',
			'import/no-relative-parent-imports': 'error',
			'import/no-restricted-paths': 'error',
			'import/no-unassigned-import': 'error',
			'import/no-unused-modules': 'error',
			'import/no-useless-path-segments': 'error',
			'import/no-webpack-loader-syntax': 'error',
			'import/order': 'off',
			// JSDoc
			'jsdoc/check-indentation': 'warn',

			'jsdoc/check-line-alignment': 'warn',
			'jsdoc/check-syntax': 'warn',
			'jsdoc/check-template-names': 'warn',
			'jsdoc/convert-to-jsdoc-comments': 'warn',
			'jsdoc/informative-docs': 'warn',
			'jsdoc/no-bad-blocks': 'warn',
			'jsdoc/no-blank-block-descriptions': 'warn',
			'jsdoc/no-blank-blocks': 'warn',
			'jsdoc/require-asterisk-prefix': 'warn',
			'jsdoc/require-description': 'warn',
			'jsdoc/require-description-complete-sentence': 'warn',
			'jsdoc/require-hyphen-before-param-description': 'warn',
			'jsdoc/require-template': 'warn',
			'jsdoc/require-throws': 'warn',
			'jsdoc/sort-tags': 'warn',

			// Globals
			'no-restricted-globals': ['error'].concat(CONFUSING_BROWSER_GLOBALS()),

			// Unicorn
			'unicorn/better-regex': 'error',
			'unicorn/custom-error-definition': 'error',
			'unicorn/no-keyword-prefix': 'error',
			'unicorn/no-unused-properties': 'error',
			'unicorn/prefer-json-parse-buffer': 'error',
			'unicorn/require-post-message-target-origin': 'error',
		},
	},

	// Overrides
	{
		files: ['*.config.js'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			'import/no-default-export': 'off',
		},
	},

	// Additional file types
	{
		files: ['**/*.json'],
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		...json.configs['recommended'],
	},
];

/**
 * This list was copied from Facebook's create-react-app's "confusing-browser-globals" package,
 * which is licensed under the MIT license.
 *
 * The original source code of this list is available on GitHub:
 * https://github.com/facebook/create-react-app/blob/dd420a6d25d037decd7b81175626dfca817437ff/packages/confusing-browser-globals/index.js.
 *
 * The original LICENSE file can be found here:
 * https://github.com/facebook/create-react-app/blob/dd420a6d25d037decd7b81175626dfca817437ff/packages/confusing-browser-globals/LICENSE.
 * @copyright 2015-present, Facebook, Inc
 * @license MIT
 * @returns {string[]} - The globals.
 * @author Facebook
 */
function CONFUSING_BROWSER_GLOBALS() {
	return [
		'addEventListener',
		'blur',
		'close',
		'closed',
		'confirm',
		'defaultStatus',
		'defaultstatus',
		'event',
		'external',
		'find',
		'focus',
		'frameElement',
		'frames',
		'history',
		'innerHeight',
		'innerWidth',
		'length',
		'location',
		'locationbar',
		'menubar',
		'moveBy',
		'moveTo',
		'name',
		'onblur',
		'onerror',
		'onfocus',
		'onload',
		'onresize',
		'onunload',
		'open',
		'opener',
		'opera',
		'outerHeight',
		'outerWidth',
		'pageXOffset',
		'pageYOffset',
		'parent',
		'print',
		'removeEventListener',
		'resizeBy',
		'resizeTo',
		'screen',
		'screenLeft',
		'screenTop',
		'screenX',
		'screenY',
		'scroll',
		'scrollbars',
		'scrollBy',
		'scrollTo',
		'scrollX',
		'scrollY',
		'self',
		'status',
		'statusbar',
		'stop',
		'toolbar',
		'top',
	];
}

export default config;
