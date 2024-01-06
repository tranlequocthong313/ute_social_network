import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia, createPinia } from 'pinia';
import { useRouter } from 'vue-router';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import observer from 'resize-observer-polyfill';

import NavbarUserProfile from '@/layouts/components/NavbarUserProfile.vue';
import useAuthStore from '@/stores/authStore';
import { changeLanguage } from '@/locales/translator.js';

// eslint-disable-next-line no-undef
global.ResizeObserver = observer;

const vuetify = createVuetify({
    components,
    directives,
});

vi.mock('vue-router');
vi.mock('@/locales/translator.js');

const mountComponent = () => {
    return mount(NavbarUserProfile, {
        global: {
            plugins: [vuetify, createTestingPinia()],
        },
    });
};

describe('NavbarUserProfile', () => {
    useRouter.mockReturnValue({
        go: vi.fn(),
    });

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be on the first page when opened', async () => {
        const wrapper = mountComponent();

        expect(wrapper.vm.history.length).toEqual(1);
        expect(wrapper.vm.currentItems.length).toEqual(wrapper.vm.items.root.length);
        wrapper.vm.items.root.forEach((key) => {
            expect(wrapper.vm.currentItems).toContain(wrapper.vm.items[key]);
        });
    });

    it('should switch to a subpage if the user selects an item that has subitems', async () => {
        const wrapper = mountComponent();

        wrapper.vm.onClickMenuItem(wrapper.vm.items['language']);

        expect(wrapper.vm.history.length).toEqual(2);
        expect(wrapper.vm.currentItems.length).toEqual(wrapper.vm.items['language'].children.length);
        wrapper.vm.items['language'].children.forEach((key) => {
            expect(wrapper.vm.currentItems).toContain(wrapper.vm.items[key]);
        });
    });

    it('should return to the original page when the user presses the back button', async () => {
        const wrapper = mountComponent();

        wrapper.vm.onClickMenuItem(wrapper.vm.items['language']);
        expect(wrapper.vm.history.length).toEqual(2);
        wrapper.vm.items['language'].children.forEach((key) => {
            expect(wrapper.vm.currentItems).toContain(wrapper.vm.items[key]);
        });

        wrapper.vm.goBackHistory();
        expect(wrapper.vm.history.length).toEqual(1);
        wrapper.vm.items.root.forEach((key) => {
            expect(wrapper.vm.currentItems).toContain(wrapper.vm.items[key]);
        });
    });

    it('should logout the user when logout is clicked', async () => {
        const wrapper = mountComponent();
        const authStore = useAuthStore();

        wrapper.vm.onClickMenuItem(wrapper.vm.items['logout']);

        expect(authStore.logout).toHaveBeenCalledOnce();
    });

    it('should change language when user selects change language item', async () => {
        const wrapper = mountComponent();

        wrapper.vm.onClickMenuItem(wrapper.vm.items['vn']);

        expect(changeLanguage).toHaveBeenCalledOnce();
        expect(changeLanguage).toBeCalledWith(wrapper.vm.items['vn'].code);
        expect(useRouter().go).toHaveBeenCalledOnce();
    });
});
