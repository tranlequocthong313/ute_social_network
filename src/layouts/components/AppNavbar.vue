<script setup>
    import { ref } from 'vue';

    import logo from '@/assets/images/logo-white.png';
    import NavbarUserProfile from './NavbarUserProfile.vue';
    import NavbarNotification from './NavbarNotification.vue';
    import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
    import useSidebarStore from '@/stores/sidebarStore';
    import avatar from '@/assets/images/hcmute_logo.png';

    const sidebarStore = useSidebarStore();

    const messages = {
        AUDIT_POST: 'auditPost',
        AUDIT_ACCOUNT: 'auditAccount',
        REPORT_ACCOUNT: 'reportAccount',
        REPORT_POST: 'reportPost',
    };
    const notifications = ref([
        {
            id: 1,
            sender: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                avatar: avatar,
            },
            message: messages.AUDIT_POST,
            createdAt: Date.now(),
            read: true,
            to: '/',
            timeAgo: '5 mins ago',
        },
        {
            id: 2,
            sender: {
                id: 2,
                firstName: 'Alice',
                lastName: 'Smith',
                avatar: avatar,
            },
            message: messages.AUDIT_ACCOUNT,
            createdAt: Date.now() - 10000,
            read: false,
            to: '/',
            timeAgo: '13 hours ago',
        },
        {
            id: 3,
            sender: {
                id: 3,
                firstName: 'Bob',
                lastName: 'Johnson',
                avatar: avatar,
            },
            message: messages.REPORT_ACCOUNT,
            createdAt: Date.now() - 20000,
            read: true,
            to: '/',
            timeAgo: '2 weeks ago',
        },
        {
            id: 4,
            sender: {
                id: 4,
                firstName: 'Eve',
                lastName: 'Anderson',
                avatar: avatar,
            },
            message: messages.REPORT_POST,
            createdAt: Date.now() - 30000,
            read: false,
            to: '/',
            timeAgo: '1 month ago',
        },
        {
            id: 5,
            sender: {
                id: 4,
                firstName: 'Eve',
                lastName: 'Anderson',
                avatar: avatar,
            },
            message: messages.REPORT_POST,
            createdAt: Date.now() - 30000,
            read: true,
            to: '/',
            timeAgo: '4 months ago',
        },
        {
            id: 6,
            sender: {
                id: 4,
                firstName: 'Eve',
                lastName: 'Anderson',
                avatar: avatar,
            },
            message: messages.REPORT_POST,
            createdAt: Date.now() - 30000,
            read: true,
            to: '/',
            timeAgo: '6 months ago',
        },
        {
            id: 7,
            sender: {
                id: 4,
                firstName: 'Eve',
                lastName: 'Anderson',
                avatar: avatar,
            },
            message: messages.REPORT_POST,
            createdAt: Date.now() - 30000,
            read: false,
            to: '/',
            timeAgo: '1 year ago',
        },
        {
            id: 8,
            sender: {
                id: 4,
                firstName: 'Eve',
                lastName: 'Anderson',
                avatar: avatar,
            },
            message: messages.REPORT_POST,
            createdAt: Date.now() - 30000,
            read: true,
            to: '/',
            timeAgo: '3 years ago',
        },
        {
            id: 9,
            sender: {
                id: 4,
                firstName: 'Eve',
                lastName: 'Anderson',
                avatar: avatar,
            },
            message: messages.REPORT_POST,
            createdAt: Date.now() - 30000,
            read: false,
            to: '/',
            timeAgo: '3 years ago',
        },
        {
            id: 10,
            sender: {
                id: 4,
                firstName: 'Eve',
                lastName: 'Anderson',
                avatar: avatar,
            },
            message: messages.REPORT_POST,
            createdAt: Date.now() - 30000,
            read: true,
            to: '/',
            timeAgo: '5 years ago',
        },
    ]);
</script>

<template>
    <VAppBar class="appbar px-4 px-md-6">
        <RouterLink :to="{ name: 'dashboard' }" class="d-none d-lg-flex align-center">
            <VAvatar class="logo" :image="logo"></VAvatar>
            <span class="logo-text">UTeSocial Admin</span>
        </RouterLink>

        <VAppBarNavIcon class="d-block d-lg-none" @click="sidebarStore.toggleSidebar" />

        <VSpacer></VSpacer>
        <div class="mx-3">
            <ThemeSwitcher />
        </div>
        <div class="mx-3">
            <NavbarNotification :items="notifications" />
        </div>
        <div class="ml-3">
            <NavbarUserProfile />
        </div>
    </VAppBar>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .appbar {
        position: fixed !important;
        z-index: 999;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .logo {
            border-radius: 14px;
            background-color: var(--primary-color);
            margin-right: 6px;

            img {
                width: var(--logo-width);
                height: var(--logo-height);
            }
        }

        .logo-text {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        i {
            color: var(--light-text-color-3);
        }
    }

    .appbar.v-theme--dark {
        i {
            color: var(--dark-text-color);
        }
    }
</style>
