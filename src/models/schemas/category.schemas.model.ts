import S from 'fluent-json-schema';

const categorySchemaObj = S.object()
	.prop('id', S.string())
	.prop('name', S.string());

export default {
	categorySchemaObj
};
