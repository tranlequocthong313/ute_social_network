<script setup>
    import { translate } from '@/locales/translator.js';
    import { searchValidator } from '@/utils/validation';

    const emits = defineEmits({
        'update:modelValue': searchValidator,
    });

    defineProps({
        loading: {
            type: Boolean,
            default: () => false,
        },
        modelValue: String,
    });

    const updateModelValue = (value) => {
        emits('update:modelValue', value);
    };
</script>

<template>
    <VTextField
        rounded
        prepend-inner-icon="mdi-magnify"
        density="compact"
        class="navbar-search"
        :placeholder="translate('search')"
        hide-details="auto"
        variant="outlined"
        :model-value="modelValue"
        @update:model-value="updateModelValue"
    >
        <template #append-inner>
            <VIcon @click="updateModelValue('')" size="16" v-show="!loading && modelValue.length"
                >mdi-close-circle</VIcon
            >
            <VProgressCircular
                v-show="loading && modelValue.length"
                indeterminate
                size="16"
                width="2"
            ></VProgressCircular>
        </template>
    </VTextField>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .navbar-search {
        .v-field__outline::after,
        .v-field__outline::before {
            content: none !important;
        }

        .v-field__outline {
            color: var(--primary-color);
        }

        .v-field__append-inner {
            position: relative;
            right: 5px;
            margin-left: 8px;

            .v-progress-circular {
                color: var(--primary-color);
            }
        }
    }

    .navbar-search.v-theme--dark span {
        color: var(--dark-text-color);
    }
</style>
