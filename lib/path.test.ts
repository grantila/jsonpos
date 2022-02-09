import { parsePath } from "./path.js"


describe( "path", ( ) =>
{
	it( "bad arg", ( ) =>
	{
		expect( ( ) => parsePath( { } as any ) ).toThrow( );
	} );

	it( "array path", ( ) =>
	{
		const path = [ "foo", "bar" ];

		expect( parsePath( { path } ) ).toStrictEqual( path );
	} );

	describe( "dot form", ( ) =>
	{
		it( "bail on not starting with dot", ( ) =>
		{
			const dotPath = "foo.bar";

			expect( ( ) => parsePath( { dotPath } ) )
				.toThrowError( SyntaxError );
		} );

		it( "simple", ( ) =>
		{
			const dotPath = ".foo.bar";

			expect( parsePath( { dotPath } ) )
				.toStrictEqual( [ "foo", "bar" ] );
		} );

		it( "only single-quote", ( ) =>
		{
			const dotPath = ".foo.'bar'";

			expect( parsePath( { dotPath } ) )
				.toStrictEqual( [ "foo", "bar" ] );
		} );

		it( "invalid single-quote", ( ) =>
		{
			const dotPath = ".foo.'bar";

			expect( ( ) => parsePath( { dotPath } ) ).toThrow( );
		} );

		it( "only bracket", ( ) =>
		{
			const dotPath = ".foo['baz']['bak'].bee";

			expect( parsePath( { dotPath } ) )
				.toStrictEqual( [ "foo", "baz", "bak", "bee" ] );
		} );

		it( "invalid opening bracket", ( ) =>
		{
			const dotPath = ".foo[baz]";

			expect( ( ) => parsePath( { dotPath } ) ).toThrow( );
		} );

		it( "invalid closing bracket", ( ) =>
		{
			const dotPath = ".foo['baz'";

			expect( ( ) => parsePath( { dotPath } ) ).toThrow( );
		} );

		it( "complex with all", ( ) =>
		{
			const dotPath = ".foo['baz']['bak']..bam.'bar'['bob'].bee";
			const arr =
				[ "foo", "baz", "bak", "", "bam", "bar", "bob", "bee" ];

			expect( parsePath( { dotPath } ) ).toStrictEqual( arr );
		} );
	} );

	describe( "json-pointer form", ( ) =>
	{
		it( "bail on not starting with /", ( ) =>
		{
			const pointerPath = "foo/bar";

			expect( ( ) => parsePath( { pointerPath } ) )
				.toThrowError( SyntaxError );
		} );

		it( "empty string middle prop", ( ) =>
		{
			const pointerPath = "/foo//bar";
			const path = [ "foo", "", "bar" ];

			expect( parsePath( { pointerPath } ) ).toStrictEqual( path );
		} );

		it( "empty string last prop", ( ) =>
		{
			const pointerPath = "/foo/bar/";
			const path = [ "foo", "bar", "" ];

			expect( parsePath( { pointerPath } ) ).toStrictEqual( path );
		} );

		it( "encoding", ( ) =>
		{
			const pointerPath = "/foo/a\"b'c~1d~0e[f]g//bar";
			const path = [ "foo", "a\"b'c/d~e[f]g", "", "bar" ];

			expect( parsePath( { pointerPath } ) ).toStrictEqual( path );
		} );
	} );
} );
