declare module 'eslint-import-resolver-node' {
    type ResolutionResult =
        | { found: false }
        | { found: true, path: string };

    const interfaceVersion: number;

    function resolve(source: string, file: string, config: unknown): ResolutionResult;
}
