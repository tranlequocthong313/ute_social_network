<script setup>
    import { ref } from 'vue';

    import { translate } from '@/locales/translator.js';

    defineProps({
        title: {
            type: String,
        },
        content: {
            type: String,
            default: () => `${translate('areYouSure')}?`,
        },
    });

    const isActive = ref(false);
</script>

<template>
    <VDialog width="500" v-model="isActive">
        <template #activator="{ props }">
            <slot name="activator" :props="props" />
        </template>
        <VCard class="pa-6">
            <slot name="default" :isActive="isActive">
                <VCardTitle>{{ title }}</VCardTitle>
                <VCardText>
                    <slot name="default">
                        {{ content }}
                    </slot>
                </VCardText>
                <VCardActions>
                    <VSpacer></VSpacer>
                    <VBtn @click="isActive = false" class="mx-1" variant="tonal">{{ translate('cancel') }}</VBtn>
                    <div @click="isActive = false" class="mx-1">
                        <slot name="action"></slot>
                    </div>
                </VCardActions>
            </slot>
        </VCard>
    </VDialog>
</template>
