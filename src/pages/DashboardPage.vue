<script setup>
    import { storeToRefs } from 'pinia';
    import { onMounted } from 'vue';

    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
    import { translate } from '@/locales/translator.js';
    import AccountRegisteredChart from '@/components/charts/AccountRegisteredChart.vue';
    import PostPublishedChart from '@/components/charts/PostPublishedChart.vue';
    import GenderChart from '@/components/charts/GenderChart.vue';
    import AveragePostStatChart from '@/components/charts/AveragePostStatChart.vue';
    import usePostViolationStore from '@/stores/postViolationStore.js';
    import useAccountViolationStore from '@/stores/accountViolationStore.js';
    import TableWithoutPaging from '@/components/TableWithoutPaging.vue';
    import useUserMangementStore from '@/stores/userManagementStore.js';
    import StatusChip from '@/components/StatusChip.vue';
    import useAdminActivityStore from '@/stores/adminActivityStore.js';

    // for developing without real backend
    const totalStats = [
        {
            label: 'onlineAccount',
            value: '25.000',
            direction: 'up',
            percent: '+3%',
            time: 'then hour ago',
        },
        {
            label: 'totalUser',
            value: '100.000',
            direction: 'up',
            percent: '+24%',
            time: 'then week ago',
        },
        {
            label: 'totalPost',
            value: '1.000.000',
            direction: 'up',
            percent: '+80%',
            time: 'then week ago',
        },
        {
            label: 'onlineAdmin',
            value: '5',
            direction: 'down',
            percent: '-4%',
            time: 'then hour ago',
        },
    ];

    const accountViolationHeaders = [
        {
            title: translate('id'),
            key: 'id',
            align: 'center',
        },
        {
            title: translate('reporter'),
            key: 'reporter.name',
            align: 'center',
        },
        {
            title: translate('reportedAccount'),
            key: 'reportedAccount.name',
            align: 'center',
        },
        {
            title: translate('type'),
            key: 'reportType',
            align: 'center',
        },
        {
            title: translate('createdAt'),
            key: 'createdAt',
            align: 'center',
        },
        {
            title: translate('status'),
            key: 'status',
            align: 'center',
        },
    ];

    const postViolationHeaders = [
        {
            title: translate('id'),
            key: 'id',
            align: 'center',
        },
        {
            title: translate('reporter'),
            key: 'reporter.name',
            align: 'center',
        },
        {
            title: translate('reportedPost'),
            key: 'reportedPost.title',
            align: 'center',
        },
        {
            title: translate('type'),
            key: 'reportType',
            align: 'center',
        },
        {
            title: translate('createdAt'),
            key: 'createdAt',
            align: 'center',
        },
        {
            title: translate('status'),
            key: 'status',
            align: 'center',
        },
    ];

    const userMangementHeaders = [
        {
            title: translate('id'),
            key: 'id',
            align: 'center',
        },
        {
            title: translate('email'),
            key: 'email',
            align: 'center',
        },
        {
            title: translate('type'),
            key: 'type',
            align: 'center',
        },
        {
            title: translate('faculty'),
            key: 'faculty',
            align: 'center',
        },
        {
            title: translate('createdAt'),
            key: 'createdAt',
            align: 'center',
        },
        {
            title: translate('status'),
            key: 'status',
            align: 'center',
        },
    ];

    const adminActivitiesHeaders = [
        {
            title: translate('id'),
            key: 'id',
            align: 'center',
        },
        {
            title: translate('email'),
            key: 'admin.email',
            align: 'center',
        },
        {
            title: translate('object'),
            key: 'targetId',
            align: 'center',
        },
        {
            title: translate('type'),
            key: 'activityType',
            align: 'center',
        },
        {
            title: translate('createdAt'),
            key: 'createdAt',
            align: 'center',
        },
    ];

    const adminActivityStore = useAdminActivityStore();
    const { activities, loading: adminActivityLoading } = storeToRefs(adminActivityStore);

    const userMangementStore = useUserMangementStore();
    const { users, loading: userManagementLoading } = storeToRefs(userMangementStore);

    const postViolationStore = usePostViolationStore();
    const { violationPosts, loading: postViolationLoading } = storeToRefs(postViolationStore);

    const accountViolationStore = useAccountViolationStore();
    const { violationAccounts, loading: accountViolationLoading } = storeToRefs(accountViolationStore);

    onMounted(() => {
        Promise.all([
            postViolationStore.getItems({}),
            accountViolationStore.getItems({}),
            userMangementStore.getItems({}),
            adminActivityStore.getItems({}),
        ]);
    });
</script>

<template>
    <VContainer fluid>
        <VRow class="flex-wrap">
            <VCol
                cols="12"
                sm="6"
                md="3"
                v-for="({ label, value, direction, percent, time }, index) in totalStats"
                :key="index"
                ><CardStatisticsVertical
                    :label="translate(label)"
                    :value="value"
                    :direction="direction"
                    :percent="percent"
                    :time="time"
            /></VCol>
        </VRow>

        <VRow>
            <VCol cols="12" md="6">
                <AccountRegisteredChart />
            </VCol>
            <VCol cols="12" md="6">
                <PostPublishedChart />
            </VCol>
            <VCol cols="12" md="6">
                <AveragePostStatChart />
            </VCol>
            <VCol cols="12" md="6">
                <GenderChart />
            </VCol>
        </VRow>

        <h2 class="mt-5 mb-3 table-title">{{ translate('recentAdminActivity') }}</h2>
        <TableWithoutPaging :items="activities" :loading="adminActivityLoading" :headers="adminActivitiesHeaders" />

        <h2 class="mt-5 mb-3 table-title">{{ translate('recentCreatedAccount') }}</h2>
        <TableWithoutPaging
            :headers="userMangementHeaders"
            :loading="userManagementLoading"
            :items="users"
            statusKey="status"
        >
            <template #status="{ item }">
                <StatusChip :status="item?.selectable?.status" />
            </template>
        </TableWithoutPaging>

        <h2 class="mt-5 mb-3 table-title">{{ translate('recentPostViolation') }}</h2>
        <TableWithoutPaging
            :headers="postViolationHeaders"
            :loading="postViolationLoading"
            :items="violationPosts"
            statusKey="status"
        >
            <template #status="{ item }">
                <StatusChip :status="item?.selectable?.status" />
            </template>
        </TableWithoutPaging>

        <h2 class="mt-5 mb-3 table-title">{{ translate('recentAccountViolation') }}</h2>
        <TableWithoutPaging
            :headers="accountViolationHeaders"
            :loading="accountViolationLoading"
            :items="violationAccounts"
            statusKey="status"
        >
            <template #status="{ item }">
                <StatusChip :status="item?.selectable?.status" />
            </template>
        </TableWithoutPaging>
    </VContainer>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .table-title {
        color: var(--primary-color);
        font-weight: bold;
    }
</style>
