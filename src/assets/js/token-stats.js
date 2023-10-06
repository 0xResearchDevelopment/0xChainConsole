var delayInMS = 3000;

var tokenNetProfitArr = [];
var baseNetProfitArr = [];
var overallProfitableArr = [];
var lastTradedDateArr = [];

var getTokenStats = () => {
    const profileObj = JSON.parse(localStorage.getItem('profileObj'));
    var username = profileObj.NAME_FIRST + " " + profileObj.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profileObj.PROFILE_PHOTO;

    const botId = localStorage.getItem('botId');
    const authToken = localStorage.getItem('authToken');
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
    
    axios.post(
            'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/tradingdata/getTokenStats',
            {
                botId: botId
            },
            {
            headers: {
                Authorization: `Bearer ${authToken}`
            }            
        })
        .then(res => {
            console.log("### Inside getTokenStats:res.data: " + res.data);
            if (res.status == 200) {
                console.log("### Inside getTokenStats:res.data.tradeTransHistoryOneRow:", res.data.tradeTransHistoryOneRow);
                const botDetails = res.data.tradeTransHistoryOneRow;
                const tradeTransHistory = res.data.tradeTransHistory;

                tokenNetProfitArr = formatGraphData(tradeTransHistory).tokenNetProfit;
                baseNetProfitArr = formatGraphData(tradeTransHistory).baseNetProfit;
                overallProfitableArr = formatGraphData(tradeTransHistory).overallProfitable;
                lastTradedDateArr = formatGraphData(tradeTransHistory).lastTradedDate;

                updateChartData(tokenNetProfitArr,baseNetProfitArr,overallProfitableArr,lastTradedDateArr);

                document.getElementById("header-trade-symbol").innerHTML = botDetails.TRADE_SYMBOL;
                document.getElementById("bot-name").innerHTML = botDetails.TRADE_SYMBOL;
                document.getElementById("base-icon").src = botDetails.BOT_BASE_ICON;
                document.getElementById("token-icon").src = botDetails.BOT_TOKEN_ICON;
                document.getElementById("time-frame").innerHTML = botDetails.BOT_NAME;
                document.getElementById("total-no-of-trades").innerHTML = botDetails.TOTAL_NUMOF_TRADES;
                document.getElementById("net-profit").innerHTML = botDetails.TOKEN_NETPROFIT;
                document.getElementById("traded-date1").innerHTML = botDetails.LAST_TRADED_DATE;
                document.getElementById("investment").innerHTML = botDetails.TOKEN_ENTRY_AMOUNT;
                document.getElementById("subscribed-on").innerHTML = botDetails.SUBSCRIBED_ON;
                document.getElementById("traded-qty").innerHTML = botDetails.LAST_TRADE_QTY;
                document.getElementById("traded-date2").innerHTML = botDetails.LAST_TRADED_DATE; 

                document.getElementById("total-trades").innerHTML = botDetails.TOTAL_NUMOF_TRADES;
                document.getElementById("win-trades").innerHTML = botDetails.WIN_TRADES; 
                document.getElementById("loss-trades").innerHTML = botDetails.LOSS_TRADES; 
                var winPercentage = Math.round((botDetails.WIN_TRADES/botDetails.TOTAL_NUMOF_TRADES)*100,2);
                var lossPercentage = Math.round((botDetails.LOSS_TRADES/botDetails.TOTAL_NUMOF_TRADES)*100,2);
                document.getElementById("win-percent").innerHTML = winPercentage + '%'; 
                document.getElementById("loss-percent").innerHTML = lossPercentage + '%' 
                document.getElementById("win-percent").style.width = winPercentage + '%';
                document.getElementById("loss-percent").style.width = lossPercentage + '%';

                var currentBalance = botDetails.BASE_CURRENT_BALANCE + " " + botDetails.BASE_CURRENCY_CODE;
                var initialBalance = botDetails.BASE_INITIAL_CAPITAL + " " + botDetails.BASE_CURRENCY_CODE;
                document.getElementById("current-balance").innerHTML = currentBalance; 
                document.getElementById("initial-balance").innerHTML = initialBalance; 

                var baseProfit = botDetails.BASE_PROFIT + " " + botDetails.BASE_CURRENCY_CODE;
                document.getElementById("base-net-profit").innerHTML = botDetails.BASE_NETPROFIT; 
                document.getElementById("base-profit").innerHTML = baseProfit;

                var tokenTradeFee = botDetails.TOKEN_TRADE_FEE + " " + botDetails.TOKEN_CURRENCY_CODE;
                var baseTradeFee = botDetails.BASE_TRADE_FEE + " " + botDetails.BASE_CURRENCY_CODE;
                document.getElementById("token-trade-fee").innerHTML = tokenTradeFee; 
                document.getElementById("base-trade-fee").innerHTML = baseTradeFee; 
                
                for (let i = 0; i < tradeTransHistory.length; i++) {                     
                    createTransHistoryElements(tradeTransHistory[i].LAST_TRADED_DATE, tradeTransHistory[i].TRADE_ACTION,
                                        tradeTransHistory[i].LAST_TRADE_QTY, tradeTransHistory[i].TOKEN_CURRENCY_CODE);    
                }

                document.getElementById("symbol-statistics").innerHTML = botDetails.TRADE_SYMBOL; 
                document.getElementById("total-no-of-days").innerHTML = botDetails.TOTAL_NUMOF_DAYS; 
                document.getElementById("profit-per-month").innerHTML = botDetails.PROFIT_PER_MONTH; 
                document.getElementById("profit-per-trade").innerHTML = botDetails.PROFIT_PER_TRADE; 
                document.getElementById("overall-profitable").innerHTML = botDetails.OVERALL_PROFITABLE; 
                document.getElementById("trades-per-month").innerHTML = botDetails.TRADES_PER_MONTH; 
                document.getElementById("max-wins").innerHTML = botDetails.MAX_WINS; 
                document.getElementById("max-losses").innerHTML = botDetails.MAX_LOSS; 
                document.getElementById("max-tokens-held").innerHTML = botDetails.MAX_TOKENS_HELD; 
                document.getElementById("avg-time-per-trade").innerHTML = botDetails.AVG_TIME_PER_TRADE; 
            }
        })
        .catch(err => {
            console.log("### Inside getTokenStats:err.response", err);
            showToastAlerts('token-stats-error','alert-error-msg',err.response.data.message);
            if(err.response.status == 401) {
                setTimeout(()=> {
                    window.location.href='sign-in-cover.html';
                 }
                 ,delayInMS);
            }
        });
};

