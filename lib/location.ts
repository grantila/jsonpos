import type { ValueNode, IdentifierNode } from 'json-to-ast'

import type { ParsedJson } from './parse.js'


export type LocationPath = Array< number | string >;

export interface LocationOptions {
	dataPath: string | LocationPath;
	markIdentifier?: boolean;
}

export interface Position
{
	line: number;
	column: number;
	offset: number;
}

export interface Location
{
	start: Position | undefined;
	end: Position | undefined;
}

export function getLocation(
	parsedJson: ParsedJson,
	{ dataPath, markIdentifier = false }: LocationOptions
): Location
{
	const { jsonAST } = parsedJson;

	const path =
		Array.isArray( dataPath )
		? dataPath
		:
			(
				dataPath.startsWith( '.' )
				? dataPath.slice( 1 )
				: dataPath
			)
			.split( '.' )
			.filter( val => val );

	const pathAsString = ( ) => path.join( '.' );
	const getParentPath = ( index: number ) =>
		'.' + path.slice( 0, index ).join( '.' );
	const explainWhere = ( index: number ) =>
		`${getParentPath( index )} [query: ${pathAsString( )}]`;

	const { loc } = path
		.reduce( ( node: ValueNode | IdentifierNode, pathItem, index ) =>
			node.type === 'Object'
			? ( ( ) =>
				{
					const child = node.children.find( child =>
						child.key.value === pathItem
					);
					if ( !child )
					{
						throw new Error(
							`No such property ${pathItem} in ` +
							`${explainWhere( index )}`
						);
					}
					const { key, value } = child;
					return markIdentifier && index === path.length - 1
						? key
						: value;
				} )( )
			// istanbul ignore next
			: node.type === 'Array'
			? ( ( ) =>
				{
					const itemIndex = Number( pathItem );
					if ( isNaN( itemIndex ) )
					{
						throw new Error(
							`Invalid non-numeric array index "${pathItem}" ` +
							`in array at ${explainWhere( index )}`
						);
					}
					else if (
						itemIndex < 0 || itemIndex >= node.children.length
					)
					{
						throw new RangeError(
							`Index ${itemIndex} out-of-bounds in array of ` +
							`size ${node.children.length} at ` +
							`${explainWhere( index )}`
						);
					}
					node.children
					return node.children[ Number( pathItem ) ];
				} )( )
			: node
		, jsonAST as ValueNode
	);

	// istanbul ignore next
	return { start: loc?.start, end: loc?.end };
}
