import Ajv from 'ajv';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import ResponseModel from '~models/responses/response.model';

function validate(res: Response, schema: any, obj: Object) {
	const ajv = new Ajv();
	const validate = ajv.compile(schema);
	const valid = validate(obj);
	if (!valid && validate.errors) {
		const response = new ResponseModel(res);
		response.message =
			validate.errors[0].instancePath + ' : ' + validate.errors[0].message ||
			'Something error';
		response.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
		return response.send();
	}
	return;
}

export default {
	validate
};
