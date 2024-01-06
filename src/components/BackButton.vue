<script setup>
    import { translate } from '@/locales/translator.js';

    const emits = defineEmits(['back']);

    defineProps({
        title: {
            type: String,
            default: () => translate('back'),
        },
    });

    const back = () => {
        emits('back');
    };
</script>

<template>
    <div class="d-flex align-center">
        <VIcon @click="back">mdi-arrow-left</VIcon>
        <h2 class="ml-3">{{ title }}</h2>
    </div>
</template>

<style></style>
