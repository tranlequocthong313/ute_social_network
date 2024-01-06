<script setup>
    import { storeToRefs } from 'pinia';

    import useAuditPostStore from '@/stores/auditPostStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import StatusChip from '@/components/StatusChip.vue';
    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';

    const auditPostStore = useAuditPostStore();
    const { auditPosts, totalItems, loading } = storeToRefs(auditPostStore);

    // for developing without real backend
    const totalStats = [
        {
            label: 'resolved',
            value: '100.000',
            direction: 'up',
            percent: '+24%',
            time: 'then week ago',
        },
        {
            label: 'rejected',
            value: '1.000.000',
            direction: 'up',
            percent: '+80%',
            time: 'then week ago',
        },
        {
            label: 'pending',
            value: '100.000',
            direction: 'up',
            percent: '+24%',
            time: 'then week ago',
        },
    ];

    const auditPostHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'title',
            title: translate('title'),
            align: 'center',
        },
        {
            key: 'author',
            title: translate('author'),
            align: 'center',
        },
        {
            key: 'status',
            title: translate('status'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
        },
    ];
</script>

<template>
    <VRow class="flex-wrap pa-4">
        <VCol cols="12" sm="4" v-for="({ label, value, direction, percent, time }, index) in totalStats" :key="index"
            ><CardStatisticsVertical
                :label="translate(label)"
                :value="value"
                :direction="direction"
                :percent="percent"
                :time="time"
        /></VCol>
    </VRow>
    <TableWithActions
        :headers="auditPostHeaders"
        :items="auditPosts"
        :loading="loading"
        :itemsLength="totalItems"
        @deleteItem="auditPostStore.deleteItem"
        @deleteItems="auditPostStore.deleteItems"
        @update-options="auditPostStore.getItems"
        statusKey="status"
        hideAdd
        hideEdit
    >
        <template #status="{ item }">
            <StatusChip :status="item.status === 'resolved' ? 'active' : item.status" />
        </template>
    </TableWithActions>
</template>
