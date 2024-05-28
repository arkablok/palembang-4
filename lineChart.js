fetch('data_vending.json')
.then(response => response.json())
.then(data => {
const transactionsByMonth = data.reduce((acc, item) => {
  if (item.TransDate) {
    const parts = item.TransDate.split('/');
    const month = parts[1];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mar", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[parseInt(month, 10) - 1];

    const formattedDate = `${monthName}`; 

      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
    acc[formattedDate]++;
  }
  return acc;
  }, {});

  const labels = Object.keys(transactionsByMonth);
  const transactions = Object.values(transactionsByMonth);


    const q1data = transactions.slice(0, Math.floor(transactions.length * 1/4));
    const q2data = transactions.slice(Math.floor(transactions.length * 1/4), Math.floor(transactions.length * 2/4));
    const q3data = transactions.slice(Math.floor(transactions.length * 2/4), Math.floor(transactions.length * 3/4));
    const q4data = transactions.slice(Math.floor(transactions.length * 3/4), transactions.length);

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
              },
              {
                label: 'Quarter 1',
                data: q1data,
                fill: false,
                hidden: true
              },
              {
                label: 'Quarter 2',
                data: q2data,
                fill: false,
                hidden: true
              },
              {
                label: 'Quarter 3',
                data: q3data,
                fill: false,
                hidden: true
              },
              {
                label: 'Quarter 4',
                data: q4data,
                fill: false,
                hidden: true
              }
          ]
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
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                filter: function(item, chart) {
                  return !item.text.includes('Quarter');
                }
              }
            }
          }
        }
    });

    document.getElementById('quarterSelector').addEventListener('change', function() {
      const selectedQuarter = this.value; 
      
      let newData = [];
      let newLabels = [];
      if (selectedQuarter === 'quarter1') {
          newData = q1data;
          newLabels = labels.slice(0, Math.floor(labels.length * 1/4)); 
      } else if (selectedQuarter === 'quarter2') {
          newData = q2data;
          newLabels = labels.slice(Math.floor(labels.length * 1/4), Math.floor(labels.length * 2/4)); 
      } else if (selectedQuarter === 'quarter3') {
          newData = q3data;
          newLabels = labels.slice(Math.floor(labels.length * 2/4), Math.floor(labels.length * 3/4)); 
      } else if (selectedQuarter === 'quarter4') {
          newData = q4data;
          newLabels = labels.slice(Math.floor(labels.length * 3/4), labels.length); 
      } else {
          newData = transactions;
          newLabels = labels;
      }

      chart.data.labels = newLabels;
      chart.data.datasets[0].data = newData;
     
      chart.update();
    });
    

  }
);