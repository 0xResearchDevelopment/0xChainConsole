var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';
//API call : Get User Profile
var loadChartData = () => {
    const authToken = localStorage.getItem('authToken');
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
    axios
        .get(
            //'@API_URL@/api/auth/user-profile',
            targetEndPointUrlBase+'/api/auth/user-profile',
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

                tokenSummaryNetProfit = subscribtionStatsSummary != null ? subscribtionStatsSummary.AVG_USER_SUB_NETPROFIT : 0;
                updateTokenPieChartData();

                investmentSummaryNetProfit = subscribtionStatsSummary != null ? subscribtionStatsSummary.AVG_AVG_USD_PROFIT_PERCENT : 0;
                updateInvestmentPieChartData();

                var graphData = formatGraphData(netProfitDaily);
                inputNetprofit = graphData.netProfitArray;
                inputBaseNetprofit = graphData.baseNetProfitArray;
                inputUsdProfit = graphData.usdProfitArray;
                inputXAxisData = graphData.xAxisDataArray;
                updateChartData(inputNetprofit, inputBaseNetprofit, inputUsdProfit, inputXAxisData);
            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            if (err.response.status == 401) {
                showToastAlerts('index-error','alert-error-msg',err.response.data.message);
                setTimeout(()=> {
                    location.href = "sign-in-cover.html";
                 }
                 ,delayInMS);
            }
        })
}

//API call to fetch Chart data
loadChartData();

