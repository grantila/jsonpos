[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]


# jsonpos

Get the text position [start, end] of a property in a JSON document.

Given the following JSON:

```js
{
    "foo": {
        "bar": "baz"
               ^^^^^
    }
}
```

The position of `foo.bar` (or `["foo", "bar"]` if provided as an array), is:
```js
{
    start: { line: 3, column: 16, offset: 30 },
    end: { line: 3, column: 21, offset: 35 }
}
```

where `offset` is the character offset in the JSON string.

If the *property* "bar" is wanted, instead of the *value*, set `markIdentifier` to `true`, see [Simple usage](#definition).

# Install

`npm i jsonpos` or `yarn add jsonpos`


# Simple usage

### Definition

`jsonpos( json, options: LocationOptions ): Location`

where `LocationOptions` is:

```ts
interface LocationOptions
    dataPath: string | Array< string | number >;
    markIdentifier?: boolean;
}
```

and `Location` is:
```ts
interface Location
{
    start: Position | undefined;
    end: Position | undefined;
}
```

where `Position` is:

```ts
interface Position
{
    line: number;
    column: number;
    offset: number;
}
```

### As textual path:

```ts
import { jsonpos } from 'jsonpos'

const loc = jsonpos(
    '{ "foo": { "bar": "baz" } }',
    { dataPath: 'foo.bar' }
);
```

### As array path:

```ts
import { jsonpos } from 'jsonpos'

const loc = jsonpos(
    '{ "foo": { "bar": "baz" } }',
    { dataPath: [ 'foo', 'bar' ] }
);
```


## Advanced usage

The `jsonpos` function is a shorthand for `getLocation( getAstByString( json ), options )`

Extract the AST (using [json-to-ast](https://www.npmjs.com/package/json-to-ast)) with `getAstByString` or `getAstByObject`. The result is an object of type `ParsedJson`:

```ts
interface ParsedJson
{
    json: any;
    jsonString: string;
    jsonAST: ValueNode; // ValueNode is a json-to-ast type
}
```

### getAstByString

```ts
import { getAstByString } from 'jsonpos'

const ast = getAstByString( '{ "foo": "bar" }' );
const { json, jsonString, jsonAST } = ast;
```

### getAstByObject

`getAstByObject` will stringify the JSON using `JSON.stringify(obj, null, 4)` and use that to parse the AST.

```ts
import { getAstByObject } from 'jsonpos'

const ast = getAstByObject( { foo: "bar" } );
const { json, jsonString, jsonAST } = ast;
```

`getAstByObject` takes an optional second argument `indent` which can be set to something else than `4` if necessary, e.g. `2`:

```ts
const ast = getAstByObject( { foo: "bar" }, 2 );
```

### getLocation

The `getLocation` takes an *ast* object as returned by `getAstByString` or `getAstByObject` and returns a `Location` object.

#### Definitins

`getLocation( ast: ParsedJson, options: LocationOptions ): Location`

#### Example

```ts
import { getAstByString, getLocation } from 'jsonpos'

const ast = getAstByString( '{ "foo": "bar" }' );
const loc = getLocation( ast, { dataPath: 'foo' } );
```

[npm-image]: https://img.shields.io/npm/v/jsonpos.svg
[npm-url]: https://npmjs.org/package/jsonpos
[downloads-image]: https://img.shields.io/npm/dm/jsonpos.svg
[build-image]: https://img.shields.io/github/workflow/status/grantila/jsonpos/Master.svg
[build-url]: https://github.com/grantila/jsonpos/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/jsonpos/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/jsonpos?branch=master
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/grantila/jsonpos.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/grantila/jsonpos/context:javascript
