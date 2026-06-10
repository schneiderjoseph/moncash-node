'use strict';

const {
    validateAmount,
    validatePhone,
    validateOrderId,
    validateReference,
    validateDesc,
    validateId
} = require('../lib/utils/validate');
const { MoncashError } = require('../lib/utils/Errors');

describe('validate utilities', () => {
    test('validateAmount rounds and accepts valid values', () => {
        expect(validateAmount(50.556)).toBe(50.56);
        expect(validateAmount(1)).toBe(1);
    });

    test('validateAmount rejects invalid values', () => {
        expect(() => validateAmount(0)).toThrow(MoncashError);
        expect(() => validateAmount(0.5)).toThrow('minimum is 1 HTG');
        expect(() => validateAmount('50')).toThrow(MoncashError);
        expect(() => validateAmount(NaN)).toThrow(MoncashError);
    });

    test('validatePhone accepts Haitian formats', () => {
        expect(validatePhone('50912345678', 'receiver')).toBe('50912345678');
        expect(validatePhone('12345678', 'account')).toBe('12345678');
    });

    test('validatePhone rejects invalid phones', () => {
        expect(() => validatePhone('', 'receiver')).toThrow(MoncashError);
        expect(() => validatePhone('123', 'receiver')).toThrow(MoncashError);
        expect(() => validatePhone('509123;DROP', 'receiver')).toThrow(MoncashError);
    });

    test('validateOrderId enforces length', () => {
        expect(validateOrderId('ORDER-001')).toBe('ORDER-001');
        expect(() => validateOrderId('')).toThrow(MoncashError);
        expect(() => validateOrderId('x'.repeat(129))).toThrow('128 characters');
    });

    test('validateReference enforces pattern and length', () => {
        expect(validateReference('TX-001')).toBe('TX-001');
        expect(() => validateReference('')).toThrow(MoncashError);
        expect(() => validateReference('TX 001')).toThrow('alphanumeric');
        expect(() => validateReference('x'.repeat(65))).toThrow('64 characters');
    });

    test('validateDesc enforces length', () => {
        expect(validateDesc('Payment')).toBe('Payment');
        expect(() => validateDesc('')).toThrow(MoncashError);
        expect(() => validateDesc('x'.repeat(256))).toThrow('255 characters');
    });

    test('validateId enforces non-empty and max length', () => {
        expect(validateId('12874820', 'transactionId')).toBe('12874820');
        expect(() => validateId('', 'orderId')).toThrow(MoncashError);
        expect(() => validateId('x'.repeat(129), 'orderId')).toThrow('128 characters');
    });
});
