import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { sendSendGrid } from './sendgrid';
import { SendMessage } from '../types';
import { expect } from 'chai';

describe('sendSendGrid', () => {
    const mockAxios = new MockAdapter(axios);
    const messageDetails: SendMessage = {
        to: 'test@example.com',
        to_name: 'Test User',
        from: 'noreply@example.com',
        from_name: 'Test App',
        subject: 'Test Email',
        body: 'This is a test email'
    };

    afterEach(() => {
        mockAxios.reset();
    });

    it('should send an email via SendGrid', async () => {
        const responsePayload = { message: 'Email sent successfully' };
        mockAxios.onPost('https://api.sendgrid.com/v3/mail/send').reply(200, responsePayload);

        const response = await sendSendGrid(messageDetails);

        expect(response).equals(true);
    });

    it('should throw an error if SendGrid API returns an error', async () => {
        const expectedError = new Error('SendGrid API Error');
        mockAxios.onPost('https://api.sendgrid.com/v3/mail/send').reply(500, expectedError);

        try {
            await sendSendGrid(messageDetails);
        } catch (e) {
            expect(String(e)).to.equal('Error: Request failed with status code 500');
        }
    });
});
