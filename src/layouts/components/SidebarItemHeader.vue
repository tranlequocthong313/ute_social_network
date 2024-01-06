<script setup>
    defineProps({
        title: {
            type: String,
            required: true,
        },
    });
</script>

<template>
    <VListSubheader class="my-2">
        <strong class="sidebar-item-divider-title">{{ title }}</strong>
    </VListSubheader>
    <VDivider class="my-2" />
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .sidebar-item-divider-title {
        font-size: 1rem;
        color: var(--primary-color);
    }
</style>
