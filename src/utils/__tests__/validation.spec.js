import { describe, expect, it } from 'vitest';

import {
    searchValidator,
    datePickerValidator,
    validateStatus,
    validateDirection,
    isEmpty,
    basicRules,
    emailRules,
    passwordRules,
} from '@/utils/validation';

describe('validation', () => {
    it('should validate email correctly', () => {
        const correctEmail = ['admin@gmail.com', 'test@yahoo.com', 'abc@edu.vn'];

        const wrongEmail = ['', 'admin', 'abc@.com', '@abc.com'];

        correctEmail.forEach((email) => {
            let result;
            for (let rule of emailRules) {
                result = rule(email);
                if (typeof result === 'string') {
                    break;
                }
            }
            expect(result).toBeTruthy();
        });

        wrongEmail.forEach((email) => {
            let result;
            for (let rule of emailRules) {
                result = rule(email);
                if (typeof result === 'string') {
                    break;
                }
            }
            expect(result).toBeTypeOf('string');
        });
    });

    it('should validate password correctly', () => {
        expect(passwordRules[0]('')).toBeTypeOf('string');
        expect(passwordRules[0]('password')).toBeTruthy();
    });

    it('should validate basic rules correctly', () => {
        expect(basicRules[0]('')).toBeTypeOf('string');
        expect(basicRules[0]('abcdef')).toBeTruthy();
    });

    it('should validate isEmpty', () => {
        expect(isEmpty('')).toBeTruthy();
        expect(isEmpty([])).toBeTruthy();
        expect(isEmpty({})).toBeTruthy();

        expect(isEmpty('test')).toBeFalsy();
        expect(isEmpty([1, 2, 3])).toBeFalsy();
        expect(isEmpty({ name: 'admin' })).toBeFalsy();
        expect(isEmpty(10)).toBeFalsy();
    });

    it('should validate valid direction prop', () => {
        ['up', 'down', 'stay'].forEach((direction) => {
            expect(() => validateDirection(direction)).not.toThrow();
            expect(() => validateDirection(direction)).toBeTruthy();
        });
    });

    it('should throw error for invalid direction prop', () => {
        expect(() => validateDirection('invalid')).toThrow();
    });

    it('should validate valid status prop', () => {
        ['active', 'deactive', 'pending', 'rejected'].forEach((status) => {
            expect(() => validateStatus(status)).not.toThrow();
            expect(() => validateStatus(status)).toBeTruthy();
        });
    });

    it('should throw error for invalid status prop', () => {
        expect(() => validateStatus('invalid')).toThrow();
    });

    it('should return true searchValidator', () => {
        expect(searchValidator('John Doe')).toBeTruthy();
    });

    it('should throw error for invalid searchValidator', () => {
        expect(() => searchValidator(123)).toThrow();
        expect(() => searchValidator({})).toThrow();
        expect(() => searchValidator([])).toThrow();
    });

    it('should return true datePickerValidator', () => {
        expect(datePickerValidator(new Date())).toBeTruthy();
    });

    it('should throw error for invalid datePickerValidator', () => {
        expect(() => datePickerValidator(123)).toThrow();
        expect(() => datePickerValidator('21/2/2023')).toThrow();
        expect(() => datePickerValidator({})).toThrow();
        expect(() => datePickerValidator([])).toThrow();
    });
});
