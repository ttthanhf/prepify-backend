import S from 'fluent-json-schema';

const ingredientSchemaObj = S.object()
	.prop('id', S.string())
	.prop('name', S.string())
	.prop('category', S.string())
	.prop('price', S.string());

export default {
	ingredientSchemaObj
};
