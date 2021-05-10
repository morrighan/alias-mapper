// Node.js built-in APIs.
import process from 'process';

// Local helpers.
import createAliasMap from './alias-map-creator';

// Type definitions.
export interface Configuration extends Record<string, unknown> {
    basePath?: string;
    rootDirs?: string[];
    aliases?: Record<string, string>;
}

// Type definitions.
type AliasEntry = [ aliasAs: string, matchTo: string ];
type FoundAlias = [ mappedPath: string, remainedConfiguration: Record<string, unknown> ];

// Constants.
const aliasRegExp = /^\([^\\/]+\)/;

function findAliasFromMap(rawPath: string, aliasMap: Map<string, string>): AliasEntry | null {
    for (const aliasEntry of aliasMap.entries()) {
        const [ aliasAs ] = aliasEntry;

        if (rawPath.startsWith(aliasAs)) {
            return aliasEntry;
        }
    }

    return null;
}

export default function findAlias(
    rawPath: string,
    mentionedFile: string,
    configuration: Configuration
): FoundAlias | null {
    if (!aliasRegExp.test(rawPath)) {
        return null;
    }

    const { basePath = process.cwd(), rootDirs = [], aliases = {}, ...defaultOptions } = configuration;
    const aliasMap = createAliasMap(mentionedFile, rootDirs, aliases, basePath);
    const [ aliasAs, matchTo ] = findAliasFromMap(rawPath, aliasMap) ?? [];

    return aliasAs && matchTo
        ? [ `${matchTo}${rawPath.slice(aliasAs.length)}`, defaultOptions ]
        : null;
}
