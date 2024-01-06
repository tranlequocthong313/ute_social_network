<script setup>
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import useAuditAccountStore from '@/stores/auditAccountStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import StatusChip from '@/components/StatusChip.vue';
    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
    import useUserManagementStore from '@/stores/userManagementStore';

    const auditAccountStore = useAuditAccountStore();
    const { auditAccounts, totalItems, loading } = storeToRefs(auditAccountStore);

    const userStore = useUserManagementStore();

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

    const auditAccountHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'email',
            title: translate('email'),
            align: 'center',
        },
        {
            key: 'createdAt',
            title: translate('registrationDate'),
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

    const approveAccount = async () => {
        await auditAccountStore.approve(account.value.id);
    };

    const declineAccount = async () => {
        await auditAccountStore.decline(account.value.id);
    };
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
        :headers="auditAccountHeaders"
        :items="auditAccounts"
        :loading="loading"
        :itemsLength="totalItems"
        @deleteItem="auditAccountStore.deleteItem"
        @deleteItems="auditAccountStore.deleteItems"
        @update-options="auditAccountStore.getItems"
        @clickRow="(item) => (account = item)"
        @approveItem="approveAccount"
        @declineItem="declineAccount"
        statusKey="status"
        hideAdd
        hideEdit
        showModalOnClickRow
    >
        <template #status="{ item }">
            <StatusChip :status="item?.status" />
        </template>

        <template #modal>
            <VContainer>
                <VRow justify="center">
                    <VCol cols="12" md="5" class="d-flex justify-center">
                        <VAvatar size="180" variant="outlined">
                            <VIcon size="120">{{
                                account?.gender === 'male' ? ' mdi-gender-male' : 'mdi-gender-female'
                            }}</VIcon>
                        </VAvatar>
                    </VCol>
                    <VCol cols="12" md="7">
                        <h2 class="mb-3">{{ translate('accountDetail') }}:</h2>
                        <VTextField
                            class="mb-2"
                            :label="translate('firstName')"
                            readonly
                            v-model.trim="account.firstName"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('lastName')"
                            readonly
                            v-model.trim="account.lastName"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('gender')"
                            readonly
                            v-model.trim="account.gender"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('dateOfBirth')"
                            readonly
                            v-model.trim="account.dateOfBirth"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('email')"
                            readonly
                            v-model.trim="account.email"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('phoneNumber')"
                            readonly
                            v-model.trim="account.phoneNumber"
                            hide-details
                        />
                        <VTextField
                            v-if="userStore.studentTypes.includes(account.type)"
                            class="mb-2"
                            :label="translate('schoolYear')"
                            readonly
                            v-model.trim="account.schoolYear"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('type')"
                            readonly
                            v-model.trim="account.type"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('faculty')"
                            readonly
                            v-model.trim="account.faculty"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('major')"
                            readonly
                            v-model.trim="account.major"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('registrationDate')"
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
