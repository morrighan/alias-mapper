// Node.js built-in APIs.
import path from 'path';

export default function* mapOptionsToAliases(options, referencePath) {
	for (const aliasAs of Object.keys(options)) {
		yield [ `(${aliasAs})`, path.resolve(referencePath, options[aliasAs]) ];
	}
}
