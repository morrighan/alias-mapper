# @cichol/alias-mapper

A resolver in order to shorten deeply nested relative path expression.

[![Build Status][github actions badge]][github actions][![License][license badge]](LICENSE)[![Package Version][npm package version badge]][npm package]

## Table of Contents

- [@cichol/alias-mapper](#cicholalias-mapper)
  - [Table of Contents](#table-of-contents)
  - [Motivation](#motivation)
    - [Prior Art](#prior-art)
  - [Installation](#installation)
  - [Integration](#integration)
    - [Babel](#babel)
    - [ESLint](#eslint)
    - [Visual Studio Code](#visual-studio-code)
  - [Usage](#usage)
  - [License](#license)

## Motivation

In monorepo structure or complex directory hierarchy, we used to exhausted by deeply nested import expression. (e.g. `import ... from '../../../../package.json'` in `packages/frontend/components/button/index.jsx`)

### Prior Art

-   [**`babel-plugin-module-resolver`**][babel plugin module resolver]<br />It has a risk of name collision with existing modules by indirect deep dependencies. because it allows using any name as an alias.
-   [**`babel-plugin-root-import`**][babel plugin root import]<br />It allows only one character as an alias name. (e.g. `~` is allowed, but `~~` is not)
    -   [**`eslint-import-resolver-babel-plugin-root-import`**][eslint import resolver babel plugin root import]<br />It requires `babel-plugin-root-import@^5`. but latest version of `babel-plugin-root-import@6` is released.
-   [**`babel-plugin-hash-resolve`**][babel plugin hash resolve]<br />It requires off some option of `eslint-plugin-import`. (e.g. `import/no-unresolved`, `import/extensions`)

## Installation

```sh
$ npm install --save-dev @cichol/alias-mapper
```

## Integration

### Babel

If `import ... from '(frontend)/application'` expression in `backend/server.js` file. that will be transformed like `const ... = require('../frontend/releases/application')`.

```json
{
    "plugins": [
        [
            "module:@cichol/alias-mapper",
            {
                "rootDirs": [
                    "sources"
                ],
                "aliases" {
                    "models": "sources/backend/models"
                }
            }
        ]
    ]
}
```

Write or append above codes into your [Babel configuration file][babel configuration file]. (e.g. [`babel.config.js`][babel config js], [`.babelrc(.js(on)?)?`][babelrc])

Babel integration has to match to output directories. (e.g. `dist`, `out`, `build`, ...)

### ESLint

If you want to integrate with ESLint, you have to ensure [`eslint-plugin-import`][eslint plugin import] installed. and then, set resolver to your configuration file.

```json
{
    "settings": {
        "import/resolver": {
            "@cichol/alias-mapper": {
                "rootDirs": [
                    "sources"
                ],
                "aliases" {
                    "models": "sources/backend/models"
                }
            }
        }
    }
}
```

Write or append above codes into your [ESLint configuration file][eslint configuration file]. (e.g. `.eslintrc(.js(on)?|.ya?ml)?`)

ESLint integration has to match to source directories. (e.g. `src`, ...)

### Visual Studio Code

In Visual Studio Code, all JavaScript files are analyzed by [internal TypeScript language handler][internal typescript language handler]. so, you can just write [`jsconfig.json` file][jsconfig json] or [`tsconfig.json` for TypeScript project][tsconfig json].

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "(frontend)/*": "sources/frontend/*",
            "(backend)/*": "sources/backend/*",
            "(models)/*": "sources/backend/models/*"
        }
    },
    "include": ["sources"]
}
```

Visual Studio Code integration has to wrap alias name with parentheses and match to source directories.

## Usage

After the integration process, you can write code with aliased scopes. an alias name has to wrapped by parentheses for avoiding name collision with existing modules by indirect deep dependencies.

**Before**

```diff
- import logger from '../../../../common/logger';
```

**After**

```diff
+ import logger from '(common)/logger';
```

## License

[MIT Licensed](LICENSE).

[github actions badge]: https://img.shields.io/github/workflow/status/morrighan/alias-mapper/On%20default/develop?style=flat-square
[github actions]: https://github.com/morrighan/alias-mapper/actions
[license badge]: https://img.shields.io/github/license/morrighan/alias-mapper.svg?style=flat-square
[npm package version badge]: https://img.shields.io/npm/v/@cichol/alias-mapper.svg?style=flat-square
[npm package]: https://www.npmjs.com/package/@cichol/alias-mapper
[babel plugin module resolver]: https://www.npmjs.com/package/babel-plugin-module-resolver
[babel plugin root import]: https://www.npmjs.com/package/babel-plugin-root-import
[eslint import resolver babel plugin root import]: https://www.npmjs.com/package/eslint-import-resolver-babel-plugin-root-import
[babel plugin hash resolve]: https://www.npmjs.com/package/babel-plugin-hash-resolve
[babel configuration file]: https://babeljs.io/docs/en/configuration
[babel config js]: https://babeljs.io/docs/en/config-files#project-wide-configuration
[babelrc]: https://babeljs.io/docs/en/config-files#file-relative-configuration
[eslint plugin import]: https://www.npmjs.com/package/eslint-plugin-import
[eslint configuration file]: https://eslint.org/docs/user-guide/configuring#configuration-file-formats
[internal typescript language handler]: https://github.com/Microsoft/vscode-languageserver-node
[jsconfig json]: https://code.visualstudio.com/docs/languages/jsconfig
[tsconfig json]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
