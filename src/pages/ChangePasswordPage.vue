<script setup>
    import { ref } from 'vue';

    import useAuthStore from '@/stores/authStore.js';
    import { translate } from '@/locales/translator.js';
    import { toastError } from '@/utils/toast';

    const authStore = useAuthStore();

    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');

    const changePassword = async () => {
        if (newPassword.value === confirmPassword.value) {
            await authStore.changePassword({
                currentPassword: currentPassword.value,
                newPassword: newPassword.value,
            });
            currentPassword.value = '';
            newPassword.value = '';
            confirmPassword.value = '';
        } else {
            toastError('Passwords must match!');
        }
    };
</script>

<template>
    <VContainer fluid>
        <VCard>
            <VCardTitle>{{ translate('changePassword') }}</VCardTitle>
            <VCardText>
                <div>
                    <VTextField
                        v-model="currentPassword"
                        :label="translate('currentPassword')"
                        type="password"
                        required
                    ></VTextField>
                    <VTextField
                        v-model="newPassword"
                        :label="translate('newPassword')"
                        type="password"
                        required
                    ></VTextField>
                    <VTextField
                        v-model="confirmPassword"
                        :label="translate('confirmNewPassword')"
                        type="password"
                        required
                    ></VTextField>
                    <VBtn class="changePassword" @click="changePassword">{{ translate('changePassword') }}</VBtn>
                </div>
            </VCardText>
        </VCard>
    </VContainer>
</template>

<style lang="scss" scoped>
    @import '@/assets/base.css';

    .changePassword {
        color: var(--dark-text-color);
        background-color: var(--primary-color);
    }
</style>
