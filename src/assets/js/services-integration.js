var delayInMS = 3000;

var signUp = async () => {

    var accountOtpGenerated = Math.floor(1000 + Math.random() * 9000).toString();
    //console.log("### accountOtpGenerated:", accountOtpGenerated);
    sessionStorage.setItem('otpCode', accountOtpGenerated);

    const myBody = {
        "name_first": document.getElementById("signup-fname").value,
        "name_last": document.getElementById("signup-lname").value,
        "email": document.getElementById("signup-email").value,
        "password": document.getElementById("signup-password").value,
        "accountOtpGenerated" : accountOtpGenerated
    };
    //console.log("## signUp-request-object:",myBody);
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


var verifyOtp = () => {
    var otpCode = sessionStorage.getItem('otpCode');
    console.log("## inside verify - otpCode:", otpCode);

    var digit1 = document.getElementById("one").value;
    var digit2 = document.getElementById("two").value;
    var digit3 = document.getElementById("three").value;
    var digit4 = document.getElementById("four").value;
    digit1 = digit1.length == 1 ? digit1 : 0;
    digit2 = digit2.length == 1 ? digit2 : 0;
    digit3 = digit3.length == 1 ? digit3 : 0;
    digit4 = digit4.length == 1 ? digit4 : 0;
    var userEnteredCode = digit1+digit2+digit3+digit4;
    console.log("## inside verify - userEnteredCode:", userEnteredCode);
    if(userEnteredCode == otpCode) {
        showToastAlerts('verification-success','alert-success-msg',"OTP validation successful");
        setTimeout(() => {
            verifyAccount();
        }, delayInMS);
        //alert("valid otp");
    } else {
        //alert("invalid otp");
        showToastAlerts('verification-error','alert-error-msg',"Invalid OTP");
    }    
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
                 },delayInMS);

                }
            }).catch(err => {
                console.log(err, err.response);
                alert(err);
        });
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

                if(profile.ROLE_CODE == -2){
                    location.href = "profile.html";
                }
                else if(profile.ROLE_CODE == -1){
                    location.href = "pricing.html";
                }
                else if(profile.ROLE_CODE < -2 && profile.ROLE_CODE > 5){
                    location.href = "sign-in-cover.html";
                }

                for (let i = 0; i < subscribedBots.length; i++) {
                    createDashboardBoxes(subscribedBots[i].TRADE_SYMBOL,subscribedBots[i].LAST_TRADE_QTY,subscribedBots[i].TOKEN_NETPROFIT,
                                            subscribedBots[i].BOT_TOKEN_ICON,subscribedBots[i].BOT_BASE_ICON,subscribedBots[i].TOTAL_NUMOF_TRADES,subscribedBots[i].LAST_TRADED_DATE,
                                            subscribedBots[i].TOKEN_ENTRY_AMOUNT, subscribedBots[i].TRADE_TIMEFRAME,i);                      
                }

                document.getElementById("as-of-summary").innerHTML = subscribtionStatsSummary.AS_OF_SUMMARY;
                document.getElementById("total-trades").innerHTML = subscribtionStatsSummary.SUM_USER_SUB_TRADES;
                document.getElementById("active-bots").innerHTML = subscribtionStatsSummary.ACTIVE_BOTS;

                const theme = new Map([
                    ["PROFILE", 'success'],
                    ["SUBSCRIBE", 'secondary'],
                    ["BOTS", 'secondary'],
                    ["NOTIFICATION", 'info']
                    //["BOTS", 'warning']
                  ]);

                const recentActivities = (res.data.userRecentActivities!=undefined)?res.data.userRecentActivities:[];
                for (let i = 0; i < recentActivities.length; i++) {
                    populateRecentActivities(recentActivities[i].DESC,recentActivities[i].MODULE,
                                        recentActivities[i].ACTIVITY_TS,theme.get(recentActivities[i].MODULE));                      
                }

                //generateSummary(subscribtionStatsSummary.AVG_USER_SUB_NETPROFIT);
                //generateStatistics(netProfitHourly);
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

