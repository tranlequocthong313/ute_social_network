import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import ThemeSwitcher from '@/components/ThemeSwitcher.vue';

const vuetify = createVuetify({
    components,
    directives,
});

describe('ThemeSwitcher', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = mount(ThemeSwitcher, {
            props: {},
            global: {
                plugins: [vuetify],
            },
        });
    });

    afterEach(async () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            await wrapper.find('[data-test=theme-switcher]').trigger('click');
        }
    });

    it('should toggle theme', async () => {
        await wrapper.find('[data-test=theme-switcher]').trigger('click');
        expect(wrapper.find('[data-test=theme-switcher]').classes()).toContain('mdi-brightness-4');

        await wrapper.find('[data-test=theme-switcher]').trigger('click');
        expect(wrapper.find('[data-test=theme-switcher]').classes()).toContain('mdi-brightness-6');
    });

    it('should use light theme by default', () => {
        expect(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches).toBeFalsy();
    });

    it('should return correct properties in light mode', async () => {
        expect(wrapper.find('[data-test=theme-switcher]').classes()).toContain('mdi-brightness-6');
    });

    it('should return correct properties in dark mode', async () => {
        await wrapper.find('[data-test=theme-switcher]').trigger('click');

        expect(wrapper.find('[data-test=theme-switcher]').classes()).toContain('mdi-brightness-4');
    });
});
