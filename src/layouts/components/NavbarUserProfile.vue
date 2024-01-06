<script setup>
    import { computed, ref, watch } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useRouter } from 'vue-router';
    import gravatar from 'gravatar';

    import logo from '@/assets/images/hcmute_logo.png';
    import { changeLanguage, translate } from '@/locales/translator.js';
    import useAuthStore from '@/stores/authStore';

    const items = {
        root: ['profile', 'language', 'logout'],
        profile: { title: 'profile', icon: 'mdi-account', link: 'profile' },
        language: { title: 'language', icon: 'mdi-translate', children: ['en', 'vn'] },
        logout: { title: 'logout', icon: 'mdi-logout', divider: true, jobType: 'logout' },
        en: { title: 'english', code: 'en', jobType: 'lang' },
        vn: { title: 'vietnamese', code: 'vn', jobType: 'lang' },
    };

    const router = useRouter();

    const history = ref([items.root]);
    const submenuTitle = ref(null);
    const onShowMenu = ref(false);

    const store = useAuthStore();
    const { user } = storeToRefs(store);

    const currentItems = computed(() => {
        return history.value[history.value.length - 1].map((key) => items[key]);
    });

    const onClickMenuItem = (menuItem) => {
        openSubMenu(menuItem);
        handleJob(menuItem);
    };

    const openSubMenu = (menuItem) => {
        if (menuItem?.children) {
            submenuTitle.value = menuItem.title;
            return history.value.push(menuItem.children);
        }
    };

    const handleJob = async (menuItem) => {
        switch (menuItem.jobType) {
            case 'lang':
                changeLanguage(menuItem.code);
                router.go();
                break;

            case 'logout':
                await store.logout();
                break;

            default:
                break;
        }
    };

    const goBackHistory = () => {
        submenuTitle.value = null;
        history.value = history.value.slice(0, history.value.length - 1);
    };

    watch(onShowMenu, () => {
        setTimeout(() => {
            submenuTitle.value = null;
            history.value = [items.root];
        }, 200);
    });
</script>

<template>
    <VMenu width="230" offset="10px" :close-on-content-click="false" v-model="onShowMenu">
        <template #activator="{ props: menu }">
            <VTooltip :text="translate('user')" location="bottom">
                <template #activator="{ props: tooltip }">
                    <VAvatar
                        v-bind="{ ...menu, ...tooltip }"
                        :image="gravatar.url(user?.email, { s: '24' })"
                        size="24"
                    />
                </template>
            </VTooltip>
        </template>
        <VList>
            <VListItem
                :prepend-avatar="gravatar.url(user?.email)"
                :title="user?.username"
                :subtitle="translate('admin')"
            ></VListItem>
            <VDivider class="my-2" />
            <div v-if="submenuTitle" class="submenu-title">
                <VIcon @click="goBackHistory">mdi-chevron-left</VIcon>
                <h4 class="mx-10">{{ translate(submenuTitle) }}</h4>
            </div>
            <template v-for="(item, index) in currentItems" :key="index">
                <VDivider class="my-1" v-if="item?.divider" />
                <VListItem :value="item?.title" :prepend-icon="item?.icon" @click="onClickMenuItem(item)">
                    <RouterLink :to="{ name: item?.link }" class="menu-title">
                        {{ translate(item?.title) }}
                    </RouterLink>
                </VListItem>
            </template>
        </VList>
    </VMenu>
</template>

<style lang="scss" scoped>
    @import '@/assets/base.css';

    .v-avatar {
        border: 1px solid black !important;
        cursor: pointer;
    }

    .menu-title {
        display: block;
        width: 100%;
        height: 100%;
        color: var(--dark-text-color);
    }

    .submenu-title {
        display: flex;
        padding: 8px 14px;

        i {
            cursor: pointer;
        }
    }
</style>
