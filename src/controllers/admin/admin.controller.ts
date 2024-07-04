import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import accountService from '~services/admin/account.service';

class AccountAdminController {
	async getAllAccount(req: FastifyRequest, res: FastifyResponse) {
		return accountService.getAllAccount(req, res);
	}
}

export default new AccountAdminController();
