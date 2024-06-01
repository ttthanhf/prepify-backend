import S from 'fluent-json-schema';
import { FastifySchema } from 'fastify/types/schema';

const recipeCreateObj = S.object()
	.prop('name', S.string().required())
	.prop(
		'ingredients',
		S.array()
			.items(
				S.object()
					.prop('ingredient_id', S.number().required())
					.prop('amount', S.number().required())
					.prop('unit_id', S.number().required())
			)
			.required()
	)
	.prop('category', S.number().required())
	.prop('foodStyle', S.array().items(S.number()).required())
	.prop('steps', S.string().required())
	.prop(
		'nutrition',
		S.array()
			.items(
				S.object()
					.prop('nutrition_id', S.number().required())
					.prop('amount', S.number().required())
					.prop('unit_id', S.number().required())
			)
			.required()
	)
	.prop('images', S.array().items(S.string()))
	.prop('time', S.number().required().description('Time cook'))
	.prop('video', S.string().description('URL youtube'))
	.prop('level', S.string().required());

const recipeCreateSchema: FastifySchema = {
	body: recipeCreateObj.valueOf()
};

export default {
	recipeCreateSchema,
	recipeCreateObj
};
