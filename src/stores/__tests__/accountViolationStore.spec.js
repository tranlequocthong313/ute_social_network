import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useAccountViolationStore from '@/stores/accountViolationStore';
import useAdminActivityStore from '@/stores/adminActivityStore';
import * as http from '@/utils/http';

vi.mock('@/utils/http');
vi.mock('@/stores/adminActivityStore');

const users = [
    {
        id: 1,
        reporter: {
            id: 1,
            name: 'Federica Housecraft',
            email: 'fhousecraft7@china.com.cn',
        },
        reportedAccount: {
            id: 3,
            name: 'Penn Canto',
            email: 'pcantoh@soundcloud.com',
        },
        reportType: 'Harassment',
        description:
            'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.\n\nSed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.',
        createdAt: '6/23/2023',
        status: 'pending',
    },
];

const user = {
    id: 2,
    reporter: {
        id: 3,
        name: 'Penn Canto',
        email: 'pcantoh@soundcloud.com',
    },
    reportedAccount: {
        id: 1,
        name: 'Federica Housecraft',
        email: 'fhousecraft7@china.com.cn',
    },
    reportType: 'Other',
    description:
        'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.',
    createdAt: '4/12/2023',
    status: 'pending',
};

const path = '/violating-accounts';

describe('accountViolationStore', () => {
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

    it('should have empty violationAccounts by default', () => {
        const store = useAccountViolationStore();

        expect(store.violationAccounts).toEqual([]);
    });

    it('should have a list of violationAccounts after getItems', async () => {
        const store = useAccountViolationStore();

        await store.getItems({});

        expect(store.violationAccounts).toEqual(users);
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

        const store = useAccountViolationStore();

        await store.getItems({});

        expect(store.error).toEqual('Something went wrong');
        expect(store.violationAccounts).toEqual([]);
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

        const store = useAccountViolationStore();

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

        const store = useAccountViolationStore();
        store.violationAccounts = items;

        expect(store.violationAccounts).toEqual(items);
        await store.deleteItems([1, 2, 3]);

        expect(store.violationAccounts).toEqual([]);
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).toBeCalledTimes(3);
    });

    it('should have error when approve failed', async () => {
        http.PATCH.mockResolvedValue({
            error: {
                message: 'Approve failed',
            },
        });

        const store = useAccountViolationStore();

        await store.approve(2);

        expect(store.error).toEqual('Approve failed');
        expect(http.PATCH).toBeCalledWith(`${path}/2`, {
            status: 'resolved',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should approve', async () => {
        http.PATCH.mockResolvedValue({
            error: null,
        });

        const store = useAccountViolationStore();
        store.violationAccounts.push(user);

        expect(store.violationAccounts).toContain(user);

        await store.approve(2);

        expect(store.violationAccounts).not.toContain(user);

        expect(http.PATCH).toBeCalledWith(`${path}/2`, {
            status: 'resolved',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Approve account report',
            targetId: user.id,
        });
    });

    it('should have error when decline failed', async () => {
        http.PATCH.mockResolvedValue({
            error: {
                message: 'Decline failed',
            },
        });

        const store = useAccountViolationStore();

        await store.decline(2);

        expect(store.error).toEqual('Decline failed');
        expect(http.PATCH).toBeCalledWith(`${path}/2`, {
            status: 'rejected',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).not.toBeCalled();
    });

    it('should decline', async () => {
        http.PATCH.mockResolvedValue({
            error: null,
        });

        const store = useAccountViolationStore();
        store.violationAccounts.push(user);

        expect(store.violationAccounts).toContain(user);

        await store.decline(2);

        expect(store.violationAccounts).not.toContain(user);

        expect(http.PATCH).toBeCalledWith(`${path}/2`, {
            status: 'rejected',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Decline account report',
            targetId: user.id,
        });
    });
});
