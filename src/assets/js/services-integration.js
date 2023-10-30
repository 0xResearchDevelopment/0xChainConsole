var delayInMS = 3000;
var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';

var signUp = async () => {
    var firstName = document.getElementById('signup-fname').value;
    var lastName = document.getElementById('signup-lname').value;
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
    validateSignUpInputs(firstName,lastName,email,password);

    if(firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length > 0 && password.length >= 6 && password.length <= 15 && validateEmail(email,"signUp")) {
        var accountOtpGenerated = Math.floor(1000 + Math.random() * 9000).toString();
        //console.log("### accountOtpGenerated:", accountOtpGenerated); //FIXME: cmment out before LIVE
        sessionStorage.setItem('otpCode', accountOtpGenerated);
        sessionStorage.setItem('signUpEmail', email);
    
        const myBody = {
            "name_first": firstName,
            "name_last": lastName,
            "email": email,
            "password": password,
            "accountOtpGenerated" : accountOtpGenerated
        };

        await axios
        .post(
            targetEndPointUrlBase +'/api/auth/register',
            myBody,
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
                showToastAlerts('signup-success','alert-success-msg',res.data.message);
                sessionStorage.setItem('verficationToken', res.data.results.verification.token);
                sessionStorage.setItem('actionCode', 0);
                setTimeout(()=> {
                    window.location.href = "verification.html";
                }
                ,delayInMS);
            }
        })
        .catch(err => {
            console.log(err);
            if(err.response.status == 422) {
                showToastAlerts('signup-error','alert-error-msg',err.response.data.errors.msg);
                document.getElementById("signup-fname").value = '';
                document.getElementById("signup-lname").value = '';
                document.getElementById("signup-email").value = '';
                document.getElementById("signup-password").value = '';
            }
        });
    }
};

var verifyOtp = () => {
    var otpCode = sessionStorage.getItem('otpCode');
    var actionCode = sessionStorage.getItem('actionCode');
    //console.log("## inside verify - otpCode:", otpCode);

    var digit1 = document.getElementById("one").value;
    var digit2 = document.getElementById("two").value;
    var digit3 = document.getElementById("three").value;
    var digit4 = document.getElementById("four").value;
    digit1 = digit1.length == 1 ? digit1 : 0;
    digit2 = digit2.length == 1 ? digit2 : 0;
    digit3 = digit3.length == 1 ? digit3 : 0;
    digit4 = digit4.length == 1 ? digit4 : 0;
    var userEnteredCode = digit1+digit2+digit3+digit4;
    //console.log("## inside verify - userEnteredCode:", userEnteredCode);
    if(userEnteredCode == otpCode) {
        showToastAlerts('verification-success','alert-success-msg',"OTP validation successful");
        if(actionCode == 0) {
            setTimeout(() => {
                verifyAccount(actionCode); //actionCode : 0 is for sign-in verification, 1 is for forget-change password
            }, delayInMS);
        } else if (actionCode == 1) {
            setTimeout(()=> {
                window.location.href = "create-password.html";
            },delayInMS);
        }
    } else {
        //alert("invalid otp");
        showToastAlerts('verification-error','alert-error-msg',"Invalid OTP");
    }    
};

var resendVerifyOtp = async() => {
    document.getElementById("defaultCheck1").checked = true;
    var accountOtpGenerated = Math.floor(1000 + Math.random() * 9000).toString();
    //console.log("### resendVerifyOtp-resend-otp:", accountOtpGenerated);
    sessionStorage.setItem('otpCode', accountOtpGenerated);
    var email = sessionStorage.getItem('signUpEmail');

    const myBody = {
        "email": email,
        "accountOtpGenerated": accountOtpGenerated
    };

    await axios.post(
        targetEndPointUrlBase +'/api/auth/verify/resendOtp',
        myBody,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    )
    .then(res => {
        console.log(res);
        showToastAlerts('verification-success','alert-success-msg',res.data.message);
    })
    .catch(err => {
        console.log(err);
        showToastAlerts('verification-error','alert-error-msg',err.response.data.errors.msg);
    });
};

