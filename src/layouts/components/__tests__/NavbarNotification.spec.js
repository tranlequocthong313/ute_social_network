import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import observer from 'resize-observer-polyfill';

import NavbarNotification from '@/layouts/components/NavbarNotification.vue';

// eslint-disable-next-line no-undef
global.ResizeObserver = observer;

const vuetify = createVuetify({
    components,
    directives,
});

const generateRandomNotifications = (size) => {
    const items = [];
    let unread = 0;

    for (let i = 0; i < size; i++) {
        const read = Math.floor(Math.random() * 100) % 2 === 0;
        unread = read === true ? unread : unread + 1;
        items.push({
            id: i,
            sender: {
                id: i,
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'avatar',
            },
            message: 'auditPost',
            createdAt: Date.now(),
            read,
            to: '/',
            timeAgo: '5 mins ago',
        });
    }

    return {
        items,
        unread,
        read: items.length - unread,
    };
};

const mountComponent = (size) => {
    const { items, unread, read } = generateRandomNotifications(size);
    return {
        wrapper: mount(NavbarNotification, {
            props: {
                items,
            },
            global: {
                plugins: [vuetify],
            },
        }),
        unread,
        read,
    };
};

describe('NavbarNotification', () => {
    it('should have correct notifications state', async () => {
        const { wrapper, unread, read } = mountComponent(50);

        expect(wrapper.vm.unreadNotifications.length).toEqual(unread);
        expect(wrapper.vm.notifications.length - wrapper.vm.unreadNotifications.length).toEqual(read);
    });

    it('should be no more unread notifications when user clicks to mark all as read', async () => {
        const { wrapper, unread } = mountComponent(50);

        expect(wrapper.vm.unreadNotifications.length).toEqual(unread);

        wrapper.vm.markReadAll();

        expect(wrapper.vm.unreadNotifications.length).toEqual(0);
    });

    it('should mark as read when the user clicks on an unread notification', async () => {
        const { wrapper, unread } = mountComponent(50);

        expect(wrapper.vm.unreadNotifications.length).toEqual(unread);

        for (let item of wrapper.vm.notifications) {
            if (!item.read) {
                wrapper.vm.readNotification(item);
            }
        }

        expect(wrapper.vm.unreadNotifications.length).toEqual(0);
    });

    it('should display all notifications when in the all tab', async () => {
        const { wrapper } = mountComponent(50);

        expect(wrapper.vm.notifications.length).toEqual(50);
    });

    it('should only display unread notifications when in the unread tab', async () => {
        const { wrapper, unread } = mountComponent(50);

        wrapper.vm.notificationTab = 'unread';

        expect(wrapper.vm.notifications.length).toEqual(unread);
    });
});
