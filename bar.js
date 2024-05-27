
let myChart;
let jsonData;

// Fetch JSON data when the page loads
fetch('data_vending.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;

        const totalTransaction = jsonData.length;

        // Display the total number of transactions
        document.getElementById('number').innerText = `${totalTransaction}`;

        // Call the updateChart function to display the chart
        updateChart();
    });

// Function to update the chart
function updateChart() {
    const selectedLocation = document.getElementById('locationSelector').value;

    // Filter data based on the selected location
    const filteredData = selectedLocation === "All" ? jsonData : jsonData.filter(item => item.Location === selectedLocation);

    // Count total transactions per location
    const locationTransactionCount = filteredData.reduce((acc, item) => {
        const location = item.Location;
        acc[location] = (acc[location] || 0) + 1;
        return acc;
    }, {});

    // Get labels and data for the chart
    const labels = Object.keys(locationTransactionCount);
    const dataValues = Object.values(locationTransactionCount);

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
