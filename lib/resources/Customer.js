'use strict';

const { validatePhone } = require('../utils/validate');

/**
 * Customer resource for MonCash account status checks.
 */
class Customer {
    /**
     * @param {object} config - SDK configuration
     * @param {import('../Request')} request - HTTP client
     */
    constructor(config, request) {
        this.config = config;
        this.request = request;
    }

    /**
     * Check whether a phone number is registered and active on MonCash.
     *
     * @security Backend-only — do not expose from a public frontend (account enumeration risk).
     * @param {string} account - MonCash account phone (509XXXXXXXX or XXXXXXXX)
     * @param {function} [cb] - Optional callback `(err, status)`
     * @returns {Promise<object>|void} Resolves with customer status when no callback is provided
     * @throws {MoncashError} When validation fails
     * @example
     * const status = await moncash.customer.getStatus('50912345678');
     * console.log(status);
     */
    getStatus(account, cb) {
        let validatedAccount;

        try {
            validatedAccount = validatePhone(account, 'account');
        } catch (err) {
            if (typeof cb === 'function') {
                cb(err, null);
                return;
            }
            return Promise.reject(err);
        }

        const promise = this.request.post(
            this.config.customer_status_uri,
            { account: validatedAccount },
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
}

module.exports = Customer;
