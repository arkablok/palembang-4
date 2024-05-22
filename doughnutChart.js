let doughnutChart;
let dataJson;

fetch('data.json')
.then(response => response.json())
.then(data => {
    dataJson = data;
    updateChart2();
});

function updateChart2() {
    const selectedMachine = document.getElementById('Selector1').value;
    const filteredData = selectedMachine === "Type" ? dataJson : dataJson.filter(item => item.machine === selectedMachine);

    const labels = filteredData.map(item => item.machine);
    const dataValues = filteredData.map(item => parseInt(item.transaction));

    const sum = dataValues.reduce((acc, value) => acc + value, 0);
    
    if (doughnutChart) {
        doughnutChart.data.labels = labels;
        doughnutChart.data.datasets[0].data = dataValues;
        doughnutChart.update();
    } else {
        const ctx = document.getElementById('doughnutChart').getContext('2d');
        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Transaction from machine',
                        data: dataValues,
                        backgroundColor: ['#0372ef', '#2e8bf3', '#5ba5f5', '#89bef8', '#b7d8fb'],
                    }
                ]
            },
            options: {
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
                        color: 'white',
                        formatter: (value) => {
                            let percentage = (value * 100 / sum).toFixed(1) + '%';
                            return percentage;
                        } 
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
}

document.getElementById('Selector1').addEventListener('change', updateChart2);