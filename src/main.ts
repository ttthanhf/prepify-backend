import fastify from 'fastify';
import fastifyConfig from '~configs/fastify.config';
import AutoLoad from '@fastify/autoload';
import path from 'path';
import swaggerConfig from '~configs/swagger.config';
import exceptionsHandle from './exceptions/exceptions';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import OrderProcessWorker from '~workers/orderProcess.worker';
import RabbitMQUtil from '~utils/rabbitmq.util';
require('dotenv').config();

const app = fastify(
	fastifyConfig.fastifyInitConfig
).withTypeProvider<TypeBoxTypeProvider>();
exceptionsHandle(app);
swaggerConfig(app);

const pathRegisters = ['plugins', 'routes'];
pathRegisters.forEach((pathRegister: string) => {
	app.register(AutoLoad, {
		dir: path.join(__dirname, pathRegister),
		prefix: '/moderator'
	});
});

app.ready(async () => {
	app.swagger();

	try {
		const rabbitmqInstance = await RabbitMQUtil.getInstance();
		const orderProcessWorker = OrderProcessWorker.getInstance(rabbitmqInstance);
		console.log('OrderProcessWorker has started.');
	} catch (err) {
		console.error('Failed to start OrderProcessWorker:', err);
		process.exit(1); // Exit the process if the worker fails to start
	}
});

app.listen(fastifyConfig.fastifyListenConfig, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
