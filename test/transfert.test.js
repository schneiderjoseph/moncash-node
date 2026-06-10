'use strict';

const moncash = require('./conf');
const { mockOAuth, mockTransfertError, cleanAll } = require('./mockApi');
const { MoncashError } = require('../lib/utils/Errors');

describe('check transfert', () => {
    afterEach(() => {
        cleanAll();
    });

    test('create with reference', (done) => {
        mockOAuth();
        mockTransfertError();

        moncash.transfert.create({
            receiver: '50900000000',
            amount: 50,
            desc: 'test',
            reference: 'TX-TEST-001'
        }, (err) => {
            expect(err.type).toBeDefined();
            done();
        });
    });

    test('create rejects missing reference', async () => {
        await expect(moncash.transfert.create({
            receiver: '50900000000',
            amount: 50,
            desc: 'test'
        })).rejects.toThrow(MoncashError);
    });

    test('create rejects invalid reference', async () => {
        await expect(moncash.transfert.create({
            receiver: '50900000000',
            amount: 50,
            desc: 'test',
            reference: 'TX 001'
        })).rejects.toThrow('alphanumeric');
    });
});
