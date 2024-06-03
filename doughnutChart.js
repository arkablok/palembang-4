let myChart;
let myDoughnutChart;
let jsonData;

// Date ranges corresponding to the options in the selector
const dateRanges = {
    "all": [new Date("2022-01-01"), new Date("2022-12-31")],
    "jan": [new Date("2022-01-01"), new Date("2022-01-31")],
    "feb": [new Date("2022-02-01"), new Date("2022-02-28")],
    "mar": [new Date("2022-03-01"), new Date("2022-03-31")],
    "apr": [new Date("2022-04-01"), new Date("2022-04-30")],
    "may": [new Date("2022-05-01"), new Date("2022-05-31")],
    "jun": [new Date("2022-06-01"), new Date("2022-06-30")],
    "jul": [new Date("2022-07-01"), new Date("2022-07-31")],
    "aug": [new Date("2022-08-01"), new Date("2022-08-31")],
    "sept": [new Date("2022-09-01"), new Date("2022-09-30")],
    "oct": [new Date("2022-10-01"), new Date("2022-10-31")],
    "nov": [new Date("2022-11-01"), new Date("2022-11-30")],
    "dec": [new Date("2022-12-01"), new Date("2022-12-31")]
};

// Fetch JSON data when the page loads
fetch('data_vending.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;
        updateChart(); // Call updateChart function to display the chart initially
        updateDoughnutChart(); // Call updateDoughnutChart function to display the doughnut chart initially
    });

// Function to update the bar chart
function updateChart() {
    const selectedDateRange = document.getElementById('selector').value;
    const [startDate, endDate] = dateRanges[selectedDateRange];

    // Filter data based on the selected date range
    const filteredData = jsonData.filter(item => {
        const [day, month, year] = item.TransDate.split('/');
        const itemDate = new Date(`${year}-${month}-${day}`);
        return itemDate >= startDate && itemDate <= endDate;
    });

    // Update the total number of transactions display
    const totalTransaction = filteredData.length;
    document.getElementById('number').innerText = `${totalTransaction}`;

    // Filter data based on selected locations
    const checkboxes = document.querySelectorAll('#locationCheckboxes input[id="bar"]');
    let selectedLocations = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedLocations.push(checkbox.value);
        }
    });

    const locationFilteredData = selectedLocations.includes("All") || selectedLocations.length === 0
        ? filteredData
        : filteredData.filter(item => selectedLocations.includes(item.Location));

    // Count total transactions per location
    const locationTransactionCount = locationFilteredData.reduce((acc, item) => {
        const location = item.Location;
        acc[location] = (acc[location] || 0) + 1;
        return acc;
    }, {});

    // Get labels and data for the chart
    const sortedLocations = Object.entries(locationTransactionCount).sort((a, b) => b[1] - a[1]);
    const labels = sortedLocations.map(entry => entry[0]);
    const dataValues = sortedLocations.map(entry => entry[1]);

    // If the chart already exists, update its data
    if (myChart) {
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = dataValues;
        myChart.update();
    } else {
        // Chart configuration
        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Transactions',
                    data: dataValues,
                    backgroundColor: 'rgba(0, 91, 191, 1)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Create the chart using the configuration
        const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, config);
    }
}

// Function to update the doughnut chart
function updateDoughnutChart() {
    const selectedDateRange = document.getElementById('selector').value;
    const [startDate, endDate] = dateRanges[selectedDateRange];

    // Filter data based on the selected date range
    const filteredData = jsonData.filter(item => {
        const [day, month, year] = item.TransDate.split('/');
        const itemDate = new Date(`${year}-${month}-${day}`);
        return itemDate >= startDate && itemDate <= endDate;
    });

    const transactionCountReduce = filteredData.length;
    const machineNames = [...new Set(filteredData.map(item => item.Machine))];
    const machineData = machineNames.map(machineName => {
        const machineTransactions = filteredData.filter(item => item.Machine === machineName);
        return machineTransactions.length;
    });

    const myDoughnutChartCtx = document.getElementById('doughnutChart').getContext('2d');

    if (myDoughnutChart) {
        myDoughnutChart.destroy();
    }

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
        options: {
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
}

// Function to select all locations
function selectAllLocations(checkbox) {
    const checkboxes = document.querySelectorAll('#locationCheckboxes input[id="bar"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
    updateChart();
}

// Event listener for date range selector
document.getElementById('selector').addEventListener('change', () => {
    updateChart();
    updateDoughnutChart();
});
