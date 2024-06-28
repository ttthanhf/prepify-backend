import { FastifyError, FastifyRequest } from 'fastify';
import ResponseModel from '~models/responses/response.model';
import { Fastify, FastifyResponse } from '~types/fastify.type';

export default async function exceptionsHandle(app: Fastify) {
	app.setErrorHandler(
		(error: FastifyError, request: FastifyRequest, reply: FastifyResponse) => {
			const validation = error.validation || [];
			const response = new ResponseModel(reply);
			response.statusCode = 400;
			request.log.error(error);
			if (validation.length > 0) {
				if (validation[0].message?.startsWith('must match pattern')) {
					response.message = `${validation[0].instancePath.slice(1)} not correct format`;
				} else {
					response.message = String(error);
				}
			} else {
				response.message = String(error);
			}
			return response.send();
		}
	);
}
