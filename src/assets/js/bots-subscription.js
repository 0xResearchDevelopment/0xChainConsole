var delayInMS = 3000;
var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';

function truncate (num, places) {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

var loadBotSummaryData = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
    const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;

    const authToken = localStorage.getItem('authToken');
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
    axios
        .post(
            targetEndPointUrlBase+'/api/subscription/getBotsSummary',
            {},
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            if (res.status == 200) {
                console.log(res.data);
                const botsSummary = (res.data.botsSummary!=undefined && res.data.botsSummary!=null)?res.data.botsSummary:null;
                const userSubscribedBots = (res.data.susbcribedBots!=undefined && res.data.susbcribedBots!=null)?res.data.susbcribedBots:null;

                var userSubscriptionStatus = 0;
                for (let i = 0; i < botsSummary.length; i++) {
                    userSubscriptionStatus  = findUserSubscriptionStatus(userSubscribedBots, botsSummary[i].BOT_ID);
                    var avgTimePerTrade = botsSummary[i].AVG_TIME_PER_TRADE < 1 ? truncate(botsSummary[i].AVG_TIME_PER_TRADE*24,2) + " hours" : truncate(botsSummary[i].AVG_TIME_PER_TRADE,2) +  " days";        
                    createTableRows(
                        userSubscriptionStatus,
                        botsSummary[i].BOT_TOKEN_ICON,
                        botsSummary[i].BOT_ID, 
                        botsSummary[i].TRADE_SYMBOL + "_" + botsSummary[i].TRADE_TIMEFRAME.toUpperCase(), //botsSummary[i].BOT_NAME,
                        botsSummary[i].TOKEN_NETPROFIT,
                        botsSummary[i].BASE_NETPROFIT,
                        botsSummary[i].OVERALL_PROFITABLE,
                        botsSummary[i].TOTAL_NUMOF_TRADES,
                        botsSummary[i].PROFIT_PER_MONTH,
                        avgTimePerTrade,    //botsSummary[i].AVG_TIME_PER_TRADE, 
                        botsSummary[i].TOTAL_NUMOF_DAYS, 
                        botsSummary[i].APP_TS_FORMATED
                    );                      
                } 
                applyResponsiveness(botsSummary.length);
            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            if(err.response.status == 401) {
                setTimeout(()=> {
                    window.location.href='sign-in-cover.html';
                 }
                 ,delayInMS);
            }
        }) 
};

var findUserSubscriptionStatus = (userSubscribedBots, botID) => {
    let userSubscriptionStatus = 0 ;
    for (let i = 0; i < userSubscribedBots.length; i++) {
        if (botID == userSubscribedBots[i].BOT_ID) {
            console.log("### MATCH FOUND : userSubscribedBots:" + userSubscribedBots[i].BOT_ID + " botID:" +botID);
             return 1;
        }
    }
    return userSubscriptionStatus;
};

