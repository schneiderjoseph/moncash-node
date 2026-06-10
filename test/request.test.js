'use strict';

const nock = require('nock');
const Moncash = require('../lib/Moncash');
const { cleanAll } = require('./mockApi');

const SANDBOX_BASE = 'https://sandbox.moncashbutton.digicelgroup.com';

describe('Request.get security', () => {
    let moncash;

    beforeEach(() => {
        moncash = new Moncash({
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
            mode: 'sandbox'
        });
    });

    afterEach(() => {
        cleanAll();
    });

    test('get uses OAuth mutex and returns data', async () => {
        nock(SANDBOX_BASE)
            .post('/Api/oauth/token')
            .reply(200, {
                access_token: 'test-access-token',
                token_type: 'bearer',
                expires_in: 3600
            });

        nock(SANDBOX_BASE)
            .get('/Api/v1/PrefundedBalance')
            .reply(200, { balance: 5000 });

        const balance = await moncash.prefunded.getBalance();
        expect(balance.balance).toBe(5000);
    });

    test('get strips axios config on error', async () => {
        nock(SANDBOX_BASE)
            .post('/Api/oauth/token')
            .reply(200, {
                access_token: 'test-access-token',
                token_type: 'bearer',
                expires_in: 3600
            });

        nock(SANDBOX_BASE)
            .get('/Api/v1/PrefundedBalance')
            .reply(500, { message: 'Server error' });

        try {
            await moncash.prefunded.getBalance();
            throw new Error('Expected error');
        } catch (err) {
            expect(err.config).toBeUndefined();
            expect(err.type).toBeDefined();
        }
    });
});
