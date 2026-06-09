'use strict';

const moncash = require('./conf');
const {
    mockOAuth,
    mockCaptureByOrderId,
    mockCaptureByTransactionId,
    cleanAll
} = require('./mockApi');

describe('check capture',()=>{
    afterEach(() => {
        cleanAll();
    });

    test('getByOrderId', done => {
        mockOAuth();
        mockCaptureByOrderId();

        moncash.capture.getByOrderId("1559796839",(err,resp)=>{
            expect(err).toBe(null);
            expect(resp.orderId).toBe('1559796839');
            done();
        });
    });

    test('getByTransactionId', done => {
        mockOAuth();
        mockCaptureByTransactionId();

        moncash.capture.getByTransactionId("12874820",(err,resp)=>{
            expect(err).toBe(null);
            expect(resp.transactionId).toBe('12874820');
            done();
        });
    });
});
