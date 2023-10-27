import axios from 'axios';
import FormData from 'form-data';
import { SendMessage } from '../types';

export const sendMailGun = async (messageDetails: SendMessage) => {
    const {
        to,
        to_name,
        from,
        from_name,
        subject,
        body,
    } = messageDetails;

    const mailgunKey: string = 'YXBpOjc2ZDU2YjdiZDJmYzU2MmFiODc1N2QwZjE2YmRmZjc1LTMyNGUwYmIyLWZlODQ0ZjYx';

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
            'Authorization': `Basic ${mailgunKey}`,
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
        console.log(`sendMailGun: FAIL ${e}`);
        throw e;
    }
};
