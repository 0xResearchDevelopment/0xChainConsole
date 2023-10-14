var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';

var loadHistoryData = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
    const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;

    const authToken = localStorage.getItem('authToken');
    //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
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
                    createTableRows(userTransHistory[i].EVENT_ID, new Date(userTransHistory[i].APP_TS).toLocaleString(), userTransHistory[i].LAST_TRADE_QTY, 
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
//******************************************* */