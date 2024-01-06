import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useAuditPostStore from '@/stores/auditPostStore';
import useAdminActivityStore from '@/stores/adminActivityStore';
import * as http from '@/utils/http';

vi.mock('@/utils/http');
vi.mock('@/stores/adminActivityStore');

const posts = [
    {
        id: 2,
        title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        content:
            'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.',
        author: 'Federica Housecraft',
        status: 'pending',
    },
    {
        id: 3,
        title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        content:
            'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.\n\nNam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.',
        author: 'Penn Canto',
        status: 'pending',
    },
];

const path = '/posts';

describe('postStore', () => {
    http.GET.mockResolvedValue({
        error: null,
        data: posts,
        totalCount: posts.length,
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

    it('should have empty posts by default', () => {
        const store = useAuditPostStore();

        expect(store.auditPosts).toEqual([]);
    });

    it('should have a list of posts after getItems', async () => {
        const store = useAuditPostStore();

        await store.getItems({});

        expect(store.auditPosts).toEqual(posts);
        expect(http.GET).toHaveBeenCalledOnce();
        expect(http.GET).toBeCalledWith(`${path}?status=pending`, {
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

        const store = useAuditPostStore();

        await store.getItems({});

        expect(store.error).toEqual('Something went wrong');
        expect(store.auditPosts).toEqual([]);
        expect(http.GET).toHaveBeenCalledOnce();
        expect(http.GET).toBeCalledWith(`${path}?status=pending`, {
            params: {
                _sort: 'id',
                _order: 'desc',
                _page: 1,
                _limit: 10,
                q: '',
            },
        });
    });

    it('should have error when delete items failed', async () => {
        http.DELETE.mockResolvedValue({
            error: {
                message: 'Delete failed',
            },
        });

        const store = useAuditPostStore();

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

        const store = useAuditPostStore();
        store.auditPosts = items;

        expect(store.auditPosts).toEqual(items);
        await store.deleteItems([1, 2, 3]);

        expect(store.auditPosts).toEqual([]);
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).toBeCalledTimes(3);
    });
});
