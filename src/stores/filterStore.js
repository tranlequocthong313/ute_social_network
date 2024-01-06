import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { isEmpty } from '@/utils/validation';

const useFilterStore = defineStore('filterStore', () => {
    const showingFilter = ref(false);
    const _filters = ref([]);
    const map = ref({});

    const filterTypes = {
        checkbox: Array,
        radio: String,
        range: Array,
    };

    const mapTypes = {};

    const setFilters = (filters) => {
        _filters.value = filters;
        _filters.value.forEach((filter) => {
            map.value[filter.key] = new filterTypes[filter.type]();
            mapTypes[filter.key] = filter.type;
        });
    };

    const toggleFilter = () => {
        showingFilter.value = !showingFilter.value;
    };

    const setSelected = (key, value) => {
        map.value[key] = value;
    };

    const filters = computed(() => {
        return _filters.value;
    });

    const query = computed(() => {
        let q = '';
        for (const [key, value] of Object.entries(map.value)) {
            if (!isEmpty(value)) {
                q += getQueryPair(key, value);
            }
        }
        return q.slice(0, q.length - 1);
    });

    const getQueryPair = (key, value) => {
        if (mapTypes[key] === 'range') {
            return `${key}_gte=${value[0]}&${key}_lte=${value[1]}&`;
        }
        if (mapTypes[key] === 'checkbox') {
            let result = '';
            for (let it of value) {
                result += `${key}=${it}&`;
            }
            return result;
        }
        if (mapTypes[key] === 'radio') {
            return `${key}=${value}&`;
        }
    };

    return {
        query,
        filters,
        showingFilter,
        map,
        setSelected,
        setFilters,
        toggleFilter,
    };
});

export default useFilterStore;
