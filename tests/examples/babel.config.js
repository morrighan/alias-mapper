// Node.js built-in APIs.
const path = require('path');

// Constants.
const epiciniumCognomen = path.resolve(__dirname, '../../releases/babel.js');

// Babel configuration.
const presets = Object.entries({
	'@babel/preset-env': {
		targets: { node: 'v8.12.0' },
		modules: false
	}
});

const plugins = Object.entries({
	[epiciniumCognomen]: {
		common: 'releases/common',
		backend: 'releases/backend',
		model: 'releases/backend/models'
	},

	'@babel/plugin-transform-runtime': { regenerator: false }
});

module.exports = { presets, plugins };
