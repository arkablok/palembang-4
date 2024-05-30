// Mem-fetch data dari file database.json
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
                let topProducts = [];
                // Mengambil top 2 produk untuk setiap kategori
                categories.forEach(category => {
                    const productsInCategory = labels
                        .filter(label => aggregatedData[label].Category === category)
                        .sort((a, b) => aggregatedData[b].RQty - aggregatedData[a].RQty)
                        .slice(0, 2); // Mengambil 2 produk teratas
                    topProducts.push(...productsInCategory);
                });
                labels = topProducts;

                // Membuat dataset untuk setiap kategori
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
            return 'rgba(54, 162, 235, 0.7)';
        case 'Carbonated':
            return 'rgba(255, 206, 86, 0.7)';
        case 'Non Carbonated':
            return 'rgba(75, 192, 192, 0.7)';
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
            return 'rgba(54, 162, 235, 1)';
        case 'Carbonated':
            return 'rgba(255, 206, 86, 1)';
        case 'Non Carbonated':
            return 'rgba(75, 192, 192, 1)';
        default:
            return 'rgba(255, 159, 64, 1)';
    }
}