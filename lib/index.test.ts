import * as index from "./index.js"


const { jsonpos } = index;

describe( "index", ( ) =>
{
	it( "jsonpos by string", ( ) =>
	{
		const res = jsonpos( '{"foo": "bar"}', { dotPath: '.foo' } );
		expect( res ).toStrictEqual( {
			start: { line: 1, column: 9, offset: 8 },
			end: { line: 1, column: 14, offset: 13 },
		} );
	} );

	it( "jsonpos by string", ( ) =>
	{
		const res = jsonpos( { "foo": "bar" } as any, { dotPath: '.foo' } );
		expect( res ).toStrictEqual( {
			start: { line: 2, column: 12, offset: 13 },
			end: { line: 2, column: 17, offset: 18 },
		} );
	} );

	it( "exports everything", ( ) =>
	{
		expect( index ).toMatchObject( {
			getParsedByObject: expect.any( Function ),
			getParsedByString: expect.any( Function ),
			getLocation: expect.any( Function ),
			jsonpos: expect.any( Function ),
		} );
	} );
} );