var verifyAccount = (actionCode) => {
    //console.log("## verifyAccount-token:", sessionStorage.getItem('verficationToken'));
    var verifyAccountUrl = targetEndPointUrlBase +'/api/auth/verify/' + sessionStorage.getItem('verficationToken');
    //console.log("## verifyAccount-actionCode:", actionCode);

    axios.get(verifyAccountUrl)
        .then(res => {
            console.log(res);
            if (res.status == 200) {
                showToastAlerts('verification-success','alert-success-msg',res.data.message);
                sessionStorage.removeItem('verficationToken');
                sessionStorage.removeItem('actionCode');
                sessionStorage.removeItem('signUpEmail');
                sessionStorage.removeItem('otpCode');
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
    localStorage.clear(); //TODO: clears all previous session and local values
    sessionStorage.clear();
    var userName = document.getElementById('signin-username').value;
    var password = document.getElementById('signin-password').value;
    validateSignInInputs(userName, password);

    if(userName.length > 0 && password.length > 0 && password.length >= 6 && password.length <= 15 && validateEmail(userName,"signIn")) {
        axios
        .post(
            targetEndPointUrlBase +'/api/auth/login',
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
            showToastAlerts('signin-error','alert-error-msg',err.response.data.message);
        });
    }
};

var validateEmail = (email, page) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(email) == false) 
        {
            if(page == "signIn"){
                document.getElementById('signin-username').classList.add("is-invalid");
                document.getElementById('signin-username-format').style.display = 'block';
            }
            else if(page == "signUp"){
                document.getElementById('signup-email').classList.add("is-invalid");
                document.getElementById('signup-email-format').style.display = 'block';
            }
            return false;
        }

    return true;
}

var isPwdConfirmPwdMatches = (password, confirmPassword) => {
    if (password == confirmPassword) {
        return true;
    }
    else {
        document.getElementById('create-password').classList.add("is-invalid");
        document.getElementById('create-confirmpassword').classList.add("is-invalid");
        document.getElementById('create-password-match').style.display = 'block';
        return false;
    }
}

var validateSignInInputs = (userName, password) => {
    document.getElementById('signin-username').classList.remove("is-invalid");
    document.getElementById('signin-username-empty').style.display = 'none';
    document.getElementById('signin-username-format').style.display = 'none';
    document.getElementById('signin-password').classList.remove("is-invalid");
    document.getElementById('signin-password-empty').style.display = 'none';
    document.getElementById('signin-password-length').style.display = 'none';

    if(userName.length == 0){
        document.getElementById('signin-username').classList.add("is-invalid");
        document.getElementById('signin-username-empty').style.display = 'block';
    }
    if(userName.length > 0){
        validateEmail(userName, "signIn");
    }
    if(password.length == 0){
        document.getElementById('signin-password').classList.add("is-invalid");
        document.getElementById('signin-password-empty').style.display = 'block';
    }
    if(password.length > 15 || (password.length < 6 && password.length > 0)){
        document.getElementById('signin-password').classList.add("is-invalid");
        document.getElementById('signin-password-length').style.display = 'block';
    }
}

var validateSignUpInputs = (fname, lname, email, password) => {
    document.getElementById('signup-fname').classList.remove("is-invalid");
    document.getElementById('signup-fname-empty').style.display = 'none';
    document.getElementById('signup-lname').classList.remove("is-invalid");
    document.getElementById('signup-lname-empty').style.display = 'none';
    document.getElementById('signup-email').classList.remove("is-invalid");
    document.getElementById('signup-email-empty').style.display = 'none';
    document.getElementById('signup-email-format').style.display = 'none';
    document.getElementById('signup-password').classList.remove("is-invalid");
    document.getElementById('signup-password-empty').style.display = 'none';
    document.getElementById('signup-password-length').style.display = 'none';

    if(fname.length == 0){
        document.getElementById('signup-fname').classList.add("is-invalid");
        document.getElementById('signup-fname-empty').style.display = 'block';
    }
    if(lname.length == 0){
        document.getElementById('signup-lname').classList.add("is-invalid");
        document.getElementById('signup-lname-empty').style.display = 'block';
    }
    if(email.length == 0){
        document.getElementById('signup-email').classList.add("is-invalid");
        document.getElementById('signup-email-empty').style.display = 'block';
    }
    if(email.length > 0){
        validateEmail(email, "signUp");
    }
    if(password.length == 0){
        document.getElementById('signup-password').classList.add("is-invalid");
        document.getElementById('signup-password-empty').style.display = 'block';
    }
    if(password.length > 15 || (password.length < 6 && password.length > 0)){
        document.getElementById('signup-password').classList.add("is-invalid");
        document.getElementById('signup-password-length').style.display = 'block';
    }
}

