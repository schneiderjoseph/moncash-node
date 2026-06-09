'use strict';

const { MoncashError } = require('../utils/Errors');

const HAITIAN_PHONE_FULL = /^509\d{8}$/;
const HAITIAN_PHONE_LOCAL = /^\d{8}$/;

/**
 * Transfert resource for sending funds via MonCash.
 */
class Transfert {
    /**
     * @param {object} config - SDK configuration
     * @param {import('../Request')} request - HTTP client
     */
    constructor(config,request){
        this.config  = config;
        this.request = request;
    }

    /**
     * Validate fund transfer input.
     * @param {object} data - Transfer payload
     * @throws {MoncashError} When validation fails
     * @private
     */
    _validateCreate(data) {
        const amount = data?.amount;
        if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
            throw new MoncashError('Invalid amount: must be a positive finite number greater than 0');
        }

        const receiver = data?.receiver;
        if (typeof receiver !== 'string' || receiver.trim().length === 0) {
            throw new MoncashError('Invalid receiver: must be a non-empty string');
        }
        if (!HAITIAN_PHONE_FULL.test(receiver) && !HAITIAN_PHONE_LOCAL.test(receiver)) {
            throw new MoncashError('Invalid receiver: must match Haitian phone format (509XXXXXXXX or XXXXXXXX)');
        }

        const desc = data?.desc;
        if (typeof desc !== 'string' || desc.trim().length === 0) {
            throw new MoncashError('Invalid desc: must be a non-empty string');
        }
        if (desc.length > 255) {
            throw new MoncashError('Invalid desc: must not exceed 255 characters');
        }
    }

    /**
     * Create a fund transfer.
     * @param {object} data - Transfer data
     * @param {string} data.receiver - Recipient phone (509XXXXXXXX or XXXXXXXX)
     * @param {number} data.amount - Transfer amount in HTG (must be > 0)
     * @param {string} data.desc - Transfer description (max 255 chars)
     * @param {function} [cb] - Optional callback `(err, transfert)`
     * @returns {Promise<object>|void} Resolves with transfer response when no callback is provided
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
            this.config.transfert_uri,
            data,
            {'Content-Type': 'application/json'}
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
