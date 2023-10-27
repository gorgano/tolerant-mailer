import axios from 'axios';
import FormData from 'form-data';
import { SendMessage } from '../types';
import { definedEnv } from '../env';

export const sendMailGun = async (messageDetails: SendMessage) => {
    const {
        to,
        to_name,
        from,
        from_name,
        subject,
        body,
    } = messageDetails;

    const { mailGunKey } = definedEnv;

    //'Mailgun Sandbox <postmaster@sandbox457c1ab32b1440ea972ad1ab9537776d.mailgun.org>'
    let data = new FormData();
    data.append('from', from);
    data.append('to', to);
    data.append('subject', subject);
    data.append('text', body);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.mailgun.net/v3/sandbox457c1ab32b1440ea972ad1ab9537776d.mailgun.org/messages',
        headers: {
            'Authorization': `Basic ${mailGunKey}`,
        },
        data: data
    };

    try {
        const mailGunResponse = await axios.request(config)
        // Logger.debug normally
        console.log('sendMailGun: OK');
        // data:{id:'string',message:'Queued...'},status:200,statusText:'OK'
        return;
    } catch (e) {
        // TODO: Get mailgun error for error array (if available)
        console.log(`sendMailGun: FAIL ${e}`);
        throw e;
    }
};
