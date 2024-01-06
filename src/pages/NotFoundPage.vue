<script setup>
    import { translate } from '@/locales/translator';
</script>

<template>
    <VContainer>
        <h1>404</h1>
        <h2>{{ translate('notFoundInstruction') }}</h2>
        <RouterLink :to="{ name: 'dashboard' }">{{ $t('goHome') }}</RouterLink>
    </VContainer>
</template>
