<script setup>
    import { storeToRefs } from 'pinia';
    import { ref, watch } from 'vue';

    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import useAdminStore from '@/stores/adminStore.js';
    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
    import { generatePassword } from '@/utils/string';
    import { emailRules, basicRules } from '@/utils/validation.js';
    import { getTimeFromTimestamp } from '@/utils/date.js';
    import useAdminGroupStore from '@/stores/adminGroupStore';

    const adminStore = useAdminStore();
    const adminGroupStore = useAdminGroupStore();
    const { admins, totalItems, loading } = storeToRefs(adminStore);
    const { groupNames } = storeToRefs(adminGroupStore);

    watch(admins, (newValue, _) => {
        for (let i = 0; i < newValue.length; i++) {
            newValue[i].createdAt = getTimeFromTimestamp(newValue[i].createdAt);
        }
    });

    const copyText = translate('copyRaw');

    const addForm = ref(null);
    const editForm = ref(null);
    const formRules = ref(basicRules);
    const _emailRules = ref(emailRules);
    const email = ref(null);
    const randomPassword = ref(null);
    const group = ref(null);
    const copyTooltipText = ref(copyText);

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
            key: 'group.groupName',
            title: translate('group'),
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

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await adminStore.addItem({
                email: email.value,
                groupName: group.value,
                password: randomPassword.value,
            });
            email.value = null;
            group.value = null;
            randomPassword.value = null;
        }
    };

    const editItem = async (item) => {
        if (!item.group) {
            item.group = {};
            item.group.groupName = group.value;
        }
        if ((await editForm.value.validate()).valid) {
            await adminStore.editItem(item);
            group.value = null;
        }
    };

    const copyToClipboard = () => {
        let textArea = document.createElement('textarea');
        textArea.value = randomPassword.value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        copyTooltipText.value = `${translate('copied')}!`;
    };

    let timer = null;
    const onMouseLeaveCopy = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            copyTooltipText.value = copyText;
        }, 200);
    };

    const openAdd = async () => {
        await adminGroupStore.getItems({});
    };

    const openEdit = async () => {
        await adminGroupStore.getItems({});
    };
</script>

<template>
    <TableWithActions
        :headers="adminHeaders"
        :items="admins"
        :loading="loading"
        :itemsLength="totalItems"
        @addItem="addItem"
        @deleteItem="adminStore.deleteItem"
        @deleteItems="adminStore.deleteItems"
        @editItem="editItem"
        @update-options="adminStore.getItems"
        @openAdd="openAdd"
        @openEdit="openEdit"
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm">
                    <VRow>
                        <VCol cols="12">
                            <VTextField
                                type="email"
                                :label="translate('email')"
                                v-model.trim="email"
                                :rules="_emailRules"
                            />
                        </VCol>
                        <VCol cols="12" class="d-flex align-center">
                            <VTextField
                                v-model.trim="randomPassword"
                                readonly
                                :label="translate('password')"
                                :rules="formRules"
                            >
                                <template #append-inner>
                                    <VTooltip :text="translate('generateRandomPassword')" location="bottom">
                                        <template #activator="{ props }">
                                            <VIcon
                                                @click="randomPassword = generatePassword()"
                                                class="mx-1"
                                                v-bind="props"
                                                >mdi-key</VIcon
                                            >
                                        </template>
                                    </VTooltip>
                                    <VTooltip
                                        :text="copyTooltipText"
                                        location="bottom"
                                        @update:modelValue="onMouseLeaveCopy"
                                    >
                                        <template #activator="{ props }">
                                            <VIcon @click="copyToClipboard" class="mx-1" v-bind="props"
                                                >mdi-content-copy</VIcon
                                            >
                                        </template>
                                    </VTooltip>
                                </template>
                            </VTextField>
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                v-model.trim="group"
                                :label="translate('group')"
                                :items="groupNames"
                                :rules="formRules"
                            ></VSelect>
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
                            <h2>Username: {{ item.username }}</h2>
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                v-if="item.group"
                                :label="translate('group')"
                                v-model.trim="item.group.groupName"
                                :items="groupNames"
                                :rules="formRules"
                            ></VSelect>
                            <VSelect
                                v-else
                                v-model.trim="group"
                                :label="translate('group')"
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
