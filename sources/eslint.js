// Node.js built-in APIs.
import path from 'path';

// Third-party modules.
import { sync as glob } from 'glob';

// Internal helpers.
import findOptions from './helpers/options-finder';
import mapOptionsToAliases from './helpers/options-to-aliases-mapper';

// Constants.
const jsAwarePattern = /^.(?:[jt]sx?|json\d?|node)$/i;

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
			} catch {} // eslint-disable-line no-empty

			const patternedPath = path.format({
				dir: path.dirname(bloatedPath),
				name: path.basename(bloatedPath),
				ext: '.*'
			});

			const [ foundPath ] = glob(patternedPath).filter(target => jsAwarePattern.test(path.extname(target)));

			if (typeof foundPath !== 'string') {
				continue;
			}

			return { found: true, path: foundPath };
		}
	}

	return { found: false };
}

export const interfaceVersion = 2;
