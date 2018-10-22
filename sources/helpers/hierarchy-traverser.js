// Node.js built-in APIs.
import path from 'path';

export default function* traverseHierarchy(targetPath) {
	let directory = targetPath;

	while (path.dirname(directory) !== directory) {
		yield directory;

		directory = path.dirname(directory);
	}

	yield path.dirname(directory);
}
