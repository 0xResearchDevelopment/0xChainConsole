var delayInMS = 3000;

var signUp = async () => {

    const myBody = {
        "name_first": document.getElementById("signup-fname").value,
        "name_last": document.getElementById("signup-lname").value,
        "email": document.getElementById("signup-email").value,
        "password": document.getElementById("signup-password").value
    };
    console.log(myBody);
    const response = await fetch('https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myBody)
    });

    const myJson = await response.json();
    if (myJson.code == 422) {
        showToastAlerts('signup-error','alert-error-msg',JSON.parse(JSON.stringify(myJson.errors.msg)));
        document.getElementById("signup-fname").value = '';
        document.getElementById("signup-lname").value = '';
        document.getElementById("signup-email").value = '';
        document.getElementById("signup-password").value = '';
    }
    else if (myJson.code == 201) {
        showToastAlerts('signup-success','alert-success-msg',JSON.parse(JSON.stringify(myJson.message)));
        sessionStorage.setItem('verficationToken', myJson.results.verification.token);
        setTimeout(()=> {
            window.location.href = "sign-up-verification.html";
         }
         ,delayInMS);
    }

    /*await axios
    .post(
        'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/register',
        {
            name_first:document.getElementById("signup-fname").value,
            name_last:document.getElementById("signup-lname").value,
            email:document.getElementById("signup-email").value,
            password:document.getElementById("signup-password").value
        },
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    )
    .then(res => {
        console.log(res);
        if(res.status == 201){
            alert(JSON.stringify(myJson.message)); 
            sessionStorage.setItem('verficationToken', myJson.results.verification.token);
            location.href = "sign-up-verification.html";
        }
    })
    .catch(err => {
        console.log(err.response);
        if(err.response.status == 422) {
            alert(err.response.data.errors);
        }
    });*/

};

var verifyAccount = () => {
    var verifyAccountUrl = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/verify/' + sessionStorage.getItem('verficationToken');

    axios.get(verifyAccountUrl)
        .then(res => {
            console.log(res);
            if (res.status == 200) {
                showToastAlerts('verification-success','alert-success-msg',res.data.message);
                sessionStorage.removeItem('verficationToken');
                setTimeout(()=> {
                    window.location.href = "sign-in-cover.html";
                 }
                 ,delayInMS);

            }
        }).catch(err => {
            console.log(err, err.response);
            alert(err);
        })
};

var signIn = () => {
    axios
        .post(
            'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/login',
            {
                email: document.getElementById("signin-username").value,
                password: document.getElementById("signin-password").value,
            }
        )
        .then(res => {
            console.log("res: " + res);
            if (res.status == 200) {
                showToastAlerts('signin-success','alert-success-msg',res.data.message);
                console.log(res.data.results.token);
                localStorage.setItem('authToken', res.data.results.token);
                setTimeout(()=> {
                    window.location.href='index.html';
                 }
                 ,delayInMS);
            }
        })
        .catch(err => {
            console.log(err.response);
            if (err.response.status == 422) {
                showToastAlerts('signin-error','alert-error-msg',err.response.data.errors);
            }
        });
};

