var delayInMS = 3000;
var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';
var subscribedBots = [];

function truncate (num, places) {
  return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
}

var loadBotSummaryData = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
    subscribedBots = (JSON.parse(localStorage.getItem('subscribedBots'))!=undefined && JSON.parse(localStorage.getItem('subscribedBots'))!=null)?JSON.parse(localStorage.getItem('subscribedBots')):[];
    const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;
    if(profile.ROLE_CODE == 99){
        document.getElementById('admin-menu').style.display = 'block';
    }
    if(profile.ROLE_CODE <= 10){
        document.getElementById('equity-options-menu').style.display = 'none';
        document.getElementById('dashboard-menu-count').innerHTML = 1;
    }

    const authToken = localStorage.getItem('authToken');
    
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

                let tierLimit = localStorage.getItem('role_code');
                let activeBots = localStorage.getItem('active_bots_count');
                let inactiveBots = localStorage.getItem('inactive_bots_count');
                let subscribeRequests = localStorage.getItem('requests_subscribe_count');
                let unsubscribeRequests = localStorage.getItem('requests_unsubscribe_count'); //TODO: this gives no.of unsubscribe requests in workflow
                let totalPendingApprovalReqCount = subscribeRequests + unsubscribeRequests;
                let remainingLimit = (tierLimit-activeBots-subscribeRequests);

                //Fill top boxes
                document.getElementById("field-tier-limit").innerHTML = tierLimit;
                document.getElementById("field-active-bots").innerHTML = activeBots; 
                document.getElementById("SubscribedLbl").innerHTML = "Subscribed [Inactive:" + inactiveBots+"]";
                document.getElementById("pendingWorkflowLbl").innerHTML = "Pending Approval [Sub:"+ subscribeRequests + " Unsub:" +unsubscribeRequests +"]";
                document.getElementById("field-pending-requests").innerHTML = Number(totalPendingApprovalReqCount);
                document.getElementById("field-remaining-limit").innerHTML = Number(remainingLimit);

                var userSubscriptionStatus = 0;
                var userSubscriptionStatusActiveInactive = 0;
                for (let i = 0; i < botsSummary.length; i++) {
                    userSubscriptionStatus  = findUserSubscriptionStatus(userSubscribedBots, botsSummary[i].BOT_ID);
                    userSubscriptionStatusActiveInactive  = findUserSubscriptionStatusActiveOrInactive(userSubscribedBots, botsSummary[i].BOT_ID);
                    var avgTimePerTrade = botsSummary[i].AVG_TIME_PER_TRADE < 1 ? truncate(botsSummary[i].AVG_TIME_PER_TRADE*24,2).toFixed(1) + " hours" : truncate(botsSummary[i].AVG_TIME_PER_TRADE,2).toFixed(1) +  " days";        
                    createTableRows(
                        userSubscriptionStatus,
                        userSubscriptionStatusActiveInactive,
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
                        botsSummary[i].APP_TS_FORMATED,
                        botsSummary[i].AVG_USD_PROFIT_PERCENT
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
            //console.log("### MATCH FOUND : userSubscribedBots:" + userSubscribedBots[i].BOT_ID + " botID:" +botID);
            return 1;
        }
    }
    return userSubscriptionStatus;
};


// if the user's BOT ID matches then take BOT-STATUS : if 0 then show Inactive, otherwise Active
var findUserSubscriptionStatusActiveOrInactive = (userSubscribedBots, botID) => {
    let userSubscriptionStatusActiveInactive = -1; //means Subscribe 
    for (let i = 0; i < userSubscribedBots.length; i++) {
        if (botID == userSubscribedBots[i].BOT_ID) {
            if(userSubscribedBots[i].SUBSCRIBE_STATUS == 0) {
                //console.log("$$$ MATCH FOUND : " + userSubscribedBots[i].BOT_ID + " botID:" +botID + " [INACTIVE]");
                return userSubscribedBots[i].SUBSCRIBE_STATUS;
            }
            else {
                //console.log("$$$ MATCH FOUND : " + userSubscribedBots[i].BOT_ID + " botID:" +botID + " [ACTIVE]");
                return userSubscribedBots[i].SUBSCRIBE_STATUS;
            }
        }
    }
    //console.log("$$$ MATCH NOT FOUND :  botID:" +botID + " [SUBSCRIBE]");
    return userSubscriptionStatusActiveInactive;
};

