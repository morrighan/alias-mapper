// Babel configuration.
const presets = Object.entries({
	'@babel/preset-env': { targets: { node: 'v8.12.0' } }
});

const plugins = Object.entries({
	'@babel/plugin-proposal-optional-catch-binding': {},
	'@babel/plugin-proposal-export-default-from': {},
	'@babel/plugin-proposal-export-namespace-from': {},
	'babel-plugin-closure-elimination': {},
	'module:faster.js': {},
	'@babel/plugin-transform-runtime': { regenerator: false }
});

module.exports = { presets, plugins };
