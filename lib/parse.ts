import parse, { type LiteralNode } from 'json-to-ast'


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
	const jsonString = JSON.stringify( json ?? null, null, indent );
	const ret = getAstByString( jsonString );

	// When we get undefined as input, mimic null behavior
	if ( json === undefined )
	{
		const jsonAST = ret.jsonAST as LiteralNode;
		// istanbul ignore next
		if ( jsonAST.loc?.end )
		{
			jsonAST.loc.end.column += 5;
			jsonAST.loc.end.offset += 5;
			jsonAST.loc.source = undefined as any as null;
		}
		jsonAST.value = undefined as any as null;
		jsonAST.raw = 'undefined';
		ret.jsonString = 'undefined';
		ret.json = undefined;
	}

	return ret;
}
