
  /* starts : chainview - netprofit summary pie-chart */
  var options = {
    series: [-14.4],  /* get this value from loacl storage */
    chart: {
      height: 295,
      type: "radialBar",
    },
    colors: ["rgba(0, 144, 172, 0.95)"],
    plotOptions: {
      radialBar: {
        hollow: {
          size: "65%",
        },
      },
    },
    labels: ["Net Profit"],
  };
  var chart2 = new ApexCharts(document.querySelector("#avgNetProfit"), options);
  chart2.render();
  function index1() {
    chart2.updateOptions({
      colors: ["rgba(" + myVarVal + ", 0.95)"],
    });
  }
/* ends : chainview - netprofit summary pie-chart */



/* starts : chainview - Netprofit stats line-chart */
var options = {
    chart: {
      height: 300,
      toolbar: {
          show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: ['var(--primary02)', 'rgba(245 ,187 ,116, 0.2)', "rgba(255,255,255,0)"],
        opacity: 0.5
      },
    },
      grid: {
        show: true,
        borderColor: 'rgba(119, 119, 142, 0.1)',
        strokeDashArray: 4,
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [0, 2.5, 2.5],
        curve: "smooth",
      },
      legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      fontWeight: 600,
      fontSize: '11px',
        tooltipHoverFormatter: function (val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
        },
        labels: {
          colors: '#74767c',
        },
        markers: {
            width: 8,
            height: 8,
            strokeWidth: 0,
            radius: 12,
            offsetX: 0,
            offsetY: 0
        },
      },
    series: [{
      name: "Total Trades",
      data: [66, 85, 50, 105, 65, 74, 70, 105, 100, 125, 85, 110, 85, 58, 112],
      type: 'bar',
    },{
      name: 'Token Netprofit',
            data: [65, 20, 40, 55, 80, 90, 59, 86, 120, 165, 115, 120, 50, 70, 85],
            type: 'line',
          },{
            name: "Base Netprofit",
            data: [20, 65, 85, 38, 55, 25, 25, 165, 75, 64, 70, 75, 85, 85, 115 ],
            type: 'line',
          }],
          colors: ["rgba(119, 119, 142, 0.075)","rgba(0, 144, 172, 0.95)", "rgba(245 ,187 ,116)", ],
          fill: {
            type: ['solid', 'gradient', 'gradient'],
            gradient: {
              gradientToColors: ["transparent", '#4776E6', '#f5bb74']
            },
          },
        yaxis: {
          title: {
              style: {
                  color: '#adb5be',
                  fontSize: '14px',
                  fontFamily: 'poppins, sans-serif',
                  fontWeight: 600,
                  cssClass: 'apexcharts-yaxis-label',
              },
          },
          labels: {
              formatter: function (y) {
                  return y.toFixed(0) + "";
              },
              show: true,
              style: {
                  colors: "#8c9097",
                  fontSize: '11px',
                  fontWeight: 600,
                  cssClass: 'apexcharts-xaxis-label',
              },
          }
        },
        xaxis: {
            type: 'day',
            categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan', '10 Jan', '11 Jan', '12 Jan', '13 Jan', '14 Jan', '15 Jan'],
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
            rotate: -90,
              style: {
                  colors: "#8c9097",
                  fontSize: '11px',
                  fontWeight: 600,
                  cssClass: 'apexcharts-xaxis-label',
              },
            }
        },
  }
  document.getElementById("earnings").innerHTML = "";
  var chart = new ApexCharts(document.querySelector("#earnings"), options);
  chart.render();
  
  function earnings() {
    chart.updateOptions({
      colors: [
        "rgba(119, 119, 142, 0.075)",
        "rgba(" + myVarVal + ", 0.95)",
        "rgba(245 ,187 ,116)",
      ],
    });
  }
  
  /* ends : chainview - Netprofit stats line-chart */