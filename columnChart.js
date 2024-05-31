fetch('data_vending.json')
    .then((res) => {
        // Memeriksa apakah ada error pada response
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        // Mengagregasi data berdasarkan produk dan memfilter nilai null atau kosong
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

        const categories = ['Food', 'Water', 'Carbonated', 'Non Carbonated'];
        const chart = document.getElementById('columnChart').getContext('2d');

        let myChart;

        // Fungsi untuk memperbarui chart berdasarkan kategori yang dipilih
        function updateChart1() {
            const categorySelector = document.getElementById('categorySelector');
            const selectedCategory = categorySelector.value;

            let labels = Object.keys(aggregatedData);
            let dataFilters;

            if (selectedCategory === 'Type') {
                // Mengambil top 10 produk terlaris di semua kategori
                labels = labels
                    .sort((a, b) => aggregatedData[b].RQty - aggregatedData[a].RQty)
                    .slice(0, 10); // Mengambil 10 produk teratas

                // Membuat dataset untuk semua kategori
                dataFilters = categories.map(category => ({
                    label: category,
                    data: labels.map(label => aggregatedData[label].Category === category ? aggregatedData[label].RQty : 0),
                    backgroundColor: getCategoryColor(category),
                    borderColor: getBorderColor(category),
                    borderWidth: 1,
                }));
            } else {
                // Mengambil top 10 produk untuk kategori yang dipilih
                labels = labels.filter(label => aggregatedData[label].Category === selectedCategory)
                    .sort((a, b) => aggregatedData[b].RQty - aggregatedData[a].RQty)
                    .slice(0, 10); // Mengambil 10 produk teratas

                // Membuat dataset untuk kategori yang dipilih
                dataFilters = [{
                    label: selectedCategory,
                    data: labels.map(label => aggregatedData[label].RQty),
                    backgroundColor: getCategoryColor(selectedCategory),
                    borderColor: getBorderColor(selectedCategory),
                    borderWidth: 1,
                }];
            }

            // Memperbarui chart jika sudah ada, atau membuat chart baru
            if (myChart) {
                myChart.data.labels = labels;
                myChart.data.datasets = dataFilters;
                myChart.options.elements.bar.barPercentage = selectedCategory === 'Type' ? 1 : 0.9;
                myChart.options.elements.bar.categoryPercentage = selectedCategory === 'Type' ? 1 : 0.9;
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
                        elements: {
                            bar: {
                                barThickness: 40, // Atur ketebalan bar di sini
                                barPercentage: selectedCategory === 'Type' ? 1 : 0.9,
                                categoryPercentage: selectedCategory === 'Type' ? 1 : 0.9,
                            }
                        },
                    },
                };

                myChart = new Chart(chart, config);
            }
        }

        // Membuat chart awal
        updateChart1();

        // Menambahkan event listener untuk meng-handle perubahan pada selector kategori
        categorySelector.addEventListener('change', updateChart1);

    })
    .catch((error) => console.error("Unable to fetch data:", error));

// Fungsi untuk mendapatkan warna background berdasarkan kategori
function getCategoryColor(category) {
    switch (category) {
        case 'Food':
            return 'rgba(255, 99, 132, 0.7)';
        case 'Water':
            return 'rgba(173, 216, 230, 0.7)';
        case 'Carbonated':
            return 'rgba(144, 238, 144, 0.7)';
        case 'Non Carbonated':
            return 'rgba(255, 165, 0, 0.7)';
        default:
            return 'rgba(255, 159, 64, 0.7)';
    }
}

// Fungsi untuk mendapatkan warna border berdasarkan kategori
function getBorderColor(category) {
    switch (category) {
        case 'Food':
            return 'rgba(255, 99, 132, 1)';
        case 'Water':
            return 'rgba(173, 216, 230, 1)';
        case 'Carbonated':
            return 'rgba(144, 238, 144, 1)';
        case 'Non Carbonated':
            return 'rgba(255, 165, 0, 1)';
        default:
            return 'rgba(255, 159, 64, 1)';
    }
}