import fastify from 'fastify';
import fastifyConfig from '~configs/fastify.config';
import AutoLoad from '@fastify/autoload';
import path = require('path');
import swaggerConfig from '~configs/swagger.config';
require('dotenv').config();

const app = fastify(fastifyConfig.fastifyInitConfig);
swaggerConfig(app);

const pathRegisters = ['plugins', 'routes'];
pathRegisters.forEach((pathRegister: string) => {
	app.register(AutoLoad, {
		dir: path.join(__dirname, pathRegister)
	});
});

app.ready(() => {
	app.swagger();
});

app.listen(fastifyConfig.fastifyListenConfig, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
