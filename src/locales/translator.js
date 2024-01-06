import { createI18n } from 'vue-i18n';

import en from './en.json';
import vn from './vn.json';

const translator = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang'),
    fallbackLocale: 'en',
    messages: {
        en,
        vn,
    },
});

export const changeLanguage = (code) => {
    translator.global.locale.value = code;
    localStorage.setItem('lang', code);
};

export const translate = (key) => {
    return translator.global.t(key);
};

export default translator;
