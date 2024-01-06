import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import BackButton from '@/components/BackButton.vue';

const vuetify = createVuetify({
    components,
    directives,
});

describe('BackButton', () => {
    it('should emit click event when user clicks on back buton', async () => {
        const wrapper = mount(BackButton, {
            global: {
                plugins: [vuetify],
            },
        });

        await wrapper.find('i').trigger('click');
        expect(wrapper.emitted().click).toBeTruthy();
        expect(wrapper.emitted().click.length).toEqual(1);

        await wrapper.find('i').trigger('click');
        expect(wrapper.emitted().click).toBeTruthy();
        expect(wrapper.emitted().click.length).toEqual(2);
    });
});
