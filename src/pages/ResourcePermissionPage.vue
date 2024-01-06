<script setup>
    import { storeToRefs } from 'pinia';
    import { ref, toRefs, computed } from 'vue';

    import useResourcePermissionStore from '@/stores/resourcePermissionStore.js';
    import useAdminStore from '@/stores/adminStore.js';
    import useAdminGroupStore from '@/stores/adminGroupStore.js';
    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import { basicRules } from '@/utils/validation.js';
    import useFilterStore from '@/stores/filterStore';

    const props = defineProps({
        resource: {
            type: Object,
            required: true,
        },
    });
    const { resource } = toRefs(props);

    const adminStore = useAdminStore();
    const adminGroupStore = useAdminGroupStore();

    const resourcePermissionStore = useResourcePermissionStore();
    const { resourcePermissions, resource: _resource, totalItems, loading } = storeToRefs(resourcePermissionStore);
    _resource.value = resource.value._id;

    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const vnName = ref(null);
    const enName = ref(null);
    const code = ref(null);
    const selectedPermissions = ref([]);
    const editSelectedPermissions = ref([]);
    const actorType = ref(['Admin', 'AdminGroup']);
    const actor = ref(null);
    const type = ref(actorType.value[0]);
    const searching = ref(null);

    const filterStore = useFilterStore();
    filterStore.setFilters([]);

    const resourcePermissionHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'actor.username',
            title: translate('username'),
            align: 'center',
        },
        {
            key: 'actor.groupName',
            title: translate('groupName'),
            align: 'center',
        },
        {
            key: 'actorType',
            title: translate('type'),
            align: 'center',
        },
        {
            key: 'operation',
            title: translate('operation'),
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
            await resourcePermissionStore.editItem({
                _id: item._id,
                operation: editSelectedPermissions.value.reduce((a, b) => +a + +b, 0),
            });
        }
    };

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await resourcePermissionStore.addItem({
                actor: actor.value._id,
                actorType: type.value,
                operation: selectedPermissions.value.reduce((a, b) => +a + +b, 0),
            });

            actor.value = '';
            selectedPermissions.value = [];
        }
    };

    const searchActors = async () => {
        if (type.value === 'Admin') {
            await adminStore.getItems({ search: searching.value });
        } else if (type.value === 'AdminGroup') {
            await adminGroupStore.getItems({ search: searching.value });
        }
    };

    const actors = computed(() => {
        console.log(type.value);
        console.log(adminStore.admins);
        console.log(adminGroupStore.adminGroups);
        if (type.value === 'Admin') {
            return adminStore.admins;
        } else if (type.value === 'AdminGroup') {
            return adminGroupStore.adminGroups;
        }
        return [];
    });

    const selectActor = (a) => {
        console.log(adminStore.admins);
        console.log(adminGroupStore.adminGroups);
        actor.value = a;
        adminStore.admins = [];
        adminGroupStore.adminGroups = [];
    };

    const operations = {
        1: ['1'],
        2: ['2'],
        3: ['1', '2'],
        4: ['4'],
        5: ['4', '1'],
        6: ['4', '2'],
        7: ['1', '2', '4'],
    };

    const openEdit = async (item) => {
        editSelectedPermissions.value = [];
        editSelectedPermissions.value = operations[item.operation];
    };
</script>

<template>
    <TableWithActions
        :headers="resourcePermissionHeaders"
        :items="resourcePermissions"
        :loading="loading"
        :itemsLength="totalItems"
        :modalTitle="resource.resourceName"
        @addItem="addItem"
        @deleteItem="resourcePermissionStore.deleteItem"
        @deleteItems="resourcePermissionStore.deleteItems"
        @editItem="editItem"
        @update-options="resourcePermissionStore.getItems"
        @openEdit="openEdit"
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm">
                    <VRow>
                        <VCol cols="12">
                            <VSelect
                                v-model.trim="type"
                                :label="translate('type')"
                                :items="actorType"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12">
                            <VTextField type="text" :label="translate('search')" v-model.trim="searching" />
                            <VBtn @click="searchActors">{{ translate('search') }}</VBtn>
                        </VCol>
                    </VRow>
                    <VRow>
                        <Vlist>
                            <VListItem
                                v-for="a in actors"
                                :key="a._id"
                                class="d-flex align-center justify-between w-100"
                            >
                                <div>
                                    <p>{{ a?.username ? a.username : a.groupName }}</p>
                                </div>
                                <div>
                                    <VBtn class="table-active-button" variant="tonal" @click="selectActor(a)">Add</VBtn>
                                </div>
                            </VListItem>
                        </Vlist>
                    </VRow>
                    <VRow>
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
                    <VRow>
                        <VCol cols="12">
                            <h2>Actor: {{ item.actor.username ? item.actor.username : item.actor.groupName }}</h2>
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
    </TableWithActions>
</template>
