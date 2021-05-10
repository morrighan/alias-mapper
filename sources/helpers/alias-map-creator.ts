// Node.js built-in APIs.
import fs from 'fs';
import path from 'path';

// Local helpers.
import findClosestRoot from './closest-root-finder';

export default function createAliasMap(
    mentionedFile: string,
    rootDirs: string[],
    aliases: Record<string, string>,
    basePath: string
): Map<string, string> {
    const aliasMap = new Map(
        Object.entries(aliases).map(([ aliasAs, matchTo ]) => [ `(${aliasAs})`, path.resolve(basePath, matchTo) ])
    );

    const closestRoot = findClosestRoot(mentionedFile, rootDirs, basePath);

    if (closestRoot) {
        for (const dirent of fs.readdirSync(closestRoot, { withFileTypes: true })) {
            if (!dirent.isDirectory()) {
                continue;
            }

            const aliasAs = `(${dirent.name})`;
            const matchTo = path.resolve(basePath, path.relative(basePath, path.resolve(closestRoot, dirent.name)));

            aliasMap.set(aliasAs, matchTo);
        }
    }

    return aliasMap;
}
