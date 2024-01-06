import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useFacultyStore from '@/stores/facultyStore';
import useAdminActivityStore from '@/stores/adminActivityStore';
import * as http from '@/utils/http';

vi.mock('@/utils/http');
vi.mock('@/stores/adminActivityStore');

const faculties = [
    {
        id: 1,
        name: 'Astronomy and Astrophysics Faculty',
        abbreviation: 'AAD',
    },
    {
        id: 2,
        name: 'Art History and Archaeology Faculty',
        abbreviation: 'AHAD',
    },
];

const faculty = {
    id: 4,
    name: 'Information Technology',
    abbreviation: 'IT',
};

const path = '/faculties';

describe('facultyStore', () => {
    http.GET.mockResolvedValue({
        error: null,
        data: faculties,
        totalCount: faculties.length,
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

    it('should have empty faculties by default', () => {
        const store = useFacultyStore();

        expect(store.faculties).toEqual([]);
    });

    it('should have a list of faculties after getItems', async () => {
        const store = useFacultyStore();

        await store.getItems({});

        expect(store.faculties).toEqual(faculties);
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

        const store = useFacultyStore();

        await store.getItems({});

        expect(store.error).toEqual('Something went wrong');
        expect(store.faculties).toEqual([]);
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

        const store = useFacultyStore();

        await store.addItem(faculty);

        expect(store.error).toEqual('Add failed');
        expect(http.POST).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should add item', async () => {
        http.POST.mockResolvedValue({
            data: faculty,
        });

        const store = useFacultyStore();

        await store.addItem(faculty);

        expect(store.faculties).toContain(faculty);
        expect(http.POST).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Add new faculty',
            targetId: faculty.id,
        });
    });

    it('should have error when edit item failed', async () => {
        const editItem = {
            ...faculty,
            name: 'Medical',
        };

        http.PATCH.mockResolvedValue({
            error: {
                message: 'Edit failed',
            },
        });

        const store = useFacultyStore();

        await store.editItem(editItem);

        expect(store.error).toEqual('Edit failed');
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(http.PATCH).toBeCalledWith(`${path}/${faculty.id}`, editItem);
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should edit item', async () => {
        const editItem = {
            ...faculty,
            name: 'Medical',
        };

        http.PATCH.mockResolvedValue({
            data: editItem,
        });

        const store = useFacultyStore();
        store.faculties.push(faculty);

        await store.editItem(editItem);

        expect(store.faculties).toContain(editItem);
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(http.PATCH).toBeCalledWith(`${path}/${faculty.id}`, editItem);
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Edit faculty',
            targetId: faculty.id,
        });
    });

    it('should have error when delete items failed', async () => {
        http.DELETE.mockResolvedValue({
            error: {
                message: 'Delete failed',
            },
        });

        const store = useFacultyStore();

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

        const store = useFacultyStore();
        store.faculties = items;

        expect(store.faculties).toEqual(items);
        await store.deleteItems([1, 2, 3]);

        expect(store.faculties).toEqual([]);
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).toBeCalledTimes(3);
    });
});