var updateProfilePage = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
    const subscribedBots = JSON.parse(localStorage.getItem('subscribedBotsArr'));

    const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;
    document.getElementById("profile-header-photo").src = profile.PROFILE_PHOTO;
    document.getElementById("profile-header-name").innerHTML = username;
    document.getElementById("profile-header-email").innerHTML = profile.EMAIL_ID;     
    document.getElementById("profile-header-phone").innerHTML = (profile.PHONE_PRIMARY != null && profile.PHONE_PRIMARY != undefined) ? profile.PHONE_PRIMARY : "Primary-Phone";  
    document.getElementById("profile-header-city").innerHTML = (profile.CITY != null && profile.CITY != undefined) ? profile.CITY : "City"; 
    document.getElementById("profile-header-state").innerHTML = (profile.STATE != null && profile.STATE != undefined) ? profile.STATE : "State";  
    document.getElementById("profile-header-country").innerHTML = (profile.COUNTRY != null && profile.COUNTRY != undefined) ? profile.COUNTRY : "Country";
    document.getElementById("profile-last-updated-on").innerHTML = profile.UPDATED_TS;

    const profileStatus = (profile.ROLE_CODE > -2) ? 100: (profile.ROLE_CODE == -2) ? 50 : 0;
    showProfileStatus(profileStatus);

    document.getElementById("profile-firstname").innerHTML = profile.NAME_FIRST;
    document.getElementById("profile-lastname").innerHTML = profile.NAME_LAST;
    document.getElementById("profile-displayname").innerHTML = (profile.NAME_DISPLAY != null && profile.NAME_DISPLAY != undefined) ? profile.NAME_DISPLAY : "Display Name"; 
    document.getElementById("profile-rolecode").innerHTML = profile.ROLE_CODE;
    document.getElementById("profile-timestamp").innerHTML = profile.CREATED_TS;

    document.getElementById("profile-email").innerHTML = profile.EMAIL_ID;     
    document.getElementById("profile-phone").innerHTML = (profile.PHONE_PRIMARY != null && profile.PHONE_PRIMARY != undefined) ? profile.PHONE_PRIMARY : "Primary-Phone";
    document.getElementById("profile-city").innerHTML = (profile.CITY != null && profile.CITY != undefined) ? profile.CITY : "City"; 
    document.getElementById("profile-state").innerHTML = (profile.STATE != null && profile.STATE != undefined) ? profile.STATE : "State";  
    document.getElementById("profile-country").innerHTML = (profile.COUNTRY != null && profile.COUNTRY != undefined) ? profile.COUNTRY : "Country";

    for (let i = 0; i < subscribedBots.length; i++) {
        createBotNameBoxes(subscribedBots[i].BOT_NAME);                      
    }

    document.getElementById("firstname-add").value = profile.NAME_FIRST;
    document.getElementById("lastname-add").value = profile.NAME_LAST;
    document.getElementById("email-add").value = profile.EMAIL_ID;
    document.getElementById("displayname-add").value = profile.NAME_DISPLAY;
    document.getElementById("photourl-add").value = profile.PROFILE_PHOTO;
    document.getElementById("primary-phoneno-add").value = profile.PHONE_PRIMARY;
    document.getElementById("secondary-phoneno-add").value = profile.PHONE_SECONDARY;
    document.getElementById("clientid-add").value = profile.NAME_CLIENT_ID;
    document.getElementById("address-add").value = profile.ADDRESS;
    document.getElementById("pincode-add").value = profile.PINCODE;
    document.getElementById("city-add").value = profile.CITY;
    document.getElementById("state-add").value = profile.STATE;
    document.getElementById("country-add").value = profile.COUNTRY;

    if(profile.RISK_PLAN != undefined && profile.RISK_PLAN != null){
        var options = document.getElementById("risk-level").options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].text.toLowerCase() == profile.RISK_PLAN.toLowerCase()) {
                options[i].selected = true;
                break;
            }
        }
    }
    
    document.getElementById("platform-name").value = profile.API_EXCHANGE;
    document.getElementById("api-key-value").value = profile.API_KEY;
    document.getElementById("api-secret-value").value = profile.API_SECRET;
    document.getElementById("notes-section").value = profile.NOTES;
}

