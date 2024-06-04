function parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(str => str.trim());
    return new Date(`${year}-${month}-${day}`);
}

// Function to get date range based on selected value
function getDateRange(value) {
    switch(value) {
        case 'jan': return [parseDate('01/01/2022'), parseDate('31/01/2022')];
        case 'feb': return [parseDate('01/02/2022'), parseDate('28/02/2022')];
        case 'mar': return [parseDate('01/03/2022'), parseDate('31/03/2022')];
        case 'apr': return [parseDate('01/04/2022'), parseDate('30/04/2022')];
        case 'may': return [parseDate('01/05/2022'), parseDate('31/05/2022')];
        case 'jun': return [parseDate('01/06/2022'), parseDate('30/06/2022')];
        case 'jul': return [parseDate('01/07/2022'), parseDate('31/07/2022')];
        case 'aug': return [parseDate('01/08/2022'), parseDate('31/08/2022')];
        case 'sept': return [parseDate('01/09/2022'), parseDate('30/09/2022')];
        case 'oct': return [parseDate('01/10/2022'), parseDate('31/10/2022')];
        case 'nov': return [parseDate('01/11/2022'), parseDate('30/11/2022')];
        case 'dec': return [parseDate('01/12/2022'), parseDate('31/12/2022')];
        default: return [parseDate('01/01/2022'), parseDate('31/12/2022')];
    }
}

// Function to update the doughnut chart
function update() {
    const dateSelector = document.getElementById('selector');
    const selectedValue = dateSelector.value;
    const [startDate, endDate] = getDateRange(selectedValue);

    fetch('data_vending.json')
    .then(response => response.json())
    .then(data => {
        const filteredData = data.filter(item => {
            const itemDate = parseDate(item.TransDate);
            return itemDate >= startDate && itemDate <= endDate;
        });

        const transactionCountReduce = filteredData.reduce((acc, curr) => acc + 1, 0);

        const machineNames = [...new Set(filteredData.map(item => item.Machine))];
        const machineData = machineNames.map(machineName => {
            const machineTransactions = filteredData.filter(item => item.Machine === machineName);
            return machineTransactions.length;
        });

        myDoughnutChart.data.labels = machineNames;
        myDoughnutChart.data.datasets[0].data = machineData;
        myDoughnutChart.options.title.text = `Total transactions: ${transactionCountReduce}`;
        myDoughnutChart.update();
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Initial chart setup
let myDoughnutChart;

fetch('data_vending.json')
.then(response => response.json())
.then(data => {
    const transactionCountReduce = data.reduce((acc, curr) => acc + 1, 0);

    const machineNames = [...new Set(data.map(item => item.Machine))];
    const machineData = machineNames.map(machineName => {
        const machineTransactions = data.filter(item => item.Machine === machineName);
        return machineTransactions.length;
    });

    const myDoughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');

    myDoughnutChart = new Chart(myDoughnutChartCtx, {
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

    const checkboxes = document.querySelectorAll('.doughnut-checkbox');

    // Add event listener to checkboxes
    checkboxes.forEach((cb, i) => {
        cb.addEventListener('change', () => {
            const allUnchecked = Array.from(checkboxes).every(cb => !cb.checked);
            if (allUnchecked) {
                // Reset chart data to original state
                myDoughnutChart.data.labels = machineNames;
                myDoughnutChart.data.datasets[0].data = machineData;
            } else {
                const selectedMachines = Array.from(checkboxes)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);
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