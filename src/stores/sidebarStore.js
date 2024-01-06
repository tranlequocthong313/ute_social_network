import { defineStore } from 'pinia';
import { ref } from 'vue';

const useSidebarStore = defineStore('sidebarStore', () => {
    const tabletAndMobileScreenSize = 1280;
    const isShowingSidebar = ref(window.innerWidth >= tabletAndMobileScreenSize);
    const expandOnHover = ref(window.innerWidth >= tabletAndMobileScreenSize);

    window.addEventListener('resize', () => {
        const onLargeScreen = window.innerWidth >= tabletAndMobileScreenSize;
        isShowingSidebar.value = onLargeScreen;
        expandOnHover.value = onLargeScreen;
    });

    const toggleSidebar = () => {
        isShowingSidebar.value = !isShowingSidebar.value;
    };

    return {
        isShowingSidebar,
        expandOnHover,
        toggleSidebar,
    };
});

export default useSidebarStore;
