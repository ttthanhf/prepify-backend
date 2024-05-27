import { FastifyError, FastifyRequest } from 'fastify';
import ResponseModel from '~models/responses/response.model';
import { Fastify, FastifyResponse } from '~types/fastify.type';

export default async function exceptionsHandle(app: Fastify) {
	app.setErrorHandler(
		(error: FastifyError, request: FastifyRequest, reply: FastifyResponse) => {
			const validation = error.validation || [];
			const reponse = new ResponseModel(reply);
			reponse.statusCode = 400;
			if (validation.length > 0) {
				if (validation[0].message?.startsWith('must match pattern')) {
					reponse.message = `${validation[0].instancePath.slice(1)} not correct format`;
				}
			} else {
				console.log(error);
				request.log.error(error);
				reponse.message = String(error);
			}
			return reponse.send();
		}
	);
}
