<script setup>
    import { RouterView } from 'vue-router';
    import { useRoute } from 'vue-router';
    import { useTheme } from 'vuetify';
    import { onMounted, computed } from 'vue';

    const theme = useTheme();

    onMounted(() => {
        const themeStorage = localStorage.getItem('theme');
        if (themeStorage) {
            theme.global.name.value = themeStorage;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme.global.name.value = 'dark';
            localStorage.setItem('theme', theme.global.name.value.toString());
        }
    });

    const route = useRoute();

    const component = computed(() => {
        return route?.meta?.layout;
    });

    const sidebarItems = computed(() => {
        return route?.meta?.sidebarItems;
    });
</script>

<template>
    <VApp>
        <component :is="component" :items="sidebarItems">
            <VMain>
                <RouterView />
            </VMain>
        </component>
    </VApp>
</template>
