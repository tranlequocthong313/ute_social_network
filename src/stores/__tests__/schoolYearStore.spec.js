import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useSchoolYearStore from '@/stores/schoolYearStore';
import useAdminActivityStore from '@/stores/adminActivityStore';
import * as http from '@/utils/http';

vi.mock('@/utils/http');
vi.mock('@/stores/adminActivityStore');

const schoolYears = [
    {
        name: '2021-2025',
        startDate: '2021-09-10',
        endDate: '2025-10-25',
        createdAt: '25-09-2023 04:31:52 PM',
        id: 1,
    },
    {
        name: '2020-2024',
        startDate: '2020-09-03',
        endDate: '2024-09-14',
        createdAt: '25-09-2023 04:34:26 PM',
        id: 2,
    },
];

const schoolYear = {
    name: '2020-2024',
    startDate: '2020-09-03',
    endDate: '2024-09-14',
    createdAt: '25-09-2023 04:34:26 PM',
    id: 3,
};

const path = '/school-years';

describe('schoolYearStore', () => {
    http.GET.mockResolvedValue({
        error: null,
        data: schoolYears,
        totalCount: schoolYears.length,
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

    it('should have empty school years by default', () => {
        const store = useSchoolYearStore();

        expect(store.schoolYears).toEqual([]);
    });

    it('should have a list of school years after getItems', async () => {
        const store = useSchoolYearStore();

        await store.getItems({});

        expect(store.schoolYears).toEqual(schoolYears);
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

        const store = useSchoolYearStore();

        await store.getItems({});

        expect(store.error).toEqual('Something went wrong');
        expect(store.schoolYears).toEqual([]);
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

        const store = useSchoolYearStore();

        await store.addItem(schoolYear);

        expect(store.error).toEqual('Add failed');
        expect(http.POST).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should add item', async () => {
        http.POST.mockResolvedValue({
            data: schoolYear,
        });

        const store = useSchoolYearStore();

        await store.addItem(schoolYear);

        expect(store.schoolYears).toContain(schoolYear);
        expect(http.POST).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Add new school year',
            targetId: schoolYear.id,
        });
    });

    it('should have error when edit item failed', async () => {
        const editItem = {
            ...schoolYear,
            name: '2026-2028',
        };

        http.PATCH.mockResolvedValue({
            error: {
                message: 'Edit failed',
            },
        });

        const store = useSchoolYearStore();

        await store.editItem(editItem);

        expect(store.error).toEqual('Edit failed');
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(http.PATCH).toBeCalledWith(`${path}/${schoolYear.id}`, editItem);
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should edit item', async () => {
        const editItem = {
            ...schoolYear,
            name: '2026-2028',
        };

        http.PATCH.mockResolvedValue({
            data: editItem,
        });

        const store = useSchoolYearStore();
        store.schoolYears.push(schoolYear);

        await store.editItem(editItem);

        expect(store.schoolYears).toContain(editItem);
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(http.PATCH).toBeCalledWith(`${path}/${schoolYear.id}`, editItem);
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Edit school year',
            targetId: schoolYear.id,
        });
    });

    it('should have error when delete items failed', async () => {
        http.DELETE.mockResolvedValue({
            error: {
                message: 'Delete failed',
            },
        });

        const store = useSchoolYearStore();

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

        const store = useSchoolYearStore();
        store.schoolYears = items;

        expect(store.schoolYears).toEqual(items);
        await store.deleteItems([1, 2, 3]);

        expect(store.schoolYears).toEqual([]);
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).toBeCalledTimes(3);
    });
});
