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

The position of `/foo/bar` (or `["foo", "bar"]` if provided as an array), is:
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

## Versions

 * Since v2 this is a [pure ESM][pure-esm] package, and requires Node.js >=12.20
 * Since v3 the API has changed. The `dataPath` option has been renamed with changed semantics.
   * Dot-based (string) `dataPath` is now `dotPath`. **It's not recommended to use as it's not safe for certain characters**.
     * Also, it now requires an initial `.`. Only the path `.` represents the root object.
   * Array-based `dataPath` is now simply `path`.
     * An empty object represents the root object, like in v2.
   * New slash-based (string) `pointerPath` is allowed, following JSON Pointer encoding.

# Exports

The package exports the following functions:
 * [`jsonpos`](#definition) the main function, getting the location of a value in a JSON document
 * AST helper functions:
   * [`getAstByObject`](#getastbyobject)
   * [`getAstByString`](#getastbystring)
 * Location helper function:
   * [`getLocation`](#getlocation)
 * Path helper functions:
   * [`parsePath`](#parsepath)
   * [`encodeJsonPointerPath`](#json-pointer-paths)
   * [`encodeJsonPointerSegment`](#json-pointer-paths)
   * [`parseJsonPointerPath`](#json-pointer-paths)
   * [`parseJsonPointerSegment`](#json-pointer-paths)


# Simple usage

### Definition

`jsonpos( json, options: LocationOptions ): Location`

where `LocationOptions` is:

```ts
interface LocationOptions
    markIdentifier?: boolean;

    // Only one of the following
    dotPath: string;
    path: Array< string | number >;
    pointerPath: string;
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

### As dot-separated textual path:

```ts
import { jsonpos } from 'jsonpos'

const loc = jsonpos(
    '{ "foo": { "bar": "baz" } }',
    { dotPath: '.foo.bar' }
);
```

*Note that dot-separated paths are strongly advised against.*


### As /-separated textual path:

```ts
import { jsonpos } from 'jsonpos'

const loc = jsonpos(
    '{ "foo": { "bar": "baz" } }',
    { pointerPath: '/foo/bar' }
);
```


### As array path:

```ts
import { jsonpos } from 'jsonpos'

const loc = jsonpos(
    '{ "foo": { "bar": "baz" } }',
    { path: [ 'foo', 'bar' ] }
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
const loc = getLocation( ast, { pointerPath: '/foo' } );
```

## Path helpers

This package understand array paths `["foo", "bar"]`, dot-path `".foo.bar"` and JSON Pointer paths `/foo/bar`. Support for dot-path is to understand older paths from [Ajv](https://www.npmjs.com/package/ajv). Array paths are often the most practical programatically.

### parsePath

The `parsePath` function is what [`jsonpos`]() uses to parse the path. It takes on object containing either `path` (an array), `dotPath` or `pointerPath` (strings), and it returns the path as an array.

```ts
parsePath( { path: [ "foo", "bar" ] } );  // -> [ "foo", "bar" ]
parsePath( { dotPath: ".foo.bar" } );     // -> [ "foo", "bar" ]
parsePath( { pointerPath: "/foo/bar" } ); // -> [ "foo", "bar" ]
```

### JSON Pointer paths

JSON Pointer paths support the slash character (`/`) in a path segment, and encodes it with `~1` and `~0`. `encodeJsonPointerSegment` and `parseJsonPointerSegment` does this:

```ts
encodeJsonPointerSegment( "f/o/o" ); // -> "f~1o~1o"
parseJsonPointerSegment( "f~1o~1o" ); // -> "f/o/o"
```

For complete paths (of segments), use `encodeJsonPointerPath` and `parseJsonPointerPath`:

```ts
encodeJsonPointerPath( [ "f/o/o", "bar" ] ); // -> "/f~1o~1o/bar"
parseJsonPointerPath( "/f~1o~1o/bar" ); // -> [ "f/o/o", "bar" ]
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
[pure-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
