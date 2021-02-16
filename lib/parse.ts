import * as parse from 'json-to-ast'


export interface ParsedJson
{
	json: any;
	jsonString: string;
	jsonAST: unknown;
}

export function getAstByString( jsonString: string, json?: any ): ParsedJson
{
	const jsonAST = parse( jsonString, { loc: true } );
	return {
		json: json || JSON.parse( jsonString ),
		jsonString,
		jsonAST,
	};
}

export function getAstByObject( json: any, indent = 4 ): ParsedJson
{
	const jsonString = JSON.stringify( json, null, indent );
	return getAstByString( jsonString );
}
