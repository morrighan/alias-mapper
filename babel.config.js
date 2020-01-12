// Babel configuration.
const presets = Object.entries({
	'@babel/preset-env': { targets: { node: 'v12.14.1' } }
});

const plugins = Object.entries({
	'@babel/plugin-proposal-export-default-from': {},
	'@babel/plugin-proposal-export-namespace-from': {},
	'@babel/plugin-transform-runtime': { regenerator: false }
});

module.exports = { presets, plugins };
