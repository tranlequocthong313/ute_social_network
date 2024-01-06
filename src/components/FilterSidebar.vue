<script setup>
    import { storeToRefs } from 'pinia';
    import { onMounted, ref } from 'vue';

    import useFilterStore from '@/stores/filterStore';
    import { capitalizeString } from '@/utils/string.js';

    const filterStore = useFilterStore();
    const { filters, showingFilter, map } = storeToRefs(filterStore);

    const updateModelValue = async (key, value) => {
        filterStore.setSelected(key, value);
    };

    const rangeValues = ref({});
    onMounted(() => {
        filters.value.forEach((filter) => {
            if (filter.type === 'range') {
                rangeValues.value[filter.key] = [];
            }
        });
    });
</script>

<template>
    <VNavigationDrawer location="right" temporary v-model="showingFilter" class="filter-sidebar" touchless>
        <VList>
            <VListItem class="mb-2">
                <h1><strong>Filters</strong></h1>
            </VListItem>
            <VListItem v-for="filter in filters" :key="filter?.key">
                <VListItemTitle>{{ filter?.title }}</VListItemTitle>
                <slot :name="`item.${filter?.key}`" :item="filter?.value">
                    <div v-if="filter?.type === 'checkbox'">
                        <VCheckbox
                            v-for="it in filter?.value"
                            :key="it"
                            :label="capitalizeString(it)"
                            hide-details
                            :model-value="map[filter?.key]"
                            @update:modelValue="(value) => updateModelValue(filter?.key, value)"
                            :value="it"
                        />
                    </div>

                    <VRadioGroup
                        v-if="filter?.type === 'radio'"
                        :model-value="map[filter?.key]"
                        @update:modelValue="(value) => updateModelValue(filter?.key, value)"
                    >
                        <VRadio
                            v-for="it in filter?.value"
                            :key="it"
                            :label="capitalizeString(it)"
                            hide-details
                            :value="it"
                        />
                        <VBtn class="button" width="100%" @click="updateModelValue(filter?.key, '')">Clear</VBtn>
                    </VRadioGroup>

                    <div v-if="filter?.type === 'range'">
                        <VRangeSlider v-model="rangeValues[filter?.key]" step="1" thumb-label="always">
                            <template #append>
                                <VIcon @click="rangeValues[filter?.key] = []">mdi-delete</VIcon>
                            </template>
                        </VRangeSlider>
                        <VBtn
                            class="button"
                            width="100%"
                            @click="updateModelValue(filter?.key, rangeValues[filter?.key])"
                            >Accept</VBtn
                        >
                    </div>
                </slot>
                <VDivider />
            </VListItem>
        </VList>
    </VNavigationDrawer>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .filter-sidebar {
        position: fixed !important;
        top: var(--navbar-height);
        overflow-y: scroll;

        .button {
            background-color: var(--primary-color);
            lighting-color: var(--dark-text-color);
        }
    }
</style>
