<script setup>
    import { onMounted } from 'vue';
    import Chart from 'chart.js/auto';

    import { translate } from '@/locales/translator.js';

    const labels = [translate('male'), translate('female'), translate('nonBinary')];

    const getRandomData = () => {
        return Math.floor(Math.random() * 1000) + 100;
    };

    const data = {
        labels,
        datasets: [
            {
                label: translate('gender'),
                backgroundColor: ['rgba(75, 192, 192)', 'rgba(255, 99, 132)', 'rgba(201, 203, 207)'],
                borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(201, 203, 207)'],
                data: [],
                hoverOffset: 4,
            },
        ],
    };

    for (let i = 0; i < labels.length; i++) {
        data.datasets.forEach((dataset) => {
            dataset.data.push(getRandomData());
        });
    }

    const config = {
        type: 'pie',
        data,
        options: {
            maintainAspectRatio: false,
        },
    };

    onMounted(() => {
        new Chart(document.getElementById('pie-chart'), config);
    });
</script>

<template>
    <div>
        <canvas id="pie-chart"></canvas>
    </div>
</template>
