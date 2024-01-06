<script setup>
    import { computed } from 'vue';

    import { translate } from '@/locales/translator.js';
    import useTheme from '@/composables/useTheme.js';

    const theme = useTheme();

    const tooltipText = computed(() => {
        return translate(theme.isDark.value ? 'darkMode' : 'lightMode');
    });

    const icon = computed(() => {
        return theme.isDark.value ? 'mdi-brightness-4' : 'mdi-brightness-6';
    });
</script>

<template>
    <VTooltip :text="tooltipText" location="bottom">
        <template #activator="{ props }">
            <VIcon v-bind="props" @click="theme.toggleTheme" data-test="theme-switcher">{{ icon }}</VIcon>
        </template>
    </VTooltip>
</template>
