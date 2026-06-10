'use strict';

const {
    validateAmount,
    validatePhone,
    validateDesc,
    validateReference
} = require('../utils/validate');

/**
 * Transfert resource for sending funds via MonCash.
 */
class Transfert {
    /**
     * @param {object} config - SDK configuration
     * @param {import('../Request')} request - HTTP client
     */
    constructor(config, request) {
        this.config = config;
        this.request = request;
    }

    /**
     * Validate fund transfer input.
     * @param {object} data - Transfer payload
     * @returns {object} Sanitized transfer body
     * @throws {MoncashError} When validation fails
     * @private
     */
    _validateCreate(data) {
        return {
            amount: validateAmount(data?.amount),
            receiver: validatePhone(data?.receiver, 'receiver'),
            desc: validateDesc(data?.desc),
            reference: validateReference(data?.reference)
        };
    }

    /**
     * Create a fund transfer.
     *
     * @security Backend-only — payouts are irreversible. Verify receiver before sending.
     * @param {object} data - Transfer data
     * @param {string} data.receiver - Recipient phone (509XXXXXXXX or XXXXXXXX)
     * @param {number} data.amount - Transfer amount in HTG (must be >= 1)
     * @param {string} data.desc - Transfer description (max 255 chars)
     * @param {string} data.reference - Unique merchant reference (idempotency key, max 64 chars)
     * @param {function} [cb] - Optional callback `(err, transfert)`
     * @returns {Promise<object>|void} Resolves with transfer response when no callback is provided
     * @example
     * const result = await moncash.transfert.create({
     *   receiver: '50912345678',
     *   amount: 50,
     *   desc: 'Supplier payment',
     *   reference: 'TX-001'
     * });
     */
    create(data, cb) {
        let body;

        try {
            body = this._validateCreate(data);
        } catch (err) {
            if (typeof cb === 'function') {
                cb(err, null);
                return;
            }
            return Promise.reject(err);
        }

        const promise = this.request.post(
            this.config.transfert_uri,
            body,
            { 'Content-Type': 'application/json' }
        );

        if (typeof cb === 'function') {
            promise
                .then((transfert) => cb(null, transfert))
                .catch((err) => cb(err, null));
            return;
        }

        return promise;
    }
}

module.exports = Transfert;
