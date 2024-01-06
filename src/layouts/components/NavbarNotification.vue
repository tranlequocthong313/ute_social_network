<script setup>
    import { computed, ref, watch, toRefs } from 'vue';

    import { translate } from '@/locales/translator.js';

    const props = defineProps({
        items: {
            type: Array,
            default: () => [],
        },
    });
    const { items } = toRefs(props);

    const showingNotifications = ref(false);
    const showingOptions = ref(false);
    const notificationTab = ref('all');

    const unreadNotifications = computed(() => items.value.filter((item) => !item.read));

    const notifications = computed(() => {
        if (notificationTab.value === 'all') {
            return items.value;
        } else {
            return unreadNotifications.value;
        }
    });

    const readNotification = (item) => {
        item.read = true;
    };

    const markReadAll = () => {
        unreadNotifications.value.forEach((item) => {
            item.read = true;
        });
        showingOptions.value = false;
    };

    watch(showingNotifications, () => {
        setTimeout(() => (notificationTab.value = 'all'), 200);
    });

    const onClickNotificationMenu = () => {
        showingOptions.value = false;
        showingNotifications.value = true;
    };
</script>

<template>
    <VMenu
        width="380"
        max-height="500"
        offset="10"
        :close-on-content-click="false"
        v-model="showingNotifications"
        @click="onClickNotificationMenu"
    >
        <template #activator="{ props: menu }">
            <VTooltip :text="translate('notification')" location="bottom">
                <template #activator="{ props: tooltip }">
                    <VBadge
                        class="d-flex align-center justify-center notification-badge"
                        max="99"
                        offset-x="3"
                        :content="unreadNotifications.length"
                        :model-value="unreadNotifications.length > 0"
                        data-test="notification-badge"
                    >
                        <VIcon v-bind="{ ...menu, ...tooltip }" data-test="notification-bell">mdi-bell</VIcon>
                    </VBadge>
                </template>
            </VTooltip>
        </template>
        <VList data-test="notification-list">
            <div class="notification-header">
                <div class="d-flex align-center justify-space-between">
                    <h2 class="pl-4 font-weight-bold">{{ translate('notification') }}</h2>
                    <VMenu offset="10px" v-model="showingOptions" :close-on-content-click="false">
                        <template #activator="{ props }">
                            <VIcon class="mr-3" v-bind="props">mdi-dots-horizontal</VIcon>
                        </template>
                        <VList>
                            <VListItem prepend-icon="mdi-check" value="mark-all" @click="markReadAll">
                                <VListItemTitle>{{ translate('markAllRead') }}</VListItemTitle>
                            </VListItem>
                            <VListItem prepend-icon="mdi-cog" value="settings" @click="showingOptions = false">
                                <VListItemTitle>{{ translate('notificationSettings') }}</VListItemTitle>
                            </VListItem>
                            <VListItem prepend-icon="mdi-ballot" value="open-all" @click="showingOptions = false">
                                <VListItemTitle>{{ translate('openNotifications') }}</VListItemTitle>
                            </VListItem>
                        </VList>
                    </VMenu>
                </div>

                <VTabs class="pl-4 mb-2 tabs" v-model="notificationTab">
                    <VTab value="all">{{ translate('all') }}</VTab>
                    <VTab value="unread">{{ translate('unread') }}</VTab>
                </VTabs>
            </div>

            <VListItem
                v-for="(item, index) in notifications"
                :value="index"
                :key="index"
                class="px-4 py-3 notification-item"
                @click="readNotification(item)"
            >
                <RouterLink :to="item?.to">
                    <VRow>
                        <VCol cols="3" class="d-flex justify-center align-center">
                            <VAvatar size="56">
                                <VImg
                                    cover
                                    :src="item?.sender?.avatar"
                                    :alt="`${item?.sender.firstName} ${item?.sender.lastName}`"
                                >
                                    <template #placeholder>
                                        <div class="d-flex align-center justify-center fill-height">
                                            <v-progress-circular
                                                color="grey-lighten-4"
                                                indeterminate
                                            ></v-progress-circular>
                                        </div>
                                    </template>
                                </VImg>
                            </VAvatar>
                        </VCol>
                        <VCol cols="9">
                            <VRow class="align-center">
                                <VCol cols="10" class="content">
                                    <p class="content-main">
                                        <strong>{{ item.sender.firstName }} {{ item.sender.lastName }}</strong>
                                        <span>{{ ' ' }}</span
                                        ><span>{{ translate(item.message) }}</span>
                                    </p>
                                    <p class="mt-2" :class="{ 'unread-timeago': !item.read }">{{ item.timeAgo }}</p>
                                </VCol>
                                <VCol cols="2" v-if="!item.read">
                                    <div class="status-badge"></div>
                                </VCol>
                            </VRow>
                        </VCol>
                    </VRow>
                </RouterLink>
            </VListItem>
            <div v-if="!notifications.length" class="d-flex flex-column align-center py-3 empty-notification">
                <VIcon class="text-center" size="150">mdi-bell-sleep</VIcon>
                <p class="my-2 text-center">You have no notifications</p>
            </div>
        </VList>
    </VMenu>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .v-theme--dark .notification-header {
        color: var(--dark-text-color);
    }

    .notification-header {
        color: var(--light-text-color);

        .tabs {
            span {
                font-size: 0.8rem;
                font-weight: bold;
            }
        }
    }

    .notification-item {
        a {
            font-size: 0.9rem;
            color: var(--light-text-color);
        }
        .content {
            line-height: 1.2rem;

            .content-main {
                font-size: 1rem;
            }
        }

        &.v-theme--dark a {
            color: var(--dark-text-color);
        }
    }

    .notification-badge {
        .v-badge__badge {
            color: var(--dark-text-color);
            background-color: var(--error-color);
        }
    }

    .status-badge {
        width: 12px;
        height: 12px;
        display: inline-flex;
        background-color: var(--primary-color);
        border-radius: 50%;
    }

    .v-tab__slider {
        color: var(--primary-color);
    }

    .unread-timeago {
        color: var(--primary-color);
    }

    .empty-notification {
        color: var(--light-text-color-3);
    }
</style>
