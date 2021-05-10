// Third-party modules.
import { resolve as defaultResolve } from 'eslint-import-resolver-node';

// Local helpers.
import type { Configuration } from './helpers/alias-finder';
import findAlias from './helpers/alias-finder';

// Type definitions.
type ResolutionResult = ReturnType<typeof defaultResolve>;

// Constants.
export const interfaceVersion = 2;

export function resolve(
    rawPath: string,
    mentionedFile: string,
    configuration: Configuration
): ResolutionResult {
    const [ mappedPath, defaultOptions ] = findAlias(rawPath, mentionedFile, configuration) ?? [];

    return mappedPath && defaultOptions
        ? defaultResolve(mappedPath, mentionedFile, defaultOptions)
        : { found: false };
}
