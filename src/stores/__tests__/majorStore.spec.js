import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useMajorStore from '@/stores/majorStore';
import useAdminActivityStore from '@/stores/adminActivityStore';
import * as http from '@/utils/http';

vi.mock('@/utils/http');
vi.mock('@/stores/adminActivityStore');

const majors = [
    {
        id: 1,
        name: 'Information Technology',
        abbreviation: 'IT',
        faculty: 4,
    },
    {
        id: 2,
        name: 'Software Engineering',
        abbreviation: 'SE',
        faculty: 4,
    },
];

const major = {
    id: 3,
    name: 'Computer Science',
    abbreviation: 'CS',
    faculty: 4,
};

const path = '/majors';

describe('majorStore', () => {
    http.GET.mockResolvedValue({
        error: null,
        data: majors,
        totalCount: majors.length,
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

    it('should have empty majors by default', () => {
        const store = useMajorStore();

        expect(store.majors).toEqual([]);
    });

    it('should have a list of majors after getItems', async () => {
        const store = useMajorStore();
        store.faculty = 4;

        await store.getItems({});

        expect(store.majors).toEqual(majors);
        expect(http.GET).toHaveBeenCalledOnce();
        expect(http.GET).toBeCalledWith(`${path}?faculty=${store.faculty}`, {
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

        const store = useMajorStore();
        store.faculty = 4;

        await store.getItems({});

        expect(store.error).toEqual('Something went wrong');
        expect(store.majors).toEqual([]);
        expect(http.GET).toHaveBeenCalledOnce();
        expect(http.GET).toBeCalledWith(`${path}?faculty=${store.faculty}`, {
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

        const store = useMajorStore();

        await store.addItem(major);

        expect(store.error).toEqual('Add failed');
        expect(http.POST).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should add item', async () => {
        http.POST.mockResolvedValue({
            data: major,
        });

        const store = useMajorStore();

        await store.addItem(major);

        expect(store.majors).toContain(major);
        expect(http.POST).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Add new major',
            targetId: major.id,
        });
    });

    it('should have error when edit item failed', async () => {
        const editItem = {
            ...major,
            name: 'Medical',
        };

        http.PATCH.mockResolvedValue({
            error: {
                message: 'Edit failed',
            },
        });

        const store = useMajorStore();

        await store.editItem(editItem);

        expect(store.error).toEqual('Edit failed');
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(http.PATCH).toBeCalledWith(`${path}/${major.id}`, editItem);
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should edit item', async () => {
        const editItem = {
            ...major,
            name: 'Medical',
        };

        http.PATCH.mockResolvedValue({
            data: editItem,
        });

        const store = useMajorStore();
        store.majors.push(major);

        await store.editItem(editItem);

        expect(store.majors).toContain(editItem);
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(http.PATCH).toBeCalledWith(`${path}/${major.id}`, editItem);
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Edit major',
            targetId: major.id,
        });
    });

    it('should have error when delete items failed', async () => {
        http.DELETE.mockResolvedValue({
            error: {
                message: 'Delete failed',
            },
        });

        const store = useMajorStore();

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

        const store = useMajorStore();
        store.majors = items;

        expect(store.majors).toEqual(items);
        await store.deleteItems([1, 2, 3]);

        expect(store.majors).toEqual([]);
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).toBeCalledTimes(3);
    });
});