var getUserProfile = () => {
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

                const profile = (res.data.profile!=undefined && res.data.profile!=null)?res.data.profile:{};
                const subscribtionStatsSummary = (res.data.subscribtionStatsSummary!=undefined && res.data.subscribtionStatsSummary!=null)?res.data.subscribtionStatsSummary:{};
                const subscribedBots = (res.data.subscribedBots!=undefined && res.data.subscribedBots!=null)?res.data.subscribedBots:[];
                const netProfitHourly = (res.data.netprofitHourlyData!=undefined && res.data.netprofitHourlyData!=null)?res.data.netprofitHourlyData:[];
                const netProfitDaily = (res.data.netprofitDailyData!=undefined && res.data.netprofitDailyData!=null)?res.data.netprofitDailyData:[];
                const netProfitMonthly = (res.data.netprofitMonthlyData!=undefined && res.data.netprofitMonthlyData!=null)?res.data.netprofitMonthlyData:[];

                var username = profile.NAME_FIRST + " " + profile.NAME_LAST;
                console.log("# inside getUserProfile - res - username:", username);
                document.getElementById("header-user-name").innerHTML = username;
                document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;

                localStorage.setItem('profileObj', JSON.stringify(profile)); 
                localStorage.setItem('statsSummaryObj', JSON.stringify(subscribtionStatsSummary));
                localStorage.setItem('subscribedBotsArr', JSON.stringify(subscribedBots));
                localStorage.setItem('netProfitHourlyArr', JSON.stringify(netProfitHourly)); 
                localStorage.setItem('netProfitDailyArr', JSON.stringify(netProfitDaily));
                localStorage.setItem('netProfitMonthlyArr', JSON.stringify(netProfitMonthly));

                if(window.location.pathname == '/index.html' ){
                    for (let i = 0; i < subscribedBots.length; i++) {
                        createDashboardBoxes(subscribedBots[i].TRADE_SYMBOL,subscribedBots[i].LAST_TRADE_QTY,subscribedBots[i].TOKEN_NETPROFIT,
                                                subscribedBots[i].BOT_TOKEN_ICON,subscribedBots[i].BOT_BASE_ICON,subscribedBots[i].TOTAL_NUMOF_TRADES,subscribedBots[i].LAST_TRADED_DATE,
                                                subscribedBots[i].TOKEN_ENTRY_AMOUNT, subscribedBots[i].TRADE_TIMEFRAME,i);                      
                    }
    
                    document.getElementById("as-of-summary").innerHTML = subscribtionStatsSummary.AS_OF_SUMMARY;
                    document.getElementById("total-trades").innerHTML = subscribtionStatsSummary.SUM_USER_SUB_TRADES;
                    document.getElementById("active-bots").innerHTML = subscribtionStatsSummary.ACTIVE_BOTS;
    
                    const recentActivities = (res.data.userRecentActivities!=undefined)?res.data.userRecentActivities:[];
                    //localStorage.setItem('subscribedBotsArr', JSON.stringify(subscribedBots));
                    for (let i = 0; i < recentActivities.length; i++) {
                        populateRecentActivities(recentActivities[i].DESC,recentActivities[i].MODULE,
                                            recentActivities[i].ACTIVITY_TS,'info');                      
                    }

                    //generateSummary(subscribtionStatsSummary.AVG_USER_SUB_NETPROFIT);
                    //generateStatistics(netProfitHourly);
                }
                else if(window.location.pathname == '/profile.html'){
                    document.getElementById("profile-photo").src = profile.PROFILE_PHOTO;
                    document.getElementById("profile-name").innerHTML = username;
                    document.getElementById("profile-email").innerHTML = profile.EMAIL_ID;     
                    document.getElementById("primary-phone").innerHTML = (profile.PHONE_PRIMARY != null && profile.PHONE_PRIMARY != undefined) ? profile.PHONE_PRIMARY : "Primary-Phone";  
                    document.getElementById("profile-city").innerHTML = (profile.CITY != null && profile.CITY != undefined) ? profile.CITY : "City"; 
                    document.getElementById("profile-state").innerHTML = (profile.STATE != null && profile.STATE != undefined) ? profile.STATE : "State";  
                    document.getElementById("profile-country").innerHTML = (profile.COUNTRY != null && profile.COUNTRY != undefined) ? profile.COUNTRY : "Country";
                    document.getElementById("last-updated-on").innerHTML = profile.UPDATED_TS;
                    
                    const profileStatus = (profile.ROLE_CODE > -2) ? 100: (profile.ROLE_CODE == -2) ? 50 : 0;
                    showProfileStatus(profileStatus);
                }
            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            location.href = "sign-in-cover.html";
        })
}

