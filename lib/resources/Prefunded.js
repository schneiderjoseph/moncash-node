'use strict';

const { validateReference } = require('../utils/validate');

/**
 * Prefunded account resource for merchant payout operations.
 */
class Prefunded {
    /**
     * @param {object} config - SDK configuration
     * @param {import('../Request')} request - HTTP client
     */
    constructor(config, request) {
        this.config = config;
        this.request = request;
    }

    /**
     * Retrieve the status of a prefunded transfer by merchant reference.
     *
     * @security Backend-only — references are sensitive merchant identifiers.
     * @param {string} reference - Unique merchant reference for the transfer
     * @param {function} [cb] - Optional callback `(err, status)`
     * @returns {Promise<object>|void} Resolves with transaction status when no callback is provided
     * @throws {MoncashError} When validation fails
     * @example
     * const status = await moncash.prefunded.getTransactionStatus('TX-001');
     */
    getTransactionStatus(reference, cb) {
        let validatedReference;

        try {
            validatedReference = validateReference(reference);
        } catch (err) {
            if (typeof cb === 'function') {
                cb(err, null);
                return;
            }
            return Promise.reject(err);
        }

        const promise = this.request.post(
            this.config.prefunded_status_uri,
            { reference: validatedReference },
            { 'Content-Type': 'application/json' }
        );

        if (typeof cb === 'function') {
            promise
                .then((status) => cb(null, status))
                .catch((err) => cb(err, null));
            return;
        }

        return promise;
    }

    /**
     * Retrieve the current prefunded account balance for the merchant.
     *
     * @security Backend-only — merchant balance is sensitive financial data.
     * Requires a prefunded account activated by Digicel.
     * @param {function} [cb] - Optional callback `(err, balance)`
     * @returns {Promise<object>|void} Resolves with balance when no callback is provided
     * @example
     * const balance = await moncash.prefunded.getBalance();
     */
    getBalance(cb) {
        const promise = this.request.get(this.config.prefunded_balance_uri);

        if (typeof cb === 'function') {
            promise
                .then((balance) => cb(null, balance))
                .catch((err) => cb(err, null));
            return;
        }

        return promise;
    }
}

module.exports = Prefunded;
