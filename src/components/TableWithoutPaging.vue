<script setup>
    defineProps({
        loading: {
            type: Boolean,
        },
        headers: {
            type: Array,
            required: true,
        },
        items: {
            type: Array,
            default: () => [],
        },
        statusKey: {
            type: String,
        },
    });
</script>

<template>
    <VDataTable :loading="loading" :headers="headers" :items="items" :items-length="items.length" must-sort>
        <template v-slot:[`item.${statusKey}`]="{ item }">
            <slot name="status" :item="item"></slot>
        </template>

        <template #bottom></template>
    </VDataTable>
</template>

<style lang="scss">
    @import '@/assets/_override.scss';
</style>
