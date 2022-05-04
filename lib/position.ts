export interface Position
{
	line: number;
	column: number;
	offset: number;
}

export function countCharUntil( text: string, end: number, char: string )
: { count: number; lastPos: number; }
{
	let count = 0;
	let lastPos = 0;
	let i = 0;

	for ( ; i < end; )
	{
		const found = text.indexOf( char, i );

		if ( found === -1 || found >= end )
			break;

		i = found + 1;

		if ( i < end )
		{
			++count;
			lastPos = found;
		}
	}

	return { count, lastPos };
}

export function getPosition( text: string, pos: number ): Position
{
	// Clamp to text range
	pos = Math.min( Math.max( pos, 0 ), text.length );

	const { count, lastPos } = countCharUntil( text, pos + 1, '\n' );

	const newlines = count;

	return {
		offset: pos,
		line: newlines + 1,
		column: Math.max( 1, pos - lastPos + ( count === 0 ? 1 : 0 ) ),
	};
}
