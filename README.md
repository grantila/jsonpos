# jsonpos

Get the text position [start, end] of a property in a JSON document.

Given the following JSON:

```json
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

If the *property* "bar" is wanted, instead of the *value*, set `markIdentifier` to `true`.

# Install

Install

`npm i jsonpos` or `yarn add jsonpos`


# Usage

As textual path:

```ts
import { jsonpos } from 'jsonpos'

const pos = jsonpos(
	'{ "foo": { "bar": "baz" } }',
	{ dataPath: 'foo.bar' }
);
```

As array path:

```ts
import { jsonpos } from 'jsonpos'

const pos = jsonpos(
	'{ "foo": { "bar": "baz" } }',
	{ dataPath: [ 'foo', 'bar' ] }
);
```