var createDashboardBoxes = (tradeSymbol,lastTradeQty,netProfit,tokenIconUrl, baseIconUrl,totalNoOfTrades,lastTradedDate,tokenEntryAmount,tradeTimeframe,index) => {
    const colDiv = document.createElement('div');
    colDiv.id = 'col-div';
    colDiv.setAttribute("class", "col card-background");

    const cardDiv = document.createElement('div');
    cardDiv.id = 'card-div';
    cardDiv.setAttribute("class", "card custom-card");

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.id = 'card-body-div';
    cardBodyDiv.setAttribute("class", "card-body");

    const flex1Div = document.createElement('div');
    flex1Div.id = 'flex1-div';
    flex1Div.setAttribute("class", "d-flex");
    
    const flex1Child1Div = document.createElement('div');
    flex1Child1Div.id = 'flex1-child1-div';
    flex1Child1Div.innerHTML = `<p class="fw-medium mb-1 text-muted">${tradeSymbol}_${tradeTimeframe}</p><h3 class="mb-0">${lastTradeQty}</h3>`;

    const flex1Child2Div = document.createElement('div');
    flex1Child2Div.id = 'flex1-child2-div';
    flex1Child2Div.setAttribute("class", "avatar avatar-sm br-4 ms-auto");
    flex1Child2Div.innerHTML = `<img src="${tokenIconUrl}" class="fs-20"><img src="${baseIconUrl}" class="fs-20">`;

    const flex2Div = document.createElement('div');
    flex2Div.id = 'flex2-div';
    flex2Div.setAttribute("class", "d-flex mt-2");
    flex2Div.innerHTML = `<p class="fw-medium mb-1 text-muted">Trades : ${totalNoOfTrades}</p>`

    const flex5Div = document.createElement('div');
    flex5Div.id = 'flex5-div';
    flex5Div.setAttribute("class", "d-flex mt-2");
    flex5Div.innerHTML = `<p class="mb-0 fs-10 text-mute"><span>As of : ${lastTradedDate}</span></p>`

    const flex3Div = document.createElement('div');
    flex3Div.id = 'flex3-div';
    flex3Div.setAttribute("class", "d-flex");
    flex3Div.innerHTML = `<p class="fw-medium mb-1 text-muted">Invested : ${tokenEntryAmount}</p>`

    const flex4Div = document.createElement('div');
    flex4Div.id = 'flex4-div';
    flex4Div.setAttribute("class", "d-flex mt-2");
    if(netProfit>0){
        flex4Div.innerHTML = `<span class="badge bg-success-transparent fs-14 rounded-pill">${netProfit}% <i class="ti ti-trending-up ms-1"></i></span>
        <a href="javascript:void(0);" onclick="navigateTokenStats(${index})" class="text-muted fs-11 ms-auto text-decoration-underline mt-auto">more</a>`
    }
    else{
        flex4Div.innerHTML = `<span class="badge bg-danger-transparent fs-14 rounded-pill">${netProfit}% <i class="ti ti-trending-down ms-1"></i></span>
        <a href="javascript:void(0);" onclick="navigateTokenStats(${index})" class="text-muted fs-11 ms-auto text-decoration-underline mt-auto">more</a>`
    }

    const containerDiv = document.getElementById("dashboard-box-container");
    containerDiv.appendChild(colDiv);
    colDiv.appendChild(cardDiv);
    cardDiv.appendChild(cardBodyDiv);
    cardBodyDiv.appendChild(flex1Div);
    flex1Div.appendChild(flex1Child1Div);
    flex1Div.appendChild(flex1Child2Div);
    cardBodyDiv.appendChild(flex5Div);
    cardBodyDiv.appendChild(flex2Div);
    cardBodyDiv.appendChild(flex3Div);
    cardBodyDiv.appendChild(flex4Div);
}

var navigateTokenStats = (index) => {
    const subscribedBots = JSON.parse(localStorage.getItem('subscribedBotsArr'));
    localStorage.setItem('selectedBotObj', JSON.stringify(subscribedBots[index]));
    location.href = "token-stats.html";
};

var showToastAlerts = (divId,spanId,msg) => {
    document.getElementById(spanId).innerHTML = msg;
    const middlecentertoastExample = document.getElementById(divId);
    const toast = new bootstrap.Toast(middlecentertoastExample,{delay: delayInMS});
	toast.show();
}

