var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';

var loadFlowData = () => {
    //var tableData = [];
    const authToken = localStorage.getItem('authToken');
    axios
        .get(
            targetEndPointUrlBase+'/api/equity/options/loadData',
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            if (res.status == 200) {
                console.log(res.data);
                const optionsData = res.data.equityOptionsData;
                var tableDataCount = 0;
                for (let i = 0; i < optionsData.length; i++) {
                    if(optionsData[i].OPTIONS_TYPE != null){
                        var formattedDate = Date.parse(optionsData[i].TICKER_ADDED_TS_STR);
                        var priceChangePercentage = (optionsData[i].PERFORMANCE_1 / optionsData[i].TICKER_PRICE) *100;
                        createTableRows(optionsData[i].TICKER, optionsData[i].OPTIONS_TYPE, formattedDate, optionsData[i].TICKER_PRICE, optionsData[i].TIKCER_MULTIPLIER,
                            optionsData[i].OPTIONS_COUNT_CALL, optionsData[i].OPTIONS_FLOW_CALL, optionsData[i].OPTIONS_COUNT_PUT,optionsData[i].OPTIONS_FLOW_PUT, priceChangePercentage,
                            optionsData[i].PERFORMANCE_2, optionsData[i].MARKET_CAP, optionsData[i].TICKER_NAME);
                            
                            tableDataCount = tableDataCount + 1;
                    }              
                }

                applyResponsiveness(optionsData.length);
                showToastAlerts('equity-options-data-success','alert-success-msg',`Loaded ${tableDataCount} records of ${optionsData.length}`);
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

var createTableRows = (ticker, type, date_added, added_price, multiplier, call_count, call_flow, 
    put_count,put_flow, json_performance, performance, market_cap, company_name) => {
    const optionType = type == 1 ? 'CALL' : 'PUT'    
    const revisedMarketCap = Math.round((market_cap/1000000000)*100)/100;
    const callFlowTheme = call_flow >= .8 ? 'success' : call_flow < .8 && call_flow >= .5 ? 'info' : 'secondary';
    const callFlowTrend = call_flow >= .8 &&  call_count >= 20000 && revisedMarketCap >= 20 ? 'bi bi-patch-check-fill text-success ms-1 fs-14' : '';
    const putFlowTheme = put_flow >= .8 ? 'success' : put_flow < .8 && put_flow >= .5 ? 'info' : 'secondary';
    const putFlowTrend = put_flow >= .8 &&  put_count >= 20000 && revisedMarketCap >= 20  ? 'bi bi-patch-check-fill text-success ms-1 fs-14' : '';
    const jsonPerformanceTheme = json_performance > 0 ? 'success' : 'info'; // Stock changes today in $$
    const performanceTheme = performance > 0 ? 'success' : 'info'
    const badgeTheme = (optionType == 'CALL') ? 'primary' : 'secondary';
    const shorlistedTicker = call_flow >= .69 &&  call_count >= 20000 && revisedMarketCap >= 5 ? 'Yes' : put_flow >= .69 &&  put_count >= 20000 && revisedMarketCap >= 5 ? 'Yes' : '-';  //TODO: $5Billions marketcap

    const row = document.createElement('tr');
    row.innerHTML = `<td style = 'font-size: 12px;'>${ticker}</td>
    <td style = 'font-size: 12px;'>${shorlistedTicker}</td>
    <td style = 'font-size: 12px;'><span class="badge bg-${badgeTheme}-transparent rounded-pill badge-sm fs-12 fw-semibold">${optionType}</span></td>
    <td style = 'font-size: 12px;'>${Math.round(multiplier*100)/100}</td>
    <td style = 'font-size: 12px;'><span class='badge bg-${callFlowTheme}-transparent fs-12 rounded-pill'>${Math.round((call_flow*100)*100)/100}%  <i class='${callFlowTrend}'></i></span></td>
    <td style = 'font-size: 12px;'><span class='badge bg-${putFlowTheme}-transparent fs-12 rounded-pill'>${Math.round((put_flow*100)*100)/100}% <i class='${putFlowTrend}'></i></span></td>
    <td style = 'font-size: 12px;'>${call_count}</td>
    <td style = 'font-size: 12px;'>${put_count}</td>
    <td style = 'font-size: 12px;'>$${added_price}</td>
    <td style = 'font-size: 12px;'>$${revisedMarketCap}</td>
    <td style = 'font-size: 12px;'><span class='badge bg-${jsonPerformanceTheme}-transparent fs-12 rounded-pill'>${Math.round(json_performance)}%</span> 
                <span class='badge bg-${performanceTheme}-transparent fs-12 rounded-pill'>${Math.round((performance))}%</span></td>
    <td style = 'font-size: 12px;'>${date_added}</td>
    <td style = 'font-size: 12px;'>${company_name}</td>`;

    const tbody = document.getElementById("equity-options-tbody");
    tbody.appendChild(row);
}

var applyResponsiveness = (arrSize) => {
    $('#flowDataResponsiveTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
        },
        order: [[1,'desc']],   //Soring by EventID decensing order
        "pageLength": arrSize,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ], dom: 'flirtBlp' //'Bfrtip'
    });
};