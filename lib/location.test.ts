import { getAstByString } from './parse.js'
import { getLocation } from './location.js'
import { getAstByObject } from '.';

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
			{ dotPath: ".foo.1.baz", markIdentifier: false }
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

	it( "by string, markIdentifier {= false by default}", ( ) =>
	{
		const parsed = getAstByString( json );

		const loc = getLocation(
			parsed,
			{ dotPath: ".foo.1.baz" }
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
			{ dotPath: ".foo.1.baz", markIdentifier: true }
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

	it( "by string not beginning with '.'", ( ) =>
	{
		const parsed = getAstByString( json );

		const thrower = ( ) => getLocation(
			parsed,
			{ dotPath: "foo.1.baz", markIdentifier: true }
		);
		expect( thrower ).toThrow( );
	} );

	it( "by array path, markIdentifier = false", ( ) =>
	{
		const parsed = getAstByString( json );

		const loc = getLocation(
			parsed,
			{ path: [ "foo", 1, "baz" ], markIdentifier: false }
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
			{ path: [ "foo", 1, "baz" ], markIdentifier: true }
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
				{ path: [ "foo", 1, "bee" ], markIdentifier: false }
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
				{ path: [ "foo", 3, "baz" ], markIdentifier: false }
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
				{ path: [ "foo", "bad", "baz" ], markIdentifier: false }
			);
		expect( thrower ).toThrow(
			/Invalid non-numeric array index "bad" .* \.foo .*foo\.bad\.baz/
		);
	} );

	describe( "Handle difficult characters", ( ) =>
	{

		it( "dot style", ( ) =>
		{
			const dotPath = ".foo['baz']['bak']..bam.'bar'['bob'].bee";
			const obj =
				'{"foo":{"baz":{"bak":{"":{"bam":{"bar":{"bob":"bee"}}}}}}}';

			const parsed = getAstByString( obj );

			const loc = getLocation( parsed, { dotPath } );

			expect( loc ).toStrictEqual( {
				start: {
					column: 47,
					line: 1,
					offset: 46,
				},
				end: {
					column: 52,
					line: 1,
					offset: 51,
				},
			} );
		} );

		it( "json-pointer style", ( ) =>
		{
			const pointerPath = "/foo/a\"b'c~1d~0e[f]g//bar";
			const obj = { "foo": { "a\"b'c/d~e[f]g": { "": "bar" } } };

			const parsed = getAstByObject( obj );

			const loc = getLocation( parsed, { pointerPath } );

			expect( loc ).toStrictEqual( {
				start: {
					column: 17,
					line: 4,
					offset: 59,
				},
				end: {
					column: 22,
					line: 4,
					offset: 64,
				},
			} );
		} );
	} );
} );
