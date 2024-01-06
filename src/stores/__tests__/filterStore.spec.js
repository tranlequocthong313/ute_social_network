import { describe, it, beforeEach, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import useFilterStore from '@/stores/filterStore';

const filters = [
    {
        key: 'type',
        title: 'Type',
        value: ['lecturer', 'student', 'alumni'],
        type: 'checkbox',
    },
    {
        key: 'faculty',
        title: 'Faculty',
        value: ['it', 'medical'],
        type: 'checkbox',
    },
    {
        key: 'status',
        title: 'Status',
        value: ['active', 'deactive', 'pending'],
        type: 'radio',
    },
    {
        key: 'gender',
        title: 'Gender',
        value: ['male', 'female'],
        type: 'checkbox',
    },
    {
        key: 'hometown',
        title: 'Hometown',
        value: ['Quang Nam', 'Ho Chi Minh', 'Ha Noi', 'Da Nang', 'Nghe An', 'Hai Phong', 'Can Tho'],
        type: 'checkbox',
    },
    {
        key: 'yearOfBirth',
        title: 'Year of birth',
        value: [0, 100],
        type: 'range',
    },
];

describe('filterStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('should hide filter sidebar by default', () => {
        const store = useFilterStore();

        expect(store.showingFilter).toBeFalsy();
    });

    it('should show filter sidebar when toggle', () => {
        const store = useFilterStore();

        store.toggleFilter();

        expect(store.showingFilter).toBeTruthy();
    });

    it('should create a correct map for selected filter', () => {
        const store = useFilterStore();

        store.setFilters(filters);

        expect(store.map).toMatchObject({
            type: [],
            faculty: [],
            status: new String(),
            gender: [],
            hometown: [],
            yearOfBirth: [],
        });
    });

    it('should return empty query by default', () => {
        const store = useFilterStore();

        store.setFilters(filters);

        expect(store.query).toEqual('');
    });

    it('should return the exact query as the selected filter', () => {
        const store = useFilterStore();

        store.setFilters(filters);
        store.setSelected('gender', ['male']);
        store.setSelected('status', 'active');
        store.setSelected('hometown', ['Ho Chi Minh', 'Quang Nam']);
        store.setSelected('yearOfBirth', [60, 90]);
        store.setSelected('gender', ['male', 'female']);

        expect(store.query).toContain('gender=male');
        expect(store.query).toContain('status=active');
        expect(store.query).toContain('hometown=Ho Chi Minh');
        expect(store.query).toContain('hometown=Quang Nam');
        expect(store.query).toContain('yearOfBirth_gte=60');
        expect(store.query).toContain('yearOfBirth_lte=90');
        expect(store.query).toContain('gender=female');
    });
});
