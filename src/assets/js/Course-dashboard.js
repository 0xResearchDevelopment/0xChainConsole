
/* CourseStatistics Summary chart */
function CourseStatistics() {
    var options = {
        series: [{
            name: 'Study',
            data: [44, 42, 57, 86, 112, 55, 70, 43, 23, 54, 77, 34],
		}, {
			name: 'Exams',
			data: [20, 58, 58, 120, 80, 95, 35, 88, 60, 85, 75, 85]
		}],
        chart: {
            type: 'line',
            height: 320
        },
        grid: {
            borderColor: 'rgba(167, 180, 201 ,0.2)',
        },
		colors: [ "rgba(" + myVarVal + ", 0.99)",  '#4876e6'],
		markers: {
			size: [5,0],
			strokeColors: '#fff',
			strokeWidth: [3, 0],
			strokeOpacity: 0.9,
		},
		stroke: {
			curve: 'smooth',
			width: [2,2],
			dashArray: [0, 4]
		},
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
			position: 'top',
            labels: {
                colors: '#74767c',
            },
        },
        yaxis: {
            labels: {
                formatter: function (y) {
                    return y.toFixed(0) + "";
                }
            },
            labels: {
                style: {
                    colors: "#8c9097",
                    fontSize: '11px',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-label',
                },
            }
        },
        xaxis: {
            type: 'month',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
            axisBorder: {
                show: true,
                color: 'rgba(167, 180, 201 ,0.2)',
                offsetX: 0,
                offsetY: 0,
            },
            axisTicks: {
                show: true,
                borderType: 'solid',
                color: 'rgba(167, 180, 201 ,0.2)',
                width: 6,
                offsetX: 0,
                offsetY: 0
            },
            labels: {
                rotate: -90,
                style: {
                    colors: "#8c9097",
                    fontSize: '11px',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-label',
                },
            }
        }
    };
    document.getElementById('CourseStatistics').innerHTML = '';
    var chart1 = new ApexCharts(document.querySelector("#CourseStatistics"), options);
    chart1.render();
}
/* CourseStatistics Summary chart closed*/


// Payouts Report Chart
var options2 = {
    series: [{
        name: 'Paid',
        data: [50, 20, 32, 32, 20, 50, 20, 40, 25, 55, 20, 30],
        type: 'area',
    }, {
        name: 'UnPaid',
        data: [25, 15, 40, 20, 25, 15, 58, 28, 30, 15, 58, 28],
        type: "line",
    }],
    chart: {
        height: 230,
        toolbar: {
            show: false,
        },
        background: 'none',
        fill: "#fff",
    },
    grid: {
        borderColor: '#f2f6f7',
    },
    colors: ["rgb(132, 90, 223)", "#ffb8a5"],
    background: 'transparent',
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2,
        dashArray: [0, 5],
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: true,
        position: 'top',
    },
    xaxis: {
        show: false,
        axisBorder: {
            show: false,
            color: 'rgba(119, 119, 142, 0.05)',
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: false,
            borderType: 'solid',
            color: 'rgba(119, 119, 142, 0.05)',
            width: 6,
            offsetX: 0,
            offsetY: 0
        },
        labels: {
            rotate: -90,
        }
    },
    yaxis: {
        show: false,
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        }
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
};
document.getElementById('payoutsReport').innerHTML = ''
var chart2 = new ApexCharts(document.querySelector("#payoutsReport"), options2);
chart2.render();
function payoutsReport() {
    chart2.updateOptions({
        colors: ["rgba(" + myVarVal + ", 0.07)", "#ffb8a5"],
    })
};