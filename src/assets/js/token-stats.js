var delayInMS = 3000;
var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';

const botId = localStorage.getItem('botId');
const userSubscriptionStatusValue = localStorage.getItem('userSubscriptionStatus'); 
const authToken = localStorage.getItem('authToken');
let backToPreviousPage = "token-stats.html";

function truncate (num, places) {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

var formatGraphData = (rawInputArr) => {
  var input1 = [];
  var input2 = [];
  var input3 = [];
  var xAxisData = [];
  var profitDifference = 0; 

  const tbody = document.getElementById("token-stats-tbody");
  tbody.innerHTML = '';
  const rowDate = document.createElement('tr');
  const rowNetProfit = document.createElement('tr');
  const rowProfitDiff = document.createElement('tr');

  for (let i = 0; i < rawInputArr.length; i++) {
    input1.push(rawInputArr[i].TOKEN_NETPROFIT);
    input2.push(rawInputArr[i].BASE_NETPROFIT);
    input3.push(rawInputArr[i].OVERALL_PROFITABLE);
    var tradeDate = rawInputArr[i].APP_TS;
    profitDifference = i+1 < rawInputArr.length ? (rawInputArr[i+1].TOKEN_NETPROFIT - rawInputArr[i].TOKEN_NETPROFIT) : 0;
    //console.log("###token-stats-profirSummary: i:" + i + " profitDifference:" + truncate(profitDifference, 2) +"%");
    xAxisData.push(tradeDate);

    if(i==0) {
      var tdDateLabel= document.createElement('td');
      tdDateLabel.style.fontWeight = 'bold';
      var textDateLabel = document.createTextNode("Date");
      tdDateLabel.appendChild(textDateLabel);
      rowDate.appendChild(tdDateLabel);

      var tdNetProfitLabel = document.createElement('td');
      var textNetProfitLabel = document.createTextNode("Profit %");
      tdNetProfitLabel.appendChild(textNetProfitLabel);
      rowNetProfit.appendChild(tdNetProfitLabel);

      var tdProfitDiffLabel= document.createElement('td');
      var textProfitDiffLabel = document.createTextNode("Change %");
      tdProfitDiffLabel.appendChild(textProfitDiffLabel);
      rowProfitDiff.appendChild(tdProfitDiffLabel);
    }

    var tdDate = document.createElement('td');
    tdDate.style.fontWeight = 'bold';
    var textDate = document.createTextNode(rawInputArr[i].APP_TS);
    tdDate.appendChild(textDate);
    rowDate.appendChild(tdDate);

    var tdNetProfit = document.createElement('td');
    var textNetProfit = document.createTextNode(rawInputArr[i].TOKEN_NETPROFIT+"%");
    var fontColorNetProfit = rawInputArr[i].NETPROFIT >= 0 ? 'text-success' : 'text-danger';
    tdNetProfit.classList.add(fontColorNetProfit);
    tdNetProfit.appendChild(textNetProfit);
    rowNetProfit.appendChild(tdNetProfit);

    var tdProfitDiff= document.createElement('td');
    var textProfitDiff = document.createTextNode(truncate(profitDifference, 2)+"%");
    var fontColorProfitDiff = profitDifference >= 0 ? 'text-success' : 'text-danger';
    tdProfitDiff.classList.add(fontColorProfitDiff);
    tdProfitDiff.appendChild(textProfitDiff);
    rowProfitDiff.appendChild(tdProfitDiff);
  }

  tbody.appendChild(rowDate);
  tbody.appendChild(rowNetProfit);
  tbody.appendChild(rowProfitDiff);

  return {
    tokenNetProfit: input1,
    baseNetProfit: input2,
    overallProfitable: input3,
    lastTradedDate: xAxisData
  };
}

var updateChartData = (tokenNetProfitInput, baseNetProfitInput, overallProfitableInput, lastTradedDateInput, tokenCode, baseCode) => {
  console.log("tokenNetProfitInput: " + tokenNetProfitInput);
  console.log("baseNetProfitInput: " + baseNetProfitInput);
  console.log("overallProfitableInput: " + overallProfitableInput);
  console.log("lastTradedDateInput: " + lastTradedDateInput);
  console.log("baseCode: " + baseCode);
  console.log("tokenCode: " + tokenCode);

  var chart = new ApexCharts(document.querySelector("#profit-statistics"), options);
  chart.render();
  chart.updateOptions({
    colors: [
      "rgba(" + myVarVal + ", 0.075)",
      "rgba(" + myVarVal + ", 0.95)",
      "rgba(245 ,187 ,116)",
    ],
    series: [{
      name: tokenCode,
      data: tokenNetProfitInput,
      type: 'bar',
    }, {
      name: tokenCode,
      data: tokenNetProfitInput,
      type: 'line',
    }, {
      name: baseCode,
      data: baseNetProfitInput,
      type: 'line',
    }],
    //labels: lastTradedDateInput,
    xaxis: {
      type: 'day',
      categories: lastTradedDateArr,
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

var getTokenStats = (parentPage) => {
  const profileObj = JSON.parse(localStorage.getItem('profileObj'));
  var username = profileObj.NAME_FIRST + " " + profileObj.NAME_LAST;
  document.getElementById("header-user-name").innerHTML = username;
  document.getElementById("header-profile-photo").src = profileObj.PROFILE_PHOTO;
  if(profileObj.ROLE_CODE == 99){
    document.getElementById('admin-menu').style.display = 'block';
  }

  console.log("## botId: " + botId + " userSubscriptionStatusValue: " +userSubscriptionStatusValue);
  //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
  var targetEndPointUrl = targetEndPointUrlBase+'/api/tradingdata/getTokenStats';
  if (parentPage == 1) {
    targetEndPointUrl = targetEndPointUrlBase+'/api/subscription/getBotStats';
    backToPreviousPage = "bot-stats.html";
  }
  console.log("## targetEndPointUrl:", targetEndPointUrl);

  axios.post(
    //'@API_URL@/api/tradingdata/getTokenStats',
    targetEndPointUrl,
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
        const botDetails = res.data.tradeTransHistoryOneRow; // 1st row from history
        const tradeTransHistory = res.data.tradeTransHistory; //history
        netprofitHourlyData = res.data.netprofitHourlyData; //hourly data
        netprofitDailyData = res.data.netprofitDailyData; //daily data
        netprofitMonthlyData = res.data.netprofitMonthlyData; //monthly data
        tokenCurrencyCode = botDetails.TOKEN_CURRENCY_CODE;
        baseCurrencyCode = botDetails.BASE_CURRENCY_CODE;
        const pendingWorkflowRequestsCount = res.data.pendingRequestsCounts.REQ_COUNT; //pendingRequestsCounts
        const requestSubmittedOn = res.data.pendingRequestsCounts.SUBMITTED_ON; //pendingRequests Submitted On
        const requestSubmittedID = res.data.pendingRequestsCounts.REQ_ID; //pendingRequests Submitted On

        const approvedWorkflowRequestsCount = res.data.approvedRequestsCounts.REQ_COUNT; //approvedRequestsCounts
        const approvedRequestSubmittedOn = res.data.approvedRequestsCounts.SUBMITTED_ON; //approvedRequests Submitted On
        const approvedRequestSubmittedID = res.data.approvedRequestsCounts.SUB_REQ_ID; //approvedRequests Submitted On

        var formattedData = formatGraphData(netprofitDailyData);
        tokenNetProfitArr = formattedData.tokenNetProfit;
        baseNetProfitArr = formattedData.baseNetProfit;
        overallProfitableArr = formattedData.overallProfitable;
        lastTradedDateArr = formattedData.lastTradedDate;

        //updateChartData(tokenNetProfitArr, baseNetProfitArr, overallProfitableArr, lastTradedDateArr, botDetails.TOKEN_CURRENCY_CODE, botDetails.BASE_CURRENCY_CODE);
       setTimeout(() => {
          updateChartData(tokenNetProfitArr, baseNetProfitArr, overallProfitableArr, lastTradedDateArr, botDetails.TOKEN_CURRENCY_CODE, botDetails.BASE_CURRENCY_CODE);
        }
          , 200);

        //userSubscriptionStatusValue - determine status
        let usrBotSubscriptionStatus = userSubscriptionStatusValue >= 1 ? "<span class='badge bg-success ms-0 d-offline-block fs-14 '>ACTIVE</span>" : "<span class='badge bg-danger ms-0 d-offline-block fs-14 '>SUBSCRIBE</span>"; // ACTIVE refers USER already scubscribed; SUBSCRIBE refers USER yet to subscribe
        let idSubscriptionBoxButtonText = userSubscriptionStatusValue >= 1 ? "Unsubscribe" : "Proceed";
        let subscriptionStatusBoxTextBelow = userSubscriptionStatusValue >= 1 ? "Already subscribed" : "Review stats below & subscribe";
        
        //document.getElementById("header-trade-symbol").innerHTML = "<span class='badge bg-info ms-0 d-offline-block fs-12 '>"+ botDetails.BOT_ID +"</span>  " + botDetails.TRADE_SYMBOL + " " +usrBotSubscriptionStatus;
        document.getElementById("header-trade-symbol").innerHTML = usrBotSubscriptionStatus + " " + botDetails.TRADE_SYMBOL;
        document.getElementById("bot-name").innerHTML = "<span class='badge bg-info ms-0 d-offline-block fs-14 '>" + botDetails.BOT_ID +"</span>   " +  botDetails.TRADE_SYMBOL;
        document.getElementById("base-icon").src = botDetails.BOT_BASE_ICON;
        document.getElementById("token-icon").src = botDetails.BOT_TOKEN_ICON;
        document.getElementById("time-frame").innerHTML = botDetails.BOT_NAME;
        //document.getElementById("total-no-of-trades").innerHTML = botDetails.TOTAL_NUMOF_TRADES;
        document.getElementById("subscription-status-box-text-main").innerHTML = usrBotSubscriptionStatus;
        if(userSubscriptionStatusValue == 0) {
          document.getElementById("id-subscription-box-button").innerHTML = '';
          document.getElementById("id-subscription-box-button").innerHTML = '<a href="javascript:proceedSubscriptionUpdate(\'' + parentPage + '\' , \'' + pendingWorkflowRequestsCount + '\' , \'' + requestSubmittedOn + '\' , \'' + requestSubmittedID + '\' , \'' + approvedWorkflowRequestsCount + '\' , \'' + approvedRequestSubmittedOn + '\' , \'' + approvedRequestSubmittedID + '\');" class="btn btn-primary">'+ idSubscriptionBoxButtonText + "</a>";
        }
        else if(userSubscriptionStatusValue >= 1){
          document.getElementById("id-subscription-box-button").innerHTML = '';
          document.getElementById("staticBackdropLabel").innerHTML = 'Confirmation for Unsubscription of '+botDetails.BOT_NAME;
          document.getElementById("id-subscription-box-button").innerHTML = pendingWorkflowRequestsCount == 0 ? "<a data-bs-toggle='modal' data-bs-target='#botUnsubscribeModal' class='btn btn-primary'>"+ idSubscriptionBoxButtonText + "</a>"
                                                                                                              : '<a href="javascript:showErrorToast(\'' + requestSubmittedOn + '\' , \'' + requestSubmittedID + '\')" class="btn btn-primary">'+ idSubscriptionBoxButtonText + "</a>";
        }
        
        document.getElementById("subscription-status-box-text-below").innerHTML = subscriptionStatusBoxTextBelow; 
        
        document.getElementById("traded-date1").innerHTML = botDetails.APP_TS;
        document.getElementById("investment").innerHTML = botDetails.TOKEN_ENTRY_AMOUNT;
        document.getElementById("subscribed-on").innerHTML = "Started on: " + botDetails.SUBSCRIBED_ON;
        document.getElementById("traded-qty").innerHTML = botDetails.LAST_TRADE_QTY;
        document.getElementById("traded-date2").innerHTML = botDetails.LAST_TRADED_DATE;

        document.getElementById("total-trades").innerHTML = botDetails.TOTAL_NUMOF_TRADES;
        document.getElementById("win-trades").innerHTML = botDetails.WIN_TRADES;
        document.getElementById("loss-trades").innerHTML = botDetails.LOSS_TRADES;
        var winPercentage = Math.round((botDetails.WIN_TRADES / botDetails.TOTAL_NUMOF_TRADES) * 100, 2);
        var lossPercentage = Math.round((botDetails.LOSS_TRADES / botDetails.TOTAL_NUMOF_TRADES) * 100, 2);
        document.getElementById("win-percent").innerHTML = winPercentage + '%';
        document.getElementById("loss-percent").innerHTML = lossPercentage + '%';
        document.getElementById("win-percent").style.width = winPercentage + '%';
        document.getElementById("loss-percent").style.width = lossPercentage + '%';

        var currentBalance = "Current: " + botDetails.BASE_CURRENT_BALANCE + " " + botDetails.BASE_CURRENCY_CODE;
        var initialBalance = "Invested: " + botDetails.BASE_INITIAL_CAPITAL + " " + botDetails.BASE_CURRENCY_CODE;
        document.getElementById("current-balance").innerHTML = currentBalance;
        document.getElementById("initial-balance").innerHTML = initialBalance;

        //Profit Summary - Chart setup - starts
        var netProfitValue = botDetails.TOKEN_NETPROFIT;
        var baseNetProfitValue = botDetails.BASE_NETPROFIT;
        var tradeSuccessRate = botDetails.OVERALL_PROFITABLE;
        
        document.getElementById("tokenAsOfNowtNetProfitLbl").innerHTML = "<i class='bx bxs-circle text-primary fs-12  me-1'></i>" + botDetails.TOKEN_CURRENCY_CODE + " Netprofit";
        document.getElementById("baseAsOfNowtNetProfitLbl").innerHTML = "<i class='bx bxs-circle text-secondary fs-12  me-1'></i>" + botDetails.BASE_CURRENCY_CODE + " Netprofit";
        document.getElementById("overallAsOfNowtNetProfitLbl").innerHTML = "<i class='bx bxs-circle text-info fs-12 me-1'></i>" + "Trade Success Rate";

        if(netProfitValue>0){
          document.getElementById("net-profit").innerHTML = "<span class='badge bg-success-transparent fs-14 rounded-pill'>" + netProfitValue + "%<i class='ti ti-trending-up ms-1'></i></span>";
          document.getElementById("tokenAsOfNowtNetProfit").innerHTML = "<span class='badge bg-success-transparent fs-14 rounded-pill'>" + botDetails.TOKEN_NETPROFIT + "%" + "<i class='ti ti-trending-up ms-1'></i></span>";
        } else {
          document.getElementById("net-profit").innerHTML = "<span class='badge bg-danger-transparent fs-14 rounded-pill'>" + netProfitValue + "%<i class='ti ti-trending-down ms-1'></i></span>";
          document.getElementById("tokenAsOfNowtNetProfit").innerHTML = "<span class='badge bg-danger-transparent fs-14 rounded-pill'>" + botDetails.TOKEN_NETPROFIT + "%" + "<i class='ti ti-trending-down ms-1'></i></span>";
        }

        document.getElementById("statsBaseIconUrl-0").src = botDetails.BOT_BASE_ICON;
        document.getElementById("statsBaseIconUrl-1").src = botDetails.BOT_BASE_ICON;
        document.getElementById("statsBaseIconUrl-2").src = botDetails.BOT_TOKEN_ICON;

        if(baseNetProfitValue>0){
          document.getElementById("base-net-profit").innerHTML = "Netprofit: " + "<span class='badge bg-success-transparent fs-14 rounded-pill'>" + baseNetProfitValue + "%"+ "<i class='ti ti-trending-up ms-1'></i></span>";
          document.getElementById("baseAsOfNowtNetProfit").innerHTML = "<span class='badge bg-success-transparent fs-14 rounded-pill'>" + botDetails.BASE_NETPROFIT + "%" + "<i class='ti ti-trending-up ms-1'></i></span>";
        } else {
          document.getElementById("base-net-profit").innerHTML = "Netprofit: " + "<span class='badge bg-danger-transparent fs-14 rounded-pill'>" + baseNetProfitValue + "%" + "<i class='ti ti-trending-down ms-1'></i></span>";
          document.getElementById("baseAsOfNowtNetProfit").innerHTML = "<span class='badge bg-danger-transparent fs-14 rounded-pill'>" + botDetails.BASE_NETPROFIT + "%" + "<i class='ti ti-trending-down ms-1'></i></span>";
        }
        document.getElementById("base-profit").innerHTML = "Gain in BASE: " + botDetails.BASE_PROFIT + " " + botDetails.BASE_CURRENCY_CODE;

        if(tradeSuccessRate>0)
          document.getElementById("overallAsOfNowtNetProfit").innerHTML =  "<span class='badge bg-success-transparent fs-14 rounded-pill'>" +tradeSuccessRate + "%" + "<i class='ti ti-trending-up ms-1'></i></span>"; //Trade success rate
        else
          document.getElementById("overallAsOfNowtNetProfit").innerHTML =  "<span class='badge bg-danger-transparent fs-14 rounded-pill'>" +tradeSuccessRate + "%" + "<i class='ti ti-trending-up ms-1'></i></span>"; //Trade success rate
        
        //Profit Summary - Chart setup - ends

        
        var tokenTradeFee = botDetails.TOKEN_TRADE_FEE + " " + botDetails.TOKEN_CURRENCY_CODE;
        var baseTradeFee = botDetails.BASE_TRADE_FEE + " " + botDetails.BASE_CURRENCY_CODE;
        document.getElementById("token-trade-fee").innerHTML = "Fee in Token: " + tokenTradeFee;
        document.getElementById("base-trade-fee").innerHTML = "Fee in BASE: " + baseTradeFee;

        for (let i = tradeTransHistory.length - 1; i >=0; i--) {
          //var txDateTime = new Date(tradeTransHistory[i].APP_TS).toLocaleString();
          var txDateTime = (tradeTransHistory[i].APP_TS);
          createTransHistoryElements(txDateTime, tradeTransHistory[i].TRADE_ACTION,
            tradeTransHistory[i].LAST_TRADE_QTY, tradeTransHistory[i].TOKEN_CURRENCY_CODE);
        }

        document.getElementById("symbol-statistics").innerHTML = botDetails.TRADE_SYMBOL;
        document.getElementById("total-no-of-days").innerHTML = botDetails.TOTAL_NUMOF_DAYS + " Days";
        document.getElementById("total-no-of-days-box").innerHTML = botDetails.TOTAL_NUMOF_DAYS + " Days";

        //Profit per Month
        let profitPerMonth = botDetails.PROFIT_PER_MONTH;
        const recommendateRating  = profitPerMonth > 10 ? 'bi-patch-check-fill' : '';
        const profitPerMonthColor  = profitPerMonth > 0 ? 'success' : 'danger';
        const profitPerMonthTrend  = profitPerMonth > 0 ? 'trending-up' : 'trending-down';
        let profitPerMonthDesign = "<span class='text-" + profitPerMonthColor +"'><i class='ti ti-" + profitPerMonthTrend +" me-1 align-middle'></i>" + profitPerMonth +"%</span><i class='bi " + recommendateRating +" text-success ms-1 fs-21'></i>";
        
        //Profit per trade
        let profitPerTrade = botDetails.PROFIT_PER_TRADE;
        let profitPerTradeDesign = "<span class='text-" + profitPerMonthColor +"'><i class='ti ti-" + profitPerMonthTrend +" me-1 align-middle'></i>" + profitPerTrade +"%</span><i class='bi " + recommendateRating +" text-success ms-1 fs-21'></i>";

        //Overall success rate
        let overallSuccessRate = botDetails.OVERALL_PROFITABLE;
        const successRateColorCode = overallSuccessRate > 40 ? 'text-success' : 'text-danger';
        const successRateTrend = overallSuccessRate > 40 ? 'caret-up-fill' : 'caret-down-fill';
        let overallSuccessRateDesign = "<div class='progress progress-xs progress-custom progress-animate' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100'><div class='progress-bar bg-primary' style='width:"+ overallSuccessRate + "%'></div></div><span class='fs-14'>"+ overallSuccessRate + "%<i class='bi bi-"+ successRateTrend + " ms-1 " + successRateColorCode + "'></i></span>";

        document.getElementById("profit-per-month").innerHTML = profitPerMonthDesign;
        document.getElementById("profit-per-trade").innerHTML = profitPerTradeDesign;
        document.getElementById("overall-profitable").innerHTML = overallSuccessRateDesign;
        document.getElementById("trades-per-month").innerHTML = botDetails.TRADES_PER_MONTH + " trades";
        document.getElementById("max-wins").innerHTML = botDetails.MAX_WINS + " trades";
        document.getElementById("max-losses").innerHTML = botDetails.MAX_LOSS + " trades";
        document.getElementById("max-tokens-held").innerHTML = botDetails.MAX_TOKENS_HELD + " " + botDetails.TOKEN_CURRENCY_CODE;
        var avgTimePerTrade = botDetails.AVG_TIME_PER_TRADE < 1 ? truncate(botDetails.AVG_TIME_PER_TRADE*24,2) + " hours" : truncate(botDetails.AVG_TIME_PER_TRADE,2) +  " days";        
        document.getElementById("avg-time-per-trade").innerHTML = avgTimePerTrade
      }
    })
    .catch(err => {
      console.log("### Inside getTokenStats:err.response", err);
      showToastAlerts('token-stats-error', 'alert-error-msg', err.response.data.message);
      if (err.response.status == 401) {
        setTimeout(() => {
          window.location.href = 'sign-in-cover.html';
        }
          , delayInMS);
      }
    });
};

var showToastAlerts = (divId, spanId, msg) => {
  document.getElementById(spanId).innerHTML = msg;
  const middlecentertoastExample = document.getElementById(divId);
  const toast = new bootstrap.Toast(middlecentertoastExample, { delay: delayInMS });
  toast.show();
}

var goBackToPreviousPage = () => {
  window.location.href=backToPreviousPage;//'bots-list.html';
};

var createTransHistoryElements = (lastTradedDate, tradeAction, lastTradeQty, tokenCurrCode) => {
  const tradeActionFull = (tradeAction == 'B') ? 'Bought' : (tradeAction == 'S') ? 'Sold' : tradeAction;
  const badgeTheme = (tradeAction == 'B') ? 'success' : 'secondary';
  const list = document.createElement('li');
  list.id = 'transaction-li';
  list.innerHTML = `<div class="">
                          <i class="task-icon bg-${badgeTheme}"></i>
                          <div class="flex-1 fw-semibold">
                            <span>${lastTradeQty} ${tokenCurrCode} </span>
                            <span class="badge bg-${badgeTheme}-transparent rounded-pill badge-sm fs-12 fw-semibold ms-2">${tradeActionFull}</span>
                            <span class="text-muted fs-10 ms-2">${lastTradedDate}</span>
                          </div>
                      </div>`

  const ulist = document.getElementById("transactions-ul");
  ulist.appendChild(list);
}

var proceedSubscriptionUpdate = (parentPage, pendingWorkflowRequestsCount, requestSubmittedOn, requestSubmittedID, approvedWorkflowRequestsCount, approvedRequestSubmittedOn, approvedRequestSubmittedID) => {
  //get submitted requests count from storage
  //when userSubscriptionStatusValue = 1 then REQ_TYPE should be UNSUBSCRIBE
  //when userSubscriptionStatusValue = 0 then REQ_TYPE should be SUBSCRIBE
  //validation : active_bots_latest+requests_subscribe_count should be <= roleCode

  const requests_subscribe_count = localStorage.getItem('requests_subscribe_count');
  const requests_unsubscribe_count = localStorage.getItem('requests_unsubscribe_count');
  const active_bots_latest = localStorage.getItem('active_bots_count');
  const role_code = localStorage.getItem('role_code');
  console.log("## requests_subscribe_count: " + requests_subscribe_count + " requests_unsubscribe_count: " + requests_unsubscribe_count + " active_bots_latest: " + active_bots_latest + " role_code: " + role_code);
  let userTotalBots = active_bots_latest + requests_subscribe_count;

  if (pendingWorkflowRequestsCount <= 0) {
    if (userTotalBots < role_code) {
      //duplicate check - starts - make sure there is no earlier subscription for this combo
      if (approvedWorkflowRequestsCount == 0) {
        //allow request submission to redirect to request page
        showToastAlerts('token-stats-success', 'alert-success-msg', 'You are eligible to place request');
        setTimeout(() => {
          window.location.href = 'workflow.html?code=' + parentPage;
        }, delayInMS);
      } else {
        //do not allow, stay her and show error message
        let errMsg = "You already subscribed for this Strategy on " + approvedRequestSubmittedOn + " associated request# " + approvedRequestSubmittedID;
        showToastAlerts('token-stats-error', 'alert-error-msg', errMsg);
      }
      //duplicate check ends
    } else {
      //do not allow, stay her and show error message
      showToastAlerts('token-stats-error', 'alert-error-msg', 'You have reached maximum subscriptions of your tier, please upgrade your tier level');
    }
  } else {
    showErrorToast(requestSubmittedOn, requestSubmittedID);
  } 
};

var unsubscribeBot = (requestDescribtion) => {
  var botName = document.getElementById("time-frame").innerHTML;
  var revisedReqDesc = botName + " - " + requestDescribtion;
  const requestBody = {
    reqType: 'UNSUBSCRIBE',
    reqDesc: revisedReqDesc,
    botId: botId,
    botName : botName,
    agreeWhitelist: 1,
    agreeIpAdded: 1,
    agreeTerms: 1,
    agreeConsent: 1,
    agreeTermsDocPath: '',
  }

  //authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
  axios
  .post(
      targetEndPointUrlBase +'/api/subscription/placeRequest',
      requestBody,
      {
          headers: {
              Authorization: `Bearer ${authToken}`
          }
      }
  )
  .then(res => {
      console.log("res: " + JSON.stringify(res.data));
      if (res.status == 200) {
          showToastAlerts('token-stats-success','alert-success-msg',res.data.message);
          setTimeout(()=> {
            goBackToPreviousPage();
          }
          ,delayInMS);
      }
  })
  .catch(err => {
      console.log(err);
          if (err.response.status == 401) {
          showToastAlerts('token-stats-error','alert-error-msg',err.response.data.message);
          setTimeout(()=> {
              location.href = "sign-in-cover.html";
              }
              ,delayInMS);
      }
  });
}

var showErrorToast = (requestSubmittedOn, requestSubmittedID) => {
   showToastAlerts('token-stats-error', 'alert-error-msg', `You have already submitted a <span class='text-black fs-16'>Request# ${requestSubmittedID} on ${requestSubmittedOn} </span>and it is under review process, please contact support team`);
};

/* column chart with negative values */
// var options = {
//     series: [
//       {
//         name: "Token Netprofit",
//         type: "line",
//         data: tokenNetProfitArr,
//       },
//       {
//         name: "Base Netprofit",
//         type: "line",
//         data: baseNetProfitArr,
//       },
//       {
//         name: "Overall Profitable",
//         type: "line",
//         data: overallProfitableArr,
//       },
//     ],
//     chart: {
//       toolbar: {
//         show: false,
//       },
//       height: 310,
//       type: "line",
//       stacked: false,
//     },
//     stroke: {
//       width: [0, 1, 1],
//       curve: "smooth",
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "40%",
//       },
//     },
//     colors: [
//       "rgba(0, 144, 172, 0.95)",
//       "rgba(0, 144, 172, 0.05)",
//       "#ffa891",
//     ],
//     fill: {
//       opacity: [0.85, 0.25, 1],
//       gradient: {
//         inverseColors: false,
//         shade: "light",
//         type: "vertical",
//         opacityFrom: 0.65,
//         opacityTo: 0.15,
//         stops: [0, 100, 100, 100],
//       },
//     },

//     labels: lastTradedDateArr,
//     markers: {
//       size: 0,
//     },
//     xaxis: {
//       type: "month",
//     },
//     yaxis: {
//       title: {
//         text: "%",
//       },
//       min: 0,
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//       y: {
//         formatter: function (y) {
//           if (typeof y !== "undefined") {
//             return y.toFixed(0) + " %";
//           }
//           return y;
//         },
//       },
//     },
//     legend: {
//       show: true,
//     },
//   };

//   var chart = new ApexCharts(document.querySelector("#profit-statistics"), options);
//   chart.render();

// /* column chart with negative values */
// var options = {
//   series: [{
//     name: 'Token Netprofit',
//     data: tokenNetProfitArr,
//     type: "line"
//   }, {
//     name: 'Base Netprofit',
//     data: baseNetProfitArr,
//     type: "line"
//   }, {
//     name: 'Overall Netprofit',
//     data: overallProfitableArr,
//     type: "bar"
//   }],
//   chart: {
//     type: 'line',
//     height: 520,
//     width: 600
//   },
//   plotOptions: {
//     bar: {
//       colors: {
//         ranges: [{
//           from: -100,
//           to: -46,
//           color: '#e6533c'
//         }, {
//           from: -45,
//           to: 0,
//           color: '#a66a5e'
//         }]
//       },
//       columnWidth: '80%',
//     }
//   },
//   grid: {
//     borderColor: '#f2f5f7',
//   },
//   colors: [
//     "rgba(0, 144, 172, 0.95)",
//     "rgba(0, 144, 172, 0.05)",
//     "#ffa891",
//   ],
//   dataLabels: {
//     enabled: true,
//   },
//   yaxis: {
//     title: {
//       text: 'Growth',
//       style: {
//         color: "#8c9097",
//       }
//     },
//     labels: {
//       formatter: function (y) {
//         return y.toFixed(0) + "%";
//       },
//       labels: {
//         show: true,
//         style: {
//           colors: "#8c9097",
//           fontSize: '10px',
//           fontWeight: 600,
//           cssClass: 'apexcharts-xaxis-label',
//         },
//       }
//     }
//   },
//   xaxis: {
//     type: 'month',
//     categories: lastTradedDateArr,
//     labels: {
//       rotate: -90,
//       style: {
//         colors: "#8c9097",
//         fontSize: '11px',
//         fontWeight: 600,
//         cssClass: 'apexcharts-xaxis-label',
//       },
//     }
//   }
// };
// var chart = new ApexCharts(document.querySelector("#profit-statistics"), options);
// chart.render();


// function hrmstatistics() {
//   chart.updateOptions({
//     colors: [
//       "rgba(" + myVarVal + ", 0.95)",
//       "rgba(" + myVarVal + ", 0.05)",
//       "#ffa891",
//     ],
//   });

// }

/*  sales overview chart */
var netprofitHourlyData = [];
var netprofitDailyData = [];
var netprofitMonthlyData = [];
var tokenCurrencyCode = '';
var baseCurrencyCode = '';

var tokenNetProfitArr = [];
var baseNetProfitArr = [];
var overallProfitableArr = [];
var lastTradedDateArr = [];

var options = {
  chart: {
    height: 400,
    toolbar: {
      show: true
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
    enabled: true
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if (typeof y !== "undefined") {
          return y.toFixed(0) + " %";
        }
        return y;
      },
    },
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
    fontSize: '16px',
    tooltipHoverFormatter: function (val, opts) {
      return val + ': ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '%'
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
    }
  },
  series: [{
    name: "Token",
    data: tokenNetProfitArr,
    type: 'bar'
  }, {
    name: "Token",
    data: tokenNetProfitArr,
    type: 'line'
  }, {
    name: "Base",
    data: baseNetProfitArr,
    type: 'line'
  }],
  colors: ["rgba(119, 119, 142, 0.075)", "rgba(0, 144, 172, 0.95)", "rgba(245 ,187 ,116)",],
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
    categories: lastTradedDateArr,
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
};

document.getElementById("profit-statistics").innerHTML = "";
var chart = new ApexCharts(document.querySelector("#profit-statistics"), options);
chart.render();

updateChartData(tokenNetProfitArr, baseNetProfitArr, overallProfitableArr, lastTradedDateArr, "Token Currency Code", "Base Currency Code");

var changeLayout = (layout) => {
  if(layout == 2){
      var formattedData = formatGraphData(netprofitMonthlyData);
      tokenNetProfitArr = formattedData.tokenNetProfit;
      baseNetProfitArr = formattedData.baseNetProfit;
      overallProfitableArr = formattedData.overallProfitable;
      lastTradedDateArr = formattedData.lastTradedDate;
      updateChartData(tokenNetProfitArr, baseNetProfitArr, overallProfitableArr, lastTradedDateArr, tokenCurrencyCode, baseCurrencyCode);
  }
  else if(layout == 1){
    var formattedData = formatGraphData(netprofitDailyData);
    tokenNetProfitArr = formattedData.tokenNetProfit;
    baseNetProfitArr = formattedData.baseNetProfit;
    overallProfitableArr = formattedData.overallProfitable;
    lastTradedDateArr = formattedData.lastTradedDate;
    updateChartData(tokenNetProfitArr, baseNetProfitArr, overallProfitableArr, lastTradedDateArr, tokenCurrencyCode, baseCurrencyCode);
  }
  else {
    var formattedData = formatGraphData(netprofitHourlyData);
    tokenNetProfitArr = formattedData.tokenNetProfit;
    baseNetProfitArr = formattedData.baseNetProfit;
    overallProfitableArr = formattedData.overallProfitable;
    lastTradedDateArr = formattedData.lastTradedDate;
    updateChartData(tokenNetProfitArr, baseNetProfitArr, overallProfitableArr, lastTradedDateArr, tokenCurrencyCode, baseCurrencyCode);
  }
};

var validateModalInputs = () => {
  if(document.getElementById('unsubscription-note').value.length > 0){
    document.getElementById('unsubscription-submit').disabled = false;
  }
  else {
    document.getElementById('unsubscription-submit').disabled = true;
  }
}
//**************************************************** */