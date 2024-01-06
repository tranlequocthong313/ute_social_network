import { translate } from '@/locales/translator.js';

export const emailRules = [
    (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || translate('emailMustBeValid'),
    (v) => v?.length > 0 || translate('emailMustNotEmpty'),
];

export const basicRules = [(v) => v?.length > 0 || translate('fieldMustBeEntered')];

export const passwordRules = [(v) => v?.length > 0 || translate('passwordMustNotEmpty')];

export const isEmpty = (value) => {
    if (typeof value === 'string') {
        return value.trim() === '';
    } else if (Array.isArray(value)) {
        return value.length === 0;
    } else if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length === 0;
    }
    return false;
};

export const validateDirection = (direction) => {
    if (['up', 'down', 'stay'].includes(direction)) {
        return true;
    }
    throw Error(`direction is required and must be either 'up', 'down' or 'stay'. You passed ${direction}`);
};

export const validateStatus = (status) => {
    if (['active', 'deactive', 'pending', 'rejected'].includes(status)) {
        return true;
    }
    throw Error(
        `status is required and must be either 'active', 'deactive', 'pending' or 'rejected'. You passed ${status}`,
    );
};

export const searchValidator = (search) => {
    if (typeof search === 'string') {
        return true;
    }
    throw Error(`
        Search should be a string.
        Got: ${search}
    `);
};

export const datePickerValidator = (date) => {
    if (date instanceof Date) {
        return true;
    }
    throw Error(`
        Date should be a date.
        Got: ${date}
    `);
};
