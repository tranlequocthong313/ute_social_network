import { createRouter, createWebHistory } from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import NavbarLayout from '@/layouts/NavbarLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';

import useAuthStore from '@/stores/authStore.js';
import DashboardPage from '@/pages/DashboardPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import UserManagementPage from '@/pages/UserManagementPage.vue';
import SchoolYearManagementPage from '@/pages/SchoolYearManagementPage.vue';
import FacultyPage from '@/pages/FacultyPage.vue';
import AdminGroupPage from '@/pages/AdminGroupPage.vue';
import AuditPostPage from '@/pages/AuditPostPage.vue';
import AuditAccountPage from '@/pages/AuditAccountPage.vue';
import PostViolationPage from '@/pages/PostViolationPage.vue';
import AccountViolationPage from '@/pages/AccountViolationPage.vue';
import AdminManagementPage from '@/pages/AdminManagementPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import ChangePasswordPage from '@/pages/ChangePasswordPage.vue';
import ResourceManagementPage from '@/pages/ResourceManagementPage.vue';

const mainSidebarItems = [
    { title: 'dashboard', activeValue: 'dashboard', icon: 'mdi-home', route: 'dashboard' },
    { header: 'management' },
    {
        title: 'user',
        activeValue: 'user-management',
        icon: 'mdi-account-multiple',
        route: 'userManagement',
    },
    {
        title: 'schoolYear',
        activeValue: 'school-year',
        icon: 'mdi-calendar',
        route: 'schoolYear',
    },
    {
        title: 'faculty',
        activeValue: 'faculty',
        icon: 'mdi-domain',
        route: 'faculty',
    },
    {
        title: 'admin',
        activeValue: 'admin',
        icon: 'mdi mdi-account',
        route: 'adminManagement',
    },
    {
        title: 'adminGroup',
        activeValue: 'adminGroup',
        icon: 'mdi mdi-account-group',
        route: 'adminGroup',
    },
    {
        title: 'resource',
        activeValue: 'resource',
        icon: 'mdi mdi-vector-link',
        route: 'resource',
    },
    { header: 'audit' },
    { title: 'post', activeValue: 'audit-post', icon: 'mdi-note-text', route: 'auditPost' },
    {
        title: 'signup-account',
        activeValue: 'audit-signup-account',
        icon: 'mdi-account-plus',
        route: 'auditAccount',
    },
    { header: 'report-violation' },
    { title: 'post', activeValue: 'report-violation-post', icon: 'mdi-note-remove', route: 'reportPost' },
    {
        title: 'account',
        activeValue: 'report-violation-account',
        icon: 'mdi-account-alert',
        route: 'reportAccount',
    },
];

const profileSidebarItems = [
    { title: 'profile', activeValue: 'profile', icon: 'mdi-account', route: 'profile' },
    { header: 'modify' },
    { title: 'changePassword', activeValue: 'change-password', icon: 'mdi-onepassword', route: 'changePassword' },
];

export const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
            layout: EmptyLayout,
        },
    },
    {
        path: '/',
        name: 'dashboard',
        component: DashboardPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/resources',
        name: 'resource',
        component: ResourceManagementPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/users',
        name: 'userManagement',
        component: UserManagementPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/school-years',
        name: 'schoolYear',
        component: SchoolYearManagementPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/faculties',
        name: 'faculty',
        component: FacultyPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/admin-group',
        name: 'adminGroup',
        component: AdminGroupPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/admins',
        name: 'adminManagement',
        component: AdminManagementPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/audit/post',
        name: 'auditPost',
        component: AuditPostPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/audit/account',
        name: 'auditAccount',
        component: AuditAccountPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/report/post',
        name: 'reportPost',
        component: PostViolationPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/report/account',
        name: 'reportAccount',
        component: AccountViolationPage,
        meta: {
            layout: MainLayout,
            sidebarItems: mainSidebarItems,
        },
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfilePage,
        meta: {
            layout: MainLayout,
            sidebarItems: profileSidebarItems,
        },
    },
    {
        path: '/profile/change-password',
        name: 'changePassword',
        component: ChangePasswordPage,
        meta: {
            layout: MainLayout,
            sidebarItems: profileSidebarItems,
        },
    },
    {
        path: '/:catchAll(.*)',
        name: 'notFound',
        component: NotFoundPage,
        meta: {
            layout: NavbarLayout,
        },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior: () => {
        return { top: 0 };
    },
    routes,
});
router.beforeEach((to, from, next) => {
    const store = useAuthStore();

    if (store.loggedIn && to.name === 'login') {
        next({ name: 'dashboard' });
    } else if (!store.loggedIn && to.name !== 'login') {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router;
