// Node.js built-in APIs.
import fs from 'fs';
import path from 'path';

// Internal helpers.
import traverseDirectories from './hierarchy-traverser';
import loadESLintConfiguration from './eslintrc-loader';

// Constants.
const candidates = [ '.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json', '.eslintrc' ];
const internalResolverPath = path.resolve(__dirname, '../eslint.js');

// Partial helpers.
function* findPathOfOptions(targetPath) {
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

		yield packagePath;
	}
}

export default function* findOptions(targetPath) {
	for (const optionsPath of findPathOfOptions(targetPath)) {
		const configuredDirectory = path.dirname(optionsPath);
		const { root, settings: { 'import/resolver': resolvers = {} } = {} } = loadESLintConfiguration(optionsPath);

		for (const [ resolver, options ] of Object.entries(resolvers)) {
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

		if (root === true) {
			break;
		}
	}
}
