<script setup>
    import { onMounted } from 'vue';
    import Chart from 'chart.js/auto';

    import { translate } from '@/locales/translator.js';
    import { shuffle } from '@/utils/array.js';
    import { getMonths } from '@/utils/date.js';

    const getRandomData = () => {
        return Math.floor(Math.random() * 1000) + 100;
    };

    const labels = getMonths();

    const data = {
        labels,
        datasets: [
            {
                label: translate('accountRegisteredEachMonth'),
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(255, 159, 64)',
                    'rgba(255, 205, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(54, 162, 235)',
                    'rgba(153, 102, 255)',
                    'rgba(201, 203, 207)',
                ],
                data: [],
                borderWidth: 1,
            },
        ],
    };

    shuffle(data.datasets[0].backgroundColor);

    for (let i = 0; i < labels.length; i++) {
        data.datasets.forEach((dataset) => {
            dataset.data.push(getRandomData());
        });
    }

    const config = {
        type: 'bar',
        data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            maintainAspectRatio: false,
        },
    };

    onMounted(() => {
        new Chart(document.getElementById('bar-chart'), config);
    });
</script>

<template>
    <div>
        <canvas id="bar-chart" height="40vh"></canvas>
    </div>
</template>
