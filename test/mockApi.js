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
        .post('/Api/v1/Transfert', (body) => {
            return body.amount === 50 &&
                body.receiver === '50900000000' &&
                body.desc === 'test' &&
                body.reference === 'TX-TEST-001';
        })
        .reply(400, { message: 'Transfer failed' });
}

/**
 * Mock customer status endpoint.
 * @returns {import('nock').Scope}
 */
function mockCustomerStatus() {
    return nock(SANDBOX_BASE)
        .post('/Api/v1/CustomerStatus')
        .reply(200, { status: 'ACTIVE' });
}

/**
 * Mock prefunded transaction status endpoint.
 * @returns {import('nock').Scope}
 */
function mockPrefundedStatus() {
    return nock(SANDBOX_BASE)
        .post('/Api/v1/PrefundedTransactionStatus')
        .reply(200, { status: 'SUCCESS', reference: 'TX-001' });
}

/**
 * Mock prefunded transaction status not found.
 * @returns {import('nock').Scope}
 */
function mockPrefundedStatusNotFound() {
    return nock(SANDBOX_BASE)
        .post('/Api/v1/PrefundedTransactionStatus')
        .reply(404, { message: 'Not found' });
}

/**
 * Mock prefunded balance endpoint.
 * @returns {import('nock').Scope}
 */
function mockPrefundedBalance() {
    return nock(SANDBOX_BASE)
        .get('/Api/v1/PrefundedBalance')
        .reply(200, { balance: 10000 });
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
    mockCustomerStatus,
    mockPrefundedStatus,
    mockPrefundedStatusNotFound,
    mockPrefundedBalance,
    cleanAll
};
