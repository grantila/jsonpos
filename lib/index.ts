import type { ParsedJson } from './parse.js'
import { getAstByObject, getAstByString } from './parse.js'

import type {
	Position,
	LocationPath,
	Location,
	LocationOptions,
} from './location.js'
import { getLocation } from './location.js'


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
