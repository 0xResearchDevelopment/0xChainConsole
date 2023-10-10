//API call : Get User Profile
var loadChartData = () => {
    const authToken = localStorage.getItem('authToken');
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
    axios
        .get(
            'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/user-profile',
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            if (res.status == 200) {
                console.log(res.data);

                const subscribtionStatsSummary = (res.data.subscribtionStatsSummary!=undefined && res.data.subscribtionStatsSummary!=null)?res.data.subscribtionStatsSummary:null;
                netProfitHourly = (res.data.netprofitHourlyData!=undefined && res.data.netprofitHourlyData!=null)?res.data.netprofitHourlyData:null;
                netProfitDaily = (res.data.netprofitDailyData!=undefined && res.data.netprofitDailyData!=null)?res.data.netprofitDailyData:null;
                netProfitMonthly = (res.data.netprofitMonthlyData!=undefined && res.data.netprofitMonthlyData!=null)?res.data.netprofitMonthlyData:null;

                avgNetProfit = subscribtionStatsSummary != null ? subscribtionStatsSummary.AVG_USER_SUB_NETPROFIT : 0;
                updatePieChartData();

                var graphData = formatGraphData(netProfitHourly);
                inputNetprofit = graphData.netProfitArray;
                inputXAxisData = graphData.xAxisDataArray;
                updateChartData(inputNetprofit, inputXAxisData);
            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            location.href = "sign-in-cover.html";
        })
}

//API call to fetch Chart data
loadChartData();

/* starts : chainview - netprofit summary pie-chart */
var avgNetProfit = 0;
var pieChartData = {
    series: [avgNetProfit],  /* get this value from loacl storage*/
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

var chart2 = new ApexCharts(document.querySelector("#avgNetProfit"), pieChartData);
chart2.render();
function index1() {
    chart2.updateOptions({
        colors: ["rgba(" + myVarVal + ", 0.95)"],
    });
}

var updatePieChartData = () => {
    var chart2 = new ApexCharts(document.querySelector("#avgNetProfit"), pieChartData);
    chart2.render();
    chart2.updateOptions({
        colors: ["rgba(" + myVarVal + ", 0.95)"],
        series: [avgNetProfit]
    });
}
/* ends : chainview - netprofit summary pie-chart */

var formatGraphData = (rawNetProfitArr) => {
    var netProfit = [];
    var xAxisData = [];
    for (let i = 0; i < rawNetProfitArr.length; i++) {
        netProfit.push(rawNetProfitArr[i].NETPROFIT);
        xAxisData.push(rawNetProfitArr[i].AS_OF);
    }

    return {
        netProfitArray: netProfit,
        xAxisDataArray: xAxisData
       };
}

var updateChartData = (dataInput, XAxisInput) => {
    var chart = new ApexCharts(document.querySelector("#earnings"), chartData);
        chart.render();
        chart.updateOptions({
            series: [
                {
                    name: 'Token Netprofit',
                    data: dataInput,
                    type: 'line',
                }
            ],
            xaxis: {
                type: 'day',
                categories: XAxisInput,
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
            }
        });
}

/* starts : chainview - Netprofit stats line-chart */
var netProfitHourly = [];
var netProfitDaily = [];
var netProfitMonthly = [];

var inputNetprofit = [];
var inputXAxisData = [];

console.log("1: ",inputNetprofit);
console.log("2: ",inputXAxisData);

var chartData = {
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
            color: ['rgba(245 ,187 ,116, 0.2)'],
            opacity: 0.5
        },
    },
    grid: {
        show: true,
        borderColor: 'rgba(119, 119, 142, 0.1)',
        strokeDashArray: 4,
    },
    dataLabels: {
        enabled: true
    },
    stroke: {
        width: [2.5],
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
    series: [
        {
            name: 'Token Netprofit',
            data: inputNetprofit,
            type: 'line',
        }],
    colors: ["rgba(0, 144, 172, 0.95)",],
    fill: {
        type: ['gradient'],
        gradient: {
            gradientToColors: ['#4776E6']
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
        categories: inputXAxisData,
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
var chart = new ApexCharts(document.querySelector("#earnings"), chartData);
chart.render();

updateChartData(inputNetprofit,inputXAxisData);

function earnings() {
    chart.updateOptions({
        colors: [
            "rgba(" + myVarVal + ", 0.95)"
        ],
    });
}

var changeLayout = (layout) => {

    if(layout == 2){
        var graphData = formatGraphData(netProfitMonthly);
        inputNetprofit = graphData.netProfitArray;
        inputXAxisData = graphData.xAxisDataArray;

        updateChartData(inputNetprofit,inputXAxisData);
        document.getElementById("chart-view").innerHTML = "Monthly"
    }
    else if(layout == 1){
        var graphData = formatGraphData(netProfitDaily);
        inputNetprofit = graphData.netProfitArray;
        inputXAxisData = graphData.xAxisDataArray;

        updateChartData(inputNetprofit,inputXAxisData);
        document.getElementById("chart-view").innerHTML = "Daily"
    }
    else {
        var graphData = formatGraphData(netProfitHourly);
        inputNetprofit = graphData.netProfitArray;
        inputXAxisData = graphData.xAxisDataArray;

        updateChartData(inputNetprofit,inputXAxisData);
        document.getElementById("chart-view").innerHTML = "Hourly"
    }
}

/* ends : chainview - Netprofit stats line-chart */
