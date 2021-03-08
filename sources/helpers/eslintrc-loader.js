// Node.js built-in APIs.
import fs from 'fs';
import path from 'path';

// Third-party modules.
import YAML from 'js-yaml';
import JSON from 'json5';

// Caches.
const configurationCaches = new Map();

export default function loadESLintConfiguration(targetPath) {
	if (configurationCaches.has(targetPath)) {
		return configurationCaches.get(targetPath);
	}

	const fileExtension = path.extname(targetPath);
	let configuration;

	if (fileExtension === '.js') {
		configuration = require(targetPath); // eslint-disable-line global-require, import/no-dynamic-require
	} else {
		const unparsedConfiguration = fs.readFileSync(targetPath, { encoding: 'utf8' });

		if (fileExtension === '.yaml' || fileExtension === '.yml') {
			configuration = YAML.load(unparsedConfiguration);
		} else if (fileExtension === '.json') {
			configuration = JSON.parse(unparsedConfiguration);

			if (path.basename(targetPath) === 'package.json') {
				({ eslintConfig: configuration } = configuration);
			}
		} else {
			try {
				configuration = YAML.load(unparsedConfiguration);
			} catch {
				configuration = JSON.parse(unparsedConfiguration);
			}
		}
	}

	configurationCaches.set(targetPath, configuration);

	return configuration;
}
