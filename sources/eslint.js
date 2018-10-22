// Node.js built-in APIs.
import path from 'path';

// Internal helpers.
import findOptions from './helpers/options-finder';
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

	for (const [ options, configuredDirectory ] of findOptions(path.dirname(mentionedBy))) {
		for (const [ aliasAs, matchTo ] of mapOptionsToAliases(options, configuredDirectory)) {
			if (!originalPath.startsWith(aliasAs)) {
				continue;
			}

			const bloatedPath = matchTo + originalPath.slice(aliasAs.length);

			try {
				return { found: true, path: require.resolve(bloatedPath) };
			} catch {
				continue;
			}
		}
	}

	return { found: false };
}

export const interfaceVersion = 2;
