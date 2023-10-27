import { sendMailGun } from './lib/mailgun';
import { sendSendGrid } from './lib/sendgrid';
import { SendMessage, SendTypes } from './types';
import { getTypedError } from './lib/utils';
import { definedEnv } from './env';

class UnableToSend extends Error {
	sendErrors: (Error | string)[];
	constructor(message: string, sendErrors: (Error | string)[]) {
		super(message);
		this.sendErrors = sendErrors;
	}
}

// Methods to try a send with
// Any new methods added will be automatcially add to the send chain
const sendFunctions = {
	[SendTypes.mailgun]: sendMailGun,
	[SendTypes.sendgrid]: sendSendGrid,
};

/**
 * Get an array of email provides to try.  Reads from
 * parameters to get prefered primary, but selects on if none is
 * present.
 * @returns Array with order to try email providers in
 */
const getSendOrder = (): SendTypes[] => {
	const sendOrder: SendTypes[] = [];

	const requestedPrimary = definedEnv.primarySend;
	if (Object.keys(SendTypes).includes(requestedPrimary)) {
		sendOrder.push(requestedPrimary as SendTypes);
	}

	// Populate other types that aren't requested primary
	// When no requested primary, this will 'pick' a primary
	Object.keys(SendTypes).forEach((sendType: string) => {
		if (!sendOrder.includes(sendType as SendTypes)) {
			sendOrder.push(sendType as SendTypes);
		}
	});

	return sendOrder;
}

export const sendMessage = async (messageDetails: SendMessage) => {
	const sendOrder = getSendOrder();

	const errLog: (Error | string)[] = [];
	let sent = false;

	// Try all send method until one is successful.
	for (let i = 0; i < sendOrder.length; ++i) {
		try {
			// await sendSendGrid(messageDetails);
			const sendType = sendOrder[i];
			await sendFunctions[sendType](messageDetails);
			sent = true;
			break;
		} catch (e) {
			// Logger.error(...)
			console.log(`sendMessage: ${i}/${sendOrder.length - 1} ${sendOrder[i]}: FAIL ${e}`);
			errLog.push(getTypedError(e));
		}
	}

	if (sent) return;

	throw new UnableToSend('Unable to send email', errLog);
}