var showToastAlerts = (divId,spanId,msg) => {
    document.getElementById(spanId).innerHTML = msg;
    const middlecentertoastExample = document.getElementById(divId);
    const toast = new bootstrap.Toast(middlecentertoastExample,{delay: delayInMS});
	toast.show();
}

var createTransHistoryElements = (lastTradedDate, tradeAction, lastTradeQty, tokenCurrencyCode) => {
    const tradeActionFull = (tradeAction == 'B') ? 'Bought' : (tradeAction == 'S') ? 'Sold' : tradeAction;
    const badgeTheme = (tradeAction == 'B') ? 'success' : 'secondary';
    const list = document.createElement('li');
    list.id = 'transaction-li';
    list.classList.add("list-item", "mb-4", "up-event");
    list.innerHTML = `<div class="d-flex align-items-start">
                        <div class="me-5 text-center fw-semibold">
                            <p class="text-primary fs-12 mb-0">${lastTradedDate}</p>
                        </div>
                        <div class="flex-1 fw-semibold row" style="margin-left: 15%;">
                            <span class="badge bg-${badgeTheme}-transparent rounded-pill badge-sm fw-semibold ms-2 col-xl-2">${tradeActionFull}</span>
                            <span class="col-xl-6">${lastTradeQty} ${tokenCurrencyCode}</span>
                        </div>
                      </div>`

    const ulist = document.getElementById("transactions-ul");
    ulist.appendChild(list);
}

var options = {
    series: [
      {
        name: "Token Netprofit",
        type: "bar",
        data: tokenNetProfitArr,
      },
      {
        name: "Base Netprofit",
        type: "area",
        data: baseNetProfitArr,
      },
      {
        name: "Overall Profitable",
        type: "column",
        data: overallProfitableArr,
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      height: 310,
      type: "line",
      stacked: false,
    },
    stroke: {
      width: [0, 1, 1],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
      },
    },
    colors: [
      "rgba(0, 144, 172, 0.95)",
      "rgba(0, 144, 172, 0.05)",
      "#ffa891",
    ],
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.65,
        opacityTo: 0.15,
        stops: [0, 100, 100, 100],
      },
    },
  
    labels: lastTradedDateArr,
    markers: {
      size: 0,
    },
    xaxis: {
      type: "month",
    },
    yaxis: {
      title: {
        text: "Points",
      },
      min: 0,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        },
      },
    },
    legend: {
      show: false,
    },
  };
  
  var chart = new ApexCharts(document.querySelector("#profit-statistics"), options);
  chart.render();
  function hrmstatistics() {
    chart.updateOptions({
      colors: [
        "rgba(" + myVarVal + ", 0.95)",
        "rgba(" + myVarVal + ", 0.05)",
        "#ffa891",
      ],
    });
  
  }

  var formatGraphData = (rawInputArr) => {
    var input1 = [];
    var input2 = [];
    var input3 = [];
    var xAxisData = [];

    for (let i = 0; i < rawInputArr.length; i++) {
        input1.push(rawInputArr[i].TOKEN_NETPROFIT);
        input2.push(rawInputArr[i].BASE_NETPROFIT);
        input3.push(rawInputArr[i].OVERALL_PROFITABLE);
        xAxisData.push(rawInputArr[i].LAST_TRADED_DATE);
    }

    return {
        tokenNetProfit: input1,
        baseNetProfit: input2,
        overallProfitable: input3,
        lastTradedDate: xAxisData
       };
  }

  var updateChartData = (tokenNetProfitInput, baseNetProfitInput, overallProfitableInput, lastTradedDateInput) => {
    console.log("tokenNetProfitInput: "+ tokenNetProfitInput);
    console.log("baseNetProfitInput: "+ baseNetProfitInput);
    console.log("overallProfitableInput: "+ overallProfitableInput);
    console.log("lastTradedDateInput: "+ lastTradedDateInput);

    var chart = new ApexCharts(document.querySelector("#profit-statistics"), options);
    chart.render();
    chart.updateOptions({
        colors: [
          "rgba(" + myVarVal + ", 0.95)",
          "rgba(" + myVarVal + ", 0.05)",
          "#ffa891",
        ],
        series: [
            {
              name: "Token Netprofit",
              type: "bar",
              data: tokenNetProfitInput,
            },
            {
              name: "Base Netprofit",
              type: "area",
              data: baseNetProfitInput,
            },
            {
              name: "Overall Profitable",
              type: "column",
              data: overallProfitableInput,
            },
          ],
          labels: lastTradedDateInput
      });
    }