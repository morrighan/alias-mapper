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
        '@babel/preset-env': { bugfixes: true, useBuiltIns: 'usage', targets: { node: 'current' }, corejs },
        '@babel/preset-typescript': {}
    });

    const plugins = Object.entries({
        '@babel/plugin-transform-runtime': { regenerator: false, corejs }
    });

    return { presets, plugins };
}

module.exports = configurateBabel;
