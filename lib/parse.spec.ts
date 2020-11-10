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
} );
