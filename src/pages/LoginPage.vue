<script setup>
    import 'vue3-toastify/dist/index.css';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';

    import useAuthStore from '@/stores/authStore.js';
    import logo from '@/assets/images/logo-no-background.png';
    import { changeLanguage, translate } from '@/locales/translator.js';
    import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
    import { emailRules, passwordRules } from '@/utils/validation.js';

    const authStore = useAuthStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const form = ref(null);
    const _emailRules = ref(emailRules);
    const _passwordRules = ref(passwordRules);

    const login = async () => {
        if ((await form.value.validate()).valid) {
            await authStore.login({ email: email.value, password: password.value });

            if (authStore.loggedIn) {
                router.push({ name: 'dashboard' });
            }
        }
    };
</script>

<template>
    <VContainer class="h-100 w-100 d-flex align-center">
        <div class="theme-switcher">
            <ThemeSwitcher />
        </div>
        <VRow class="flex-column flex-md-row align-center px-0 px-sm-10 px-lg-0">
            <VCol cols="12" md="7" class="d-flex pr-md-12">
                <VImg :src="logo" max-width="100%" />
            </VCol>
            <VCol cols="12" md="5">
                <VForm class="login-form" @submit.prevent="login" ref="form">
                    <VTextField
                        id="email-input"
                        variant="outlined"
                        type="email"
                        v-model.trim="email"
                        :placeholder="translate('email')"
                        :rules="_emailRules"
                    />
                    <VTextField
                        id="password-input"
                        variant="outlined"
                        type="password"
                        v-model="password"
                        :placeholder="translate('password')"
                        :rules="_passwordRules"
                    />
                    <VBtn type="submit" size="x-large" :loading='authStore.loading'>{{ translate('login') }}</VBtn>
                    <p class="forgotton-password mt-3">{{ translate('forgottonPassword') }}?</p>
                </VForm>
                <div class="language-switcher mt-6">
                    <span @click="changeLanguage('vn')">Tiếng việt</span>
                    <p class="divider">|</p>
                    <span @click="changeLanguage('en')">English</span>
                </div>
            </VCol>
        </VRow>
    </VContainer>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .login-form {
        button {
            background-color: var(--primary-color);
            color: var(--dark-text-color);
            width: 100%;
        }

        .forgotton-password {
            color: var(--primary-color);
            text-align: center;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
        }

        .v-field__outline {
            color: var(--primary-color);
        }
    }

    .language-switcher {
        text-align: center;
        span {
            position: relative;
            cursor: pointer;
            margin: 0 3px;
            color: var(--light-text-color);
            padding: 0 5px;

            &:hover {
                color: var(--primary-color);
            }
        }

        .divider {
            margin: 0 4px;
            display: inline-block;
            color: var(--light-text-color);
        }
    }

    .theme-switcher {
        position: absolute;
        top: 2%;
        right: 4%;
    }
</style>
