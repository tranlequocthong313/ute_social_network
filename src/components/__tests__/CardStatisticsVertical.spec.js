import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';

const vuetify = createVuetify({
    components,
    directives,
});

describe('CardStatisticsVertical', () => {
    it('should return same direction prop', () => {
        const directions = ['up', 'down', 'stay'];
        directions.forEach((direction) => {
            const wrapper = mount(CardStatisticsVertical, {
                props: {
                    direction,
                },
                global: {
                    plugins: [vuetify],
                },
            });
            expect(wrapper.vm[direction]).toBeTruthy();
        });
    });
});
