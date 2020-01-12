// Node.js built-in APIs.
const path = require('path');

// Constants.
const epiciniumCognomen = path.resolve(__dirname, '../../releases/eslint.js');

// ESLint configuration.
const resolvers = {
	[epiciniumCognomen]: {
		common: 'sources/common',
		backend: 'sources/backend',
		model: 'sources/backend/models'
	},

	node: {
		extensions: [ '.js', '.ts', '.json' ]
	}
};

module.exports = {
	rules: { 'import/extensions': [ 'error', 'never' ] },
	settings: { 'import/resolver': resolvers }
};
