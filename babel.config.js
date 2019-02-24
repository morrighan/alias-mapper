// Babel configuration.
const presets = Object.entries({
	'@babel/preset-env': { targets: { node: 'v10.15.1' } }
});

const plugins = Object.entries({
	'@babel/plugin-proposal-optional-catch-binding': {},
	'@babel/plugin-proposal-export-default-from': {},
	'@babel/plugin-proposal-export-namespace-from': {},
	'babel-plugin-closure-elimination': {},
	'@babel/plugin-transform-runtime': { regenerator: false }
});

module.exports = { presets, plugins };
