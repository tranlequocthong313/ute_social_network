<script setup>
    import { ref, computed } from 'vue';

    import SearchBar from '@/components/SearchBar.vue';
    import ModalDialog from './ModalDialog.vue';
    import BackButton from './BackButton.vue';
    import { translate } from '@/locales/translator.js';
    import FilterSidebar from './FilterSidebar.vue';
    import useFilterStore from '@/stores/filterStore.js';

    const props = defineProps({
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
        itemsLength: {
            type: Number,
        },
        sortBy: {
            type: Array,
            default: () => [{ key: 'id', order: 'desc' }],
        },
        statusKey: {
            type: String,
        },
        addTitle: {
            type: String,
            default: () => translate('addNew'),
        },
        editTitle: {
            type: String,
            default: () => translate('edit'),
        },
        hideAdd: {
            type: Boolean,
            default: () => false,
        },
        hideEdit: {
            type: Boolean,
            default: () => false,
        },
        showModalOnClickRow: {
            type: Boolean,
            default: () => false,
        },
        hideModalActions: {
            type: Boolean,
            default: () => false,
        },
        showFilter: {
            type: Boolean,
            default: () => true,
        },
        modalTitle: {
            type: String,
        },
        addButtonTitle: {
            type: String,
        },
    });

    const selected = ref([]);

    const disabledButton = computed(() => {
        return !selected.value.length || selected.value.length === 0;
    });

    const emits = defineEmits([
        'addItem',
        'deleteItem',
        'deleteItems',
        'editItem',
        'update-options',
        'clickRow',
        'approveItem',
        'declineItem',
        'openEdit',
    ]);

    const filterStore = useFilterStore();

    const addingItem = ref(false);
    const editingItem = ref(false);
    const showingModal = ref(false);
    const searchText = ref('');
    const searchLoading = ref(false);
    const item = ref(null);

    const addItem = () => {
        emits('addItem');
    };

    const deleteItems = () => {
        emits('deleteItems', selected.value);
        selected.value = [];
    };

    const deleteItem = (item) => {
        emits('deleteItem', item);
    };

    const editItem = () => {
        emits('editItem', item.value);
    };

    const declineItem = () => {
        showingModal.value = false;
        emits('declineItem');
    };

    const approveItem = () => {
        showingModal.value = false;
        emits('approveItem');
    };

    let timer = null;
    let delay = 500;
    const updateOptions = (properties) => {
        // debounce if user is searching
        if (properties.search.length > 0) {
            clearTimeout(timer);
            searchLoading.value = true;

            timer = setTimeout(() => {
                emits('update-options', properties);
                searchLoading.value = false;
            }, delay);
        } else {
            emits('update-options', properties);
        }
    };

    const clickRow = (e, item) => {
        if (!editingItem.value) {
            emits('clickRow', item.item.raw);
            showingModal.value = true;
        }
    };

    const openEdit = (it) => {
        item.value = it;
        editingItem.value = true;
        emits('openEdit', it);
    };

    const openAdd = () => {
        addingItem.value = true;
        emits('openAdd');
    };
</script>

