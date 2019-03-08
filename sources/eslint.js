// Node.js built-in APIs.
import path from 'path';

// Third-party modules.
import { resolve as resolveAsNode } from 'eslint-import-resolver-node';

// Internal helpers.
import findOptions, { findNodeResolverOptions } from './helpers/options-finder';
import mapOptionsToAliases from './helpers/options-to-aliases-mapper';

/**
 * @param {string} originalPath
 * @param {string} mentionedBy
 * @returns {{ found: boolean; path?: string }}
 */
export function resolve(originalPath, mentionedBy) {
	if (!/^\([^\\/]+\)/.test(originalPath)) {
		return { found: false };
	}

	const referencePath = path.dirname(mentionedBy);

	for (const [ options, configuredDirectory ] of findOptions(referencePath)) {
		const nodeOptionsCandidates = [ ...findNodeResolverOptions(referencePath) ];

		if (
			nodeOptionsCandidates.length > 0
			&& nodeOptionsCandidates.every(options => options[1] !== configuredDirectory)
		) {
			continue;
		}

		const nodeOptions = nodeOptionsCandidates.find(options => options[1] === configuredDirectory)[0] || {};

		for (const [ aliasAs, matchTo ] of mapOptionsToAliases(options, configuredDirectory)) {
			if (!originalPath.startsWith(aliasAs)) {
				continue;
			}

			return resolveAsNode(matchTo + originalPath.slice(aliasAs.length), mentionedBy, nodeOptions);
		}
	}

	return { found: false };
}

export const interfaceVersion = 2;
