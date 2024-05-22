import S from 'fluent-json-schema';

const jwtSchemas = S.object()
	.prop('SERVER_PORT', S.number().required())
	.prop('SERVER_DOMAIN', S.string().required())
	.prop('MARIADB_HOST', S.string().required())
	.prop('MARIADB_USER', S.string().required())
	.prop('MARIADB_PASSWORD', S.string().required())
	.prop('MARIADB_DATABASE', S.string().required())
	.prop('MARIADB_CLIENTURL', S.string().required())
	.prop('MARIADB_PORT', S.number().required())
	.prop('JWT_KEY', S.string().required())
	.prop('JWT_EXPIRE', S.string().required())
	.prop('JWT_ALGORITHM', S.string().required())
	.prop('OAUTH2_GOOGLE_ID', S.string().required())
	.prop('OAUTH2_GOOGLE_SECRET', S.string().required())
	.valueOf();

export default jwtSchemas;
