const labels = ['Jan','Feb','Maret','April','Mei','Juni','July','Agust','Sept','Okto','Nov','Des'];

const myLineChart = document.getElementById('lineChart').getContext('2d');

new Chart(myLineChart, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            axis: 'x',
            label: 'Produk Terjual',
            data: [873.5,897.25,1108.5,1615.0,1564.5,1782.25,2105.25,2011.25,1641.0,1595.75,1489.25,1361.75],
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
