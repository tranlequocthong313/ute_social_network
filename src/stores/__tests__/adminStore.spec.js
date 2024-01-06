import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useAdminStore from '@/stores/adminStore';
import useAdminActivityStore from '@/stores/adminActivityStore';
import * as http from '@/utils/http';

vi.mock('@/utils/http');
vi.mock('@/stores/adminActivityStore');

const admins = [
    {
        id: 1,
        email: 'tranlequocthong313@gmail.com',
        password: '2525461325',
        role: 'serveradmin',
        avatar: 'https://robohash.org/fugaatqueet.png?size=50x50&set=set1',
        createdAt: '2023-09-18T10:00:00Z',
    },
    {
        email: 'school0123456@gmail.com',
        role: 'sysadmin',
        password: 'rrljfy38',
        createdAt: '25-09-2023 11:29:11 AM',
        id: 2,
    },
];

const admin = {
    email: 'khangnguyen@gmail.com',
    role: 'processadmin',
    password: 'theb689q',
    createdAt: '25-09-2023 00:51:15 PM',
    id: 4,
};

const path = '/admins';

describe('adminStore', () => {
    http.GET.mockResolvedValue({
        error: null,
        data: admins,
        totalCount: admins.length,
    });
    useAdminActivityStore.mockReturnValue({
        addItem: vi.fn(),
    });

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should have empty admins by default', () => {
        const store = useAdminStore();

        expect(store.admins).toEqual([]);
    });

    it('should have a list of admins after getItems', async () => {
        const store = useAdminStore();

        await store.getItems({});

        expect(store.admins).toEqual(admins);
        expect(http.GET).toHaveBeenCalledOnce();
        expect(http.GET).toBeCalledWith(`${path}`, {
            params: {
                _sort: 'id',
                _order: 'desc',
                _page: 1,
                _limit: 10,
                q: '',
            },
        });
    });

    it('should have an error when getItems failed', async () => {
        http.GET.mockResolvedValue({
            error: {
                message: 'Something went wrong',
            },
        });

        const store = useAdminStore();

        await store.getItems({});

        expect(store.error).toEqual('Something went wrong');
        expect(store.admins).toEqual([]);
        expect(http.GET).toHaveBeenCalledOnce();
        expect(http.GET).toBeCalledWith(`${path}`, {
            params: {
                _sort: 'id',
                _order: 'desc',
                _page: 1,
                _limit: 10,
                q: '',
            },
        });
    });

    it('should have error when add item failed', async () => {
        http.POST.mockResolvedValue({
            error: {
                message: 'Add failed',
            },
        });

        const store = useAdminStore();

        await store.addItem(admin);

        expect(store.error).toEqual('Add failed');
        expect(http.POST).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should add item', async () => {
        http.POST.mockResolvedValue({
            data: admin,
        });

        const store = useAdminStore();

        await store.addItem(admin);

        expect(store.admins).toContain(admin);
        expect(http.POST).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Add new admin',
            targetId: admin.id,
        });
    });

    it('should have error when edit item failed', async () => {
        const editItem = {
            ...admin,
            role: 'setupadmin',
        };

        http.PATCH.mockResolvedValue({
            error: {
                message: 'Edit failed',
            },
        });

        const store = useAdminStore();

        await store.editItem(editItem);

        expect(store.error).toEqual('Edit failed');
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(http.PATCH).toBeCalledWith(`${path}/${admin.id}`, editItem);
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should edit item', async () => {
        const editItem = {
            ...admin,
            role: 'setupadmin',
        };

        http.PATCH.mockResolvedValue({
            data: editItem,
        });

        const store = useAdminStore();
        store.admins.push(admin);

        await store.editItem(editItem);

        expect(store.admins).toContain(editItem);
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(http.PATCH).toBeCalledWith(`${path}/${admin.id}`, editItem);
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Edit admin',
            targetId: admin.id,
        });
    });

    it('should have error when delete items failed', async () => {
        http.DELETE.mockResolvedValue({
            error: {
                message: 'Delete failed',
            },
        });

        const store = useAdminStore();

        await store.deleteItems([1, 2, 3]);

        expect(store.error).toEqual('Delete failed');
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should delete items', async () => {
        http.DELETE.mockResolvedValue({
            error: null,
        });

        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

        const store = useAdminStore();
        store.admins = items;

        expect(store.admins).toEqual(items);
        await store.deleteItems([1, 2, 3]);

        expect(store.admins).toEqual([]);
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).toBeCalledTimes(3);
    });
});
