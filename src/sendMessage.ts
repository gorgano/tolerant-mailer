import { sendMailGun } from './lib/mailgun';
import { sendSendGrid } from './lib/sendgrid';
import { SendMessage } from './types';

export const sendMessage = async (messageDetails: SendMessage) => {
	await sendMailGun(messageDetails);
	await sendSendGrid(messageDetails);
}