fetch('data_vending.json')
.then(response => response.json())
.then(data => {
    const jsonData = data;
    const transactionCountReduce = jsonData.reduce((acc, curr) => acc + 1, 0);

    const machineNames = [...new Set(data.map(item => item.Machine))];
    const machineData = machineNames.map(machineName => {
    const machineTransactions = data.filter(item => item.Machine === machineName);
    return machineTransactions.length;
});

const myDoughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');

const myDoughnutChart = new Chart(myDoughnutChartCtx, {
    type: "doughnut",
    data: {
        labels: machineNames,
        datasets: [{
            label: 'Transactions',
            data: machineData,
            backgroundColor: ["#0372ef", "#2e8bf3", "#5ba5f5", "#89bef8", "#b7d8fb"]
        }]
    },
    options:  {
        borderWidth: 0,
        hoverBorderWidth: 0,
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: `Total transactions: ${transactionCountReduce}`
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: '#fff',
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.forEach(data => {
                        sum += data;
                    });
                    let percentage = (value * 100 / sum).toFixed(1) + "%";
                    return percentage;
                }
            }
        }
    },
    plugins: [ChartDataLabels]
});

const checkboxes = document.querySelectorAll('input[id="doughnut"]');

    // Add event listener to checkboxes
    checkboxes.forEach((cb, i) => {
        cb.addEventListener('change', () => {
            const allUnchecked = Array.from(checkboxes).every(cb => !cb.checked);
            if (allUnchecked) {
            // Reset chart data to original state
            myDoughnutChart.data.labels = machineNames;
            myDoughnutChart.data.datasets[0].data = machineData;
            } else {
            const selectedMachines = machineNames.filter((machineName, index) => checkboxes.item(index).checked);
            const labels = selectedMachines.map(machineName => machineName);
            const data = selectedMachines.map(machineName => machineData[machineNames.indexOf(machineName)]);
            myDoughnutChart.data.labels = labels;
            myDoughnutChart.data.datasets[0].data = data;
            }
            myDoughnutChart.update();
        });
    });
})
.catch(error => console.error('Error fetching data:', error));
