
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
                        "json_performance": rawData[i].json_record.perf, //*100 + '%'
                        "performance": rawData[i].performance, //*100 + '%'
                        "market_cap": rawData[i].json_record.market_cap,
                        "company_name": rawData[i].company_name
                    } 
                    if(dataObj.type == 'PUT' || dataObj.type == 'CALL'){
                        tableData.push(dataObj);
                    }              
                }

                for (let j = 0; j < tableData.length; j++) {
                    createTableRows(tableData[j].ticker, tableData[j].type, tableData[j].date_added, tableData[j].added_price, tableData[j].multiplier,
                        tableData[j].call_count, tableData[j].call_flow, tableData[j].put_count,tableData[j].put_flow, tableData[j].json_performance,
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
    const callFlowTheme = call_flow > 0 ? 'success' : 'danger'
    const callFlowTrend = call_flow > 0 ? 'trending-up' : 'trending-down'
    const putFlowTheme = put_flow > 0 ? 'success' : 'danger'
    const putFlowTrend = put_flow > 0 ? 'trending-up' : 'trending-down'
    const jsonPerformanceTheme = json_performance > 0 ? 'success' : 'danger'
    const jsonPerformanceTrend = json_performance > 0 ? 'trending-up' : 'trending-down'
    const performanceTheme = performance > 0 ? 'success' : 'danger'
    const performanceTrend = performance > 0 ? 'trending-up' : 'trending-down'
    const badgeTheme = (type == 'CALL') ? 'success' : 'secondary';
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
    <td style = 'font-size: 12px;'><span class="badge bg-${badgeTheme}-transparent rounded-pill badge-sm fs-12 fw-semibold">${type}</span></td>
    <td style = 'font-size: 12px;'>${date_added}</td>
    <td style = 'font-size: 12px;'>$${added_price}</td>
    <td style = 'font-size: 12px;'>${Math.round(multiplier*100)/100}x</td>
    <td style = 'font-size: 12px;'>${call_count}</td>
    <td style = 'font-size: 12px;'><span class='badge bg-${callFlowTheme}-transparent fs-12 rounded-pill'>${Math.round((call_flow*100)*100)/100}%<i class='ti ti-${callFlowTrend} ms-1'></i></span></td>
    <td style = 'font-size: 12px;'>${put_count}</td>
    <td style = 'font-size: 12px;'><span class='badge bg-${putFlowTheme}-transparent fs-12 rounded-pill'>${Math.round((put_flow*100)*100)/100}%<i class='ti ti-${putFlowTrend} ms-1'></i></span></td>
    <td style = 'font-size: 12px;'>$${Math.round((market_cap/1000000000)*100)/100} B</td>
    <td style = 'font-size: 12px;'><span class='badge bg-${jsonPerformanceTheme}-transparent fs-12 rounded-pill'>${Math.round((json_performance*100)*100)/100}%<i class='ti ti-${jsonPerformanceTrend} ms-1'></i></span> / 
                <span class='badge bg-${performanceTheme}-transparent fs-12 rounded-pill'>${Math.round((performance*100)*100)/100}%<i class='ti ti-${performanceTrend} ms-1'></i></span></td>
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
        order: [[0, 'desc']],   //Soring by EventID decensing order
        "pageLength": arrSize,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ], dom: 'flirtBlp' //'Bfrtip'
    });
};