var getTokenStats = () => {
    const profileObj = JSON.parse(localStorage.getItem('profileObj'));
    var username = profileObj.NAME_FIRST + " " + profileObj.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;

    const selectedBot = JSON.parse(localStorage.getItem('selectedBotObj'));

    document.getElementById("bot-name").innerHTML = selectedBot.TRADE_SYMBOL;
    document.getElementById("base-icon").src = selectedBot.BOT_BASE_ICON;
    document.getElementById("token-icon").src = selectedBot.BOT_TOKEN_ICON;
    document.getElementById("time-frame").innerHTML = selectedBot.BOT_NAME;
    document.getElementById("total-trades").innerHTML = selectedBot.TOTAL_NUMOF_TRADES;
    document.getElementById("net-profit").innerHTML = selectedBot.TOKEN_NETPROFIT;
    document.getElementById("traded-date1").innerHTML = selectedBot.LAST_TRADED_DATE;

    document.getElementById("investment").innerHTML = selectedBot.TOKEN_ENTRY_AMOUNT;
    document.getElementById("subscribed-on").innerHTML = selectedBot.SUBSCRIBED_ON;
    document.getElementById("traded-qty").innerHTML = selectedBot.LAST_TRADE_QTY;
    document.getElementById("traded-date2").innerHTML = selectedBot.LAST_TRADED_DATE;
};

var updateTier = (code) => {
    console.log("### Inside updateTier:");
    const authToken = localStorage.getItem('authToken');
    axios.post(
            'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/upgradeTier',
            {
                newPlan: code
            },
            {
            headers: {
                Authorization: `Bearer ${authToken}`
            }            
        })
        .then(res => {
            console.log("### Inside updateTier:res: " + res);
            if (res.status == 200) {
                showToastAlerts('signin-success','alert-success-msg',res.data.message);
                console.log("### Inside updateTier:res.message:", res.data.message);
                setTimeout(()=> {
                    window.location.href='index.html';
                 }
                 ,delayInMS);
            }
        })
        .catch(err => {
            console.log("### Inside updateTier:err.response", err.response.data.message);
            showToastAlerts('signin-error','alert-error-msg',err.response.data.message);
            if(err.response.status == 401) {
                setTimeout(()=> {
                    window.location.href='sign-in-cover.html';
                 }
                 ,delayInMS);
            }
        });
};

var populateRecentActivities = (description,module,timestamp,theme) => {
    
    const list = document.createElement('li');
    list.id = 'activity-li';
    list.innerHTML = `<div class="">
                            <i class="task-icon bg-${theme}"></i>
                            <h6 class="fw-semibold mb-0">${description}</h6>
                            <div
                                class="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div>
                                    <span class="fs-12 text-muted">${module}
                                        <a href="javascript:void(0)"
                                            class="fw-semibold text-${description}"></a></span>
                                </div>
                                <div class="min-w-fit-content ms-2 text-end">

                                    <p class="mb-0 text-muted fs-11">${timestamp}</p>
                                </div>
                            </div>
                        </div>`

    const ulist = document.getElementById("activities-ul");
    ulist.appendChild(list);
}

var showProfileStatus = (percentCompletion) => {
    const profileStatusDiv = document.createElement('div');
    profileStatusDiv.innerHTML = `<p class="fs-15 mb-2 fw-semibold">Profile Status :</p>
                                  <p class="fw-semibold mb-2">Profile ${percentCompletion}% completed</p>
                                  <div class="progress progress-sm progress-animate ">
                                    <div class="progress-bar bg-success  ronded-1" role="progressbar" aria-valuenow="${percentCompletion}" aria-valuemin="0" aria-valuemax="100" style="width: ${percentCompletion}%"></div>
                                  </div>`

    const profileStatusContainer = document.getElementById("profile-status");
    profileStatusContainer.appendChild(profileStatusDiv);
}

/* var generateSummary = (avgNetProfit) => {
    var chart3 = new ApexCharts(document.querySelector("#avgNetProfit"), pieChartData);
    chart3.render();
    chart3.updateOptions({
        colors: ["rgba(" + myVarVal + ", 0.95)"],
        series: [avgNetProfit]
    });
}

var generateStatistics = (hourlyData) => {
    var graphData = formatGraphData(hourlyData);
    inputNetprofit = graphData.netProfitArray;
    inputXAxisData = graphData.xAxisDataArray;

    updateChartData(inputNetprofit,inputXAxisData);
} */



var signout = () => {
    console.log("### Inside signout:");
    const authToken = localStorage.getItem('authToken');
    axios.post(
            'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/logout',{},
            {
            headers: {
                Authorization: `Bearer ${authToken}`
            }            
        })
        .then(res => {
            console.log("### Inside signout:res: " + res);
            localStorage.clear();
            window.location.href='sign-in-cover.html';
        });
};
