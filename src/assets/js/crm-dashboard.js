
// for NFTs Statistics
function crmStatistics() {
	var options = {
		series: [{
			name: "Price",
			data: [20, 33, 20, 52, 30, 53, 30, 56, 35, 50]
		}, {
			name: "Volume",
			data: [35, 15, 45, 20, 55, 35, 55, 40, 30, 54]
		}],
		chart: {
			height: 343,
			type: 'line',
			zoom: {
				enabled: false
			},
			dropShadow: {
				enabled: true,
				enabledOnSeries: undefined,
				top: 5,
				left: 0,
				blur: 3,
				color: '#000',
				opacity: 0.1
			},
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			position: "top",
			horizontalAlign: "center",
			offsetX: -15,
			fontWeight: "bold",
		},
		stroke: {
			curve: 'smooth',
			width: '3',
			dashArray: [0, 4],
		},
		grid: {
			borderColor: '#f2f6f7',
		},
		colors: ["rgb(" + myVarVal + ")", "rgba(" + myVarVal + ", 0.15)"],
		yaxis: {
			title: {
				text: 'Statistics',
				style: {
					color: '#adb5be',
					fontSize: '14px',
					fontFamily: 'poppins, sans-serif',
					fontWeight: 600,
					cssClass: 'apexcharts-yaxis-label',
				},
			},
			labels: {
				// formatter: function (y) {
				// 	return y.toFixed(0) + "";
				// }
				formatter: function (y) {
					// Check if y is a valid number before using toFixed
					if (typeof y === 'number' && !isNaN(y)) {
						return y.toFixed(0) + "";
					} else {
						return ""; // Return an empty string or some default value
					}
				}
			}
		},
		xaxis: {
			type: 'month',
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			axisBorder: {
				show: true,
				color: 'rgba(119, 119, 142, 0.05)',
				offsetX: 0,
				offsetY: 0,
			},
			axisTicks: {
				show: true,
				borderType: 'solid',
				color: 'rgba(119, 119, 142, 0.05)',
				width: 6,
				offsetX: 0,
				offsetY: 0
			},
			labels: {
				rotate: -90
			}
		}
	};
	document.getElementById('crm-statistics').innerHTML = ''
	var chart = new ApexCharts(document.querySelector("#crm-statistics"), options);
	chart.render();
}

// Leads By Source Chart
var options = {
    series: [{
    name: 'Sessions',
    data: [400, 430, 470, 540, 1100, 1200, 1380]
    }],
      chart: {
        fontFamily: 'Poppins, Arial, sans-serif',
          toolbar: {
              show: false
          },
      type: 'bar',
      height: 310
    },
    grid: {
      borderColor: '#f2f6f7',
    },
    plotOptions: {
      bar: {
          horizontal: true,
          barHeight: "30%",
          borderRadius: 1,
      }
    },
    colors: ["#f59032"],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Marketing', 'Digital', 'Web', 'App', 'Referal', 'Other', 'Germany'],
    }
  };
  var chart2 = new ApexCharts(document.querySelector("#dealsSource"), options);
  chart2.render();
  
  function dealsSource(){
      chart2.updateOptions({
      colors:["rgba(" + myVarVal + ", 0.95)"],
    })
  }