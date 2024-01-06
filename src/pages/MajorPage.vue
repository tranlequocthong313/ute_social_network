<script setup>
    import { storeToRefs } from 'pinia';
    import { ref, toRefs } from 'vue';

    import useMajorStore from '@/stores/majorStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import { basicRules } from '@/utils/validation.js';
    import useFilterStore from '@/stores/filterStore';

    const props = defineProps({
        faculty: {
            type: Object,
            required: true,
        },
    });
    const { faculty } = toRefs(props);

    const majorStore = useMajorStore();
    const { majors, faculty: _faculty, totalItems, loading } = storeToRefs(majorStore);
    _faculty.value = faculty.value._id;

    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const vnName = ref(null);
    const enName = ref(null);
    const code = ref(null);

    const filterStore = useFilterStore();
    filterStore.setFilters([]);

    const majorHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'name.vi',
            title: translate('name'),
            align: 'center',
        },
        {
            key: 'code',
            title: translate('code'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
        },
    ];

    const editItem = async (item) => {
        if ((await editForm.value.validate()).valid) {
            await majorStore.editItem(item);
        }
    };

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await majorStore.addItem({
                name: {
                    vi: vnName.value,
                    en: enName.value,
                },
                code: code.value,
            });

            vnName.value = null;
            enName.value = null;
            code.value = null;
        }
    };
</script>

<template>
    <TableWithActions
        :headers="majorHeaders"
        :items="majors"
        :loading="loading"
        :itemsLength="totalItems"
        :modalTitle="faculty.name"
        @addItem="addItem"
        @deleteItem="majorStore.deleteItem"
        @deleteItems="majorStore.deleteItems"
        @editItem="editItem"
        @update-options="majorStore.getItems"
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm">
                    <VRow>
                        <VCol cols="12">
                            <VTextField type="text" label="Vi Name" v-model.trim="vnName" :rules="formRules" />
                            <VTextField type="text" label="En Name" v-model.trim="enName" :rules="formRules" />
                        </VCol>
                        <VCol cols="12">
                            <VTextField label="Code" v-model.trim="code" :rules="formRules" />
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>

        <template #edit="{ item }">
            <VContainer>
                <VForm ref="editForm">
                    <VRow>
                        <VCol cols="12">
                            <VTextField type="text" label="Vi Name" v-model.trim="item.name.vi" :rules="formRules" />
                            <VTextField type="text" label="En Name" v-model.trim="item.name.en" :rules="formRules" />
                        </VCol>
                        <VCol cols="12">
                            <VTextField label="Code" v-model.trim="item.code" :rules="formRules" />
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>
    </TableWithActions>
</template>
