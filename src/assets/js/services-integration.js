
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
        alert(JSON.stringify(myJson.errors.msg));
        document.getElementById("signup-fname").value = '';
        document.getElementById("signup-lname").value = '';
        document.getElementById("signup-email").value = '';
        document.getElementById("signup-password").value = '';
    }
    else if (myJson.code == 201) {
        alert(JSON.stringify(myJson.message));
        sessionStorage.setItem('verficationToken', myJson.results.verification.token);
        location.href = "sign-up-verification.html";
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
                alert(res.data.message);
                sessionStorage.removeItem('verficationToken');
                location.href = "sign-in-cover.html";
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
                alert(res.data.message);
                console.log(res.data.results.token);
                localStorage.setItem('authToken', res.data.results.token);
                location.href = "index.html";
            }
        })
        .catch(err => {
            console.log(err.response);
            if (err.response.status == 422) {
                alert(err.response.data.errors);
            }
        });
};


var getUserProfile = () => {
    console.log("inside getUserProfile");
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
                var username = res.data.profile.NAME_FIRST + " " + res.data.profile.NAME_LAST;
                console.log("# inside getUserProfile - res - username:", username);
                document.getElementById("header-user-name").innerHTML = username;
                const subscribedBots = (res.data.subscribedBots!=undefined)?res.data.subscribedBots:[];
                for (let i = 0; i < subscribedBots.length; i++) {
                    createDashboardBoxes(subscribedBots[i].TRADE_SYMBOL,subscribedBots[i].LAST_TRADE_QTY,subscribedBots[i].TOKEN_NETPROFIT,
                                            subscribedBots[i].BOT_TOKEN_ICON,subscribedBots[i].TOTAL_NUMOF_TRADES,subscribedBots[i].LAST_TRADED_DATE,
                                            subscribedBots[i].TOKEN_ENTRY_AMOUNT);
                }
            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            location.href = "sign-in-cover.html";
        })
}

var createDashboardBoxes = (tradeSymbol,lastTradeQty,netProfit,tokenUrl,totalNoOfTrades,lastTradedDate,tokenEntryAmount) => {
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
    flex1Child1Div.innerHTML = `<p class="fw-medium mb-1 text-muted">${tradeSymbol}</p>
    <h3 class="mb-0">${lastTradeQty}</h3>`;

    const flex1Child2Div = document.createElement('div');
    flex1Child2Div.id = 'flex1-child2-div';
    flex1Child2Div.setAttribute("class", "avatar avatar-md br-4 bg-primary-transparent ms-auto");
    flex1Child2Div.innerHTML = `<img src="${tokenUrl}" class="fs-20">`;

    const flex2Div = document.createElement('div');
    flex2Div.id = 'flex2-div';
    flex2Div.setAttribute("class", "d-flex mt-2");
    flex2Div.innerHTML = `<small style="font-weight:bold;">Trade#: ${totalNoOfTrades} (${lastTradedDate})</small>`

    const flex3Div = document.createElement('div');
    flex3Div.id = 'flex3-div';
    flex3Div.setAttribute("class", "d-flex");
    flex3Div.innerHTML = `<small style="font-weight:bold;">Invested: ${tokenEntryAmount}</small>`

    const flex4Div = document.createElement('div');
    flex4Div.id = 'flex4-div';
    flex4Div.setAttribute("class", "d-flex mt-2");
    if(netProfit>0){
        flex4Div.innerHTML = `<span class="badge bg-success-transparent rounded-pill">${netProfit} <i class="fe fe-arrow-up"></i></span>
        <a href="javascript:void(0);" class="text-muted fs-11 ms-auto text-decoration-underline mt-auto">view more</a>`
    }
    else{
        flex4Div.innerHTML = `<span class="badge bg-danger-transparent rounded-pill">${netProfit} <i class="fe fe-arrow-down"></i></span>
        <a href="javascript:void(0);" onclick="navigateTokenStats()" class="text-muted fs-11 ms-auto text-decoration-underline mt-auto">view more</a>`
    }


    const containerDiv = document.getElementById("dashboard-box-container");
    containerDiv.appendChild(colDiv);
    colDiv.appendChild(cardDiv);
    cardDiv.appendChild(cardBodyDiv);
    cardBodyDiv.appendChild(flex1Div);
    flex1Div.appendChild(flex1Child1Div);
    flex1Div.appendChild(flex1Child2Div);
    cardBodyDiv.appendChild(flex2Div);
    cardBodyDiv.appendChild(flex3Div);
    cardBodyDiv.appendChild(flex4Div);
}

var navigateTokenStats = () => {
    location.href = "token-stats.html";
};