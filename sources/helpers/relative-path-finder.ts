// Node.js built-in APIs.
import path from 'path';

// Constants.
const upwardExpression = `.${path.sep}..${path.sep}`;
const upwardLength = upwardExpression.length;

export default function findRelativePath(mentionedFile: string, mappedPath: string): string {
    let relativePath = `.${path.sep}${path.relative(mentionedFile, mappedPath)}`;

    while (mappedPath.startsWith(upwardExpression)) {
        relativePath = relativePath.slice(upwardLength);
    }

    return relativePath;
}
