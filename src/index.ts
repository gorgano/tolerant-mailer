import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
app.use(bodyParser.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Send email endpoint
app.post('/email', async (req: Request, res: Response) => {
  const { to, to_name, from, from_name, subject, body } = req.body;

  // Validate request body
  if (!to || !to_name || !from || !from_name || !subject || !body) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  res.send('w00t!').status(200);
});

// Start server
app.listen(8080, () => {
  console.log('Server started on port 8080');
});