import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { sendMessage } from './sendMessage';
import { stripHtml } from './lib/utils';

const app = express();
app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Send email endpoint
app.post('/email', async (req: Request, res: Response) => {
	const {
		to,
		to_name,
		from,
		from_name,
		subject,
		body,
	}: {
		to: string,
		to_name: string,
		from: string,
		from_name: string,
		subject: string,
		body: string,
	} = req.body;

	// Validate request body
	if (!to || !to_name || !from || !from_name || !subject || !body) {
		return res.status(400).json({ message: 'Invalid request body' });
	}

	// TODO: Basic email validation
	const textBody = stripHtml(body);

	try {
		// TODO: Make Request UUID to pass through functions for better logging
		await sendMessage({ to, to_name, from, from_name, subject, body: textBody });
		// Note: Would normally use winston or similar, but using
		//  console for the simplicity of this excersise.
		console.log('/email: sendMessage OK');
		return res.sendStatus(202); // Accepted
	} catch (e) {
		console.log(`/email: sendMessage FAIL: ${e}`);
		console.log(e);
		return res.sendStatus(500);
	}
});

// Start server
app.listen(8080, () => {
	console.log('Server started on port 8080');
});