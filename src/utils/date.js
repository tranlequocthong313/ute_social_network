import { translate } from '@/locales/translator.js';

export const getMonths = () => {
    return [
        translate('january'),
        translate('february'),
        translate('march'),
        translate('april'),
        translate('may'),
        translate('june'),
        translate('july'),
        translate('august'),
        translate('september'),
        translate('october'),
        translate('november'),
        translate('december'),
    ];
};

export function getFormattedDate(input, options = { time: true, format: 'dd-mm-yyyy' }) {
    const date = input ? new Date(input) : new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours, minutes, seconds, ampm;
    if (options.time) {
        hours = String(date.getHours() % 12).padStart(2, '0');
        minutes = String(date.getMinutes()).padStart(2, '0');
        seconds = String(date.getSeconds()).padStart(2, '0');
        ampm = date.getHours() >= 12 ? 'PM' : 'AM';

        if (options.format === 'dd-mm-yyyy') {
            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
        }

        if (options.format === 'mm-dd-yyyy') {
            return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
        }

        if (options.format === 'yyyy-mm-dd') {
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
        }
    }

    if (options.format === 'dd-mm-yyyy') {
        return `${day}-${month}-${year}`;
    }

    if (options.format === 'mm-dd-yyyy') {
        return `${month}-${day}-${year}`;
    }

    if (options.format === 'yyyy-mm-dd') {
        return `${year}-${month}-${day}`;
    }
}

export function getTimeFromTimestamp(timestamp) {
    var date = new Date(timestamp);

    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}
