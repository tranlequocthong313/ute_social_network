import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useAuditAccountStore from '@/stores/auditAccountStore';
import useAdminActivityStore from '@/stores/adminActivityStore';
import * as http from '@/utils/http';

vi.mock('@/utils/http');
vi.mock('@/stores/adminActivityStore');

const users = [
    {
        id: 2,
        email: 'eburgerc@ted.com',
        password: '$2a$10$7qJrSHhZ5i/k3rJ5/xwcz.V.PJUa3xS.A8sV4rggznEsP9sz90buW',
        firstName: 'Elisabet',
        lastName: 'Burger',
        gender: 'female',
        dateOfBirth: '12/06/2001',
        phoneNumber: '09342352375',
        hometown: 'Ha Noi',
        type: 'lecturer',
        faculty: 'Art History and Archaeology Faculty',
        major: 'Information Technology',
        avatar: 'https://robohash.org/fugaatqueet.png?size=50x50&set=set1',
        status: 'pending',
        createdAt: '12/4/2021',
    },
    {
        email: 'ptmk@ou.edu.vn',
        password: '$2a$10$UbWjWq.OMhSlDmj31vAm2OUaf.Nxsmmp1J6gKKtkDZS47iWuZenn6',
        firstName: 'Khue',
        lastName: 'Minh Phan Tran',
        type: 'lecturer',
        faculty: 'Information Technology',
        major: null,
        gender: 'male',
        dateOfBirth: '1983-07-08',
        phoneNumber: '09525252525',
        hometown: 'Can Tho',
        schoolYear: null,
        status: 'pending',
        createdAt: '25-09-2023 05:02:10 PM',
        id: 6,
    },
];

const user = {
    email: 'school0123456@gmail.com',
    password: '$2a$10$VLRyP8UjIOxhSutGOEjVQOiJ0y4Ufygsl40qL9H/bg7ewBkEdSZou',
    firstName: 'Truong',
    lastName: 'Nguyen',
    type: 'student',
    faculty: 'Information Technology',
    major: 'Software Engineering',
    gender: 'male',
    dateOfBirth: '2001-09-14',
    phoneNumber: '0939302033',
    hometown: 'Thang Binh, Quang Nam',
    schoolYear: '2019-2023',
    status: 'pending',
    createdAt: '25-09-2023 05:59:22 PM',
    id: 1,
};

const path = '/users';

describe('auditAccountstore', () => {
    http.GET.mockResolvedValue({
        error: null,
        data: users,
        totalCount: users.length,
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

    it('should have empty auditAccounts by default', () => {
        const store = useAuditAccountStore();

        expect(store.auditAccounts).toEqual([]);
    });

    it('should have a list of auditAccounts after getItems', async () => {
        const store = useAuditAccountStore();

        await store.getItems({});

        expect(store.auditAccounts).toEqual(users);
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

        const store = useAuditAccountStore();

        await store.getItems({});

        expect(store.error).toEqual('Something went wrong');
        expect(store.auditAccounts).toEqual([]);
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

        const store = useAuditAccountStore();

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

        const store = useAuditAccountStore();
        store.auditAccounts = items;

        expect(store.auditAccounts).toEqual(items);
        await store.deleteItems([1, 2, 3]);

        expect(store.auditAccounts).toEqual([]);
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).toBeCalledTimes(3);
    });

    it('should have error when approve failed', async () => {
        http.PATCH.mockResolvedValue({
            error: {
                message: 'Approve failed',
            },
        });

        const store = useAuditAccountStore();

        await store.approve(1);

        expect(store.error).toEqual('Approve failed');
        expect(http.PATCH).toBeCalledWith(`${path}/1`, {
            status: 'active',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should approve', async () => {
        http.PATCH.mockResolvedValue({
            error: null,
        });

        const store = useAuditAccountStore();
        store.auditAccounts.push(user);

        expect(store.auditAccounts).toContain(user);

        await store.approve(1);

        expect(store.auditAccounts).not.toContain(user);

        expect(http.PATCH).toBeCalledWith(`${path}/1`, {
            status: 'active',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Approve account',
            targetId: user.id,
        });
    });

    it('should have error when decline failed', async () => {
        http.PATCH.mockResolvedValue({
            error: {
                message: 'Decline failed',
            },
        });

        const store = useAuditAccountStore();

        await store.decline(1);

        expect(store.error).toEqual('Decline failed');
        expect(http.PATCH).toBeCalledWith(`${path}/1`, {
            status: 'rejected',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should decline', async () => {
        http.PATCH.mockResolvedValue({
            error: null,
        });

        const store = useAuditAccountStore();
        store.auditAccounts.push(user);

        expect(store.auditAccounts).toContain(user);

        await store.decline(1);

        expect(store.auditAccounts).not.toContain(user);

        expect(http.PATCH).toBeCalledWith(`${path}/1`, {
            status: 'rejected',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Decline account',
            targetId: user.id,
        });
    });
});
