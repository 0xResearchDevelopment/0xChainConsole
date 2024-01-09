
var loadFlowData = () => {
    var tableData = [];

    axios
        .get(
            'https://presentation.tradealgo.com/ats/historic/daily-darkflow-today?trending_status='
        )
        .then(res => {
            if (res.status == 200) {
                console.log(res.data);
                const rawData = res.data;
                var dataObj = '';
                for (let i = 0; i < rawData.length; i++) {
                    dataObj = {
                        "ticker": rawData[i].ticker,
                        "type": (rawData[i].json_record.options.call_count >= 3000 && rawData[i].json_record.options.call_flow >= 0.55 && rawData[i].json_record.market_cap >= 2000000000) ? 'CALL' : ((rawData[i].json_record.options.put_count >= 3000 && rawData[i].json_record.options.put_flow >= 0.55 && rawData[i].json_record.market_cap >= 2000000000) ? 'PUT' : 'NONE'), //mc,count,flow
                        "date_added": rawData[i].date_added,
                        "added_price": rawData[i].added_price,
                        "multiplier": rawData[i].json_record.multiplier,
                        "call_count": rawData[i].json_record.options.call_count,
                        "call_flow": rawData[i].json_record.options.call_flow, //*100 + '%'
                        "put_count": rawData[i].json_record.options.put_count,
                        "put_flow": rawData[i].json_record.options.put_flow, //*100 + '%'
                        "json_performance": rawData[i].json_record.perf, //*100 + '%' -- Stock changes today in $$
                        "performance": rawData[i].performance, //*100 + '%'
                        "market_cap": rawData[i].json_record.market_cap,
                        "company_name": rawData[i].company_name
                    } 
                    if(dataObj.type == 'PUT' || dataObj.type == 'CALL'){
                        tableData.push(dataObj);
                    }              
                }

                for (let j = 0; j < tableData.length; j++) {
                    var datevalue = tableData[j].date_added; 
                    var converteddate = Date.parse(datevalue);
                    console.log ("### Dates: " + tableData[j].date_added + " - " + converteddate); //TODO: date format fix
                    var priceChangePercentage = (tableData[j].json_performance / tableData[j].added_price) *100;
                    createTableRows(tableData[j].ticker, tableData[j].type, datevalue, tableData[j].added_price, tableData[j].multiplier,
                        tableData[j].call_count, tableData[j].call_flow, tableData[j].put_count,tableData[j].put_flow, priceChangePercentage,
                        tableData[j].performance, tableData[j].market_cap, tableData[j].company_name);   
                }
                applyResponsiveness(tableData.length);
                showToastAlerts('flow-data-success','alert-success-msg',`Loaded ${tableData.length} records of ${rawData.length}`);
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
    const revisedMarketCap = Math.round((market_cap/1000000000)*100)/100;
    const callFlowTheme = call_flow >= .8 ? 'success' : call_flow < .8 && call_flow >= .5 ? 'info' : 'secondary';
    const callFlowTrend = call_flow >= .8 &&  call_count >= 20000 && revisedMarketCap >= 20 ? 'bi bi-patch-check-fill text-success ms-1 fs-14' : '';
    const putFlowTheme = put_flow >= .8 ? 'success' : put_flow < .8 && put_flow >= .5 ? 'info' : 'secondary';
    const putFlowTrend = put_flow >= .8 &&  put_count >= 20000 && revisedMarketCap >= 20  ? 'bi bi-patch-check-fill text-success ms-1 fs-14' : '';
    const jsonPerformanceTheme = json_performance > 0 ? 'success' : 'info'; // Stock changes today in $$
    // const jsonPerformanceTrend = json_performance > 0 ? 'trending-up' : 'trending-down'
    const performanceTheme = performance > 0 ? 'success' : 'info'
    // const performanceTrend = performance > 0 ? 'trending-up' : 'trending-down'
    const badgeTheme = (type == 'CALL') ? 'primary' : 'secondary';
    const shorlistedTicker = call_flow >= .69 &&  call_count >= 20000 && revisedMarketCap >= 5 ? 'Yes' : put_flow >= .69 &&  put_count >= 20000 && revisedMarketCap >= 5 ? 'Yes' : '-';  //TODO: $5Billions marketcap
/* 
    const dateObj = new Date(date_added);
    formatOption = {
    day: 'numeric', month: 'short', year:'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false
    timeZone: 'America/Los_Angeles' 
    }; */

    const row = document.createElement('tr');
    row.innerHTML = `<td style = 'font-size: 12px;'>${ticker}</td>
    <td style = 'font-size: 12px;'>${shorlistedTicker}</td>
    <td style = 'font-size: 12px;'><span class="badge bg-${badgeTheme}-transparent rounded-pill badge-sm fs-12 fw-semibold">${type}</span></td>
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

    const tbody = document.getElementById("flow-data-tbody");
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