var createBotNameBoxes = (botName) => {
    const anchor = document.createElement('a');
    anchor.href = 'javascript:void(0);';
    anchor.innerHTML = `<span class="badge bg-light text-muted m-2">${botName}</span>`

    const botListDiv = document.getElementById("bot-list");
    botListDiv.appendChild(anchor);
}

var updateProfile = () => {

     const userDetails = {
                        name_first: document.getElementById("firstname-add").value,
                        name_last: document.getElementById("lastname-add").value,
                        name_display: document.getElementById("displayname-add").value,
                        name_client_id: document.getElementById("clientid-add").value,
                        profile_photo: document.getElementById("photourl-add").value,
                        address: document.getElementById("address-add").value,
                        city: document.getElementById("city-add").value,
                        state: document.getElementById("state-add").value,
                        country: document.getElementById("country-add").value,
                        pincode: document.getElementById("pincode-add").value,
                        phone_primary: document.getElementById("primary-phoneno-add").value,
                        phone_secondary: document.getElementById("secondary-phoneno-add").value,
                        api_exchange: document.getElementById("platform-name").value,
                        api_key: document.getElementById("api-key-value").value,
                        api_secret: document.getElementById("api-secret-value").value,
                        risk_plan: document.getElementById("risk-level").options[document.getElementById("risk-level").selectedIndex].text,
                        notes: document.getElementById("notes-section").value,
                        role_code: -1
                    }

    const authToken = localStorage.getItem('authToken');
    axios
        .post(
            'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/updateProfile',
            userDetails,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            console.log("res: " + JSON.stringify(res.data));
            if (res.status == 200) {
                showToastAlerts('update-profile-success','alert-success-msg',res.data.message);
                setTimeout(()=> {
                    window.location.href='pricing.html';
                 }
                 ,delayInMS);
            }
        })
        .catch(err => {
            console.log(err);
            /* if (err.response.status == 422) {
                showToastAlerts('update-profile-error','alert-error-msg',err.response.data.errors);
            } */
        });
};

var updatePricingPage = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
    const statsSummary = JSON.parse(localStorage.getItem('statsSummaryObj'));

    const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;

    if(statsSummary.ACTIVE_BOTS == 1){
        document.getElementById("tier-free-1m").disabled = true;
        document.getElementById("tier-1core-1m").disabled = true;

        document.getElementById("tier-free-3m").disabled = true;
        document.getElementById("tier-1core-3m").disabled = true;
    }
    else if(statsSummary.ACTIVE_BOTS >= 2 && statsSummary.ACTIVE_BOTS < 5){
        document.getElementById("tier-free-1m").disabled = true;
        document.getElementById("tier-1core-1m").disabled = true;
        document.getElementById("tier-2core-1m").disabled = true;

        document.getElementById("tier-free-3m").disabled = true;
        document.getElementById("tier-1core-3m").disabled = true;
        document.getElementById("tier-2core-3m").disabled = true;
    }

    else if(statsSummary.ACTIVE_BOTS >= 5){
        document.getElementById("tier-free-1m").disabled = true;
        document.getElementById("tier-1core-1m").disabled = true;
        document.getElementById("tier-2core-1m").disabled = true;
        document.getElementById("tier-5core-1m").disabled = true;

        document.getElementById("tier-free-3m").disabled = true;
        document.getElementById("tier-1core-3m").disabled = true;
        document.getElementById("tier-2core-3m").disabled = true;
        document.getElementById("tier-5core-3m").disabled = true;
    }
}

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
