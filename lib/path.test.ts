import {
	parsePath,
	encodeJsonPointerPath,
	encodeJsonPointerSegment,
} from "./path.js"


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

		it( "root", ( ) =>
		{
			const dotPath = ".";
			const path = [ ] as string[ ];

			expect( parsePath( { dotPath } ) ).toStrictEqual( path );
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

		it( "begin closing bracket", ( ) =>
		{
			const dotPath = "['foo']['baz'].bar";

			expect( parsePath( { dotPath } ) )
				.toStrictEqual( [ "foo", "baz", "bar" ] );
		} );

		it( "complex with all", ( ) =>
		{
			const dotPath = ".foo['baz']['bak']..bam.'bar'['bob'].bee";
			const arr =
				[ "foo", "baz", "bak", "", "bam", "bar", "bob", "bee" ];

			expect( parsePath( { dotPath } ) ).toStrictEqual( arr );
		} );

		it( "bracket with number", ( ) =>
		{
			const dotPath = ".foo['baz'][2].bee";

			expect( parsePath( { dotPath } ) )
				.toStrictEqual( [ "foo", "baz", "2", "bee" ] );
		} );

		it( "bracket with number, invalid", ( ) =>
		{
			const dotPath = ".foo['baz'][2";

			expect( ( ) => parsePath( { dotPath } ) ).toThrow( );
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

		it( "root", ( ) =>
		{
			const pointerPath = "/";
			const path = [ ] as string[ ];

			expect( parsePath( { pointerPath } ) ).toStrictEqual( path );
		} );

		it( "encoding", ( ) =>
		{
			const pointerPath = "/foo/a\"b'c~1d~0e[f]g//bar";
			const path = [ "foo", "a\"b'c/d~e[f]g", "", "bar" ];

			expect( parsePath( { pointerPath } ) ).toStrictEqual( path );
		} );

		it( "encodeJsonPointerPath empty", ( ) =>
		{
			expect( encodeJsonPointerPath( [ ] ) ).toBe( "/" );
		} );

		it( "encodeJsonPointerPath strings and numbers", ( ) =>
		{
			expect( encodeJsonPointerPath( [ "fo/o", 1 ] ) ).toBe( "/fo~1o/1" );
		} );

		it( "encodeJsonPointerSegment simple string", ( ) =>
		{
			expect( encodeJsonPointerSegment( "foo" ) ).toBe( "foo" );
		} );

		it( "encodeJsonPointerSegment simple string", ( ) =>
		{
			expect( encodeJsonPointerSegment( "foo" ) ).toBe( "foo" );
		} );

		it( "encodeJsonPointerSegment string with /", ( ) =>
		{
			expect( encodeJsonPointerSegment( "f/o/o" ) ).toBe( "f~1o~1o" );
		} );

		it( "encodeJsonPointerSegment number", ( ) =>
		{
			expect( encodeJsonPointerSegment( 2 ) ).toBe( "2" );
		} );
	} );
} );
