<script setup>
    import { toRefs, computed } from 'vue';

    import { validateStatus } from '@/utils/validation';

    const props = defineProps({
        status: {
            type: String,
            default: 'active',
            validator: validateStatus,
        },
        activeContent: {
            type: String,
            default: 'Active',
        },
        deActiveContent: {
            type: String,
            default: 'Deactive',
        },
        pendingContent: {
            type: String,
            default: 'Pending',
        },
        rejectedContent: {
            type: String,
            default: 'Rejected',
        },
        activeColor: {
            type: String,
            default: 'green',
        },
        deActiveColor: {
            type: String,
            default: 'red',
        },
        pendingColor: {
            type: String,
            default: 'yellow',
        },
        rejectedColor: {
            type: String,
            default: 'red',
        },
    });

    const {
        status,
        activeContent,
        deActiveContent,
        activeColor,
        deActiveColor,
        rejectedColor,
        pendingColor,
        pendingContent,
        rejectedContent,
    } = toRefs(props);

    const colors = {
        active: activeColor.value,
        deactive: deActiveColor.value,
        rejected: rejectedColor.value,
        pending: pendingColor.value,
    };

    const contents = {
        active: activeContent.value,
        deactive: deActiveContent.value,
        rejected: rejectedContent.value,
        pending: pendingContent.value,
    };

    const color = computed(() => {
        return colors[status.value];
    });

    const content = computed(() => {
        return contents[status.value];
    });
</script>

<template>
    <VChip :color="color" text-color="white">
        {{ content }}
    </VChip>
</template>
