import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import accountService from '~services/admin/account.service';

class AccountAdminController {
	async getAllAccount(req: FastifyRequest, res: FastifyResponse) {
		return accountService.getAllAccount(req, res);
	}

	async createAccount(req: FastifyRequest, res: FastifyResponse) {
		return accountService.createAccount(req, res);
	}
}

export default new AccountAdminController();
