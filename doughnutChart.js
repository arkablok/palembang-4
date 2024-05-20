
const myDoughnutChart = document.getElementById('doughnutChart').getContext('2d');

fetch('data.json')
.then(function(response){
    if(response.ok == true){
        return response.json();
    }
})
.then(function(data){
    createChart(data)
})


function createChart(data){

    new Chart(myDoughnutChart, {
        type: "doughnut",
        data: {
            labels: data.map(row => row.machine),
            datasets: [
                {
                    label: "Transaction from machine",
                    data: data.map(row => row.transaction),
                    backgroundColor: ["#0372ef", "#2e8bf3", "#5ba5f5", "#89bef8", "#b7d8fb"],
                }
            ]
        },
        options:  {
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
                        let percentage = (value * 100 / sum).toFixed(1) + "%";
                        return percentage;
                    },
                }
            }, 
        },
        plugins: [ChartDataLabels]
    });
}