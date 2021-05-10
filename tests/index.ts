// Node.js built-in APIs.
import console from 'console';
import { promises as fs } from 'fs';
import path from 'path';

// Third-party modules.
import { describe, it } from 'mocha';
import { expect } from 'chai';

// Target modules.
import * as Babel from '@babel/core';
import { ESLint } from 'eslint';

// Constants.
const examplesPath = path.resolve(__dirname, 'examples');
const targetFile = path.resolve(examplesPath, 'sources/frontend/components/button/index.js');
const astFile = path.resolve(__dirname, 'artifacts/ast.json');

// Artifacts.
const savedAst = fs.readFile(astFile, 'utf8').then(data => JSON.parse(data));

describe(`ESLint v${ESLint.version}`, () => {
    it('should lint without an error', async () => {
        const eslint = new ESLint({ cwd: examplesPath });
        const [ { messages } ] = await eslint.lintFiles([ targetFile ]);

        for (const { message, ruleId, line, column } of messages) {
            console.error(`[${ruleId ?? '?'}] ${message} (${line}:${column})`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(messages, 'An error has to be not raised').to.be.empty;
    });
});

describe(`Babel v${Babel.version}`, () => {
    it('should compile without an error', async () => {
        const fileResult = await Babel.transformFileAsync(targetFile, { root: examplesPath, code: false, ast: true });
        const builtAst = fileResult && JSON.parse(JSON.stringify(fileResult.ast));

        expect(builtAst, 'The abstract syntax tree does not match').to.deep.equal(await savedAst);
    });
});
