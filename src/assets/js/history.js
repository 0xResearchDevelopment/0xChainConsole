var loadHistoryData = () => {
    const authToken = localStorage.getItem('authToken');
    console.log("authToken: "+ authToken);
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

            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            //location.href = "sign-in-cover.html";
        }) 
}

var createTableRows = (eventId, appTS, lastTradedQty, tokenCurrencyCode, tradeAction, tradeSymbol, tradeTimeframe, noOfTrades, tokenNetProfit) => {
    const row = document.createElement('tr');
    row.innerHTML = `<tr>
                        <td>${eventId}</td>
                        <td>${appTS}</td>
                        <td>${lastTradedQty} ${tokenCurrencyCode}</td>
                        <td>${tradeAction}</td>
                        <td>${tradeSymbol} ${tradeTimeframe}</td>
                        <td>${noOfTrades}</td>
                        <td>${tokenNetProfit}</td>
                    </tr>`

    const tbody = document.getElementById("history-tbody");
    tbody.appendChild(row);
}