var validateCreatePwdInputs = (password, confirmPassword) => {
    document.getElementById('create-password').classList.remove("is-invalid");
    document.getElementById('create-password-empty').style.display = 'none';
    document.getElementById('create-password-length').style.display = 'none';
    document.getElementById('create-confirmpassword').classList.remove("is-invalid");
    document.getElementById('create-confirmpassword-empty').style.display = 'none';
    document.getElementById('create-confirmpassword-length').style.display = 'none';
    document.getElementById('create-password-match').style.display = 'none';

    if(password.length == 0){
        document.getElementById('create-password').classList.add("is-invalid");
        document.getElementById('create-password-empty').style.display = 'block';
    }
    if(password.length > 15 || (password.length < 6 && password.length > 0)){
        document.getElementById('create-password').classList.add("is-invalid");
        document.getElementById('create-password-length').style.display = 'block';
    }
    if(confirmPassword.length == 0){
        document.getElementById('create-confirmpassword').classList.add("is-invalid");
        document.getElementById('create-confirmpassword-empty').style.display = 'block';
    }
    if(confirmPassword.length > 15 || (confirmPassword.length < 6 && confirmPassword.length > 0)){
        document.getElementById('create-confirmpassword').classList.add("is-invalid");
        document.getElementById('create-confirmpassword-length').style.display = 'block';
    }
}

var getTodayDate = () => {
    // Date object
    const date = new Date();
    let currentDay = String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    let currentYear = date.getFullYear();
    // we will display the date as DD-MM-YYYY 
    let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
    console.log("The current date is " + currentDate);
    return currentDate;
}

