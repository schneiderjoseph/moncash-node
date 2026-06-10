'use strict';

const { MoncashError } = require('../utils/Errors');
const { validateAmount, validateOrderId } = require('../utils/validate');

/**
 * Payment resource for creating MonCash payments.
 */
class Payment {
    /**
     * @param {object} config - SDK configuration
     * @param {import('../Request')} request - HTTP client
     */
    constructor(config, request) {
        this.config = config;
        this.request = request;
    }

    /**
     * Validate payment creation input.
     * @param {object} data - Payment payload
     * @throws {MoncashError} When validation fails
     * @private
     */
    _validateCreate(data) {
        data.amount = validateAmount(data?.amount);
        data.orderId = validateOrderId(data?.orderId);
    }

    /**
     * Create a new payment.
     * @param {object} data - Payment data
     * @param {number} data.amount - Payment amount in HTG (must be > 0)
     * @param {string} data.orderId - Merchant order identifier
     * @param {function} [cb] - Optional callback `(err, payment)`
     * @returns {Promise<object>|void} Resolves with payment when no callback is provided
     */
    create(data, cb) {
        try {
            this._validateCreate(data);
        } catch (err) {
            if (typeof cb === 'function') {
                cb(err, null);
                return;
            }
            return Promise.reject(err);
        }

        const promise = this.request.post(
            this.config.creator_uri,
            data,
            { 'Content-Type': 'application/json' }
        );

        if (typeof cb === 'function') {
            promise
                .then((payment) => cb(null, payment))
                .catch((err) => cb(err, null));
            return;
        }

        return promise;
    }

    /**
     * Build the redirect URL for a created payment.
     * @param {object} payment - Payment response object from create()
     * @returns {string} Redirect URI for the MonCash payment page
     * @throws {MoncashError} When payment_token is missing
     */
    redirectUri(payment) {
        if (!payment || !payment.payment_token || !payment.payment_token.token) {
            throw new MoncashError('Invalid payment object: missing payment_token');
        }

        let params = new URLSearchParams();
        params.append('token', payment.payment_token.token);
        return this.config.redirect_uri + '/Payment/Redirect?' + params;
    }
}

module.exports = Payment;
