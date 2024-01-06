<script setup>
    import { storeToRefs } from 'pinia';
    import { ref, watch, toRefs, computed } from 'vue';

    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import useAdminInGroupStore from '@/stores/adminInGroupStore.js';
    import useAdminGroupStore from '@/stores/adminGroupStore.js';
    import { emailRules, basicRules } from '@/utils/validation.js';
    import { getTimeFromTimestamp } from '@/utils/date.js';
    import useAdminStore from '@/stores/adminStore';

    const props = defineProps({
        group: {
            type: Object,
            required: true,
        },
    });
    const { group } = toRefs(props);

    const adminStore = useAdminStore();
    const adminGroupStore = useAdminGroupStore();
    const adminInGroupStore = useAdminInGroupStore();
    const { admins, totalItems, loading, group: _group } = storeToRefs(adminInGroupStore);
    const { groupNames } = storeToRefs(adminGroupStore);
    _group.value = group.value._id;

    watch(admins, (newValue, _) => {
        for (let i = 0; i < newValue.length; i++) {
            newValue[i].createdAt = getTimeFromTimestamp(newValue[i].createdAt);
        }
    });

    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const searching = ref(null);

    const adminHeaders = [
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
            title: translate('createdAt'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
            sortable: false,
        },
    ];

    const searchAdmins = async () => {
        if ((await addForm.value.validate()).valid) {
            await adminStore.getItems({ search: searching.value });
        }
    };

    const addItem = async (item) => {
        await adminInGroupStore.addItem(item);
    };

    const editItem = async (item) => {
        console.log(item);
        if ((await editForm.value.validate()).valid) {
            await adminInGroupStore.editItem(item);
        }
    };

    const openAdd = async () => {
        adminStore.admins = [];
        searching.value = null;
    };

    const adminsNotInGroup = computed(() => {
        console.log('updating');
        return adminStore.admins.filter((admin) => !('group' in admin));
    });
</script>

<template>
    <TableWithActions
        :headers="adminHeaders"
        :items="admins"
        :loading="loading"
        :itemsLength="totalItems"
        :modalTitle="group.groupName"
        @addItem="searchAdmins"
        @editItem="editItem"
        @deleteItem="adminInGroupStore.deleteItem"
        @deleteItems="adminInGroupStore.deleteItems"
        @update-options="adminInGroupStore.getItems"
        addButtonTitle="search"
        @openAdd="openAdd"
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm" @submit.prevent="searchAdmins">
                    <VRow>
                        <VCol cols="12">
                            <VTextField
                                type="text"
                                :label="translate('searching')"
                                v-model.trim="searching"
                                :rules="formRules"
                            />
                        </VCol>
                    </VRow>
                    <VRow>
                        <Vlist>
                            <VListItem
                                v-for="admin in adminsNotInGroup"
                                :key="admin._id"
                                class="d-flex align-center justify-between w-100"
                            >
                                <div>
                                    <p>{{ admin.username }}</p>
                                    <p>{{ admin.email }}</p>
                                </div>
                                <div>
                                    <VBtn class="table-active-button" variant="tonal" @click="addItem(admin)">Add</VBtn>
                                </div>
                            </VListItem>
                        </Vlist>
                    </VRow>
                </VForm>
            </VContainer>
        </template>

        <template #edit="{ item }">
            <VContainer>
                <VForm ref="editForm">
                    <VRow>
                        <VCol cols="12">
                            <h2>Username: {{ item.username }}</h2>
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                :label="translate('group')"
                                v-model.trim="item.group.groupName"
                                :items="groupNames"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>
    </TableWithActions>
</template>
