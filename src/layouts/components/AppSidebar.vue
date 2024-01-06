<script setup>
    import SidebarItem from './SidebarItem.vue';
    import SidebarItemHeader from './SidebarItemHeader.vue';
    import { translate } from '@/locales/translator';
    import useSidebarStore from '@/stores/sidebarStore';

    defineProps({
        items: {
            type: Array,
        },
    });

    const store = useSidebarStore();
</script>

<template>
    <VNavigationDrawer
        v-model="store.isShowingSidebar"
        class="sidebar"
        :expand-on-hover="store.expandOnHover"
        :rail="store.expandOnHover"
        rail-width="65"
    >
        <VList density="compact" nav class="pl-4 py-4 pr-0">
            <template v-for="item in items" :key="item">
                <SidebarItemHeader v-if="item.header" :title="translate(`${item.header}`)" />
                <SidebarItem
                    v-if="!item.header"
                    :title="translate(`${item.title}`)"
                    :value="`${item.activeValue}`"
                    :icon="`${item.icon}`"
                    :route="`${item.route}`"
                />
            </template>
        </VList>
    </VNavigationDrawer>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .sidebar {
        position: fixed !important;
        top: var(--navbar-height);
        left: 0;
        overflow-y: scroll;
    }
</style>
