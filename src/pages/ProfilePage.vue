<script setup>
    import { storeToRefs } from 'pinia';
    import gravatar from 'gravatar';

    import useAuthStore from '@/stores/authStore.js';
    import { translate } from '@/locales/translator.js';

    const authStore = useAuthStore();
    const { user } = storeToRefs(authStore);

    const changeUsername = async (user) => {
        await authStore.changeUsername(user.username);
    };
</script>

<template>
    <VContainer>
        <VRow justify="center">
            <VCol cols="12" md="5" class="d-flex justify-center">
                <VAvatar size="180" variant="outlined" :image="gravatar.url(user?.email, { s: '180' })"> </VAvatar>
            </VCol>
            <VCol cols="12" md="7">
                <h2 class="mb-3">{{ translate('profile') }}:</h2>
                <div class="d-flex align-center">
                    <VTextField
                        class="mb-2 mr-2"
                        :label="translate('username')"
                        v-model.trim="user.username"
                        hide-details
                    />
                    <VBtn class="changeUsernameBtn" icon="mdi-rename-box" @click="changeUsername(user)"></VBtn>
                </div>
                <VTextField class="mb-2" :label="translate('email')" readonly v-model.trim="user.email" hide-details />
                <VTextField class="mb-2" :label="translate('type')" readonly v-model.trim="user.type" hide-details />
                <VTextField
                    class="mb-2"
                    :label="translate('group')"
                    readonly
                    :model-value="user?.group?.groupName"
                    hide-details
                />
                <VTextField
                    class="mb-2"
                    :label="translate('createdAt')"
                    readonly
                    v-model.trim="user.createdAt"
                    hide-details
                />
                <VTextField
                    class="mb-2"
                    :label="translate('updatedAt')"
                    readonly
                    v-model.trim="user.updatedAt"
                    hide-details
                />
            </VCol>
        </VRow>
    </VContainer>
</template>

<style lang="scss" scoped>
    @import '@/assets/base.css';

    .changeUsernameBtn {
        color: var(--dark-text-color);
        background-color: var(--primary-color);
    }
</style>
