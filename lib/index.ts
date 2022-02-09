import type { ParsedJson } from './parse.js'
import { getAstByObject, getAstByString } from './parse.js'

import type {
	LocationOptionsPath,
	LocationPath,
} from './path.js'
import { parsePath } from './path.js'

import type {
	Position,
	Location,
	LocationOptions,
} from './location.js'
import { getLocation } from './location.js'


export type { ParsedJson }
export { getAstByObject, getAstByString }

export type { LocationOptionsPath, LocationPath }
export { parsePath }

export type { Position, Location, LocationOptions }
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
