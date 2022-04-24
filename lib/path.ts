export type LocationPath = Array< number | string >;

export type LocationPathAsPath =
	{
		path: LocationPath;
		dotPath?: undefined;
		pointerPath?: undefined;
	};

export type LocationPathAsDotPath =
	{
		path?: undefined;
		dotPath: string;
		pointerPath?: undefined;
	};

export type LocationPathAsPointerPath =
	{
		path?: undefined;
		dotPath?: undefined;
		pointerPath: string;
	};

export type LocationOptionsPath =
	| LocationPathAsPath
	| LocationPathAsDotPath
	| LocationPathAsPointerPath;

export function parsePath( path: LocationOptionsPath ): LocationPath
{
	const pathAsPath = path as LocationPathAsPath;
	const pathAsDotPath = path as LocationPathAsDotPath;
	const pathAsPointerPath = path as LocationPathAsPointerPath;

	if ( pathAsPath.path && Array.isArray( pathAsPath.path ) )
		return pathAsPath.path;

	else if ( typeof pathAsDotPath.dotPath === 'string' )
		return parseDotPath( pathAsDotPath.dotPath );

	else if ( typeof pathAsPointerPath.pointerPath === 'string' )
		return parseJsonPointerPath( pathAsPointerPath.pointerPath );

	throw new TypeError( `parsePath(): Missing path argument` );
}

function parseDotPath( path: string ): LocationPath
{
	if ( !path.startsWith( '.' ) && !path.startsWith( '[' ) )
		throw new SyntaxError(
			'parsePath(): Invalid dot-path, must begin with "." or "[": ' +
			`${path}`
		);

	const bail = ( ): never =>
	{
		throw new Error( `parsePath(): Invalid dot-path: ${path}` );
	}

	const ret: LocationPath = [ ];

	const nearest = ( a: number, b: number ) =>
			a === -1 && b === -1 ? -1
			: a === -1 ? b
			: b === -1 ? a
			: a < b ? a : b;

	let pos = 0;
	while ( pos !== -1 && pos < path.length )
	{
		if ( path.charAt( pos ) === '.' )
		{
			if ( path.charAt( pos + 1 ) === "'" )
			{
				const lastPos = path.indexOf( "'", pos + 2 );
				if ( lastPos === -1 )
					bail( );

				ret.push( path.slice( pos + 2, lastPos ) );
				pos = lastPos + 1;
			}
			else
			{
				const posOfDot = path.indexOf( '.', pos + 1 );
				const posOfBracket = path.indexOf( '[', pos + 1 );

				const lastPos = nearest( posOfDot, posOfBracket );

				ret.push(
					lastPos === -1
					? path.slice( pos + 1 )
					: path.slice( pos + 1, lastPos )
				);
				pos = lastPos;
			}
		}
		else // ['segment name'] or [number] form
		{
			if ( path.charAt( pos + 1 ).match( /[0-9]/ ) )
			{
				const lastPos = path.indexOf( "]", pos + 1 );
				if ( lastPos === -1 )
					bail( );

				ret.push( path.slice( pos + 1, lastPos ) );
				pos = lastPos + 1;
			}
			else
			{
				if ( path.charAt( pos + 1 ) !== "'" )
					bail( );

				const lastPos = path.indexOf( "']", pos + 2 );
				if ( lastPos === -1 )
					bail( );

				ret.push( path.slice( pos + 2, lastPos ) );
				pos = lastPos + 2;
			}
		}
	}

	return ret;
}

export function parseJsonPointerPath( path: string ): Array< string >
{
	if ( !path.startsWith( '/' ) )
		throw new SyntaxError(
			`parsePath(): Invalid pointer-path, must begin with "/": ${path}`
		);

	return path
		.slice( 1 )
		.split( '/' )
		.map( segment => parseJsonPointerSegment( segment ) );
}

export function parseJsonPointerSegment( segment: string ): string
{
	return segment.replace( /~1/g, '/' ).replace( /~0/g, '~' );
}

export function encodeJsonPointerPath( path: Array< string | number > ): string
{
	return '/' + path
		.map( segment => encodeJsonPointerSegment( segment ) )
		.join( '/' );
}

export function encodeJsonPointerSegment( segment: string | number ): string
{
	return `${segment}`.replace( /~/g, '~0' ).replace( /\//g, '~1' );
}
