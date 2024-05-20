fetch('lineChartData.json')
  .then(response => response.json())
  .then(data => {
  
    const labels = data.map(item => item.month);
    const transactions = data.map(item => parseInt(item.totalTransaksi));

    const myLineChart = document.getElementById('lineChart').getContext('2d');

    new Chart(myLineChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                axis: 'x',
                label: 'Produk Terjual',
                data: transactions,
                fill: false,
                backgroundColor: "rgba(255, 137, 28)",
                borderColor: "rgba(255, 165, 0)",
                borderWidth: 1
            }]
        },
        options: {
          indexAxis: 'x',
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'produk terjual',
              }
            }
          }
        }
    });
  }
)