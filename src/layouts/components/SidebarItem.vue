<script setup>
    import { toRefs } from 'vue';

    const props = defineProps({
        title: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: false,
        },
        route: {
            type: String,
            required: true,
        },
    });

    const { title, value, icon } = toRefs(props);
</script>

<template>
    <RouterLink :to="{ name: `${route}` }" active-class="sidebar-item siebar-item-active">
        <VListItem :value="value" :title="title">
            <template #prepend>
                <VIcon>{{ icon }}</VIcon>
            </template>
        </VListItem>
    </RouterLink>
</template>

<style lang="scss" scoped>
    @import '@/assets/base.css';

    .sidebar-item {
        display: block;
        border-radius: 4px;
    }

    .sidebar-item-active {
        color: var(--primary-color);
    }

    .sidebar-item.router-link-exact-active {
        background-color: var(--primary-color);
        color: var(--dark-text-color);
    }

    .v-theme--dark {
        a,
        i,
        span {
            color: var(--dark-text-color);
        }
    }

    .sizebar-icon {
        font-size: 60px !important;
    }
</style>
