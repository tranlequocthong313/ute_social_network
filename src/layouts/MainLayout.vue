<script setup>
    import AppNavbar from './components/AppNavbar.vue';
    import AppSidebar from './components/AppSidebar.vue';

    defineProps({
        items: {
            type: Array,
        },
    });
</script>
<template>
    <AppNavbar />
    <AppSidebar :items="items" />
    <slot></slot>
</template>
