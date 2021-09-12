import type { ParsedJson } from './parse'
import { getAstByObject, getAstByString } from './parse'

import type {
	Position,
	LocationPath,
	Location,
	LocationOptions,
} from './location'
import { getLocation } from './location'


export type { ParsedJson }
export { getAstByObject, getAstByString }

export type {
	Position,
	LocationPath,
	Location,
	LocationOptions,
}
export { getLocation }


export function jsonpos( json: string, options: LocationOptions ): Location
{
	return getLocation(
		typeof json === 'string'
			? getAstByString( json )
			: getAstByObject( json ),
		options
	);
}
