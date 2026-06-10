'use strict';

const moncash = require('./conf');
const { mockOAuth, mockCustomerStatus, cleanAll } = require('./mockApi');
const { MoncashError } = require('../lib/utils/Errors');

describe('check customer', () => {
    afterEach(() => {
        cleanAll();
    });

    test('getStatus via callback', (done) => {
        mockOAuth();
        mockCustomerStatus();

        moncash.customer.getStatus('50912345678', (err, resp) => {
            expect(err).toBe(null);
            expect(resp.status).toBe('ACTIVE');
            done();
        });
    });

    test('getStatus via Promise', async () => {
        mockOAuth();
        mockCustomerStatus();

        const resp = await moncash.customer.getStatus('12345678');
        expect(resp.status).toBe('ACTIVE');
    });

    test('getStatus rejects invalid phone', async () => {
        await expect(moncash.customer.getStatus('invalid')).rejects.toThrow(MoncashError);
    });
});
