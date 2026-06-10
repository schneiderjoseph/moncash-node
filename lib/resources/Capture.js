'use strict';

const { validateId } = require('../utils/validate');

/**
 * Capture resource for retrieving payment transaction details.
 */
class Capture {
    /**
     * @param {object} config - SDK configuration
     * @param {import('../Request')} request - HTTP client
     */
    constructor(config, request) {
        this.config = config;
        this.request = request;
    }

    /**
     * Retrieve a payment by MonCash transaction ID.
     * @param {string} id - Transaction ID
     * @param {function} [cb] - Optional callback `(err, capture)`
     * @returns {Promise<object>|void} Resolves with capture when no callback is provided
     */
    getByTransactionId(id, cb) {
        let transactionId;

        try {
            transactionId = validateId(id, 'transactionId');
        } catch (err) {
            if (typeof cb === 'function') {
                cb(err, null);
                return;
            }
            return Promise.reject(err);
        }

        const promise = this.request.post(
            this.config.transaction_uri,
            { transactionId },
            { 'Content-Type': 'application/json' }
        );

        if (typeof cb === 'function') {
            promise
                .then((capture) => cb(null, capture))
                .catch((err) => cb(err, null));
            return;
        }

        return promise;
    }

    /**
     * Retrieve a payment by merchant order ID.
     * @param {string} id - Order ID
     * @param {function} [cb] - Optional callback `(err, capture)`
     * @returns {Promise<object>|void} Resolves with capture when no callback is provided
     */
    getByOrderId(id, cb) {
        let orderId;

        try {
            orderId = validateId(id, 'orderId');
        } catch (err) {
            if (typeof cb === 'function') {
                cb(err, null);
                return;
            }
            return Promise.reject(err);
        }

        const promise = this.request.post(
            this.config.order_uri,
            { orderId },
            { 'Content-Type': 'application/json' }
        );

        if (typeof cb === 'function') {
            promise
                .then((capture) => cb(null, capture))
                .catch((err) => cb(err, null));
            return;
        }

        return promise;
    }
}

module.exports = Capture;
