import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import StatusChip from '@/components/StatusChip.vue';

const vuetify = createVuetify({
    components,
    directives,
});

const testProps = [
    {
        status: 'active',
        activeColor: 'pink',
        activeContent: '✅',
    },
    {
        status: 'deactive',
        deActiveColor: 'black',
        deActiveContent: '❌',
    },
    {
        status: 'pending',
        pendingColor: 'white',
        pendingContent: '⌛',
    },
    {
        status: 'rejected',
        rejectedColor: 'brown',
        rejectedContent: '🙅',
    },
];

describe('StatusChip', () => {
    it('should return correct status prop', () => {
        testProps.forEach((props) => {
            const wrapper = mount(StatusChip, {
                props,
                global: {
                    plugins: [vuetify],
                },
            });

            const values = Object.values(props);

            expect(values).toContain(wrapper.vm.status);
            expect(values).toContain(wrapper.vm.color);
            expect(values).toContain(wrapper.vm.content);
        });
    });
});
