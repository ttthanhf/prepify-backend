import { Between, In } from 'typeorm';
import { DEFAULT_IMAGE } from '~constants/default.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderStatus } from '~constants/orderstatus.constant';
import { Feedback } from '~models/entities/feedback.entity';
import {
	FeedbackReponse,
	FeedbackType,
	RatingType
} from '~models/responses/feedback.response.model';
import ResponseModel from '~models/responses/response.model';
import {
	FeedbackCreateRequest,
	FeedbackGetRequest
} from '~models/schemas/feedback.schemas.model';
import feedbackRepository from '~repositories/feedback.repository';
import imageRepository from '~repositories/image.repository';
import mealKitRepository from '~repositories/mealKit.repository';
import orderRepository from '~repositories/order.repository';
import orderDetailRepository from '~repositories/orderDetail.repository';
import recipeRepository from '~repositories/recipe.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';
import userUtil from '~utils/user.util';

class FeedbackService {
	async createFeedbackHandle(req: FastifyRequest, res: FastifyResponse) {
		const customer = await userUtil.getCustomerByTokenInHeader(req.headers);
		const query: FeedbackCreateRequest = req.body as FeedbackCreateRequest;
		const response = new ResponseModel(res);

		const itemResponse: Array<{
			index: number;
			id: string;
		}> = [];
		let hasFeedback = false;
		for (const item of query) {
			const orderDetail = await orderDetailRepository.findOne({
				where: {
					id: item.orderDetailId,
					customer: {
						id: customer!.id
					}
				},
				relations: ['order', 'customer', 'mealKit', 'feedback']
			});

			if (!orderDetail) {
				response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
				return response.send();
			}

			if (orderDetail.order.status == OrderStatus.DELIVERED) {
				const newFeedback = mapperUtil.mapEntityToClass(item, Feedback);
				newFeedback.orderDetail = orderDetail;
				newFeedback.createdAt = new Date();
				const feedback = await feedbackRepository.create(newFeedback);

				itemResponse.push({
					index: itemResponse.length + 1,
					id: feedback.id
				});

				const feedbacks = await feedbackRepository.find({
					where: {
						orderDetail: {
							mealKit: {
								id: orderDetail.mealKit.id
							}
						}
					}
				});

				const mealKit = await mealKitRepository.findOneBy({
					id: orderDetail.mealKit.id
				});
				let totalStarMealKit = 0;
				feedbacks.forEach((feedback) => {
					totalStarMealKit += feedback.rating;
				});
				mealKit!.rating = feedbacks.length
					? totalStarMealKit / feedbacks.length
					: 0;
				await mealKitRepository.update(mealKit!);

				const recipe = await recipeRepository.findOneBy({
					mealKits: {
						id: orderDetail.mealKit.id
					}
				});
				recipe!.totalFeedback = feedbacks.length;
				let totalStar = 0;
				feedbacks.forEach((feedback) => {
					totalStar += feedback.rating;
				});
				recipe!.rating = feedbacks.length ? totalStar / feedbacks.length : 0;
				await recipeRepository.update(recipe!);

				if (!hasFeedback) {
					const order = await orderRepository.findOne({
						where: {
							id: orderDetail.order.id
						}
					});
					if (order) {
						order.hasFeedback = true;
						hasFeedback = true;
						await orderRepository.update(order);
					}
				}
			} else {
				response.message = 'Some feedback not create correctly';
				response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
				return response.send();
			}
		}

		response.data = itemResponse;
		return response.send();
	}

	async getFeedbackByRecipeSlugHandle(
		req: FastifyRequest,
		res: FastifyResponse
	) {
		const { recipe_slug }: any = req.params;
		const query: FeedbackGetRequest = req.query as FeedbackGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 9 && query.pageSize > 0
				? query.pageSize
				: 9;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const recipe = await recipeRepository.findOne({
			where: {
				slug: recipe_slug
			},
			relations: ['mealKits']
		});

		const [allfeedbacks, _] = await feedbackRepository.findAndCount({
			where: {
				orderDetail: {
					mealKit: {
						id: In(recipe!.mealKits.map((item) => item.id))
					}
				}
			}
		});

		const [feedbacks, itemTotal] = await feedbackRepository.findAndCount({
			where: {
				orderDetail: {
					mealKit: {
						id: In(recipe!.mealKits.map((item) => item.id))
					}
				},
				...(query.rating !== undefined &&
					query.rating !== null && {
						rating: Between(query.rating, query.rating + 0.9)
					})
			},
			relations: [
				'orderDetail',
				'orderDetail.customer',
				'orderDetail.customer.user'
			],
			order: {
				createdAt: 'DESC'
			},
			take: pageSize,
			skip: (pageIndex - 1) * pageSize
		});

		const feedbackTypeList: Array<FeedbackType> = [];
		for (const feedback of feedbacks) {
			const feedbackType = mapperUtil.mapEntityToClass(feedback, FeedbackType);
			feedbackType.fullName = feedback.orderDetail.customer.user.fullname;

			const image = await imageRepository.findOneBy({
				type: ImageType.USER,
				entityId: feedback.orderDetail.customer.user.id
			});

			if (image) {
				feedbackType.image = image.url;
			} else {
				feedbackType.image = DEFAULT_IMAGE;
			}

			const images = await imageRepository.find({
				where: {
					entityId: feedback.id,
					type: ImageType.FEEDBACK
				}
			});
			if (images[0]) {
				feedbackType.images = images.map((item) => item.url);
			}

			feedbackTypeList.push(feedbackType);
		}

		const ratingTypeList: Array<RatingType> = [
			{
				rating: 5,
				total: 0
			},
			{
				rating: 4,
				total: 0
			},
			{
				rating: 3,
				total: 0
			},
			{
				rating: 2,
				total: 0
			},
			{
				rating: 1,
				total: 0
			}
		];
		for (const feedback of allfeedbacks) {
			const existingRatingType = ratingTypeList.find(
				(rt) => rt.rating === feedback.rating
			);
			if (existingRatingType) {
				existingRatingType.total += 1;
			}
		}

		const feedbackReponse = new FeedbackReponse();
		feedbackReponse.feedbacks = feedbackTypeList;
		feedbackReponse.ratings = ratingTypeList;

		const response = new ResponseModel(res);
		response.data = {
			data: feedbackReponse,
			itemTotal,
			pageIndex,
			pageSize,
			pageTotal: Math.ceil(itemTotal / pageSize)
		};
		return response.send();
	}
}
export default new FeedbackService();
