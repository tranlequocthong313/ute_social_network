<script setup>
    import { computed, toRefs } from 'vue';

    import { validateDirection } from '@/utils/validation';
    import { numberWithDots } from '@/utils/string.js';

    const props = defineProps({
        label: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        direction: {
            type: String,
            required: true,
            validator: validateDirection,
        },
        percent: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
    });

    const { direction } = toRefs(props);

    const up = computed(() => {
        return direction.value === 'up';
    });

    const down = computed(() => {
        return direction.value === 'down';
    });

    const stay = computed(() => {
        return direction.value === 'stay';
    });

    const directionIcon = computed(() => {
        if (up.value) {
            return 'mdi-arrow-up';
        }
        if (down.value) {
            return 'mdi-arrow-down';
        }
        return 'mdi-minus';
    });
</script>

<template>
    <VCard class="card-stat-container pa-4">
        <p class="label">{{ label }}</p>
        <h1 class="value">{{ value }}</h1>
        <div>
            <VIcon class="icon" :class="{ up, down, stay }">{{ directionIcon }}</VIcon>
            <span>{{ ' ' }}</span>
            <span :class="{ up, down }">{{ percent }}</span>
        </div>
        <span class="time">{{ time }}</span>
    </VCard>
</template>

<style lang="scss">
    @import '@/assets/base.css';

    .card-stat-container {
        &.v-theme--dark {
            .label {
                color: var(--dark-text-color-secondary);
            }

            .value {
                color: var(--dark-text-color);
            }

            .time {
                color: var(--dark-text-color-3);
            }
        }

        .label {
            color: var(--light-text-color-secondary);
        }

        .value {
            font-weight: bold;
            color: var(--light-text-color);
        }

        .icon {
            font-size: 1rem;
            border-radius: 50%;
        }

        .icon.up {
            background-color: rgba(green, 0.3);
        }

        .icon.down {
            background-color: rgba(red, 0.3);
        }

        .icon.stay {
            background-color: rgba(yellow, 0.3);
        }

        .up {
            color: var(--success-color);
        }

        .down {
            color: var(--error-color);
        }

        .stay {
            color: var(--warning-color);
        }

        .time {
            color: var(--light-text-color-3);
        }
    }
</style>
