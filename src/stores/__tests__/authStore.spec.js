import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRouter } from 'vue-router';

import { POST } from '@/utils/http.js';
import useAuthStore from '@/stores/authStore';

vi.mock('@/utils/http.js');
vi.mock('vue-router');

const user = {
    email: 'admin@gmail.com',
    password: 'password',
};

const fakeData = {
    accessToken: 'token',
    user: {
        id: 1,
        email: user.email,
    },
};

describe('authStore', () => {
    POST.mockReturnValue({
        error: null,
        data: fakeData,
    });

    useRouter.mockReturnValue({
        push: vi.fn(),
    });

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return false when the user is not logged in', () => {
        const store = useAuthStore();

        expect(store.loggedIn).toBeFalsy();
    });

    it('should return true when the user is logged in', async () => {
        const store = useAuthStore();

        await store.login(user);

        expect(POST).toHaveBeenCalledOnce();
        expect(POST).toBeCalledWith('/login', user);
        expect(store.error).toBeNull();
        expect(store.user).toEqual(fakeData.user);
        expect(store.loggedIn).toBeTruthy();
    });

    it('should redirect user to the login page when logging out', async () => {
        const store = useAuthStore();

        await store.login(user);
        expect(store.loggedIn).toBeTruthy();

        await store.logout();
        expect(store.loggedIn).toBeFalsy();
        expect(useRouter().push).toHaveBeenCalledOnce();
        expect(useRouter().push).toBeCalledWith({ name: 'login' });
    });
});
