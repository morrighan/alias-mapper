// Node.js built-in APIs.
import fs from 'fs';
import path from 'path';

// Internal helpers.
import traverseDirectories from './hierarchy-traverser';
import loadESLintConfiguration from './eslintrc-loader';

// Constants.
const candidates = [ '.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json', '.eslintrc' ];
const internalResolverPath = path.resolve(__dirname, '../eslint.js');

// Caches.
const pathCaches = new Map();
const resolverCaches = new Map();

// Partial helpers.
function* findPathOfOptions(targetPath) {
	if (pathCaches.has(targetPath)) {
		yield* pathCaches.get(targetPath);
	}

	const cache = [];

	for (const reference of traverseDirectories(targetPath)) {
		const optionsPath = candidates.map(candidate => path.resolve(reference, candidate)).find(fs.existsSync);

		if (optionsPath) {
			yield optionsPath;

			continue;
		}

		const packagePath = path.resolve(reference, 'package.json');

		if (!fs.existsSync(packagePath)) {
			continue;
		}

		const { eslintConfig } = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }));

		if (!eslintConfig) {
			continue;
		}

		cache.push(packagePath);

		yield packagePath;
	}

	pathCaches.set(targetPath, cache);
}

function* findResolverOptions(targetPath) {
	if (resolverCaches.has(targetPath)) {
		yield* resolverCaches.get(targetPath);
	}

	const cache = [];

	for (const optionsPath of findPathOfOptions(targetPath)) {
		const configuredDirectory = path.dirname(optionsPath);
		const { root, settings: { 'import/resolver': resolvers = {} } = {} } = loadESLintConfiguration(optionsPath);

		for (const resolverEntry of Object.entries(resolvers)) {
			const options = [ ...resolverEntry, configuredDirectory, optionsPath ];

			cache.push(options);

			yield options;
		}

		if (root === true) {
			break;
		}
	}

	resolverCaches.set(targetPath, cache);
}

export function* findNodeResolverOptions(targetPath) {
	for (const [ resolver, options, configuredDirectory ] of findResolverOptions(targetPath)) {
		if (!/(?:eslint-import-resolver-)?node$/.test(resolver)) {
			continue;
		}

		yield [ options, configuredDirectory ];
	}
}

export default function* findOptions(targetPath) {
	for (const [ resolver, options, configuredDirectory, optionsPath ] of findResolverOptions(targetPath)) {
		if (
			!resolver.endsWith('@epicinium/cognomen')
				&& !(path.isAbsolute(resolver)
					? resolver
					: path.resolve(path.dirname(optionsPath), resolver) === internalResolverPath)
		) {
			continue;
		}

		yield [ options, configuredDirectory ];
	}
}
