import { getParsedByObject, getParsedByString } from './parse'

describe( "parse", ( ) =>
{
	it( "getParsedByObject", ( ) =>
	{
		const json = { foo: "bar" };
		expect(
			getParsedByObject( json )
		).toMatchObject( {
			json,
			jsonString: '{\n    "foo": "bar"\n}',
			jsonDoc: expect.objectContaining( {
				root: expect.objectContaining( { kind: 'object' } ),
			} ),
		} );
	} );

	it( "getParsedByObject", ( ) =>
	{
		const str = '{\n    "foo": {\n        "bar": "baz"\n    }\n}';
		expect(
			getParsedByObject( { foo: { bar: "baz" } } )
		).toStrictEqual(
			getParsedByString( str )
		);
	} );

	it( "getParsedByObject null", ( ) =>
	{
		const { json, jsonString, jsonDoc } = getParsedByObject( null );
		expect( json ).toBe( null );
		expect( jsonString ).toBe( 'null' );
		expect( jsonDoc ).toMatchObject( {
			root: expect.objectContaining( { kind: 'literal' } ),
		} );
	} );

	it( "getParsedByObject undefined", ( ) =>
	{
		const { json, jsonString, jsonDoc } = getParsedByObject( undefined );
		expect( json ).toBe( undefined );
		expect( jsonString ).toBe( 'undefined' );
		expect( jsonDoc ).toBeUndefined( );
	} );

	it( "getParsedByObject with custom indent", ( ) =>
	{
		const str = '{\n  "foo": {\n    "bar": "baz"\n  }\n}';
		expect(
			getParsedByObject( { foo: { bar: "baz" } }, 2 )
		).toStrictEqual(
			getParsedByString( str )
		);
	} );
} );
