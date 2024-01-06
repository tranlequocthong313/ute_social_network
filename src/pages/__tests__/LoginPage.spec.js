import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { useRouter } from 'vue-router';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import LoginPage from '@/pages/LoginPage.vue';
import useAuthStore from '@/stores/authStore';

const vuetify = createVuetify({
    components,
    directives,
});

vi.mock('vue-router');

const factory = () => {
    return mount(LoginPage, {
        global: {
            plugins: [vuetify, createTestingPinia()],
        },
    });
};

const user = {
    email: 'admin@gmail.com',
    password: 'P4$$vv0rd',
};

describe('LoginPage', () => {
    useRouter.mockReturnValue({
        push: vi.fn(),
    });

    beforeEach(async () => {
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should log in when the inputs are valid', async () => {
        const wrapper = factory();
        const authStore = useAuthStore();

        await wrapper.find('#email-input').setValue(user.email);
        await wrapper.find('#password-input').setValue(user.password);
        await wrapper.find('form').trigger('submit.prevent');

        await flushPromises();

        expect(authStore.login).toHaveBeenCalledOnce();
        expect(authStore.login).toHaveBeenCalledWith(user);
    });

    it('should give an error when the user has not entered an email', async () => {
        const wrapper = factory();
        const authStore = useAuthStore();

        await wrapper.find('#email-input').setValue('');
        await wrapper.find('#password-input').setValue('');
        await wrapper.find('form').trigger('submit.prevent');

        await flushPromises();

        expect(authStore.login).not.toBeCalled();
    });

    it('should error when the user enters an invalid email', async () => {
        const wrapper = factory();
        const authStore = useAuthStore();

        await wrapper.find('#email-input').setValue('invalid-email');
        await wrapper.find('#password-input').setValue(user.password);
        await wrapper.find('form').trigger('submit.prevent');

        await flushPromises();

        expect(authStore.login).not.toBeCalled();
    });

    it('should give an error when the user has not entered a password', async () => {
        const wrapper = factory();
        const authStore = useAuthStore();

        await wrapper.find('#email-input').setValue(user.email);
        await wrapper.find('#password-input').setValue('');
        await wrapper.find('form').trigger('submit.prevent');

        await flushPromises();

        expect(authStore.login).not.toBeCalled();
    });

    it('should redirect users to the dashboard page after successfully logging in', async () => {
        const wrapper = factory();
        const authStore = useAuthStore();

        await wrapper.find('#email-input').setValue(user.email);
        await wrapper.find('#password-input').setValue(user.password);
        await wrapper.find('form').trigger('submit.prevent');

        authStore.user = user;
        await flushPromises();

        expect(useRouter().push).toHaveBeenCalledOnce();
        expect(useRouter().push).toHaveBeenCalledWith({
            name: 'dashboard',
        });
    });

    it('should not redirect the user to the dashboard when the user fails to log in successfully', async () => {
        const wrapper = factory();

        await wrapper.find('#email-input').setValue(user.email);
        await wrapper.find('#password-input').setValue(user.password);
        await wrapper.find('form').trigger('submit.prevent');

        await flushPromises();

        expect(useRouter().push).not.toBeCalled();
    });
});
