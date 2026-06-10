'use strict';

const moncash = require('./conf');
const {
    mockOAuth,
    mockPrefundedStatus,
    mockPrefundedStatusNotFound,
    mockPrefundedBalance,
    cleanAll
} = require('./mockApi');
const { MoncashError } = require('../lib/utils/Errors');

describe('check prefunded', () => {
    afterEach(() => {
        cleanAll();
    });

    test('getTransactionStatus success', async () => {
        mockOAuth();
        mockPrefundedStatus();

        const resp = await moncash.prefunded.getTransactionStatus('TX-001');
        expect(resp.status).toBe('SUCCESS');
    });

    test('getTransactionStatus not found', async () => {
        mockOAuth();
        mockPrefundedStatusNotFound();

        await expect(moncash.prefunded.getTransactionStatus('TX-MISSING'))
            .rejects.toThrow();
    });

    test('getTransactionStatus rejects empty reference', async () => {
        await expect(moncash.prefunded.getTransactionStatus(''))
            .rejects.toThrow(MoncashError);
    });

    test('getBalance success', async () => {
        mockOAuth();
        mockPrefundedBalance();

        const resp = await moncash.prefunded.getBalance();
        expect(resp.balance).toBe(10000);
    });

    test('getBalance via callback', (done) => {
        mockOAuth();
        mockPrefundedBalance();

        moncash.prefunded.getBalance((err, resp) => {
            expect(err).toBe(null);
            expect(resp.balance).toBe(10000);
            done();
        });
    });
});
