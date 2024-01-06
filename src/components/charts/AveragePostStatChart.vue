<script setup>
    import { onMounted } from 'vue';
    import Chart from 'chart.js/auto';

    import { translate } from '@/locales/translator.js';
    import { shuffle } from '@/utils/array.js';
    import { getMonths } from '@/utils/date.js';

    const labels = getMonths();

    const getRandomData = () => {
        return Math.floor(Math.random() * 100000) + 100;
    };

    const data = {
        labels,
        datasets: [
            {
                label: translate('averagePostViewEachMonth'),
                data: [],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: translate('averagePostLikeEachMonth'),
                data: [],
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1,
            },
            {
                label: translate('averagePostCommentEachMonth'),
                data: [],
                fill: false,
                backgroundColor: 'rgb(153, 102, 255)',
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1,
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
        type: 'line',
        data,
        options: {
            maintainAspectRatio: false,
        },
    };

    onMounted(() => {
        new Chart(document.getElementById('line-chart'), config);
    });
</script>

<template>
    <div>
        <canvas id="line-chart" height="40vh"></canvas>
    </div>
</template>
