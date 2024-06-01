import S from 'fluent-json-schema';

const foodStyleSchemaObj = S.object()
	.prop('id', S.string())
	.prop('name', S.string())
	.prop('type', S.string());

export default {
	foodStyleSchemaObj
};