var getUserProfile = () => {
    const authToken = localStorage.getItem('authToken');
    
    axios
        .get(
            targetEndPointUrlBase +'/api/auth/user-profile',
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            if (res.status == 200) {
                console.log(res.data);
                
                const profile = (res.data.profile!=undefined && res.data.profile!=null)?res.data.profile:null;
                const subscribedBots = (res.data.subscribedBots!=undefined && res.data.subscribedBots!=null)?res.data.subscribedBots:null;
                const subscribtionStatsSummary = (res.data.subscribtionStatsSummary!=undefined && res.data.subscribtionStatsSummary!=null)?res.data.subscribtionStatsSummary:null;
                const userActiveBotsLatest = (res.data.userActiveBotsLatest!=undefined && res.data.userActiveBotsLatest!=null)?res.data.userActiveBotsLatest:null;
                const userInactiveBotsCountObj = (res.data.userInactiveBotsCount!=undefined && res.data.userInactiveBotsCount!=null)?res.data.userInactiveBotsCount:null;
                const userSubmittedRequests = (res.data.userSubmittedRequestsCount!=undefined && res.data.userSubmittedRequestsCount!=null)?res.data.userSubmittedRequestsCount:null;

                var username = profile.NAME_FIRST + " " + profile.NAME_LAST;
                console.log("# inside getUserProfile - res - username:", username);
                document.getElementById("header-user-name").innerHTML = username;
                document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;
                // Role based menu access - Administrator 
                if(profile.ROLE_CODE == 99){
                    document.getElementById('admin-menu').style.display = 'block';
                }

                localStorage.setItem('profileObj', JSON.stringify(profile)); 
                //localStorage.setItem('statsSummaryObj', JSON.stringify(subscribtionStatsSummary));
                let userActiveBotsLatestCount = (userActiveBotsLatest.ACTIVE_BOTS_LATEST != null) ? userActiveBotsLatest.ACTIVE_BOTS_LATEST : 0;
                let userInactiveBotsLatestCount = (userInactiveBotsCountObj.INACTIVE_BOTS != null) ? userInactiveBotsCountObj.INACTIVE_BOTS : 0;
                localStorage.setItem('active_bots_count', userActiveBotsLatestCount);
                localStorage.setItem('inactive_bots_count', userInactiveBotsLatestCount); //TODO: for the first time page flow to bots-list, so setting this as 0
                localStorage.setItem('role_code', profile.ROLE_CODE); 
                console.log("## roleCode:" + profile.ROLE_CODE + " ACTIVE_BOTS_LATEST:"  + userActiveBotsLatestCount + " userInactiveBotsLatestCount:"+ userInactiveBotsLatestCount);

                //get submitted requests count 
                let userSubscribeSubmittedRequestsCount = 0;
                let userUnsubscribeSubmittedRequestsCount = 0;
                for (let i = 0; i < userSubmittedRequests.length; i++) {
                    console.log("## userSubmittedRequests::", userSubmittedRequests);
                    if (userSubmittedRequests[i].REQ_TYPE == 'SUBSCRIBE')
                        userSubscribeSubmittedRequestsCount = userSubmittedRequests[i].REQUEST_COUNT;
                    else if (userSubmittedRequests[i].REQ_TYPE == 'UNSUBSCRIBE')
                        userUnsubscribeSubmittedRequestsCount = userSubmittedRequests[i].REQUEST_COUNT;
                }
                localStorage.setItem('requests_subscribe_count', userSubscribeSubmittedRequestsCount);
                localStorage.setItem('requests_unsubscribe_count', userUnsubscribeSubmittedRequestsCount);
                console.log("## requests_subscribe_count:" + userSubscribeSubmittedRequestsCount + " requests_unsubscribe_count:"  + userUnsubscribeSubmittedRequestsCount);

                if(userActiveBotsLatestCount == 0 && profile.ROLE_CODE >= 0 && userInactiveBotsLatestCount == 0){
                    //localStorage.setItem('inactive_bots_count', userInactiveBotsLatestCount); //TODO: for the first time page flow to bots-list, and then it will set actual acount if its more than 0, so that user can navigate to dashboard
                    location.href = "bots-list.html";
                }

                if(profile.ROLE_CODE == -2){
                    location.href = "profile.html";
                } else if(profile.ROLE_CODE == -1){
                    location.href = "pricing.html";
                } else if(profile.ROLE_CODE < -2 && profile.ROLE_CODE > 99){
                    location.href = "sign-in-cover.html";
                }

                for (let i = 0; i < subscribedBots.length; i++) {
                    createDashboardBoxes(subscribedBots[i].TRADE_SYMBOL,subscribedBots[i].LAST_TRADE_QTY,subscribedBots[i].TOKEN_NETPROFIT,
                                            subscribedBots[i].BOT_TOKEN_ICON,subscribedBots[i].BOT_BASE_ICON,subscribedBots[i].TOTAL_NUMOF_TRADES,subscribedBots[i].APP_TS,  //subscribedBots[i].LAST_TRADED_DATE,
                                            subscribedBots[i].TOKEN_ENTRY_AMOUNT, subscribedBots[i].TRADE_TIMEFRAME,subscribedBots[i].BOT_ID, subscribedBots[i].SUBSCRIBE_STATUS, subscribedBots[i].PLATFORM);                      
                }

                document.getElementById("as-of-summary").innerHTML = (subscribtionStatsSummary != null) ? subscribtionStatsSummary.AS_OF_SUMMARY : new Date().toUTCString().slice(5, 16); //01-01-2023
                document.getElementById("total-trades").innerHTML = (subscribtionStatsSummary != null) ? subscribtionStatsSummary.SUM_USER_SUB_TRADES : 0;
                document.getElementById("active-bots").innerHTML = (userActiveBotsLatest.ACTIVE_BOTS_LATEST != null) ? userActiveBotsLatest.ACTIVE_BOTS_LATEST : 0;

                const theme = new Map([
                    ["PROFILE", 'success'],
                    ["SUBSCRIBE", 'secondary'],
                    ["WORKFLOW", 'warning'],
                    ["NOTIFICATION", 'info'],
                    ["BOTS", 'primary']
                  ]);

                const recentActivities = (res.data.userRecentActivities!=undefined)?res.data.userRecentActivities:[];
                for (let i = 0; i < recentActivities.length; i++) {
                    populateRecentActivities(recentActivities[i].DESC,recentActivities[i].MODULE,
                                        recentActivities[i].ACTIVITY_TS,theme.get(recentActivities[i].MODULE));                      
                }
            }
        }).catch(err => {
            console.log(err, err.response);
            showToastAlerts('index-error','alert-error-msg',err.response.data.message);
            if (err.response.status == 401) {
                setTimeout(()=> {
                    location.href = "sign-in-cover.html";
                 }
                 ,0);
            }
        })
}

