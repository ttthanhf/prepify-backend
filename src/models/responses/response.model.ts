import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { FastifyResponse } from '~types/fastify.type';

interface ResponseModel {
	statusCode: number;
	message: string;
	data: any;
}

class ResponseModel {
	statusCode: number;
	message: string;
	data: any;
	private response: FastifyResponse;

	constructor(response: FastifyResponse) {
		if (!response) {
			throw Error('Response Model must inject response app');
		}

		this.statusCode = HTTP_STATUS_CODE.OK;
		this.message = 'Success';
		this.data = null;
		this.response = response;
	}

	send() {
		this.response.code(this.statusCode);
		return this.response.send({
			statusCode: this.statusCode,
			message: this.message,
			data: this.data
		});
	}
}

export default ResponseModel;
