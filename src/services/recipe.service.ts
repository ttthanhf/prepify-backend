import { MultipartFile } from '@fastify/multipart';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { Recipe } from '~models/entities/recipe.entity';
import ResponseModel from '~models/responses/response.model';
import recipeSchemasModel from '~models/schemas/recipe.schemas.model';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import objectUtil from '~utils/object.util';

import s3Util from '~utils/s3.util';
import stringUtil from '~utils/string.util';
import validateUtil from '~utils/validate.util';

class RecipeService {
	async createRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const recipeObj = {} as Recipe;
		const files: Array<MultipartFile> = [];
		const response = new ResponseModel(res);

		for await (const part of req.parts()) {
			if (part.type == 'field') {
				objectUtil.setProperty(
					recipeObj,
					part.fieldname as keyof Recipe,
					stringUtil.tryParseStringToJSON(String(part.value))
				);
			} else if (part.type == 'file') {
				if (part.fieldname == 'images') {
					if (part.mimetype.startsWith('image/')) {
						files.push(part);
					} else {
						response.message = 'Images have some file not image';
						response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
						return response.send();
					}
				}
			}
		}

		const newRecipe = new Recipe();
		objectUtil.mapObjToEntity(newRecipe, recipeObj);

		validateUtil.validate(
			res,
			recipeSchemasModel.recipeCreateObj.valueOf(),
			recipeObj
		);

		await recipeRepository.createNewRecipe(newRecipe);
		for (const file of files) {
			await s3Util.uploadImage({
				data: await file.toBuffer(),
				name:
					'recipe-' +
					String(newRecipe.id) +
					'-' +
					String(Date.now()) +
					'-' +
					String(Math.floor(Math.random() * 900) + 100) +
					'.-'
			});
		}

		return response.send();
	}
}

export default new RecipeService();
