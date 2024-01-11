var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';
var subscribedBots = [];

var loadHistoryData = () => {
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
            targetEndPointUrlBase+'/api/tradingdata/getHistory',
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
                const userTransHistory = (res.data.userTransHistory!=undefined && res.data.userTransHistory!=null)?res.data.userTransHistory:null;
        
                for (let i = 0; i < userTransHistory.length; i++) {
                    createTableRows(userTransHistory[i].EVENT_ID, userTransHistory[i].APP_TS_FMT, userTransHistory[i].LAST_TRADE_QTY, 
                                    userTransHistory[i].TOKEN_CURRENCY_CODE, userTransHistory[i].TRADE_ACTION, userTransHistory[i].TRADE_SYMBOL,
                                    userTransHistory[i].TRADE_TIMEFRAME, userTransHistory[i].TOTAL_NUMOF_TRADES, userTransHistory[i].TOKEN_NETPROFIT);                      
                } 
                applyResponsiveness();
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
}

var createTableRows = (eventId, appTS, lastTradedQty, tokenCurrencyCode, tradeAction, tradeSymbol, tradeTimeframe, noOfTrades, tokenNetProfit) => {
    const tradeActionText = tradeAction == 'B' ? 'Bought' : tradeAction == 'S' ? 'Sold' : tradeAction;
    const colorCode = tokenNetProfit > 0 ? 'success' : 'danger'
    const profitTrend = tokenNetProfit > 0 ? 'trending-up' : 'trending-down'
    const badgeTheme = (tradeAction == 'B') ? 'success' : 'secondary';
    const row = document.createElement('tr');
    row.innerHTML = `<td style = 'font-size: 12px;'>${eventId}</td>
    <td style = 'font-size: 12px;'>${tradeSymbol}_${tradeTimeframe}</td>
    <td style = 'font-size: 12px;'><span class='badge bg-${colorCode}-transparent fs-12 rounded-pill'>${tokenNetProfit}%<i class='ti ti-${profitTrend} ms-1'></i></span></td>
    <td style = 'font-size: 12px;'><span class="badge bg-${badgeTheme}-transparent rounded-pill badge-sm fs-12 fw-semibold">${tradeActionText}</span></td>
    <td style = 'font-size: 12px;'>${lastTradedQty} ${tokenCurrencyCode}</td>
    <td style = 'font-size: 12px;'>${noOfTrades}</td>
    <td style = 'font-size: 12px;'>${appTS}</td>`;

    const tbody = document.getElementById("history-tbody");
    tbody.appendChild(row);
}

var applyResponsiveness = () => {
    $('#txHistoryresponsiveDataTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
        },
        order: [[0, 'desc']],   //Soring by EventID decensing order
        "pageLength": 10,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ], dom: 'flirtBlp' //'Bfrtip'
    });
};

var autocompleteMatch = (input) => {
    if (input == '') {
      return [];
    }
    var reg = new RegExp(input)
    return subscribedBots.filter(function(bot) {
        if (bot.BOT_NAME.match(reg)) {
          return bot;
        }
    });
}

//Show search box results
var showSearchResults = (value) => {
    let bots = autocompleteMatch(value.toUpperCase());
    const ulist = document.getElementById("search-results-ul");
    ulist.innerHTML = '';
    for (i=0; i<bots.length; i++) {
        const list = document.createElement('li');
        list.classList.add('p-2','d-flex','align-items-center','text-muted','mb-2','search-app');
        list.innerHTML = `<a href="javascript:navigateTokenStats(${bots[i].BOT_ID}, ${bots[i].SUBSCRIBE_STATUS})">
                            <span>
                                <i class="bx bx-dice-1 me-2 fs-14 bg-primary-transparent p-2 rounded-circle"></i>${bots[i].BOT_NAME}
                            </span>
                          </a>`
        
        ulist.appendChild(list);
    }
}
//******************************************* */