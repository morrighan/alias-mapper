// Node.js built-in APIs.
const fs = require('fs');
const path = require('path');

// Third-party modules.
const { describe, it } = require('mocha');
const { expect } = require('chai');

// Target modules.
const babel = require('@babel/core');
const { CLIEngine } = require('eslint');

// Constants.
const examplesPath = path.resolve(__dirname, 'examples');
const targetFile = path.resolve(examplesPath, 'sources/frontend/components/button/index.js');
const astFile = path.resolve(__dirname, 'artifacts/ast.json');

// Artifacts.
const savedAst = new Promise((resolve, reject) => {
	fs.readFile(astFile, (error, data) => {
		if (error) {
			reject(error);
		}

		resolve(JSON.parse(data.toString('utf8')));
	});
});

describe(`ESLint v${CLIEngine.version}`, () => {
	it('should lint without an error', () => {
		const cli = new CLIEngine({ cwd: examplesPath });
		const { results, errorCount } = cli.executeOnFiles([ targetFile ]);

		const messages = results
			.map(({ messages }) => messages)
			.reduce((concatenated, messages) => concatenated.concat(messages), []);

		if (errorCount > 0) {
			const refinedMessage = messages
				.map(({ message, ruleId, line, column }) => `[${ruleId}] ${message} (${line}:${column})`)
				.join('\n');

			console.error(refinedMessage); // eslint-disable-line no-console
		}

		expect(messages, 'An error has to be not raised').to.be.empty; // eslint-disable-line no-unused-expressions
	});
});

describe(`Babel v${babel.version}`, () => {
	it('should compile without an error', async () => {
		const { ast } = await babel.transformFileAsync(targetFile, { root: examplesPath, code: false, ast: true });
		const builtAst = JSON.parse(JSON.stringify(ast));

		expect(builtAst, 'The abstract syntax tree does not match').to.deep.equal(await savedAst);

		// For detouring asynchronous resolution timeout.
		return undefined;
	});
});
