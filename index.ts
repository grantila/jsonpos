import type { ParsedJson } from './lib/parse'
import { getAstByObject, getAstByString } from './lib/parse'

import type {
	Position,
	LocationPath,
	Location,
	LocationOptions,
} from './lib/location'
import { getLocation } from './lib/location'


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