var createTableRows = (userSubscriptionStatus, tokenIcon, botId, botName, tokenNetProfit, baseNetprofit, successRate, noOfTrades, profitPerMonth, avgTimePerTrade, totalNoOfDays, appTS) => {
    //const tradeActionText = tradeAction == 'B' ? 'Bought' : tradeAction == 'S' ? 'Sold' : tradeAction;
    const tokenNetProfitColorCode = tokenNetProfit > 0 ? 'success' : 'danger';
    const tokanNetprofitTrend = tokenNetProfit > 0 ? 'trending-up' : 'trending-down';

    const baseNetProfitColorCode = baseNetprofit > 0 ? 'success' : 'danger';
    const baseNetprofitTrend = baseNetprofit > 0 ? 'trending-up' : 'trending-down';

    const successRateColorCode = successRate > 40 ? 'text-success' : 'text-danger';
    const successRateTrend = successRate > 40 ? 'caret-up-fill' : 'caret-down-fill';

    const recommendateRating  = profitPerMonth > 10 ? 'bi-patch-check-fill' : '';
    const profitPerMonthColor  = profitPerMonth > 10 ? 'success' : 'danger';
    const profitPerMonthTrend  = profitPerMonth > 10 ? 'trending-up' : 'trending-down';

    const userSubscriptionStatusDesign = userSubscriptionStatus == 1 ? "Active" : '';
    const userSubscriptionStatusColor = userSubscriptionStatus == 1 ? 'success' : 'danger';

    //const badgeTheme = (tradeAction == 'B') ? 'success' : 'secondary';
    const row = document.createElement('tr');

    //<span class='badge bg-${tokenNetProfitColorCode}-transparent fs-12 rounded-pill'>${tokenNetProfit}%<i class='ti ti-${tokanNetprofitTrend} ms-1'></i></span></td>
    //<span class='badge bg-${baseNetProfitColorCode}-transparent fs-12 rounded-pill'>${baseNetprofit}%<i class='ti ti-${baseNetprofitTrend} ms-1'></i></span>
    //<div class='progress progress-sm' role='progressbar' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'><div class='progress-bar bg-primary' style='width: ${successRate}%'></div></div><span class='fs-11'>${successRate}%<i class='bi bi-${successRateTrend} ms-1 ${successRateColorCode}'></i></span>
    //<span class='badge bg-primary ms-0 d-offline-block fs-12 '>5</span>
    //<span class='badge bg-${userSubscriptionStatusColor} ms-0 d-offline-block fs-12 '>${userSubscriptionStatusDesign}</span>

    row.innerHTML = `<td style = 'font-size: 12px;'>${botId} <span class="badge bg-${userSubscriptionStatusColor}-transparent">${userSubscriptionStatusDesign}</span></td>
    <td style = 'font-size: 12px;'><div class="lh-1 d-flex align-items-center"><span class="avatar avatar-xs avatar-rounded"><img src='${tokenIcon}' alt=""></span><span>-  <a href='javascript:void(0);' onclick='navigateBotStats(${botId}, ${userSubscriptionStatus})' class='fs-12 ms-auto mt-auto'>${botName}</a></span></div></td>
    <td style = 'font-size: 12px;'>${totalNoOfDays} days</td>
    <td style = 'font-size: 12px;'><span class="text-${tokenNetProfitColorCode}"><i class="ti ti-${tokanNetprofitTrend} me-1 align-middle"></i>${tokenNetProfit}%</span></td>    
    <td style = 'font-size: 12px;'><span class="text-${baseNetProfitColorCode}"><i class="ti ti-${baseNetprofitTrend} me-1 align-middle"></i>${baseNetprofit}%</span></td>
    <td style = 'font-size: 12px;'><div class="progress progress-xs progress-custom progress-animate" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar bg-primary" style="width: ${successRate}%"></div></div><span class='fs-11'>${successRate}%<i class='bi bi-${successRateTrend} ms-1 ${successRateColorCode}'></i></span></td>
    <td style = 'font-size: 12px;'>${noOfTrades}</td>
    <td style = 'font-size: 14px;'> <span class="text-${profitPerMonthColor}"><i class="ti ti-${profitPerMonthTrend} me-1 align-middle"></i>${profitPerMonth}%</span><i class="bi ${recommendateRating} text-success ms-1 fs-21"></i></td>
    <td style = 'font-size: 12px;'>${avgTimePerTrade}</td>
    <td style = 'font-size: 12px;'>${appTS}</td>`;

    const tbody = document.getElementById("botList-tbody");
    tbody.appendChild(row);
}

var navigateBotStats = (botId, userSubscriptionStatus) => {
    localStorage.setItem('botId', botId);
    localStorage.setItem('userSubscriptionStatus', userSubscriptionStatus);
    location.href = "bot-stats.html";
};


var applyResponsiveness = (arrSize) => {
    $('#botsListResponsiveDataTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
        },
        order: [[3, 'desc']],   //Soring by EventID decensing order
        "pageLength": arrSize,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ], dom: 'flirtBlp' //'Bfrtip'
    });
};
//******************************************* */