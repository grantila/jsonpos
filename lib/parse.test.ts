import { getAstByObject, getAstByString } from './parse'

describe( "parse", ( ) =>
{
	it( "getAstByObject", ( ) =>
	{
		const json = { foo: "bar" };
		expect(
			getAstByObject( json )
		).toStrictEqual( {
			json,
			jsonString: '{\n    "foo": "bar"\n}',
			jsonAST: {
				type: 'Object',
				children: expect.anything(),
				loc: expect.objectContaining( { source: null } ),
			},
		} );
	} );

	it( "getAstByObject", ( ) =>
	{
		const str = '{\n    "foo": {\n        "bar": "baz"\n    }\n}';
		expect(
			getAstByObject( { foo: { bar: "baz" } } )
		).toStrictEqual(
			getAstByString( str )
		);
	} );

	it( "getAstByObject null", ( ) =>
	{
		const { json, jsonString, jsonAST } = getAstByObject( null );
		expect( json ).toBe( null );
		expect( jsonString ).toBe( 'null' );
		expect( jsonAST ).toMatchObject( {
			loc: {
				end: {
					column: 5,
					line: 1,
					offset: 4,
				},
				source: null,
				start: {
					column: 1,
					line: 1,
					offset: 0,
				},
			},
			raw: 'null',
			type: 'Literal',
			value: null,
		} );
	} );

	it( "getAstByObject undefined", ( ) =>
	{
		const { json, jsonString, jsonAST } = getAstByObject( undefined );
		expect( json ).toBe( undefined );
		expect( jsonString ).toBe( 'undefined' );
		expect( jsonAST ).toMatchObject( {
			loc: {
				end: {
					column: 10,
					line: 1,
					offset: 9,
				},
				source: undefined,
				start: {
					column: 1,
					line: 1,
					offset: 0,
				},
			},
			raw: 'undefined',
			type: 'Literal',
			value: undefined,
		} );
	} );

	it( "getAstByObject with custom indent", ( ) =>
	{
		const str = '{\n  "foo": {\n    "bar": "baz"\n  }\n}';
		expect(
			getAstByObject( { foo: { bar: "baz" } }, 2 )
		).toStrictEqual(
			getAstByString( str )
		);
	} );
} );
