function projectAnalysis() {
    var options = {
        series: [{
            name: 'Projects',
            type: 'column',
            data: [20, 29, 37, 35, 44, 43, 50]
        }, {
            name: 'Revenue',
            type: 'bar',
            data: [10, 15, 17, 15, 12, 20, 28],
        }, {
            name: 'Tasks',
            type: 'area',
            data: [10, 20, 13, 20, 15, 20, 10, ]
        },
        ],
        chart: {
            toolbar: {
                show: false
            },
            height: 350,
            type: 'line',
            stacked: false,
            fontFamily: 'Poppins, Arial, sans-serif',
        },
        grid: {
            borderColor: '#f5f4f4',
            strokeDashArray: 3
        },
        dataLabels: {
            enabled: false
        },
        title: {
            text: undefined,
        },
        xaxis: {
            categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        },
        yaxis: [
            {
                show: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: false,
                    color: '#4eb6d0'
                },
                labels: {
                    style: {
                        colors: '#4eb6d0',
                    }
                },
                title: {
                    text: undefined,
                },
                tooltip: {
                    enabled: true
                }
            },
        ],
        tooltip: {
            enabled: true,
        },
        legend: {
            show: true,
            position: 'top',
            offsetX: 40,
            fontSize: '13px',
            fontWeight: 'normal',
            labels: {
                colors: '#acb1b1',
            },
            markers: {
                width: 10,
                height: 10,
            },
        },
        stroke: {
            width: [0, 0, 0],
            curve: 'smooth',
            dashArray: [0, 0, 0],
        },
        plotOptions: {
            bar: {
                columnWidth: "30%",
                borderRadius: 1
            }
        },
        colors: ["rgb(" + myVarVal + ")", "rgba(245, 111, 75, 0.7)", "rgba(" + myVarVal + ", 0.08)"]
    };
    document.querySelector("#projectAnalysis").innerHTML = " ";
    var chart1 = new ApexCharts(document.querySelector("#projectAnalysis"), options);
    chart1.render();
}
