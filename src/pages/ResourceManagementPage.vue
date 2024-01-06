<script setup>
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import useResourceStore from '@/stores/resourceStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import { getFormattedDate } from '@/utils/date';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import { basicRules } from '@/utils/validation.js';
    import useFilterStore from '@/stores/filterStore';
    import ResourcePermissionPage from './ResourcePermissionPage.vue';

    const resourceStore = useResourceStore();
    const { resources, totalItems, loading } = storeToRefs(resourceStore);

    const name = ref(null);
    const selectedPermissions = ref([]);
    const editSelectedPermissions = ref([]);
    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const resource = ref(null);

    const filterStore = useFilterStore();
    filterStore.setFilters([]);

    const resourceHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'resourceName',
            title: translate('resourceName'),
            align: 'center',
        },
        {
            key: 'othersPermission',
            title: translate('publicPermission'),
            align: 'center',
        },
        {
            key: 'updatedBy.username',
            title: translate('updatedBy'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
            sortable: false,
        },
    ];

    const operations = {
        1: ['1'],
        2: ['2'],
        3: ['1', '2'],
        4: ['4'],
        5: ['4', '1'],
        6: ['4', '2'],
        7: ['1', '2', '4'],
    };

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await resourceStore.addItem({
                resourceName: name.value,
                othersPermission: selectedPermissions.value.reduce((a, b) => +a + +b, 0),
            });
            name.value = '';
            selectedPermissions.value = [];
        }
    };

    const editItem = async (item) => {
        if ((await editForm.value.validate()).valid) {
            await resourceStore.editItem({
                _id: item._id,
                resourceName: item.name,
                othersPermission: editSelectedPermissions.value.reduce((a, b) => +a + +b, 0),
            });
        }
    };

    const openEdit = async (item) => {
        editSelectedPermissions.value = [];
        editSelectedPermissions.value = operations[item.othersPermission];
    };
</script>

<template>
    <TableWithActions
        :headers="resourceHeaders"
        :items="resources"
        :loading="loading"
        :itemsLength="totalItems"
        @addItem="addItem"
        @deleteItem="resourceStore.deleteItem"
        @deleteItems="resourceStore.deleteItems"
        @editItem="editItem"
        @update-options="resourceStore.getItems"
        @openEdit="openEdit"
        @clickRow="(it) => (resource = it)"
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
                                v-model.trim="name"
                                :rules="formRules"
                            ></VTextField>
                        </VCol>
                        <VCol cols="12">
                            <VCheckbox v-model="selectedPermissions" value="4" label="Get"></VCheckbox>
                            <VCheckbox v-model="selectedPermissions" value="2" label="Create"></VCheckbox>
                            <VCheckbox v-model="selectedPermissions" value="1" label="Update"></VCheckbox>
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
                                v-model.trim="item.resourceName"
                                :rules="formRules"
                            ></VTextField>
                        </VCol>
                        <VCol cols="12">
                            <VCheckbox v-model="editSelectedPermissions" value="4" label="Get"></VCheckbox>
                            <VCheckbox v-model="editSelectedPermissions" value="2" label="Create"></VCheckbox>
                            <VCheckbox v-model="editSelectedPermissions" value="1" label="Update"></VCheckbox>
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>

        <template #modal>
            <ResourcePermissionPage :resource="resource" />
        </template>
    </TableWithActions>
</template>
