'use strict';

const { MoncashError } = require('./Errors');

const HAITIAN_PHONE_FULL = /^509\d{8}$/;
const HAITIAN_PHONE_LOCAL = /^\d{8}$/;
const REFERENCE_PATTERN = /^[A-Za-z0-9_-]+$/;

/**
 * Validate and round a payment or transfer amount.
 * @param {number} amount - Amount in HTG
 * @returns {number} Amount rounded to 2 decimal places
 * @throws {MoncashError} When validation fails
 */
function validateAmount(amount) {
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
        throw new MoncashError('Invalid amount: must be a positive finite number greater than 0');
    }

    const rounded = Math.round(amount * 100) / 100;
    if (rounded < 1) {
        throw new MoncashError('Invalid amount: MonCash minimum is 1 HTG');
    }

    return rounded;
}

/**
 * Validate a Haitian MonCash phone number.
 * @param {string} value - Phone number
 * @param {string} fieldName - Field label for error messages
 * @returns {string} Trimmed phone value
 * @throws {MoncashError} When validation fails
 */
function validatePhone(value, fieldName) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new MoncashError(`Invalid ${fieldName}: must be a non-empty string`);
    }

    const phone = value.trim();
    if (!HAITIAN_PHONE_FULL.test(phone) && !HAITIAN_PHONE_LOCAL.test(phone)) {
        throw new MoncashError(`Invalid ${fieldName}: must match Haitian phone format (509XXXXXXXX or XXXXXXXX)`);
    }

    return phone;
}

/**
 * Validate a merchant order identifier.
 * @param {string} id - Order ID
 * @returns {string} Trimmed order ID
 * @throws {MoncashError} When validation fails
 */
function validateOrderId(id) {
    if (typeof id !== 'string' || id.trim().length === 0) {
        throw new MoncashError('Invalid orderId: must be a non-empty string');
    }

    const orderId = id.trim();
    if (orderId.length > 128) {
        throw new MoncashError('Invalid orderId: must not exceed 128 characters');
    }

    return orderId;
}

/**
 * Validate a merchant transaction reference (idempotency key).
 * @param {string} ref - Reference string
 * @returns {string} Trimmed reference
 * @throws {MoncashError} When validation fails
 */
function validateReference(ref) {
    if (typeof ref !== 'string' || ref.trim().length === 0) {
        throw new MoncashError('Invalid reference: must be a non-empty string');
    }

    const reference = ref.trim();
    if (reference.length > 64) {
        throw new MoncashError('Invalid reference: must not exceed 64 characters');
    }

    if (!REFERENCE_PATTERN.test(reference)) {
        throw new MoncashError('Invalid reference: only alphanumeric characters, hyphens, and underscores are allowed');
    }

    return reference;
}

/**
 * Validate a transfer description.
 * @param {string} desc - Transfer description
 * @returns {string} Trimmed description
 * @throws {MoncashError} When validation fails
 */
function validateDesc(desc) {
    if (typeof desc !== 'string' || desc.trim().length === 0) {
        throw new MoncashError('Invalid desc: must be a non-empty string');
    }

    const description = desc.trim();
    if (description.length > 255) {
        throw new MoncashError('Invalid desc: must not exceed 255 characters');
    }

    return description;
}

/**
 * Validate a capture identifier (transaction or order ID).
 * @param {string} id - Identifier value
 * @param {string} fieldName - Field label for error messages
 * @returns {string} Trimmed identifier
 * @throws {MoncashError} When validation fails
 */
function validateId(id, fieldName) {
    if (typeof id !== 'string' || id.trim().length === 0) {
        throw new MoncashError(`Invalid ${fieldName}: must be a non-empty string`);
    }

    const value = id.trim();
    if (value.length > 128) {
        throw new MoncashError(`Invalid ${fieldName}: must not exceed 128 characters`);
    }

    return value;
}

module.exports = {
    validateAmount,
    validatePhone,
    validateOrderId,
    validateReference,
    validateDesc,
    validateId
};
