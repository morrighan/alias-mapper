// Node.js built-in APIs.
const path = require('path');

// Constants.
const aliasMapper = path.resolve(__dirname, '../../releases/babel.js');

/**
 * @param {import('@babel/core').ConfigAPI} API
 * @returns {import('@babel/core').TransformOptions}
 */
function configurateBabel(API) {
    API.assertVersion('^7.14.0');
    API.cache.forever();

	// Configuration fragments.
    const corejs = { version: 3, proposals: true };

    const presets = Object.entries({
		'@babel/preset-env': { bugfixes: true, useBuiltIns: 'usage', targets: { node: 'current' }, modules: false, corejs }
	});

	const plugins = Object.entries({
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
		},

		'@babel/plugin-transform-runtime': { regenerator: false, corejs }
	});

    return { presets, plugins };
}

module.exports = configurateBabel;
