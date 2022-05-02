import type { CstNode, CstTokenRange } from 'json-cst'

import type { ParsedJson } from './parse.js'
import { LocationOptionsPath, parsePath } from './path.js'
import { getPosition, Position } from './position.js'


export type LocationOptions =
	& LocationOptionsPath
	& {
		markIdentifier?: boolean;
	};

export interface Location
{
	start: Position | undefined;
	end: Position | undefined;
}

export function getLocation(
	parsedJson: ParsedJson,
	options: LocationOptions
): Location
{
	const { jsonDoc, jsonString } = parsedJson;
	const { markIdentifier = false } = options;

	const path = parsePath( options ).map( val => `${val}` );

	if ( !jsonDoc )
	{
		// Minic null but undefined
		if ( path.length === 0 )
			// Found as root value
			return {
				start: { offset: 0, line: 1, column: 1 },
				end: { offset: 9, line: 1, column: 10 },
			};
		// Not found
		throw new Error( `No such path in undefined` );
	}

	const pathAsString = ( ) => path.join( '.' );
	const getParentPath = ( index: number ) =>
		'.' + path.slice( 0, index ).join( '.' );
	const explainWhere = ( index: number ) =>
		`${getParentPath( index )} [query: ${pathAsString( )}]`;

	const foundNode = path
		.reduce( ( node: CstNode, pathItem, index ) =>
			node?.kind === 'object'
			? ( ( ) =>
				{
					const child = node.children.find( child =>
						child.keyToken.value === pathItem
					);
					if ( !child )
					{
						throw new Error(
							`No such property ${pathItem} in ` +
							`${explainWhere( index )}`
						);
					}

					return markIdentifier && index === path.length - 1
						? child
						: child.valueNode;
				} )( )
			: node?.kind === 'array'
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
					return node.children[ Number( pathItem ) ]!.valueNode;
				} )( )
			: ( ( ) =>
				{
					throw new Error(
						`No such property ${pathItem} in ` +
						`${explainWhere( index )}`
					);
				} )( )
		, jsonDoc.root
	);

	const range: CstTokenRange =
		foundNode.kind === 'object-property'
		? {
			start: foundNode.keyToken.offset,
			end: foundNode.keyToken.offset + foundNode.keyToken.raw.length,
		}
		: foundNode.range

	return {
		start: getPosition( jsonString, range.start ),
		end: getPosition( jsonString, range.end ),
	};
}
