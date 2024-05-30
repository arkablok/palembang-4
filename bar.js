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
            const checkboxes = document.querySelectorAll('#locationCheckboxes input[id="bar"]');
            let selectedLocations = [];
            
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedLocations.push(checkbox.value);
                }
            });

            // Filter data based on the selected locations
            const filteredData = selectedLocations.includes("All") || selectedLocations.length === 0
                ? jsonData
                : jsonData.filter(item => selectedLocations.includes(item.Location));

            // Count total transactions per location
            const locationTransactionCount = filteredData.reduce((acc, item) => {
                const location = item.Location;
                acc[location] = (acc[location] || 0) + 1;
                return acc;
            }, {});

            // Get labels and data for the chart
            const sortedLocations = Object.entries(locationTransactionCount).sort((a, b) => b[1] - a[1]);

            // Get labels and data for the chart
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

        // Function to select all locations
        function selectAllLocations(checkbox) {
            const checkboxes = document.querySelectorAll('#locationCheckboxes input[id="bar"]');
            checkboxes.forEach(cb => cb.checked = checkbox.checked);
            updateChart();
        }