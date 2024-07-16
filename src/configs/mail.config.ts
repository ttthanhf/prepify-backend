import SMTPTransport from 'nodemailer/lib/smtp-transport';
import envConfig from './env.config';

const GOOGLE_MAIL_CONFIG: SMTPTransport | SMTPTransport.Options | string = {
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: envConfig.MAIL_USER,
		pass: envConfig.MAIL_PASSWORD
	}
};

export default {
	GOOGLE_MAIL_CONFIG
};
