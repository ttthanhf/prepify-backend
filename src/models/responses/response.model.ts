interface ResponseModel {
	statusCode: number;
	message: string;
	data: any;
}

class ResponseModel {
	statusCode: number;
	message: string;
	data: any;

	constructor(
		statusCode: number = 200,
		message: string = '',
		data: any = null
	) {
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
	}
}

export default ResponseModel;
