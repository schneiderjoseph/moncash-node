'use strict';

/**
 * Capture resource for retrieving payment transaction details.
 */
class Capture {
    /**
     * @param {object} config - SDK configuration
     * @param {import('../Request')} request - HTTP client
     */
    constructor(config,request){
        this.config  = config;
        this.request = request;
    }

    /**
     * Retrieve a payment by MonCash transaction ID.
     * @param {string} id - Transaction ID
     * @param {function} [cb] - Optional callback `(err, capture)`
     * @returns {Promise<object>|void} Resolves with capture when no callback is provided
     */
    getByTransactionId(id, cb) {
        const promise = this.request.post(
            this.config.transaction_uri,
            {transactionId:id},
            {'Content-Type': 'application/json'}
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
        const promise = this.request.post(
            this.config.order_uri,
            {orderId:id},
            {'Content-Type': 'application/json'}
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