var createDashboardBoxes = (tradeSymbol,lastTradeQty,netProfit,tokenIconUrl, baseIconUrl,totalNoOfTrades,lastTradedDate,tokenEntryAmount,tradeTimeframe,botId, subscribeStatus, platformName) => {
    const colDiv = document.createElement('div');
    colDiv.id = 'col-div';
    colDiv.setAttribute("class", "col card-background");

    const cardDiv = document.createElement('div');
    cardDiv.id = 'card-div';
    cardDiv.setAttribute("class", "card custom-card");

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.id = 'card-body-div';
    cardBodyDiv.setAttribute("class", "card-body");
    if(subscribeStatus == 0) {
        cardBodyDiv.style.backgroundColor = '#E0E0E0';
    }


    let botIdLabelDesign  = "<span class='badge bg-info ms-0 d-offline-block'>" + botId + "</span>"; //<a href='#' class='ms-1 fs-16' data-bs-toggle='offcanvas'><i class='bx bx-cog bx-spin'></i></a>";
    if(subscribeStatus == 0)
        botIdLabelDesign  = "<span class='badge bg-danger ms-0 d-offline-block'>"+ botId + "</span>";

    const flex1Div = document.createElement('div');
    flex1Div.id = 'flex1-div';
    flex1Div.setAttribute("class", "d-flex");
    
    const flex1Child1Div = document.createElement('div');
    flex1Child1Div.id = 'flex1-child1-div';
    flex1Child1Div.innerHTML = `<p class="fw-medium mb-1 text-muted">${botIdLabelDesign}  ${tradeSymbol}_${tradeTimeframe}</p><h3 class="mb-0">${lastTradeQty}</h3>`;

    const flex1Child2Div = document.createElement('div');
    flex1Child2Div.id = 'flex1-child2-div';
    flex1Child2Div.setAttribute("class", "avatar avatar-sm br-4 ms-auto");
    flex1Child2Div.innerHTML = `<img src="${tokenIconUrl}" class="fs-20"><img src="${baseIconUrl}" class="fs-20">`;

    const flex2Div = document.createElement('div');
    flex2Div.id = 'flex2-div';
    flex2Div.setAttribute("class", "d-flex mt-2");
    flex2Div.innerHTML = `<p class="fw-medium mb-1 fs-14 text-muted">Trades : ${totalNoOfTrades}</p>`

    const flex5Div = document.createElement('div');
    flex5Div.id = 'flex5-div';
    flex5Div.setAttribute("class", "d-flex mt-2");
    flex5Div.innerHTML = `<p class="fw-medium mb-0 fs-12 text-muted"><span>As Of:${lastTradedDate}</span></p>`

    const flex3Div = document.createElement('div');
    flex3Div.id = 'flex3-div';
    flex3Div.setAttribute("class", "d-flex");
    flex3Div.innerHTML = `<p class="fw-medium mb-1 fs-14 text-muted">Invested : ${tokenEntryAmount}</p>`

    const flex4Div = document.createElement('div');
    flex4Div.id = 'flex4-div';
    flex4Div.setAttribute("class", "d-flex mt-2");


    if(netProfit>0){
        flex4Div.innerHTML = `<span class="badge bg-success-transparent fs-14 rounded-pill">${netProfit}% <i class="ti ti-trending-up ms-1"></i></span><a href='#' class='ms-1 fs-16' data-bs-toggle='offcanvas'><i class='bx bx-cog bx-spin'></i></a>
        <a href="javascript:void(0);" onclick="navigateTokenStats(${botId}, ${subscribeStatus})" class="text-muted fs-14 ms-auto text-decoration-underline mt-auto">more</a>`
    }
    else{
        flex4Div.innerHTML = `<span class="badge bg-danger-transparent fs-14 rounded-pill">${netProfit}% <i class="ti ti-trending-down ms-1"></i></span><a href='#' class='ms-1 fs-16' data-bs-toggle='offcanvas'><i class='bx bx-cog bx-spin'></i></a>
        <a href="javascript:void(0);" onclick="navigateTokenStats(${botId}, ${subscribeStatus})" class="text-muted fs-14 ms-auto text-decoration-underline mt-auto">more</a>`
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

var navigateTokenStats = (botId, userSubscriptionStatus) => {
    localStorage.setItem('botId', botId);
    localStorage.setItem('userSubscriptionStatus', userSubscriptionStatus);
    location.href = "token-stats.html";
};

var showToastAlerts = (divId,spanId,msg) => {
    document.getElementById(spanId).innerHTML = msg;
    const middlecentertoastExample = document.getElementById(divId);
    const toast = new bootstrap.Toast(middlecentertoastExample,{delay: delayInMS});
	toast.show();
}

var updateTier = (code) => {
    console.log("### Inside updateTier:");
    const authToken = localStorage.getItem('authToken');
    axios.post(
            targetEndPointUrlBase +'/api/auth/upgradeTier',
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
                showToastAlerts('pricing-success','alert-success-msg',res.data.message);
                setTimeout(()=> {
                    window.location.href='index.html';
                 }
                 ,delayInMS);
            }
        })
        .catch(err => {
            console.log("### Inside updateTier:err.response", err.response.data.message);
            showToastAlerts('pricing-error','alert-error-msg',err.response.data.message);
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
                                    <span class="fs-12 text-muted">${module}</span>
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
                                    <div class="progress-bar bg-info ronded-1" role="progressbar" aria-valuenow="${percentCompletion}" aria-valuemin="0" aria-valuemax="100" style="width: ${percentCompletion}%"></div>
                                  </div>`

    const profileStatusContainer = document.getElementById("profile-status");
    profileStatusContainer.appendChild(profileStatusDiv);
}

var loadProfilePage = () => {

    const authToken = localStorage.getItem('authToken');
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
    axios
        .get(
            targetEndPointUrlBase +'/api/auth/user-profile',
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
                const subscribedBots = (res.data.subscribedBots!=undefined && res.data.subscribedBots!=null)?res.data.subscribedBots:[];

                const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
                document.getElementById("header-user-name").innerHTML = username;
                document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;
                document.getElementById("profile-header-photo").src = profile.PROFILE_PHOTO;
                if(profile.ROLE_CODE == 99){
                    document.getElementById('admin-menu').style.display = 'block';
                }
                document.getElementById("profile-header-name").innerHTML = username;
                document.getElementById("profile-header-email").innerHTML = profile.EMAIL_ID;     
                document.getElementById("profile-header-phone").innerHTML = (profile.PHONE_PRIMARY != null && profile.PHONE_PRIMARY != undefined) ? profile.PHONE_PRIMARY : "Primary-Phone";  
                document.getElementById("profile-header-city").innerHTML = (profile.CITY != null && profile.CITY != undefined) ? profile.CITY : "City"; 
                document.getElementById("profile-header-state").innerHTML = (profile.STATE != null && profile.STATE != undefined) ? profile.STATE : "State";  
                document.getElementById("profile-header-country").innerHTML = (profile.COUNTRY != null && profile.COUNTRY != undefined) ? profile.COUNTRY : "Country";
                document.getElementById("profile-last-updated-on").innerHTML = profile.UPDATED_TS_FMT;
            
                const profileStatus = (profile.ROLE_CODE > -2) ? 100: (profile.ROLE_CODE == -2) ? 50 : 0;
                showProfileStatus(profileStatus);
                const userStatusMsg = (profile.ROLE_CODE > -2) ? "<button type='button' class='btn btn-info btn-lg btn-wave'><i class='align-middle'></i>Active</button>" : "<button type='button' class='btn btn-danger btn-lg btn-wave'><i class='align-middle'></i>Pending Activation</button>";
                document.getElementById("btn_userStatus").innerHTML = userStatusMsg;
            
                document.getElementById("profile-firstname").innerHTML = profile.NAME_FIRST;
                document.getElementById("profile-lastname").innerHTML = profile.NAME_LAST;
                document.getElementById("profile-displayname").innerHTML = (profile.NAME_DISPLAY != null && profile.NAME_DISPLAY != undefined) ? profile.NAME_DISPLAY : "Display Name"; 
                document.getElementById("profile-rolecode").innerHTML = profile.ROLE_CODE;
                document.getElementById("profile-timestamp").innerHTML = profile.CREATED_TS_FMT;
            
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
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            location.href = "sign-in-cover.html";
        })
}

var createBotNameBoxes = (botName) => {
    const anchor = document.createElement('a');
    anchor.href = 'javascript:void(0);';
    anchor.innerHTML = `<span class="badge bg-light text-muted m-2">${botName}</span>`

    const botListDiv = document.getElementById("bot-list");
    botListDiv.appendChild(anchor);
}

var updateProfile = () => {
    let userRoleCode = document.getElementById("profile-rolecode").innerHTML;
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
                        role_code: userRoleCode
                    }

    const authToken = localStorage.getItem('authToken');
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
    axios
        .post(
            targetEndPointUrlBase +'/api/auth/updateProfile',
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
                if( userRoleCode < 0) {
                    setTimeout(()=> {
                        window.location.href='pricing.html';
                    }
                    ,delayInMS);
                } else {
                    setTimeout(()=> {
                        window.location.href='profile.html';
                    }
                    ,delayInMS);
                }
            }
        })
        .catch(err => {
            console.log(err);
            showToastAlerts('update-profile-error','alert-error-msg',err.response.data.message);
            if (err.response.status == 401) {
                setTimeout(()=> {
                    location.href = "sign-in-cover.html";
                 }
                 ,delayInMS);
            }
        });
};

var loadPricingPage = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
    //const statsSummary = JSON.parse(localStorage.getItem('statsSummaryObj'));
    let active_bots_latest = localStorage.getItem('active_bots_count');
    console.log('## active_bots_latest:', active_bots_latest);
    //localStorage.removeItem('active_bots_count');

    const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;
    if(profile.ROLE_CODE == 99){
        document.getElementById('admin-menu').style.display = 'block';
    }

    if(active_bots_latest == 1){
        document.getElementById("tier-free-1m").disabled = true;
        document.getElementById("tier-1core-1m").disabled = true;

        document.getElementById("tier-free-3m").disabled = true;
        document.getElementById("tier-1core-3m").disabled = true;
    }
    else if(active_bots_latest >= 2 && active_bots_latest < 5){
        document.getElementById("tier-free-1m").disabled = true;
        document.getElementById("tier-1core-1m").disabled = true;
        document.getElementById("tier-2core-1m").disabled = true;

        document.getElementById("tier-free-3m").disabled = true;
        document.getElementById("tier-1core-3m").disabled = true;
        document.getElementById("tier-2core-3m").disabled = true;
    }
    else if(active_bots_latest >= 5){
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
            targetEndPointUrlBase +'/api/auth/logout',{},
            {
            headers: {
                Authorization: `Bearer ${authToken}`
            }            
        })
        .then(res => {
            console.log("### Inside signout:res: " + res);
            localStorage.clear();
            window.location.href='sign-in-cover.html';
        }).catch(err => {
            console.log(err);
            if (err.response.status == 401) {
                localStorage.clear();
                setTimeout(()=> {
                    location.href = "sign-in-cover.html";
                 }
                 ,0);
            }
        });
};

var mapTierToModal = (tier) => {
    var divEl = document.getElementById("pp-modal-footer");
    divEl.innerHTML = `<button type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-outline-primary" id="pp-modal-submit"
                            data-bs-dismiss="modal" onclick="updateTier(${tier})">Submit</button>`
}

var forgetPassword = () => {

    document.getElementById('signin-username').classList.remove("is-invalid");
    document.getElementById('signin-username-empty').style.display = 'none';
    document.getElementById('signin-username-format').style.display = 'none';
    document.getElementById('signin-password').classList.remove("is-invalid");
    document.getElementById('signin-password-empty').style.display = 'none';
    document.getElementById('signin-password-length').style.display = 'none';
    var userName = document.getElementById('signin-username').value;

    if(userName.length == 0){
        document.getElementById('signin-username').classList.add("is-invalid");
        document.getElementById('signin-username-empty').style.display = 'block';
    }
    if(userName.length > 0){
        validateEmail(userName, "signIn");
    }

    if(userName.length > 0 && validateEmail(userName,"signIn")){
        var forgetPwdOtpCode = Math.floor(1000 + Math.random() * 9000).toString();
        //console.log("### forgetPwdOtpCode:", forgetPwdOtpCode);
        sessionStorage.setItem('otpCode', forgetPwdOtpCode);
        sessionStorage.setItem('signUpEmail', userName);
    
        const myBody = {
            "email": userName,
            "accountOtpGenerated" : forgetPwdOtpCode
        };

        axios
        .post(
            targetEndPointUrlBase +'/api/password/forgot',
            myBody,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(res => {
            console.log("res: " + JSON.stringify(res.data));
            showToastAlerts('signin-success','alert-success-msg',res.data.message);
            if (res.status == 201) {
                sessionStorage.setItem('verficationToken', res.data.results.verification.token);
                sessionStorage.setItem('actionCode', 1);
                setTimeout(()=> {
                    window.location.href = "verification.html";
                 }
                 ,delayInMS);
            }
        })
        .catch(err => {
            console.log(err);
            if (err.response.status == 404) {
                showToastAlerts('signin-error', 'alert-error-msg', "Account does not exists for the given email. Please use Signup");
            } else {
                showToastAlerts('signin-error', 'alert-error-msg', err.response.data.errors);
                if (err.response.status == 401) {
                    setTimeout(() => {
                        location.href = "sign-in-cover.html";
                    }
                        , delayInMS);
                }
            }
        });
    }
};

var updatePassword = () => {
    var password = document.getElementById('create-password').value;
    var confirmPassword = document.getElementById('create-confirmpassword').value;
    validateCreatePwdInputs(password,confirmPassword);

    if(password.length > 0 && password.length >= 6 && password.length <= 15 && confirmPassword.length > 0 
    && confirmPassword.length >= 6 && confirmPassword.length <= 15 && isPwdConfirmPwdMatches(password,confirmPassword)){
        console.log("## verifyAccount-token:", sessionStorage.getItem('verficationToken'));
        const requestBody = {
            "token": sessionStorage.getItem('verficationToken'),
            "password" : password
        };
        axios
        .post(
            targetEndPointUrlBase +'/api/password/reset',
            requestBody
        )
        .then(res => {
            console.log(res);
            showToastAlerts('create-password-success','alert-success-msg',res.data.message);
            if (res.status == 200) {
                sessionStorage.removeItem('verficationToken');
                sessionStorage.removeItem('actionCode');
                sessionStorage.removeItem('otpCode');
                sessionStorage.removeItem('signUpEmail');
                setTimeout(()=> {
                    window.location.href = "sign-in-cover.html";
                },delayInMS);
            }
        })
        .catch(err => {
            console.log(err, err.response);
            showToastAlerts('create-password-error','alert-error-msg',res.data.message);
        });
    }   
};

//****************************************************************** */