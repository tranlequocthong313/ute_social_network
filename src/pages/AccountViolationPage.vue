<script setup>
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import useAccountViolationStore from '@/stores/accountViolationStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import StatusChip from '@/components/StatusChip.vue';
    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';

    const accountViolationStore = useAccountViolationStore();
    const { violationAccounts, totalItems, loading } = storeToRefs(accountViolationStore);

    const account = ref(null);

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
            label: 'pending',
            value: '100.000',
            direction: 'up',
            percent: '+24%',
            time: 'then week ago',
        },
    ];

    const accountViolationHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'reporter.name',
            title: translate('reporter'),
            align: 'center',
        },
        {
            key: 'reportedAccount.name',
            title: translate('reportedAccount'),
            align: 'center',
        },
        {
            key: 'reportType',
            title: translate('type'),
            align: 'center',
        },
        {
            key: 'createdAt',
            title: translate('createdAt'),
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

    const approve = async () => {
        await accountViolationStore.approve(account.value.id);
    };

    const decline = async () => {
        await accountViolationStore.decline(account.value.id);
    };
</script>

<template>
    <VRow class="flex-wrap pa-4">
        <VCol cols="12" sm="6" v-for="({ label, value, direction, percent, time }, index) in totalStats" :key="index"
            ><CardStatisticsVertical
                :label="translate(label)"
                :value="value"
                :direction="direction"
                :percent="percent"
                :time="time"
        /></VCol>
    </VRow>
    <TableWithActions
        :headers="accountViolationHeaders"
        :items="violationAccounts"
        :loading="loading"
        :itemsLength="totalItems"
        @deleteItem="accountViolationStore.deleteItem"
        @deleteItems="accountViolationStore.deleteItems"
        @update-options="accountViolationStore.getItems"
        statusKey="status"
        @clickRow="(item) => (account = item)"
        @approveItem="approve"
        @declineItem="decline"
        hideAdd
        hideEdit
        showModalOnClickRow
    >
        <template #status="{ item }">
            <StatusChip :status="item?.status === 'resolved' ? 'active' : item?.status" activeContent="Resolved" />
        </template>

        <template #modal>
            <VContainer>
                <VRow justify="center">
                    <VCol cols="12" md="7">
                        <h2 class="mb-2">{{ translate('reporterDetail') }}:</h2>
                        <VTextField
                            class="mb-2"
                            :label="translate('name')"
                            readonly
                            v-model.trim="account.reporter.name"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('email')"
                            readonly
                            v-model.trim="account.reporter.email"
                            hide-details
                        />
                        <h2 class="mb-2">{{ translate('accountDetail') }}:</h2>
                        <VTextField
                            class="mb-2"
                            :label="translate('name')"
                            readonly
                            v-model.trim="account.reportedAccount.name"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('email')"
                            readonly
                            v-model.trim="account.reportedAccount.email"
                            hide-details
                        />
                        <h2 class="mb-2">{{ translate('moreInfo') }}</h2>
                        <VTextField
                            class="mb-2"
                            :label="translate('type')"
                            readonly
                            v-model.trim="account.reportType"
                            hide-details
                        />
                        <VTextarea
                            class="mb-2"
                            :label="translate('description')"
                            readonly
                            v-model.trim="account.description"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('reportedDate')"
                            readonly
                            v-model.trim="account.createdAt"
                            hide-details
                        />
                    </VCol>
                </VRow>
            </VContainer>
        </template>
    </TableWithActions>
</template>
