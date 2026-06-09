'use strict';

const moncash = require('./conf');
const { mockOAuth, mockPaymentCreate, cleanAll } = require('./mockApi');

describe('check payment',()=>{
    afterEach(() => {
        cleanAll();
    });

    test('create', done => {
        mockOAuth();
        mockPaymentCreate();

        moncash.payment.create({
            "amount": 50,
            "orderId": "1234423"
        },(err,resp)=>{
            expect(err).toBe(null);
            expect(resp.payment_token.token).toBe('test-payment-token');
            done();
        });
    });

    test('redirectUri',()=> {
        return expect(moncash.payment.redirectUri({
            mode: '<mode>',
            path: '/Api/v1/CreatePayment',
            payment_token: {
              expired: '<date>',
              created: '<date>',
              token: '<token>'
            },
            timestamp: '<timestamp>',
            status: '<status>'
          })).toBeDefined();
    });
});
