import { MultipartFile } from '@fastify/multipart';
import { FilterQuery } from '@mikro-orm/core';
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

		validateUtil.validate(
			res,
			recipeSchemasModel.recipeCreateObj.valueOf(),
			recipeObj
		);

		objectUtil.mapObjToEntity(newRecipe, recipeObj);

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

	async updateRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const { recipe_id }: any = req.params as Object;
		const recipeObj = {} as Recipe;

		const recipe = await recipeRepository.findOneRecipe({
			id: recipe_id
		});

		const response = new ResponseModel(res);
		if (!recipe) {
			response.message = 'Recipe not found';
			response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
			return response.send();
		}

		for await (const part of req.parts()) {
			if (part.type == 'field') {
				objectUtil.setProperty(
					recipeObj,
					part.fieldname as keyof Recipe,
					stringUtil.tryParseStringToJSON(String(part.value))
				);
			}
		}

		validateUtil.validate(
			res,
			recipeSchemasModel.recipeUpdateObj.valueOf(),
			recipeObj
		);

		objectUtil.mapObjToEntity(recipe, recipeObj);

		await recipeRepository.updateRecipe(recipe);

		return response.send();
	}

	async getRecipeHandle(req: FastifyRequest, res: FastifyResponse) {
		const query = req.query as FilterQuery<Recipe>;

		let recipe: any;
		if (query) {
			try {
				recipe = await recipeRepository.findRecipe(
					JSON.parse(JSON.stringify(query))
				);
			} catch (error) {
				recipe = await recipeRepository.findAllRecipe();
			}
		} else {
			recipe = await recipeRepository.findAllRecipe();
		}

		const response = new ResponseModel(res);
		response.data = recipe;
		return response.send();
	}
}

export default new RecipeService();
