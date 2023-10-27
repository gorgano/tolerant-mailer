import { sendMailGun } from './lib/mailgun';
import { sendSendGrid } from './lib/sendgrid';
import { SendMessage, SendTypes } from './types';
import { getTypedError } from './lib/utils';
import { definedEnv } from './env';

class UnableToSend extends Error {
	primaryError: Error | string;
	secondaryError: Error | string;
	constructor(message: string, primaryError: Error | string, secondaryError: Error | string) {
		super(message);
		this.primaryError = primaryError;
		this.secondaryError = secondaryError;
	}
}


const primary = SendTypes.mailgun;
const secondary = SendTypes.sendgrid;
const sendFunctions = {
	[SendTypes.mailgun]: sendMailGun,
	[SendTypes.sendgrid]: sendSendGrid,
};

// const getSendOrder = (): SendTypes[] => {
// 	const sendOrder: SendTypes[] = [];

// 	const requestedPrimary = env.primarySend;
// 	if (Object.keys(SendTypes).includes(requestedPrimary)) { sendOrder.push(requestedPrimary); }

// 	// Populate other types that aren't requested primary
// 	// When no requested primary, this will 'pick' a primary
// 	Object.keys(SendTypes).forEach((sendType: SendTypes) => {
// 		if (!sendOrder.includes(sendType)) { sendOrder.push(sendType); }
// 	});

// 	return sendOrder;
// }

export const sendMessage = async (messageDetails: SendMessage) => {
	// const sendOrder = getSendOrder();
	try {
		// await sendSendGrid(messageDetails);
		await sendFunctions[primary](messageDetails);
	} catch (primaryError) {
		// Logger.error(...)
		console.log(`sendMessage: Primary: FAIL ${primaryError}`);
		try {
			// await sendMailGun(messageDetails);
			await sendFunctions[secondary](messageDetails);
		} catch (secondaryError) {
			// Logger.error
			console.log(`sendMessage: Primary: FAIL ${secondaryError}`);
			const pErr = getTypedError(primaryError);
			const sErr = getTypedError(secondaryError);
			throw new UnableToSend('Unable to send email', pErr, sErr);
		}
	}
}