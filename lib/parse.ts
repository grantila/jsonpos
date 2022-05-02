import { parse, type CstDocument } from 'json-cst'


export interface ParsedJson
{
	json: any;
	jsonString: string;
	jsonDoc: CstDocument | undefined;
}

export function getParsedByString( jsonString: string, json?: any ): ParsedJson
{
	const jsonDoc = parse( jsonString );

	return {
		json: json || JSON.parse( jsonString ),
		jsonString,
		jsonDoc,
	};
}

export function getParsedByObject( json: any, indent = 4 ): ParsedJson
{
	const jsonString = JSON.stringify( json ?? null, null, indent );
	const ret = getParsedByString( jsonString );

	// When we get undefined as input, mimic null behavior
	if ( json === undefined )
	{
		ret.json = undefined;
		ret.jsonString = 'undefined';
		ret.jsonDoc = undefined;
	}

	return ret;
}
