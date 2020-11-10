import * as parse from 'json-to-ast'


export interface ParsedJson
{
	json: any;
	jsonString: string;
	jsonAST: parse.ValueNode;
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

export function getAstByObject( json: any ): ParsedJson
{
	const jsonString = JSON.stringify( json, null, 4 );
	return getAstByString( jsonString );
}
