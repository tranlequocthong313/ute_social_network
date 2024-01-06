<script setup>
    import { ref } from 'vue';

    import { getFormattedDate } from '@/utils/date';
    import { datePickerValidator } from '@/utils/validation';

    const emits = defineEmits({
        'update:modelValue': datePickerValidator,
    });

    defineProps({
        label: {
            type: String,
        },

        modelValue: {
            type: [Date, String],
        },
    });

    const menu = ref(false);

    const updateModelValue = (value) => {
        emits('update:modelValue', value);
    };
</script>

<template>
    <VMenu v-model="menu" :close-on-content-click="false">
        <template #activator="{ props }">
            <VTextField
                :model-value="getFormattedDate(modelValue, { time: false, format: 'yyyy-mm-dd' })"
                :label="label"
                append-inner-icon="mdi-calendar"
                readonly
                v-bind="props"
            ></VTextField>
        </template>
        <VDatePicker :modelValue="modelValue" @update:modelValue="updateModelValue" no-title scrollable hide-actions />
    </VMenu>
</template>
