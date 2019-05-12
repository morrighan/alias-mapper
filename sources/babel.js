// Node.js built-in APIs.
import path from 'path';

// Babel modules.
import { declare } from '@babel/helper-plugin-utils';

// Internal helpers.
import mapOptionsToAliases from './helpers/options-to-aliases-mapper';

const replace = (node, state, options, configuredDirectory) => {
	const originalPath = node.source.value;
	const mentionedBy = path.dirname(state.filename);

	if (!/^\([^\\/]+\)/.test(originalPath)) {
		return;
	}

	for (const [ aliasAs, matchTo ] of mapOptionsToAliases(options, configuredDirectory)) {
		if (!originalPath.startsWith(aliasAs)) {
			continue;
		}

		const bloatedPath = matchTo + originalPath.slice(aliasAs.length);

		node.source.value = `.${path.sep}${path.relative(mentionedBy, bloatedPath)}`; // eslint-disable-line no-param-reassign

		break;
	}
};

const generateVisitor = (options, configuredDirectory) => ({
	ImportDeclaration({ node }, state) {
		replace(node, state, options, configuredDirectory);
	},

	ExportNamedDeclaration({ node }, state) {
		if (node.source) {
			replace(node, state, options, configuredDirectory);
		}
	},

	ExportAllDeclaration({ node }, state) {
		if (node.source) {
			replace(node, state, options, configuredDirectory);
		}
	}
});

export default declare((api, options, configuredDirectory) => {
	api.assertVersion('^7.0.0');

	const globalVisitor = {
		Program(path, state) {
			path.traverse(generateVisitor(options, configuredDirectory), state);
		}
	};

	return { visitor: globalVisitor };
});
