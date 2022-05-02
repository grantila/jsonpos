import type { ParsedJson } from './parse.js'
import { getParsedByObject, getParsedByString } from './parse.js'

import type {
	LocationOptionsPath,
	LocationPath,
} from './path.js'
import { parsePath } from './path.js'

import type {
	Location,
	LocationOptions,
} from './location.js'
import { getLocation } from './location.js'

import type {
	Position,
} from './position.js'
import { getPosition } from './position.js'


export type { ParsedJson }
export { getParsedByObject, getParsedByString }

export type { LocationOptionsPath, LocationPath }
export { parsePath }

export type { Location, LocationOptions }
export { getLocation }

export type { Position }
export { getPosition }

export function jsonpos( json: string, options: LocationOptions ): Location
{
	return getLocation(
		typeof json === 'string'
			? getParsedByString( json )
			: getParsedByObject( json ),
		options
	);
}

export {
	parseJsonPointerPath,
	parseJsonPointerSegment,
	encodeJsonPointerPath,
	encodeJsonPointerSegment,
} from './path.js'
