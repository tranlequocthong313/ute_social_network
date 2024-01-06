import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import usePostViolationStore from '@/stores/postViolationStore';
import useAdminActivityStore from '@/stores/adminActivityStore';
import * as http from '@/utils/http';

vi.mock('@/utils/http');
vi.mock('@/stores/adminActivityStore');

const posts = [
    {
        id: 1,
        reporter: {
            id: 1,
            name: 'Federica Housecraft',
            email: 'fhousecraft7@china.com.cn',
        },
        reportedPost: {
            id: 3,
            title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            content:
                'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.\n\nNam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.',
            link: '',
            author: {
                id: 3,
                name: 'Penn Canto',
            },
        },
        reportType: 'Spam',
        description:
            'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.',
        createdAt: '3/5/2023',
        status: 'pending',
    },
];

const post = {
    id: 2,
    reporter: {
        id: 3,
        name: 'Penn Canto',
        email: 'pcantoh@soundcloud.com',
    },
    reportedPost: {
        id: 2,
        title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        content:
            'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.',
        link: '',
        author: {
            id: 1,
            name: 'Federica Housecraft',
        },
    },
    reportType: 'Inappropriate Content',
    description:
        'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.',
    createdAt: '6/23/2023',
    status: 'pending',
};

const path = '/violating-posts';

describe('postViolationStore', () => {
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

    it('should have empty violationPosts by default', () => {
        const store = usePostViolationStore();

        expect(store.violationPosts).toEqual([]);
    });

    it('should have a list of violationPosts after getItems', async () => {
        const store = usePostViolationStore();

        await store.getItems({});

        expect(store.violationPosts).toEqual(posts);
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

        const store = usePostViolationStore();

        await store.getItems({});

        expect(store.error).toEqual('Something went wrong');
        expect(store.violationPosts).toEqual([]);
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

        const store = usePostViolationStore();

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

        const store = usePostViolationStore();
        store.violationPosts = items;

        expect(store.violationPosts).toEqual(items);
        await store.deleteItems([1, 2, 3]);

        expect(store.violationPosts).toEqual([]);
        expect(http.DELETE).toBeCalledTimes(3);
        expect(useAdminActivityStore().addItem).toBeCalledTimes(3);
    });

    it('should have error when approve failed', async () => {
        http.PATCH.mockResolvedValue({
            error: {
                message: 'Approve failed',
            },
        });

        const store = usePostViolationStore();

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

        const store = usePostViolationStore();
        store.violationPosts.push(post);

        expect(store.violationPosts).toContain(post);

        await store.approve(2);

        expect(store.violationPosts).not.toContain(post);

        expect(http.PATCH).toBeCalledWith(`${path}/2`, {
            status: 'resolved',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Approve post report',
            targetId: post.id,
        });
    });

    it('should have error when decline failed', async () => {
        http.PATCH.mockResolvedValue({
            error: {
                message: 'Decline failed',
            },
        });

        const store = usePostViolationStore();

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

        const store = usePostViolationStore();
        store.violationPosts.push(post);

        expect(store.violationPosts).toContain(post);

        await store.decline(2);

        expect(store.violationPosts).not.toContain(post);

        expect(http.PATCH).toBeCalledWith(`${path}/2`, {
            status: 'rejected',
        });
        expect(http.PATCH).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toHaveBeenCalledOnce();
        expect(useAdminActivityStore().addItem).toBeCalledWith({
            activityType: 'Decline post report',
            targetId: post.id,
        });
    });
});
