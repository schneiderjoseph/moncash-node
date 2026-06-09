'use strict';

const nock = require('nock');

const SANDBOX_BASE = 'https://sandbox.moncashbutton.digicelgroup.com';

/**
 * Mock OAuth token endpoint for sandbox API tests.
 * @returns {import('nock').Scope}
 */
function mockOAuth() {
    return nock(SANDBOX_BASE)
        .post('/Api/oauth/token')
        .reply(200, {
            access_token: 'test-access-token',
            token_type: 'bearer',
            expires_in: 3600
        });
}

/**
 * Mock payment creation endpoint.
 * @returns {import('nock').Scope}
 */
function mockPaymentCreate() {
    return nock(SANDBOX_BASE)
        .post('/Api/v1/CreatePayment')
        .reply(200, {
            payment_token: {
                token: 'test-payment-token',
                expired: '2099-01-01',
                created: '2020-01-01'
            },
            status: 'SUCCESS'
        });
}

/**
 * Mock capture by order ID endpoint.
 * @returns {import('nock').Scope}
 */
function mockCaptureByOrderId() {
    return nock(SANDBOX_BASE)
        .post('/Api/v1/RetrieveOrderPayment')
        .reply(200, { status: 'SUCCESS', orderId: '1559796839' });
}

/**
 * Mock capture by transaction ID endpoint.
 * @returns {import('nock').Scope}
 */
function mockCaptureByTransactionId() {
    return nock(SANDBOX_BASE)
        .post('/Api/v1/RetrieveTransactionPayment')
        .reply(200, { status: 'SUCCESS', transactionId: '12874820' });
}

/**
 * Mock transfer endpoint returning a client error.
 * @returns {import('nock').Scope}
 */
function mockTransfertError() {
    return nock(SANDBOX_BASE)
        .post('/Api/v1/Transfert')
        .reply(400, { message: 'Transfer failed' });
}

/**
 * Remove all active nock interceptors.
 */
function cleanAll() {
    nock.cleanAll();
}

module.exports = {
    mockOAuth,
    mockPaymentCreate,
    mockCaptureByOrderId,
    mockCaptureByTransactionId,
    mockTransfertError,
    cleanAll
};
