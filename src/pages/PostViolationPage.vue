<script setup>
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import usePostViolationStore from '@/stores/postViolationStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import StatusChip from '@/components/StatusChip.vue';
    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
    import useFilterStore from '@/stores/filterStore';

    const postViolationStore = usePostViolationStore();
    const { violationPosts, totalItems, loading } = storeToRefs(postViolationStore);

    const post = ref(null);

    const filterStore = useFilterStore();
    filterStore.setFilters([]);

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

    const postViolationHeaders = [
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
            key: 'reportedPost.title',
            title: translate('reportedPost'),
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
        await postViolationStore.approve(post.value.id);
    };

    const decline = async () => {
        await postViolationStore.decline(post.value.id);
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
        :headers="postViolationHeaders"
        :items="violationPosts"
        :loading="loading"
        :itemsLength="totalItems"
        @deleteItem="postViolationStore.deleteItem"
        @deleteItems="postViolationStore.deleteItems"
        @update-options="postViolationStore.getItems"
        @clickRow="(item) => (post = item)"
        @approveItem="approve"
        @declineItem="decline"
        statusKey="status"
        hideAdd
        hideEdit
        showModalOnClickRow
    >
        <template #add> </template>

        <template #status="{ item }">
            <StatusChip :status="item?.status === 'resolved' ? 'active' : item.status" activeContent="Resolved" />
        </template>

        <template #modal>
            <VContainer>
                <VRow justify="center">
                    <VCol cols="12" md="7">
                        <h2>{{ translate('reportDetail') }}:</h2>
                        <VTextField
                            class="mb-2"
                            :label="translate('name')"
                            readonly
                            v-model.trim="post.reporter.name"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('email')"
                            readonly
                            v-model.trim="post.reporter.email"
                            hide-details
                        />
                        <h2>{{ translate('postDetail') }}:</h2>
                        <VTextField
                            class="mb-2"
                            :label="translate('title')"
                            readonly
                            v-model.trim="post.reportedPost.title"
                            hide-details
                        />
                        <VTextarea
                            class="mb-2"
                            :label="translate('content')"
                            readonly
                            v-model.trim="post.reportedPost.content"
                            hide-details
                        />
                        <h2>{{ translate('postAuthorDetail') }}:</h2>
                        <VTextField
                            class="mb-2"
                            :label="translate('name')"
                            readonly
                            v-model.trim="post.reportedPost.author.name"
                            hide-details
                        />
                        <h2>{{ translate('moreInfo') }}:</h2>
                        <VTextField
                            class="mb-2"
                            :label="translate('type')"
                            readonly
                            v-model.trim="post.reportType"
                            hide-details
                        />
                        <VTextarea
                            class="mb-2"
                            :label="translate('description')"
                            readonly
                            v-model.trim="post.description"
                            hide-details
                        />
                        <VTextField
                            class="mb-2"
                            :label="translate('reportedDate')"
                            readonly
                            v-model.trim="post.createdAt"
                            hide-details
                        />
                    </VCol>
                </VRow>
            </VContainer>
        </template>
    </TableWithActions>
</template>