<template>
    <VContainer fluid>
        <h2>{{ modalTitle }}</h2>
        <VCard v-if="addingItem" class="mt-8 pa-5" data-test="add-form">
            <div class="d-flex align-center">
                <BackButton @back="addingItem = false" :title="addTitle" />
            </div>
            <slot name="add"> </slot>
            <VCardActions class="justify-end">
                <VBtn :text="translate('cancel')" variant="tonal" @click="addingItem = false"></VBtn>
                <VBtn
                    class="table-active-button"
                    :text="translate(addButtonTitle ? addButtonTitle : 'add')"
                    variant="tonal"
                    @click="addItem"
                ></VBtn>
            </VCardActions>
        </VCard>
        <VCard v-if="editingItem" class="mt-8 pa-5" data-test="edit-form">
            <div class="d-flex align-center">
                <BackButton @back="editingItem = false" :title="editTitle" />
            </div>
            <slot name="edit" :item="item"> </slot>
            <VCardActions class="justify-end">
                <VBtn :text="translate('cancel')" variant="tonal" @click="editingItem = false"></VBtn>
                <VBtn class="table-active-button" :text="translate('edit')" variant="tonal" @click="editItem"></VBtn>
            </VCardActions>
        </VCard>
        <VDataTableServer
            v-if="!addingItem && !editingItem"
            class="mt-5"
            :loading="loading || searchLoading"
            :headers="headers"
            :items="items"
            :items-length="itemsLength"
            :sort-by="sortBy"
            :search="searchText"
            @update:options="updateOptions"
            @click:row="clickRow"
            v-model="selected"
            show-select
            must-sort
        >
            <template v-slot:top>
                <VRow class="align-center justify-space-between">
                    <VCol cols="12" sm="5">
                        <div class="my-2">
                            <SearchBar v-model="searchText" />
                        </div>
                    </VCol>
                    <VCol cols="12" sm="5" class="d-flex justify-center justify-sm-end">
                        <ModalDialog :title="translate('delete')">
                            <template #activator="{ props }">
                                <VBtn class="mx-2 my-2" v-bind="props" variant="tonal" :disabled="disabledButton">{{
                                    translate('delete')
                                }}</VBtn>
                            </template>
                            <template #action>
                                <VBtn
                                    class="table-active-button"
                                    :text="translate('delete')"
                                    @click="deleteItems"
                                ></VBtn>
                            </template>
                        </ModalDialog>
                        <VBtn class="mx-2 my-2 table-active-button" @click="openAdd" v-bind="props" v-if="!hideAdd">{{
                            translate('addNew')
                        }}</VBtn>
                        <VIcon class="mx-2 my-2" size="30" v-if="showFilter" @click="filterStore.toggleFilter()"
                            >mdi-filter-plus</VIcon
                        >
                    </VCol>
                </VRow>
            </template>
            <template v-slot:[`item.${statusKey}`]="{ item }">
                <slot name="status" :item="item.raw"></slot>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <slot name="actions">
                    <ModalDialog :title="translate('delete')">
                        <template #activator="{ props: dialog }">
                            <VTooltip :text="translate('delete')" location="bottom">
                                <template #activator="{ props: tooltip }">
                                    <VIcon size="small" class="me-2" v-bind="{ ...dialog, ...tooltip }"
                                        >mdi-delete</VIcon
                                    >
                                </template>
                            </VTooltip>
                        </template>
                        <template #action>
                            <VBtn
                                class="table-active-button"
                                :text="translate('delete')"
                                @click="deleteItem(item.raw)"
                            ></VBtn>
                        </template>
                    </ModalDialog>
                    <VTooltip :text="translate('edit')" location="bottom">
                        <template #activator="{ props }">
                            <VIcon size="small" class="me-2" v-bind="props" @click="openEdit(item.raw)" v-if="!hideEdit"
                                >mdi-pencil</VIcon
                            >
                        </template>
                    </VTooltip>
                </slot>
            </template>
        </VDataTableServer>
        <div v-if="showModalOnClickRow">
            <VDialog v-model="showingModal">
                <VCard class="pa-6">
                    <VContainer v-if="!hideModalActions" class="pt-0">
                        <VRow class="mt-5">
                            <VCol cols="12" sm="7" class="d-flex align-center">
                                <BackButton @back="showingModal = false" />
                            </VCol>
                            <VCol cols="12" sm="5" class="d-flex justify-end">
                                <VBtn class="mx-1" variant="tonal" @click="declineItem">{{
                                    translate('decline')
                                }}</VBtn>
                                <VBtn class="mx-1 table-active-button" @click="approveItem">{{
                                    translate('approve')
                                }}</VBtn>
                            </VCol>
                        </VRow>
                    </VContainer>
                    <slot name="modal"> </slot>
                </VCard>
            </VDialog>
        </div>
        <FilterSidebar></FilterSidebar>
    </VContainer>
</template>

<style lang="scss">
    @import '@/assets/_override.scss';

    .table-active-button {
        color: var(--dark-text-color);
        background-color: var(--primary-color);
    }
</style>
