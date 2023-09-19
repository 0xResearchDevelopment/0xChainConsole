
// personal  Stats
var options = {
	series: [ {
		name: 'Total Credit',
		type: 'line',
		data: [1, 25, 06, 28, 10,]
	},
	{
		name: 'Total Debit',
		type: 'line',
		data: [2, 05, 36, 15, 28]
	}],
	chart: {
	height: 80,
	fontFamily: 'Poppins, Arial, sans-serif',
	sparkline: {
		enabled: true
	},
	toolbar: {
		show: false
	},
	legend: {
		show: false,
	},
	yaxis: {
		min: 0,
		show: false,
		axisBorder: {
			show: false
		},
	},
	xaxis: {
		show: false,
		axisBorder: {
			show: false
		},
	},
	},
	grid: {
	show: false,
	borderColor: '#f2f6f7',
	},
	dataLabels: {
	enabled: false
	},
	legend: {
	show: true,
	position: 'bottom',
	fontSize: '11px',
	},
	stroke: {
	width: [2,1],
	curve: 'smooth',
	},
	plotOptions: {
		bar: {
			columnWidth: "27%",
			borderRadius: 1
		}
	},
	labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
var chart3 = new ApexCharts(document.querySelector("#personal-balance"), options);
chart3.render();

function personalbalance(){
	chart3.updateOptions({
		colors: ["rgba(" + myVarVal + ", 0.99)","rgba(" + myVarVal + ", 0.09)"],
	})
}
/* balance Summary chart */
function balance() {
    var options = {
        series: [{
            name: 'Income',
            data: [44, 42, 57, 86, 112, 55, 70, 43, 23, 54, 77, 34],
		}, {
			name: 'Expances',
			data: [20, 88, 58, 120, 80, 95, 35, 88, 60, 85, 75, 85]
		}],
        chart: {
            type: 'area',
            height: 276
        },
        grid: {
            borderColor: 'rgba(167, 180, 201 ,0.2)',
        },
		colors: [ "rgba(" + myVarVal + ", 0.95)",  '#4876e6'],
		markers: {
			size: [5,0],
			strokeColors: '#fff',
			strokeWidth: [3, 0],
			strokeOpacity: 0.9,
		},
		stroke: {
			curve: 'straight',
			width: 1,
			dashArray: [0, 4]
		},
		fill: {
			type: ['gradient','gradient'],
			gradient: {
				shade: 'light',
				type: "vertical",
				opacityFrom: [0.6, 0.5],
				opacityTo: [0.2, 0.1],
				stops: [0, 100]
			}
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
    document.getElementById('balance').innerHTML = '';
    var chart1 = new ApexCharts(document.querySelector("#balance"), options);
    chart1.render();
}
/* balance Summary chart closed*/