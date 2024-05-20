 // Fetch the JSON data
 fetch('data.json')
 .then(response => response.json())
 .then(data => {
     // Extract the labels and transactions from the JSON data
     const labels = data.map(item => item.machine);
     const transactions = data.map(item => parseInt(item.transaction));

     const ctx = document.getElementById('doughnutChart').getContext('2d');

     new Chart(ctx, {
         type: 'doughnut',
         data: {
             labels: labels,
             datasets: [
                 {
                     label: 'Transaction from machine',
                     data: transactions,
                     backgroundColor: ['#0372ef', '#2e8bf3', '#5ba5f5', '#89bef8', '#b7d8fb'],
                 }
             ]
         },
         options: {
             borderWidth: 0,
             hoverBorderWidth: 0,
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                 legend: {
                     display: true,
                     position: 'right',
                     labels: {
                         font: {
                             size: 13,
                         },
                         boxWidth: 13,
                         usePointStyle: true,
                         padding: 10,
                     },
                 }, 
                 datalabels: {
                     color: '#fff',
                     formatter: (value, ctx) => {
                         let sum = 0;
                         let dataArr = ctx.chart.data.datasets[0].data;
                         dataArr.map(data => {
                             sum += data;
                         });
                         let percentage = (value * 100 / sum).toFixed(1) + '%';
                         return percentage;
                     }
                 }
             }
         },
         plugins: [ChartDataLabels]
     });
 })
 .catch(error => console.error('Error loading the JSON data:', error));