// Fetch data and create/update chart
fetch("./database.json")
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        // Aggregate data by product and filter out null or empty values
        const aggregatedData = data.reduce((acc, item) => {
            if (item.RQty !== null && item.RQty !== '') {
                if (!acc[item.Product]) {
                    acc[item.Product] = {
                        RQty: 0,
                        Category: item.Category
                    };
                }
                acc[item.Product].RQty += parseInt(item.RQty);
            }
            return acc;
        }, {});

        const labels = Object.keys(aggregatedData).filter(label => aggregatedData[label].RQty > 0);
        const categories = ['Food', 'Water', 'Carbonated', 'Non-Carbonated'];
        const chart = document.getElementById('columnChart').getContext('2d');

        let myChart;

        function updateChart1() {
            const categorySelector = document.getElementById('categorySelector');
            const selectedCategory = categorySelector.value;

            let dataFilters;
            if (selectedCategory === 'Type') {
                dataFilters = categories.map(category => ({
                    label: category,
                    data: labels.map(label => aggregatedData[label].Category === category ? aggregatedData[label].RQty : 0),
                    backgroundColor: getCategoryColor(category),
                    borderColor: getBorderColor(category),
                    borderWidth: 1,
                }));
            } else {
                dataFilters = [{
                    label: selectedCategory,
                    data: labels.map(label => aggregatedData[label].Category === selectedCategory ? aggregatedData[label].RQty : 0),
                    backgroundColor: getCategoryColor(selectedCategory),
                    borderColor: getBorderColor(selectedCategory),
                    borderWidth: 1,
                }];
            }

            if (myChart) {
                myChart.data.labels = labels;
                myChart.data.datasets = dataFilters;
                myChart.update();
            } else {
                const config = {
                    type: "bar",
                    data: {
                        labels: labels,
                        datasets: dataFilters,
                    },
                    options: {
                        indexAxis: "x",
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Produk',
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Produk Terjual',
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    boxWidth: 20,
                                    boxHeight: 2,
                                },
                            },
                        },
                    },
                };

                myChart = new Chart(chart, config);
            }
        }

        // Initial chart creation
        updateChart1();

        // Function to handle change in category selector
        categorySelector.addEventListener('change', updateChart1);

    })
    .catch((error) => console.error("Unable to fetch data:", error));

function getCategoryColor(category) {
    switch (category) {
        case 'Food':
            return 'rgba(255, 99, 132, 0.7)';
        case 'Water':
            return 'rgba(54, 162, 235, 0.7)';
        case 'Carbonated':
            return 'rgba(255, 206, 86, 0.7)';
        case 'Non-Carbonated':
            return 'rgba(75, 192, 192, 0.7)';
        default:
            return 'rgba(255, 159, 64, 0.7)';
    }
}

function getBorderColor(category) {
    switch (category) {
        case 'Food':
            return 'rgba(255, 99, 132, 1)';
        case 'Water':
            return 'rgba(54, 162, 235, 1)';
        case 'Carbonated':
            return 'rgba(255, 206, 86, 1)';
        case 'Non-Carbonated':
            return 'rgba(75, 192, 192, 1)';
        default:
            return 'rgba(255, 159, 64, 1)';
    }
}