
var loadHistoryData = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
    const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;

    const authToken = localStorage.getItem('authToken');
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
    axios
        .post(
            'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/tradingdata/getHistory',
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
                    createTableRows(userTransHistory[i].EVENT_ID, userTransHistory[i].APP_TS, userTransHistory[i].LAST_TRADE_QTY, 
                                    userTransHistory[i].TOKEN_CURRENCY_CODE, userTransHistory[i].TRADE_ACTION, userTransHistory[i].TRADE_SYMBOL,
                                    userTransHistory[i].TRADE_TIMEFRAME, userTransHistory[i].TOTAL_NUMOF_TRADES, userTransHistory[i].TOKEN_NETPROFIT);                      
                } 
                applyResponsiveness();
            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            location.href = "sign-in-cover.html";
        }) 
}

var createTableRows = (eventId, appTS, lastTradedQty, tokenCurrencyCode, tradeAction, tradeSymbol, tradeTimeframe, noOfTrades, tokenNetProfit) => {
    const tradeActionText = tradeAction == 'B' ? 'Bought' : tradeAction == 'S' ? 'Sold' : tradeAction;
    const row = document.createElement('tr');
    row.innerHTML = `<td>${eventId}</td>
                    <td>${appTS}</td>
                    <td>${lastTradedQty} ${tokenCurrencyCode}</td>
                    <td>${tradeActionText}</td>
                    <td>${tradeSymbol}_${tradeTimeframe}</td>
                    <td>${noOfTrades}</td>
                    <td>${tokenNetProfit}</td>`

    const tbody = document.getElementById("history-tbody");
    tbody.appendChild(row);
}

var applyResponsiveness = () => {
    $('#responsiveDataTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: '',
        },
        "pageLength": 10,
    });
}
//******************************************* */