var createTableRows = (userSubscriptionStatus, userSubscriptionStatusActiveInactive, tokenIcon, botId, botName, tokenNetProfit, baseNetprofit, successRate, noOfTrades, profitPerMonth, avgTimePerTrade, totalNoOfDays, appTS, avgUsdProfitPercentage) => {
    //const tradeActionText = tradeAction == 'B' ? 'Bought' : tradeAction == 'S' ? 'Sold' : tradeAction;
    const tokenNetProfitColorCode = tokenNetProfit > 0 ? 'success' : 'danger';
    const tokanNetprofitTrend = tokenNetProfit > 0 ? 'trending-up' : 'trending-down';

    const baseNetProfitColorCode = baseNetprofit > 0 ? 'success' : 'danger';
    const baseNetprofitTrend = baseNetprofit > 0 ? 'trending-up' : 'trending-down';

    const usdAvgNetProfitColorCode = avgUsdProfitPercentage > 0 ? 'success' : 'danger';
    const usdAvgNetprofitTrend = avgUsdProfitPercentage > 0 ? 'trending-up' : 'trending-down';

    const successRateColorCode = successRate > 40 ? 'text-success' : 'text-danger';
    const successRateTrend = successRate > 40 ? 'caret-up-fill' : 'caret-down-fill';

    const recommendateRating  = profitPerMonth > 10 ? 'bi-patch-check-fill' : '';
    const profitPerMonthColor  = profitPerMonth > 0 ? 'success' : 'danger';
    const profitPerMonthTrend  = profitPerMonth > 0 ? 'trending-up' : 'trending-down';

    //console.log("### userSubscriptionStatusActiveInactive::", userSubscriptionStatusActiveInactive);
    const userSubscriptionStatusDesign = userSubscriptionStatusActiveInactive == -1 ? 'Subscribe' : userSubscriptionStatusActiveInactive >= 1 ? 'Active' : 'Inactive';
    const userSubscriptionStatusColor = userSubscriptionStatusActiveInactive == -1 ? 'primary' : userSubscriptionStatusActiveInactive >= 1 ? 'secondary' : 'info';
    const userSubscriptionStatusIcon = userSubscriptionStatusActiveInactive == -1 ? '<i class="ti ti-packge-import fs-18"></i>' : userSubscriptionStatusActiveInactive >= 1 ? '<i class="ti ti-rocket fs-18"></i>' : '<i class="ti ti-rocket fs-18"></i>';


    //Weightage score calculation
    let recommendationScore = 0;
    let tokenWeightageFactor = 0.57;
    let sucessrateWeightageFactor = 0.1;
    let baseWeightageFactor = 0.2;
    let usdWeightageFactor = 0.1;
    let durationWeightageFactor = 0.03;
    if(totalNoOfDays <=90 ) {
        tokenWeightageFactor = 0.57;
        sucessrateWeightageFactor = 0.1;
        baseWeightageFactor = 0.2;
        usdWeightageFactor = 0.1;
        durationWeightageFactor = 0.03;      
    } else if (totalNoOfDays >= 91 && totalNoOfDays <= 180) {
        tokenWeightageFactor = 0.54;
        sucessrateWeightageFactor = 0.1;
        baseWeightageFactor = 0.2;
        usdWeightageFactor = 0.1;
        durationWeightageFactor = 0.06;    
    } else if (totalNoOfDays >= 181) {
        tokenWeightageFactor = 0.5;
        sucessrateWeightageFactor = 0.1;
        baseWeightageFactor = 0.2;
        usdWeightageFactor = 0.1;
        durationWeightageFactor = 0.1;    
    }

    recommendationScore = ((tokenNetProfit*tokenWeightageFactor) + (baseNetprofit*baseWeightageFactor) + (avgUsdProfitPercentage*usdWeightageFactor) + (totalNoOfDays*durationWeightageFactor) + (successRate*sucessrateWeightageFactor))/noOfTrades;
    let recommendationScoreColorCode = recommendationScore > 0 ? 'primary' : 'secondary';
    let recommendationTick = "";
    let recomendationMessage = '<i class="bi bi-patch-exclamation-fill text-info ms-1 fs-18">Keep a watch, it may move either way</i>';
    if(recommendationScore >= 1.49) {
        recommendationTick = '<i class="bi bi-patch-check-fill text-success ms-1 fs-18"></i>';
        recomendationMessage = '<i class="bi bi-patch-check-fill text-success ms-1 fs-18">Overall looks good</i>';
    } else if (recommendationScore <=0.99) {
        recommendationTick = '<i class="bi bi-patch-exclamation-fill text-danger ms-1 fs-18"></i>';
        recomendationMessage = '<i class="bi bi-patch-exclamation-fill text-danger ms-1 fs-18">Not moving well, take a decision</i>';
    } 

    //const badgeTheme = (tradeAction == 'B') ? 'success' : 'secondary';
    const row = document.createElement('tr');

    //<span class='badge bg-${tokenNetProfitColorCode}-transparent fs-12 rounded-pill'>${tokenNetProfit}%<i class='ti ti-${tokanNetprofitTrend} ms-1'></i></span></td>
    //<span class='badge bg-${baseNetProfitColorCode}-transparent fs-12 rounded-pill'>${baseNetprofit}%<i class='ti ti-${baseNetprofitTrend} ms-1'></i></span>
    //<div class='progress progress-sm' role='progressbar' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'><div class='progress-bar bg-primary' style='width: ${successRate}%'></div></div><span class='fs-11'>${successRate}%<i class='bi bi-${successRateTrend} ms-1 ${successRateColorCode}'></i></span>
    //<span class='badge bg-primary ms-0 d-offline-block fs-12 '>5</span>
    //<span class='badge bg-${userSubscriptionStatusColor} ms-0 d-offline-block fs-12 '>${userSubscriptionStatusDesign}</span>

    row.innerHTML = `<td style = 'font-size: 12px;'><span class='badge bg-${userSubscriptionStatusColor}-transparent rounded-pill'>${userSubscriptionStatusIcon}<a href='javascript:navigateBotStats(${botId}, ${userSubscriptionStatusActiveInactive});' class='fs-12 ms-auto mt-auto'>${userSubscriptionStatusDesign}</a></span><span>${botId}</span></td>
    <td style = 'font-size: 12px;'><div class='lh-1 d-flex align-items-center'><span class='avatar avatar-xs avatar-rounded'><img src='${tokenIcon}'></span><span>-  <a href='javascript:navigateBotStats(${botId}, ${userSubscriptionStatusActiveInactive})' class='fs-12 ms-auto mt-auto'>${botName}</a></span></div></td>
    <td style = 'font-size: 12px;'>${totalNoOfDays.toFixed(0)}</td>
    <td style = 'font-size: 12px;'><span class='text-${tokenNetProfitColorCode}'><i class='ti ti-${tokanNetprofitTrend} me-1 align-middle'></i>${tokenNetProfit.toFixed(0)}%</span></td>    
    <td style = 'font-size: 12px;'><span class='text-${baseNetProfitColorCode}'><i class='ti ti-${baseNetprofitTrend} me-1 align-middle'></i>${baseNetprofit.toFixed(0)}%</span></td>
    <td style = 'font-size: 12px;'><span class='text-${usdAvgNetProfitColorCode}'><i class='ti ti-${usdAvgNetprofitTrend} me-1 align-middle'></i>${avgUsdProfitPercentage.toFixed(0)}%</span></td>
    <td style = 'font-size: 14px;'> <span class='badge bg-${recommendationScoreColorCode}-transparent fs-12 rounded-pill'>${recommendationScore.toFixed(2)} ${recommendationTick}</span></td>
    <td style = 'font-size: 12px;'><div class='progress progress-xs progress-custom progress-animate' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100'><div class='progress-bar bg-primary' style='width: ${successRate.toFixed(0)}%'></div></div><span class='fs-11'>${successRate}%<i class='bi bi-${successRateTrend} ms-1 ${successRateColorCode}'></i></span></td>
    <td style = 'font-size: 12px;'>${noOfTrades}</td>
    <td style = 'font-size: 12px;'>${avgTimePerTrade}</td>
    <td style = 'font-size: 12px;'>${appTS}</td>`;

    const tbody = document.getElementById("botList-tbody");
    tbody.appendChild(row);
}

var navigateBotStats = (botId, userSubscriptionStatusActiveInactive) => {
    localStorage.setItem('botId', botId);
    //console.log("==========> botId::" +botId + "  userSubscriptionStatusActiveInactive::" + userSubscriptionStatusActiveInactive);
    if (userSubscriptionStatusActiveInactive == -1 || userSubscriptionStatusActiveInactive == 0) {  // when inactive or subscribe -- it will be PROCEED button to enable subscribe so 0
        localStorage.setItem('userSubscriptionStatus', 0);
    } else if (userSubscriptionStatusActiveInactive >= 1)  { // when active -- it will be UNSUBSCRIBE button to enable UNSUBSCRIBE so 1
        localStorage.setItem('userSubscriptionStatus', 1);
    }
    location.href = "bot-stats.html";
};

var applyResponsiveness = (arrSize) => {
    $('#botsListResponsiveDataTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
        },
        order: [[6, 'desc']],   //Soring by EventID decensing order
        "pageLength": arrSize,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ], dom: 'flirtBlp' //'Bfrtip'
    });
};
//******************************************* */