<script setup>
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import useAdminGroupStore from '@/stores/adminGroupStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import { getFormattedDate } from '@/utils/date';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import { basicRules } from '@/utils/validation.js';
    import useFilterStore from '@/stores/filterStore';
    import AdminInGroupPage from '@/pages/AdminInGroupPage.vue';

    const adminGroupStore = useAdminGroupStore();
    const { adminGroups, totalItems, loading } = storeToRefs(adminGroupStore);

    const groupName = ref(null);
    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const group = ref(null);

    const filterStore = useFilterStore();
    filterStore.setFilters([]);

    const adminGroupHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'groupName',
            title: translate('groupName'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
            sortable: false,
        },
    ];

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await adminGroupStore.addItem({
                groupName: groupName.value,
            });
            groupName.value = '';
        }
    };

    const editItem = async (item) => {
        if ((await editForm.value.validate()).valid) {
            await adminGroupStore.editItem(item);
        }
    };
</script>

<template>
    <TableWithActions
        :headers="adminGroupHeaders"
        :items="adminGroups"
        :loading="loading"
        :itemsLength="totalItems"
        @addItem="addItem"
        @deleteItem="adminGroupStore.deleteItem"
        @deleteItems="adminGroupStore.deleteItems"
        @editItem="editItem"
        @update-options="adminGroupStore.getItems"
        @clickRow="(it) => (group = it)"
        showModalOnClickRow
        hideModalActions
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm">
                    <VRow class="justify-center align-center">
                        <VCol cols="12">
                            <VTextField
                                class="my-3"
                                :label="translate('name')"
                                v-model.trim="groupName"
                                :rules="formRules"
                            ></VTextField>
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>

        <template #edit="{ item }">
            <VContainer>
                <VForm ref="editForm">
                    <VRow class="justify-center align-center">
                        <VCol cols="12">
                            <VTextField
                                class="my-3"
                                :label="translate('name')"
                                hide-details
                                v-model.trim="item.groupName"
                                :rules="formRules"
                            ></VTextField>
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>

        <template #modal>
            <AdminInGroupPage :group="group" />
        </template>
    </TableWithActions>
</template>
