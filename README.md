[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]


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
 * Since v4:
   * `json-to-ast` has been replaced with `json-cst` which is a lot smaller.
   * `getAstByObject` and `getAstByString` was renamed `getParsedByObject` and `getParsedByString`.


# Exports

The package exports the following functions:
 * [`jsonpos`](#definition) the main function, getting the location of a value in a JSON document
 * CST helper functions:
   * [`getParsedByObject`](#getparsedbyobject)
   * [`getParsedByString`](#getparsedbystring)
 * Location helper function:
   * [`getLocation`](#getlocation)
   * [`getPosition`](#getlocation)
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

The `jsonpos` function is a shorthand for `getLocation( getParsedByString( json ), options )`

Extract the CST (using [json-cst](https://www.npmjs.com/package/json-cst)) with `getParsedByString` or `getParsedByObject`. The result is an object of type `ParsedJson`:

```ts
interface ParsedJson
{
    json: any;
    jsonString: string;
    jsonDoc: CstDocument; // CstDocument is a json-cst type
}
```

### getParsedByString

```ts
import { getParsedByString } from 'jsonpos'

const parsed = getParsedByString( '{ "foo": "bar" }' );
const { json, jsonString, jsonDoc } = parsed;
```

### getParsedByObject

`getParsedByObject` will stringify the JSON using `JSON.stringify(obj, null, 4)` and use that to parse the CST.

```ts
import { getParsedByObject } from 'jsonpos'

const parsed = getParsedByObject( { foo: "bar" } );
const { json, jsonString, jsonDoc } = parsed;
```

`getParsedByObject` takes an optional second argument `indent` which can be set to something else than `4` if necessary, e.g. `2`:

```ts
const parsed = getParsedByObject( { foo: "bar" }, 2 );
```

### getLocation

The `getLocation` takes an *parsed* object as returned by `getParsedByString` or `getParsedByObject` and returns a `Location` object.

#### Definitions

`getLocation( parsed: ParsedJson, options: LocationOptions ): Location`

where `Location` is defined [above](#definition).

#### Example

```ts
import { getParsedByString, getLocation } from 'jsonpos'

const parsed = getParsedByString( '{ "foo": "bar" }' );
const loc = getLocation( parsed, { pointerPath: '/foo' } );
```


### getPosition

To get the position (line and column) of an offset position, use `getPosition`.

#### Definitions

`getPosition( text: string, pos: number ): Position`

where `Position` is defined [above](#definition).

#### Example

```ts
import { getPosition } from 'jsonpos'

const text = `{
  "foo": "bar",
  "baz": 42
}`;
const loc = getPosition( text, 25 ); // 25 is start of <42>
// loc = { offset: 25, line: 3, column: 10 }
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
[build-image]: https://img.shields.io/github/actions/workflow/status/grantila/jsonpos/master.yml?branch=master
[build-url]: https://github.com/grantila/jsonpos/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/jsonpos/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/jsonpos?branch=master
[pure-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
