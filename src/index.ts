import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import axios from 'axios';
import FormData from 'form-data';

const app = express();
app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const sendMailGun = async (to: string, to_name: string, from: string, from_name: string, subject: string, body: string) => {
	const mailgunKey: string = '76d56b7bd2fc562ab8757d0f16bdff75-324e0bb2-fe844f61';

	let data = new FormData();
	data.append('from', 'Mailgun Sandbox <postmaster@sandbox457c1ab32b1440ea972ad1ab9537776d.mailgun.org>');
	data.append('to', 'Jason Hurst <gorgano@gmail.com>');
	data.append('subject', 'mailgun test');
	data.append('text', 'this is the body');

	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://api.mailgun.net/v3/sandbox457c1ab32b1440ea972ad1ab9537776d.mailgun.org/messages',
		headers: {
			'Authorization': 'Basic YXBpOjc2ZDU2YjdiZDJmYzU2MmFiODc1N2QwZjE2YmRmZjc1LTMyNGUwYmIyLWZlODQ0ZjYx',
		},
		data: data
	};

	try {
		const mailGunResponse = await axios.request(config)
		console.log(JSON.stringify(mailGunResponse.data));
	} catch (e) {
		console.log(e);
	}
};


const sendSendGrid = async (to: string, to_name: string, from: string, from_name: string, subject: string, body: string) => {

	let data = JSON.stringify({
		"personalizations": [
			{
				"to": [
					{
						"email": "gorgano@hotmail.com",
						"name": "John Doe"
					}
				],
				"subject": "Hello, World!"
			}
		],
		"content": [
			{
				"type": "text/plain",
				"value": "Heya!"
			}
		],
		"from": {
			"email": "gorgano@gmail.com",
			"name": "jh"
		},
		"reply_to": {
			"email": "gorgano@gmail.com",
			"name": "jh"
		}
	});

	let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://api.sendgrid.com/v3/mail/send',
		headers: {
			'Authorization': 'Bearer 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',
			'Content-Type': 'application/json'
		},
		data: data
	};

	try {
		const sendGridResponse = await axios.request(config)
		console.log(JSON.stringify(sendGridResponse.data));
	} catch (e) {
		console.log(e);
	}
};

// Send email endpoint
app.post('/email', async (req: Request, res: Response) => {
	const { to, to_name, from, from_name, subject, body }:
		{ to: string, to_name: string, from: string, from_name: string, subject: string, body: string } = req.body;


	// Validate request body
	if (!to || !to_name || !from || !from_name || !subject || !body) {
		return res.status(400).json({ message: 'Invalid request body' });
	}


	await sendMailGun(to, to_name, from, from_name, subject, body);
	await sendSendGrid(to, to_name, from, from_name, subject, body);

	res.send('w00t!').status(200);
});

// Start server
app.listen(8080, () => {
	console.log('Server started on port 8080');
});