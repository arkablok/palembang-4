const chartData = {
    labels: ["Earle Asphalt x1371", "EB Public Library x1380", "BSQ Mall x1364 - Zales", "GuttenPlans x1367", "BSQ Mall x1366-ATT"],
};

const myDoughnutChart = document.getElementById('doughnutChart').getContext('2d');

new Chart(myDoughnutChart, {
    type: "doughnut",
    data: {
        labels: chartData.labels,
        datasets: [
            {
                label: "Transaction from machine",
                data: [1024, 3017, 920, 3596, 739],
                backgroundColor: ["#0372ef", "#2e8bf3", "#5ba5f5", "#89bef8", "#b7d8fb"],
            }
        ]
    },
    options:  {
        borderWidth: 0,
        hoverBorderWidth: 0,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    font: {
                        size: 13,
                    },
                    boxWidth: 13,
                    usePointStyle: true,
                    padding: 10,
                },
            }, 
            datalabels: {
                color: '#fff',
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value * 100 / sum).toFixed(1) + "%";
                    return percentage;
                }
            }
        }, 
    },
    plugins: [ChartDataLabels]
});