import { sendMailGun } from './lib/mailgun';
import { sendSendGrid } from './lib/sendgrid';
import { SendMessage } from './types';
import { getTypedError } from './lib/utils';

class UnableToSend extends Error {
	primaryError: Error | string;
	secondaryError: Error | string;
	constructor(message: string, primaryError: Error | string, secondaryError: Error | string) {
		super(message);
		this.primaryError = primaryError;
		this.secondaryError = secondaryError;
	}
}

export const sendMessage = async (messageDetails: SendMessage) => {
	try {
		await sendSendGrid(messageDetails);
	} catch (primaryError) {
		// Logger.error(...)
		console.log(`sendMessage: Primary: FAIL ${primaryError}`);
		try {
			await sendMailGun(messageDetails);
		} catch (secondaryError) {
			// Logger.error
			console.log(`sendMessage: Primary: FAIL ${secondaryError}`);
			const pErr = getTypedError(primaryError);
			const sErr = getTypedError(secondaryError);
			throw new UnableToSend('Unable to send email', pErr, sErr);
		}
	}
}