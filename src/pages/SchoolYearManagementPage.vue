<script setup>
    import { storeToRefs } from 'pinia';
    import { ref } from 'vue';

    import useSchoolYearStore from '@/stores/schoolYearStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import { getFormattedDate } from '@/utils/date';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import { basicRules } from '@/utils/validation.js';
    import useFilterStore from '@/stores/filterStore';

    const schoolYearStore = useSchoolYearStore();
    const { schoolYears, totalItems, loading } = storeToRefs(schoolYearStore);

    const name = ref(null);
    const startYear = ref(null);
    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);

    const filterStore = useFilterStore();
    filterStore.setFilters([]);

    const schoolYearHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'name',
            title: translate('name'),
            align: 'center',
        },
        {
            key: 'startYear',
            title: translate('startYear'),
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
            await schoolYearStore.addItem({
                name: name.value,
                startYear: +startYear.value,
            });
            name.value = '';
            startYear.value = null;
        }
    };

    const editItem = async (item) => {
        if ((await editForm.value.validate()).valid) {
            await schoolYearStore.editItem(item);
        }
    };
</script>

<template>
    <TableWithActions
        :headers="schoolYearHeaders"
        :items="schoolYears"
        :loading="loading"
        :itemsLength="totalItems"
        @addItem="addItem"
        @deleteItem="schoolYearStore.deleteItem"
        @deleteItems="schoolYearStore.deleteItems"
        @editItem="editItem"
        @update-options="schoolYearStore.getItems"
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
                            <VTextField v-model.trim="startYear" :label="translate('startYear')"></VTextField>
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
                                v-model.trim="item.name"
                                :rules="formRules"
                            ></VTextField>
                        </VCol>
                        <VCol cols="12" md="6">
                            <VTextField v-model.trim="item.startYear" :label="translate('startYear')"></VTextField>
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>
    </TableWithActions>
</template>
