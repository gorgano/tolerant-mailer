import axios from 'axios';
import { SendMessage } from '../types';
import { definedEnv } from '../env';


export const sendSendGrid = async (messageDetails: SendMessage) => {
    const { sendGridKey } = definedEnv;

    const {
        to,
        to_name,
        from,
        from_name,
        subject,
        body,
    } = messageDetails;

    let data = JSON.stringify({
        "personalizations": [
            {
                "to": [
                    {
                        "email": to,
                        "name": to_name,
                    }
                ],
                "subject": subject,
            }
        ],
        "content": [
            {
                "type": "text/plain",
                "value": body
            }
        ],
        "from": {
            "email": from,
            "name": from_name,
        },
        "reply_to": {
            "email": from,
            "name": from_name,
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers: {
            'Authorization': `Bearer ${sendGridKey}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const sendGridResponse = await axios.request(config)
        // Logger.debug normally
        console.log('sendSendGrid: OK');
        // {data:'',status:202,statusText:'Accepted'}
        return;
    } catch (e) {
        // TODO: Get SendGrid error from error array
        console.log(`sendSendGrid: FAIL: ${e}`);
        throw e;
    }
};