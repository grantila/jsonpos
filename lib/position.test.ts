import { countCharUntil, getPosition } from './position.js'


describe( "position", ( ) =>
{
	it( "char -1/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', -1 );

		expect( parsed ).toStrictEqual( {
			line: 1,
			column: 1,
			offset: 0,
		} );
	} );

	it( "char 0/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 0 );

		expect( parsed ).toStrictEqual( {
			line: 1,
			column: 1,
			offset: 0,
		} );
	} );

	it( "char 1/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 1 );

		expect( parsed ).toStrictEqual( {
			line: 1,
			column: 2,
			offset: 1,
		} );
	} );

	it( "char 2/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 2 );

		expect( parsed ).toStrictEqual( {
			line: 1,
			column: 3,
			offset: 2,
		} );
	} );

	it( "char 3/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 3 );

		expect( parsed ).toStrictEqual( {
			line: 2,
			column: 1,
			offset: 3,
		} );
	} );

	it( "char 4/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 4 );

		expect( parsed ).toStrictEqual( {
			line: 2,
			column: 2,
			offset: 4,
		} );
	} );

	it( "char 5/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 5 );

		expect( parsed ).toStrictEqual( {
			line: 2,
			column: 3,
			offset: 5,
		} );
	} );

	it( "char 6/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 6 );

		expect( parsed ).toStrictEqual( {
			line: 2,
			column: 4,
			offset: 6,
		} );
	} );

	it( "char 7/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 7 );

		expect( parsed ).toStrictEqual( {
			line: 3,
			column: 1,
			offset: 7,
		} );
	} );

	it( "char 8/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 8 );

		expect( parsed ).toStrictEqual( {
			line: 3,
			column: 2,
			offset: 8,
		} );
	} );

	it( "char 9/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 9 );

		expect( parsed ).toStrictEqual( {
			line: 3,
			column: 3,
			offset: 9,
		} );
	} );

	it( "char 10/10", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh', 10 );

		expect( parsed ).toStrictEqual( {
			line: 3,
			column: 4,
			offset: 10,
		} );
	} );

	it( "last char is newline", ( ) =>
	{
		const input = 'ab\ncde\nfgh\n';

		const count = countCharUntil( input, 11, '\n' );
		const parsed = getPosition( input, 10 );

		expect( count ).toStrictEqual( {
			count: 2,
			lastPos: 6,
		} );
		expect( parsed ).toStrictEqual( {
			line: 3,
			column: 4,
			offset: 10,
		} );
	} );

	it( "last char is newline after newline", ( ) =>
	{
		const input = 'ab\ncde\nfgh\n\n';

		const count = countCharUntil( input, 12, '\n' );
		const parsed = getPosition( input, 11 );

		expect( count ).toStrictEqual( {
			count: 3,
			lastPos: 10,
		} );
		expect( parsed ).toStrictEqual( {
			line: 4,
			column: 1,
			offset: 11,
		} );
	} );

	it( "last char is newline after newline after newline", ( ) =>
	{
		const parsed = getPosition( 'ab\ncde\nfgh\n\n\n', 12 );

		expect( parsed ).toStrictEqual( {
			line: 5,
			column: 1,
			offset: 12,
		} );
	} );
} );
