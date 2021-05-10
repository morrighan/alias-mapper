// Node.js built-in APIs.
const path = require('path');

// Constants.
const aliasMapper = path.resolve(__dirname, '../../releases/eslint.js');
const extensions = [ '.js', '.ts', '.json' ];

/** @type {import('eslint').Linter.Config} */
module.exports = {
	rules: {
		'import/extensions': [ 'error', 'never' ]
	},

	settings: {
		'import/resolver': {
			[aliasMapper]: {
				basePath: __dirname,

				rootDirs: [
					'sources/frontend',
				],

				aliases: {
					common: 'sources/common',
					backend: 'sources/backend',
					models: 'sources/backend/models'
				},

				extensions
			},

			node: { extensions }
		}
	}
};
