import { describe, it, beforeEach, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import useSidebarStore from '@/stores/sidebarStore';

describe('sidebarStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should hide sidebar by default', () => {
        const store = useSidebarStore();

        expect(store.isShowingSidebar).toBeFalsy();
    });

    it('should show sidebar when toggle', () => {
        const store = useSidebarStore();

        store.toggleSidebar();

        expect(store.isShowingSidebar).toBeTruthy();
    });
});