/* starts : chainview - netprofit summary pie-chart */
var tokenSummaryNetProfit = 0;
var tokenPieChartData = {
    series: [tokenSummaryNetProfit],
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

var investmentSummaryNetProfit = 0;
var tokenPieChartData = {
    series: [investmentSummaryNetProfit],
    chart: {
        height: 295,
        type: "radialBar",
    },
    colors: ["rgba(38, 191, 148, 0.95)"],
    plotOptions: {
        radialBar: {
            hollow: {
                size: "65%",
            },
        },
    },
    labels: ["Net Profit"],
};

var tokenChart = new ApexCharts(document.querySelector("#tokenSummary"), tokenPieChartData);
tokenChart.render();
function index1() {
    tokenChart.updateOptions({
        colors: ["rgba(" + myVarVal + ", 0.95)"],
    });
}

var investmentChart = new ApexCharts(document.querySelector("#investmentSummary"), tokenPieChartData);
investmentChart.render();
function index1() {
    investmentChart.updateOptions({
        colors: ["rgba(38, 191, 148, 0.95)"],
    });
}

var updateTokenPieChartData = () => {
    var tokenChart = new ApexCharts(document.querySelector("#tokenSummary"), tokenPieChartData);
    tokenChart.render();
    tokenChart.updateOptions({
        colors: ["rgba(" + myVarVal + ", 0.95)"],
        series: [tokenSummaryNetProfit]
    });
}

var updateInvestmentPieChartData = () => {
    var investmentChart = new ApexCharts(document.querySelector("#investmentSummary"), tokenPieChartData);
    investmentChart.render();
    investmentChart.updateOptions({
        series: [investmentSummaryNetProfit]
    });
}
/* ends : chainview - netprofit summary pie-chart */

function truncate (num, places) {
    return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
  }

var formatGraphData = (rawNetProfitArr) => {
    var netProfit = [];
    var baseNetProfit = [];
    var usdProfit = [];
    var xAxisData = [];
    var profitDifference = 0; 
    var usdProfitDifference = 0; 

    const tbody = document.getElementById("dashboard-tbody");
    tbody.innerHTML = '';
    const rowDate = document.createElement('tr');
    const rowNetProfit = document.createElement('tr');
    const rowProfitDiff = document.createElement('tr');
    const rowActiveBots = document.createElement('tr');
    const rowSubNetProfit = document.createElement('tr');
    const rowBaseNetProfit = document.createElement('tr');
    const rowUserSubBaseNetProfit = document.createElement('tr');
    const rowUsdProfit = document.createElement('tr');
    const rowUsdProfitDiff = document.createElement('tr');

    for (let i = 0; i < rawNetProfitArr.length; i++) {
    //for (let i = rawNetProfitArr.length - 1; i >=0; i--) {
        netProfit.push(rawNetProfitArr[i].NETPROFIT);
        baseNetProfit.push(rawNetProfitArr[i].BASE_NETPROFIT);
        usdProfit.push(rawNetProfitArr[i].AVG_AVG_USD_PROFIT_PERCENT);
        xAxisData.push(rawNetProfitArr[i].AS_OF);
        
        profitDifference = i + 1 < rawNetProfitArr.length ? (rawNetProfitArr[i + 1].NETPROFIT - rawNetProfitArr[i].NETPROFIT) : 0;
        usdProfitDifference = i + 1 < rawNetProfitArr.length ? (rawNetProfitArr[i + 1].AVG_AVG_USD_PROFIT_PERCENT - rawNetProfitArr[i].AVG_AVG_USD_PROFIT_PERCENT) : 0;
        //console.log("### i:" + i + " profitDifference:" + truncate(profitDifference, 2) + "%"); 

        if (i == 0) {
        //if (i == rawNetProfitArr.length - 1) {
            var tdDateLabel = document.createElement('td');
            tdDateLabel.style.fontWeight = 'bold';
            var textDateLabel = document.createTextNode("Date");
            tdDateLabel.appendChild(textDateLabel);
            rowDate.appendChild(tdDateLabel);

            var tdNetProfitLabel = document.createElement('td');
            var textNetProfitLabel = document.createTextNode("Token-Profit %");
            tdNetProfitLabel.appendChild(textNetProfitLabel);
            rowNetProfit.appendChild(tdNetProfitLabel);

            var tdProfitDiffLabel = document.createElement('td');
            var textProfitDiffLabel = document.createTextNode("Change %");
            tdProfitDiffLabel.appendChild(textProfitDiffLabel);
            rowProfitDiff.appendChild(tdProfitDiffLabel);

            var tdActiveBotsLabel = document.createElement('td');
            var textActiveBotsLabel = document.createTextNode("# of Strategies");
            tdActiveBotsLabel.appendChild(textActiveBotsLabel);
            rowActiveBots.appendChild(tdActiveBotsLabel);

            var tdSubNetProfitLabel = document.createElement('td');
            var textSubNetProfitLabel = document.createTextNode("Total Profit");
            tdSubNetProfitLabel.appendChild(textSubNetProfitLabel);
            rowSubNetProfit.appendChild(tdSubNetProfitLabel);

            var tdBaseNetProfitLabel = document.createElement('td');
            var textBaseNetProfitLabel = document.createTextNode("Base-Profit");
            tdBaseNetProfitLabel.appendChild(textBaseNetProfitLabel);
            rowBaseNetProfit.appendChild(tdBaseNetProfitLabel);

            var tdUserSubBaseNetProfitLabel = document.createElement('td');
            var textUserSubBaseNetProfitLabel = document.createTextNode("Base-Total Profit");
            tdUserSubBaseNetProfitLabel.appendChild(textUserSubBaseNetProfitLabel);
            rowUserSubBaseNetProfit.appendChild(tdUserSubBaseNetProfitLabel);

            var tdUsdProfitLabel = document.createElement('td');
            var textUsdProfitLabel = document.createTextNode("USD-Profit %");
            tdUsdProfitLabel.appendChild(textUsdProfitLabel);
            rowUsdProfit.appendChild(tdUsdProfitLabel);

            var tdUsdProfitDiffLabel = document.createElement('td');
            var textUsdProfitDiffLabel = document.createTextNode("USD-Change %");
            tdUsdProfitDiffLabel.appendChild(textUsdProfitDiffLabel);
            rowUsdProfitDiff.appendChild(tdUsdProfitDiffLabel);
        }

        var tdDate = document.createElement('td');
        tdDate.style.fontWeight = 'bold';
        var textDate = document.createTextNode(rawNetProfitArr[i].AS_OF);
        tdDate.appendChild(textDate);
        rowDate.appendChild(tdDate);

        var tdNetProfit = document.createElement('td');
        var textNetProfit = document.createTextNode(rawNetProfitArr[i].NETPROFIT+ "%");;
        tdNetProfit.setAttribute('style', rawNetProfitArr[i].NETPROFIT >= 0 ? 'color:green !important' : 'color:red !important');
        tdNetProfit.appendChild(textNetProfit);
        rowNetProfit.appendChild(tdNetProfit);

        var tdProfitDiff = document.createElement('td');
        var textProfitDiff = document.createTextNode(truncate(profitDifference, 2)+ "%");
        tdProfitDiff.setAttribute('style', profitDifference >= 0 ? 'color:green !important' : 'color:red !important');
        tdProfitDiff.appendChild(textProfitDiff);
        rowProfitDiff.appendChild(tdProfitDiff);

        var tdActiveBots = document.createElement('td');
        var textActiveBots = document.createTextNode(rawNetProfitArr[i].ACTIVE_BOTS);
        tdActiveBots.appendChild(textActiveBots);
        rowActiveBots.appendChild(tdActiveBots);

        var tdSubNetProfit = document.createElement('td');
        var textSubNetProfit = document.createTextNode(rawNetProfitArr[i].TOTAL_USER_SUB_NETPROFIT + "%");
        tdSubNetProfit.appendChild(textSubNetProfit);
        rowSubNetProfit.appendChild(tdSubNetProfit);

        var tdBaseNetProfit = document.createElement('td');
        var textBaseNetProfit = document.createTextNode(rawNetProfitArr[i].BASE_NETPROFIT + "%");
        tdBaseNetProfit.setAttribute('style', rawNetProfitArr[i].BASE_NETPROFIT >= 0 ? 'color:green !important' : 'color:red !important');
        tdBaseNetProfit.appendChild(textBaseNetProfit);
        rowBaseNetProfit.appendChild(tdBaseNetProfit);

        var tdUserSubBaseNetProfit = document.createElement('td');
        var textUserSubBaseNetProfit = document.createTextNode(rawNetProfitArr[i].TOTAL_USER_SUB_BASE_NETPROFIT + "%");
        tdUserSubBaseNetProfit.appendChild(textUserSubBaseNetProfit);
        rowUserSubBaseNetProfit.appendChild(tdUserSubBaseNetProfit);

        var tdUsdProfit = document.createElement('td');
        var textUsdProfit = document.createTextNode(rawNetProfitArr[i].AVG_AVG_USD_PROFIT_PERCENT+ "%");;
        tdUsdProfit.setAttribute('style', rawNetProfitArr[i].AVG_AVG_USD_PROFIT_PERCENT >= 0 ? 'color:green !important' : 'color:red !important');
        tdUsdProfit.appendChild(textUsdProfit);
        rowUsdProfit.appendChild(tdUsdProfit);

        var tdProfitDiff = document.createElement('td');
        var textProfitDiff = document.createTextNode(truncate(usdProfitDifference, 2)+ "%");
        tdProfitDiff.setAttribute('style', usdProfitDifference >= 0 ? 'color:green !important' : 'color:red !important');
        tdProfitDiff.appendChild(textProfitDiff);
        rowUsdProfitDiff.appendChild(tdProfitDiff);
    }

    tbody.appendChild(rowDate);
    tbody.appendChild(rowNetProfit);
    tbody.appendChild(rowProfitDiff);
    tbody.appendChild(rowActiveBots);
    tbody.appendChild(rowSubNetProfit);
    tbody.appendChild(rowBaseNetProfit);
    tbody.appendChild(rowUserSubBaseNetProfit);
    tbody.appendChild(rowUsdProfit);
    tbody.appendChild(rowUsdProfitDiff);

    return {
        netProfitArray: netProfit,
        baseNetProfitArray: baseNetProfit,
        usdProfitArray: usdProfit,
        xAxisDataArray: xAxisData
    };
};

var updateChartData = (netProfit, baseNetProfit,usdNetProfit, XAxisInput) => {
    var chart = new ApexCharts(document.querySelector("#earnings"), chartData);
        chart.render();
        chart.updateOptions({
            series: [
                {
                    name: 'Token',
                    data: netProfit,
                    type: 'line',
                },
                {
                    name: 'Base',
                    data: baseNetProfit,
                    type: 'line',
                },
                {
                    name: "USD",
                    data: usdNetProfit,
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
var inputBaseNetprofit = [];
var inputUsdProfit = [];
var inputXAxisData = [];

console.log("1: ",inputNetprofit);
console.log("2: ",inputBaseNetprofit);
console.log("3: ",inputXAxisData);
console.log("4: ",inputUsdProfit);

var chartData = {
    chart: {
        height: 350,
        toolbar: {
            show: false
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 3,
            color: ['rgba(245 ,187 ,116, 0.2)', "rgba(255,255,255,0)",'var(--primary02)'],
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
        width: [2.5, 2.5, 0],
        curve: "smooth",
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        fontWeight: 600,
        fontSize: '11px',
        tooltipHoverFormatter: function (val, opts) {
            return val + ': ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
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
        },
        {
            name: 'Token Base Netprofit',
            data: inputBaseNetprofit,
            type: 'line',
        },
        {
            name: "USD",
            data: inputUsdProfit,
            type: 'line'
          }],
    colors: ["rgba(15, 75, 160, 0.95)","rgb(245, 184, 73)","rgba(38, 191, 148, 0.95)"], //setting line color here
    fill: {
        type: ['gradient','gradient','solid'],
        gradient: {
            gradientToColors: ['#4776E6','#F5B849',"transparent"]
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
                if (typeof y !== "undefined") {
                    return y.toFixed(0) + "";
                }
                return y;
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
};

document.getElementById("earnings").innerHTML = "";
var chart = new ApexCharts(document.querySelector("#earnings"), chartData);
chart.render();

updateChartData(inputNetprofit,inputBaseNetprofit,inputUsdProfit,inputXAxisData);

function earnings() {
    chart.updateOptions({
        colors: [
            "rgba(" + myVarVal + ", 0.95)"
        ],
    });
};

var changeLayout = (layout) => {
    if(layout == 2){
        var graphData = formatGraphData(netProfitMonthly);
        inputNetprofit = graphData.netProfitArray;
        inputBaseNetprofit = graphData.baseNetProfitArray;
        inputUsdProfit = graphData.usdProfitArray;
        inputXAxisData = graphData.xAxisDataArray;

        updateChartData(inputNetprofit,inputBaseNetprofit,inputUsdProfit,inputXAxisData);
        document.getElementById("chart-view").innerHTML = "Monthly";
    }
    else if(layout == 1){
        var graphData = formatGraphData(netProfitDaily);
        inputNetprofit = graphData.netProfitArray;
        inputBaseNetprofit = graphData.baseNetProfitArray;
        inputUsdProfit = graphData.usdProfitArray;
        inputXAxisData = graphData.xAxisDataArray;

        updateChartData(inputNetprofit,inputBaseNetprofit,inputUsdProfit,inputXAxisData);
        document.getElementById("chart-view").innerHTML = "Daily";
    }
    else {
        var graphData = formatGraphData(netProfitHourly);
        inputNetprofit = graphData.netProfitArray;
        inputBaseNetprofit = graphData.baseNetProfitArray;
        inputUsdProfit = graphData.usdProfitArray;
        inputXAxisData = graphData.xAxisDataArray;

        updateChartData(inputNetprofit,inputBaseNetprofit,inputUsdProfit,inputXAxisData);
        document.getElementById("chart-view").innerHTML = "Hourly";
    }
};
//*********************** *********************/