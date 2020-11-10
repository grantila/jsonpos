import { getAstByString } from './parse'
import { getLocation } from './location'

const json = `{
	"foo": [
		"bar",
		{ "baz": "bak" }
	]
}`;

describe( "location", ( ) =>
{
	it( "by string, markIdentifier = false", ( ) =>
	{
		const parsed = getAstByString( json );

		const loc = getLocation(
			parsed,
			{ dataPath: "foo.1.baz", markIdentifier: false }
		);
		expect( loc ).toStrictEqual( {
			start: {
				line: 4,
				column: 12,
				offset: 32,
			},
			end: {
				line: 4,
				column: 17,
				offset: 37,
			},
		} );
	} );

	it( "by string, markIdentifier = true", ( ) =>
	{
		const parsed = getAstByString( json );

		const loc = getLocation(
			parsed,
			{ dataPath: "foo.1.baz", markIdentifier: true }
		);
		expect( loc ).toStrictEqual( {
			start: {
				line: 4,
				column: 5,
				offset: 25,
			},
			end: {
				line: 4,
				column: 10,
				offset: 30,
			},
		} );
	} );

	it( "by array path, markIdentifier = false", ( ) =>
	{
		const parsed = getAstByString( json );

		const loc = getLocation(
			parsed,
			{ dataPath: [ "foo", 1, "baz" ], markIdentifier: false }
		);
		expect( loc ).toStrictEqual( {
			start: {
				line: 4,
				column: 12,
				offset: 32,
			},
			end: {
				line: 4,
				column: 17,
				offset: 37,
			},
		} );
	} );

	it( "by array path, markIdentifier = true", ( ) =>
	{
		const parsed = getAstByString( json );

		const loc = getLocation(
			parsed,
			{ dataPath: [ "foo", 1, "baz" ], markIdentifier: true }
		);
		expect( loc ).toStrictEqual( {
			start: {
				line: 4,
				column: 5,
				offset: 25,
			},
			end: {
				line: 4,
				column: 10,
				offset: 30,
			},
		} );
	} );

	it( "by non-existing path (failed by object property)", ( ) =>
	{
		const parsed = getAstByString( json );

		const thrower = ( ) =>
			getLocation(
				parsed,
				{ dataPath: [ "foo", 1, "bee" ], markIdentifier: false }
			);
		expect( thrower ).toThrow(
			/No such property bee in \.foo\.1 .*foo\.1\.bee/
		);
	} );

	it( "by non-existing path (failed by array index)", ( ) =>
	{
		const parsed = getAstByString( json );

		const thrower = ( ) =>
			getLocation(
				parsed,
				{ dataPath: [ "foo", 3, "baz" ], markIdentifier: false }
			);
		expect( thrower ).toThrow(
			/Index 3 out-of-bounds .* size 2 at \.foo .*foo\.3\.baz/
		);
	} );

	it( "by non-existing path (failed by non-numeric array index)", ( ) =>
	{
		const parsed = getAstByString( json );

		const thrower = ( ) =>
			getLocation(
				parsed,
				{ dataPath: [ "foo", "bad", "baz" ], markIdentifier: false }
			);
		expect( thrower ).toThrow(
			/Invalid non-numeric array index "bad" .* \.foo .*foo\.bad\.baz/
		);
	} );
} );
