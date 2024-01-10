var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';

var loadOptionFlowData = () => {
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
                const optionsData = (res.data.equityOptionsData != undefined && res.data.equityOptionsData != null) ? res.data.equityOptionsData : null;
                var tableDataCount = 0;

                const tableDiv = document.createElement('div');
                tableDiv.innerHTML = `<table id="optionsResponsiveTable" class="table table-bordered border-primary text-nowrap table-hover mt-4" style="width:100%">
                                    <thead>
                                        <tr>
                                            <th scope="col">Ticker</th>
                                            <th scope="col">Pick</th>
                                            <th scope="col">Option</th>
                                            <th scope="col">Multiplier</th>
                                            <th scope="col">Call(%)</th>
                                            <th scope="col">Put(%)</th>
                                            <th scope="col">Call(#)</th>
                                            <th scope="col">Put(#)</th>
                                            <th scope="col">Price $</th>
                                            <th scope="col">M.Cap $B</th>
                                            <th scope="col">Performance %</th>
                                            <th scope="col">Action</th>
                                            <th scope="col">Last Updated TS</th>
                                            <th scope="col">Company Name</th>
                                        </tr>
                                    </thead>
                                <tbody id="options-tbody">
                                </tbody>`;

                const containerDiv = document.getElementById("options");
                containerDiv.innerHTML = '';
                containerDiv.appendChild(tableDiv);

                for (let i = 0; i < optionsData.length; i++) {
                    if(optionsData[i].OPTIONS_TYPE != null){
                        var formattedDate = Date.parse(optionsData[i].TICKER_ADDED_TS_STR);
                        var priceChangePercentage = (optionsData[i].PERFORMANCE_1 / optionsData[i].TICKER_PRICE) *100;
                        createTableRowsOptions(optionsData[i].TICKER, optionsData[i].OPTIONS_TYPE, formattedDate, optionsData[i].TICKER_PRICE, optionsData[i].TIKCER_MULTIPLIER,
                            optionsData[i].OPTIONS_COUNT_CALL, optionsData[i].OPTIONS_FLOW_CALL, optionsData[i].OPTIONS_COUNT_PUT,optionsData[i].OPTIONS_FLOW_PUT, priceChangePercentage,
                            optionsData[i].PERFORMANCE_2, optionsData[i].MARKET_CAP, optionsData[i].TICKER_NAME, 1);
                            
                            tableDataCount = tableDataCount + 1;
                    }              
                }

                applyResponsivenessOptions(optionsData.length);
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

var loadTickerHistoryData = (ticker) => {
    const authToken = localStorage.getItem('authToken');
    axios
        .post(
            targetEndPointUrlBase+'/api/equity/options/getDataByTicker',
            {ticker: ticker},
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            if (res.status == 200) {
                console.log(res.data);
                const tickerData = (res.data.tickerData != undefined && res.data.tickerData != null) ? res.data.tickerData : null;

                const tableDiv = document.createElement('div');
                tableDiv.innerHTML = `<table id="tickerHistoryResponsiveTable" class="table table-bordered border-primary text-nowrap table-hover mt-4" style="width:100%">
                                    <thead>
                                        <tr>
                                            <th scope="col">Ticker</th>
                                            <th scope="col">Pick</th>
                                            <th scope="col">Option</th>
                                            <th scope="col">Multiplier</th>
                                            <th scope="col">Call(%)</th>
                                            <th scope="col">Put(%)</th>
                                            <th scope="col">Call(#)</th>
                                            <th scope="col">Put(#)</th>
                                            <th scope="col">Price $</th>
                                            <th scope="col">M.Cap $B</th>
                                            <th scope="col">Performance %</th>
                                            <th scope="col">Last Updated TS</th>
                                            <th scope="col">Company Name</th>
                                        </tr>
                                    </thead>
                                <tbody id="ticker-history-tbody">
                                </tbody>`;

                const containerDiv = document.getElementById("ticker-history");
                containerDiv.innerHTML = '';
                containerDiv.appendChild(tableDiv);

                for (let i = 0; i < tickerData.length; i++) {
                    if(tickerData[i].OPTIONS_TYPE != null){
                        var formattedDate = Date.parse(tickerData[i].TICKER_ADDED_TS_STR);
                        var priceChangePercentage = (tickerData[i].PERFORMANCE_1 / tickerData[i].TICKER_PRICE) *100;
                        createTableRowsTickerHistory(tickerData[i].TICKER, tickerData[i].OPTIONS_TYPE, formattedDate, tickerData[i].TICKER_PRICE, tickerData[i].TIKCER_MULTIPLIER,
                            tickerData[i].OPTIONS_COUNT_CALL, tickerData[i].OPTIONS_FLOW_CALL, tickerData[i].OPTIONS_COUNT_PUT,tickerData[i].OPTIONS_FLOW_PUT, priceChangePercentage,
                            tickerData[i].PERFORMANCE_2, tickerData[i].MARKET_CAP, tickerData[i].TICKER_NAME, 3);
                    }              
                }
                applyResponsivenessTickerHistory(tickerData.length);
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

var loadWatchlistData = () => {
    const authToken = localStorage.getItem('authToken');
    axios
        .get(
            targetEndPointUrlBase+'/api/equity/options/getWatchlistData',
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            if (res.status == 200) {
                console.log(res.data);
                const watchlistData = (res.data.watchlistData != undefined && res.data.watchlistData != null) ? res.data.watchlistData : null;

                const tableDiv = document.createElement('div');
                tableDiv.innerHTML = `<table id="watchlistResponsiveTable" class="table table-bordered border-primary text-nowrap table-hover mt-4" style="width:100%">
                                    <thead>
                                        <tr>
                                            <th scope="col">Ticker</th>
                                            <th scope="col">Pick</th>
                                            <th scope="col">Option</th>
                                            <th scope="col">Multiplier</th>
                                            <th scope="col">Call(%)</th>
                                            <th scope="col">Put(%)</th>
                                            <th scope="col">Call(#)</th>
                                            <th scope="col">Put(#)</th>
                                            <th scope="col">Price $</th>
                                            <th scope="col">M.Cap $B</th>
                                            <th scope="col">Performance %</th>
                                            <th scope="col">Action</th>
                                            <th scope="col">Last Updated TS</th>
                                            <th scope="col">Company Name</th>
                                        </tr>
                                    </thead>
                                <tbody id="watchlist-tbody">
                                </tbody>`;

                const containerDiv = document.getElementById("watchlist");
                containerDiv.innerHTML = '';
                containerDiv.appendChild(tableDiv);

                for (let i = 0; i < watchlistData.length; i++) {
                    if(watchlistData[i].OPTIONS_TYPE != null){
                        var formattedDate = Date.parse(watchlistData[i].TICKER_ADDED_TS_STR);
                        var priceChangePercentage = (watchlistData[i].PERFORMANCE_1 / watchlistData[i].TICKER_PRICE) *100;
                        createTableRowsWatchlist(watchlistData[i].TICKER, watchlistData[i].OPTIONS_TYPE, formattedDate, watchlistData[i].TICKER_PRICE, watchlistData[i].TIKCER_MULTIPLIER,
                            watchlistData[i].OPTIONS_COUNT_CALL, watchlistData[i].OPTIONS_FLOW_CALL, watchlistData[i].OPTIONS_COUNT_PUT,watchlistData[i].OPTIONS_FLOW_PUT, priceChangePercentage,
                            watchlistData[i].PERFORMANCE_2, watchlistData[i].MARKET_CAP, watchlistData[i].TICKER_NAME, 3);
                    }              
                }
                applyResponsivenessWatchlist(watchlistData.length);
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

var createTableRowsOptions = (ticker, type, date_added, added_price, multiplier, call_count, call_flow, 
    put_count,put_flow, json_performance, performance, market_cap, company_name, tab_no) => {
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
    <td style = 'font-size: 12px;'>
        <div class="hstack gap-2 fs-15">
            <a href="javascript:navigateToTickerHistory('${ticker}')" class="btn btn-icon btn-sm btn-info-light rounded-pill"><i class="ri-link"></i></a>
            <a href="javascript:addWatchList('${ticker}', '${company_name}')" class="btn btn-icon btn-sm btn-danger-light rounded-pill"><i class="ri-play-list-add-fill"></i></a>
        </div>
    </td>
    <td style = 'font-size: 12px;'>${date_added}</td>
    <td style = 'font-size: 12px;'>${company_name}</td>`;

    const tbody = document.getElementById("options-tbody");
    tbody.appendChild(row);
}

var createTableRowsTickerHistory = (ticker, type, date_added, added_price, multiplier, call_count, call_flow, 
    put_count,put_flow, json_performance, performance, market_cap, company_name, tab_no) => {
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

    const tbody = document.getElementById("ticker-history-tbody");
    tbody.appendChild(row);
}

var createTableRowsWatchlist = (ticker, type, date_added, added_price, multiplier, call_count, call_flow, 
    put_count,put_flow, json_performance, performance, market_cap, company_name, tab_no) => {
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
    <td style = 'font-size: 12px;'>
        <div class="hstack gap-2 fs-15">
            <a href="javascript:removeWatchList('${ticker}')" class="btn btn-icon btn-sm btn-danger-light rounded-pill"><i class="ri-close-line"></i></a>
        </div>
    </td>
    <td style = 'font-size: 12px;'>${date_added}</td>
    <td style = 'font-size: 12px;'>${company_name}</td>`;

    const tbody = document.getElementById("watchlist-tbody");
    tbody.appendChild(row);
}

var applyResponsivenessOptions = (arrSize) => {
    $('#optionsResponsiveTable').DataTable({
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

var applyResponsivenessTickerHistory = (arrSize) => {
    $('#tickerHistoryResponsiveTable').DataTable({
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

var applyResponsivenessWatchlist = (arrSize) => {
    $('#watchlistResponsiveTable').DataTable({
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

var addWatchList = (ticker, tickerName) => {

    const watchlistData = {
        ticker: ticker,
        tickerName: tickerName,
    }

    console.log(watchlistData);

    const authToken = localStorage.getItem('authToken');
    axios
        .post(
            targetEndPointUrlBase +'/api/equity/options/addWatchlist',
            watchlistData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            console.log("res: " + JSON.stringify(res.data));
            showToastAlerts('equity-options-data-success','alert-success-msg',res.data.message);
            if (res.status == 201) {
                setTimeout(()=> {
                    switchTab('watchlist')
                }, delayInMS);
            }
        })
        .catch(err => {
            console.log(err);
            showToastAlerts('equity-options-data-error','alert-error-msg',err.response.data.message);
            if (err.response.status == 401) {
                setTimeout(()=> {
                    location.href = "sign-in-cover.html";
                 }, delayInMS);
            }
        });
}

var removeWatchList = (ticker) => {

    const authToken = localStorage.getItem('authToken');
    axios
        .post(
            targetEndPointUrlBase +'/api/equity/options/removeWatchlist',
            {ticker: ticker},
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            console.log("res: " + JSON.stringify(res.data));
            showToastAlerts('equity-options-data-success','alert-success-msg',res.data.message);
            if (res.status == 200) {
                setTimeout(()=> {
                    loadWatchlistData();
                }, delayInMS);
            }
        })
        .catch(err => {
            console.log(err);
            showToastAlerts('equity-options-data-error','alert-error-msg',err.response.data.message);
            if (err.response.status == 401) {
                setTimeout(()=> {
                    location.href = "sign-in-cover.html";
                 }, delayInMS);
            }
        });
}

var switchTab = (tabName) => {
    var targetTab = document.querySelector('#option-flow-tab a[href="#' + tabName + '"]')
    bootstrap.Tab.getOrCreateInstance(targetTab).show();
    if(tabName == 'watchlist'){
        loadWatchlistData();
    }
}

var navigateToTickerHistory = (ticker) => {
    switchTab('ticker-history');
    loadTickerHistoryData(ticker);
}