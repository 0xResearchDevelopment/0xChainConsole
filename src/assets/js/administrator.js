var delayInMS = 2000;
var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';

var loadAdminWorkflow = () => {
    loadHeaderData();
    const profile = JSON.parse(localStorage.getItem('profileObj'));

    const authToken = localStorage.getItem('authToken');
    if (profile.ROLE_CODE == 99) {
        showToastAlerts('process-stats-success', 'alert-success-msg', 'You are eligible to access');
        axios
            .post(
                targetEndPointUrlBase + '/api/subscription/getWorkflow',
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
                    const pendingRequests = (res.data.pendingRequests != undefined && res.data.pendingRequests != null) ? res.data.pendingRequests : null;
                    const processedRequests = (res.data.processedRequests != undefined && res.data.processedRequests != null) ? res.data.processedRequests : null;

                    for (let i = 0; i < pendingRequests.length; i++) {
                        createTableRowsPending(
                            pendingRequests[i].REQ_ID,
                            pendingRequests[i].REQ_TYPE,
                            pendingRequests[i].REQ_STATUS,
                            pendingRequests[i].REQ_DESC,
                            pendingRequests[i].BOT_ID,
                            pendingRequests[i].EMAIL_ID,
                            pendingRequests[i].SUBMITTED_ON,
                        );
                    }

                    for (let i = 0; i < processedRequests.length; i++) {
                        createTableRowsProcessed(
                            processedRequests[i].REQ_ID,
                            processedRequests[i].REQ_TYPE,
                            processedRequests[i].REQ_STATUS,
                            processedRequests[i].REQ_DESC,
                            processedRequests[i].BOT_ID,
                            processedRequests[i].EMAIL_ID,
                            processedRequests[i].SUBMITTED_ON,
                            processedRequests[i].PROCESSED_ON
                        );
                    }

                    applyResponsivenessPending();
                    applyResponsivenessProcessed();
                }
            }).catch(err => {
                console.log("inside err");
                console.log(err, err.response);
                if (err.response.status == 401) {
                    showToastAlerts('update-profile-error','alert-error-msg',err.response.data.message);
                    setTimeout(()=> {
                       window.location.href = 'sign-in-cover.html';
                     }
                     ,delayInMS);
                }
            });
    } else {
        showToastAlerts('process-stats-error', 'alert-error-msg', 'Unauthorized access');
        setTimeout(() => {
            window.location.href = 'index.html';
          }, delayInMS);
    }
};

var createTableRowsPending = (reqId, reqType, reqStatus, reqDesc, botId, userEmailID, submittedTS) => {
    const colorCode = (reqType == 'SUBSCRIBE') ? 'success' : 'secondary';
    const row = document.createElement('tr');
    let reqTypeValue = "\"" + reqType + "\"";
    let userEmailIDValue = "\"" + userEmailID + "\"";
    row.innerHTML = `<td style = 'font-size: 12px;'>${reqId}</td>
    <td style = 'font-size: 12px;'><div class='hstack gap-2 fs-12'><a href='javascript:processRequest(${reqId}, ${reqTypeValue}, 1, ${botId}, ${userEmailIDValue});' class='btn btn-sm btn-info-light'>Approve<i class='ri-checkbox-circle-fill'></i></a><a href='javascript:processRequest(${reqId}, ${reqTypeValue}, 0, ${botId}, ${userEmailIDValue});' class='btn btn-sm btn-danger-light'>Reject<i class='ri-close-circle-fill'></i></a></div></td>
    <td style = 'font-size: 12px;'><span class='text-${colorCode} fs-12'>${reqType}</span></td>
    <td style = 'font-size: 12px;'>${reqStatus}</td>
    <td style = 'font-size: 12px;'>${reqDesc}</td>
    <td style = 'font-size: 12px;'>${botId}</td>
    <td style = 'font-size: 12px;'>${userEmailID}</td>
    <td style = 'font-size: 12px;'>${submittedTS}</td>`;

    const tbody = document.getElementById("workflow-pending-tbody");
    tbody.appendChild(row);
}

var createTableRowsProcessed = (reqId, reqType, reqStatus, reqDesc, botId, userEmailID, submittedTS, processedTS) => {
    const colorCode = (reqType == 'SUBSCRIBE') ? 'success' : 'secondary';
    const row = document.createElement('tr');
    let reqTypeValue = "\"" + reqType + "\"";
    let userEmailIDValue = "\"" + userEmailID + "\"";
    row.innerHTML = `<td style = 'font-size: 12px;'>${reqId}</td>
    <td style = 'font-size: 12px;'><span class='text-${colorCode} fs-12'>${reqType}</span></td>
    <td style = 'font-size: 12px;'>${reqStatus}</td>
    <td style = 'font-size: 12px;'>${reqDesc}</td>
    <td style = 'font-size: 12px;'>${botId}</td>
    <td style = 'font-size: 12px;'>${userEmailID}</td>
    <td style = 'font-size: 12px;'>${submittedTS}</td>
    <td style = 'font-size: 12px;'>${processedTS}</td>`;

    const tbody = document.getElementById("workflow-processed-tbody");
    tbody.appendChild(row);
}

//<td style = 'font-size: 12px;'>${botSymbol}</td>
//<td style = 'font-size: 12px;'>${botTimeframe}</td>
//<td style = 'font-size: 12px;'>${botExchange}</td>
    
var createTableRowsBots = (botId, botSymbol, botTimeframe, botExchange, botName, botSimulate, botStatus, botBaseIcon, botTokenIcon, currencyId, createdOn, updatedOn) => {
    const row = document.createElement('tr');
    let botSimulateText = botSimulate == 1 ? 'Yes' : 'No';
    let botStatusText = botStatus == 1 ? '<span class="text-success"><i class="ri-checkbox-circle-fill fs-14"></i>  Active</span>' : '<span class="text-muted"><i class="ri-checkbox-circle-blank-fill fs-14"></i>  Inactive</span>';
    row.innerHTML = `<td style = 'font-size: 12px;'>${botId}</td>
                    <td style = 'font-size: 12px;'>
                        <div class="hstack gap-2 fs-15">
                            <a href="javascript:loadUpdateBotModal('${botId}', '${botSymbol}', '${botTimeframe}', '${botExchange}', '${botName}','${botSimulate}','${botStatus}','${botBaseIcon}','${botTokenIcon}','${currencyId}');" class="btn btn-icon btn-sm btn-info-light rounded-pill"><i class="ri-edit-line"></i></a>
                            <a href="javascript:deleteBot('${botId}');" class="btn btn-icon btn-sm btn-danger-light rounded-pill"><i class="ri-delete-bin-line"></i></a>
                        </div>
                    </td>


    <td style = 'font-size: 12px;'>${botName}</td>
    <td style = 'font-size: 12px;'>${botSimulateText}</td>
    <td style = 'font-size: 12px;'>${botStatusText}</td>
    <td style = 'font-size: 12px;'><div class="avatar avatar-sm br-4 ms-auto"><img src=${botBaseIcon} class="fs-20"></div></td>
    <td style = 'font-size: 12px;'><div class="avatar avatar-sm br-4 ms-auto"><img src=${botTokenIcon} class="fs-20"></div></td>
    <td style = 'font-size: 12px;'>${currencyId}</td>
    <td style = 'font-size: 12px;'>${createdOn}</td>
    <td style = 'font-size: 12px;'>${updatedOn}</td>`;


    const tbody = document.getElementById("admin-bots-list-tbody");
    tbody.appendChild(row);
}

var createTableRowsUsers = (userId, emailId, clientId, firstName, lastName, country, phone, role, status, createdOn, updatedOn) => {
    const row = document.createElement('tr');
    let roleText = role == 99 ? 'Admin' : 'User';
    let statusText = status == 1 ? 'Active' : 'Inactive';
    let editIconElement = '<a href="javascript:loadUpdateUserModal(\'' + emailId + '\' ,\'' + status + '\', \'' + role + '\',  \'' + clientId + '\');" class="btn btn-icon btn-sm btn-info-light rounded-pill"><i class="ri-edit-line"></i></a>';
    let buttonElement = status == 0 ? '<a href="javascript:updateUserData(\'' + emailId + '\' ,1, \'' + role + '\',  \'' + clientId + '\');" class="btn btn-sm btn-info-light">Activate</a>' 
                            : '<a href="javascript:updateUserData(\'' + emailId + '\' ,0, \'' + role + '\',  \'' + clientId + '\');" class="btn btn-sm btn-danger-light">Deactivate</a>';
    row.innerHTML = `<td style = 'font-size: 12px;'>${userId} ${editIconElement}</td>
                    <td style = 'font-size: 12px;'>${buttonElement}</td>
                    <td style = 'font-size: 12px;'>${emailId}</td>
                    <td style = 'font-size: 12px;'>${clientId}</td>
                    <td style = 'font-size: 12px;'>${firstName}</td>
                    <td style = 'font-size: 12px;'>${lastName}</td>
                    <td style = 'font-size: 12px;'>${country}</td>
                    <td style = 'font-size: 12px;'>${phone}</td>
                    <td style = 'font-size: 12px;'>${roleText}</td>
                    <td style = 'font-size: 12px;'>${role}</td>
                    <td style = 'font-size: 12px;'>${statusText}</td>
                    <td style = 'font-size: 12px;'>${createdOn}</td>
                    <td style = 'font-size: 12px;'>${updatedOn}</td>`;


    const tbody = document.getElementById("admin-users-list-tbody");
    tbody.appendChild(row);
}

var applyResponsivenessPending = () => {
    $('#adminSubscriptionWorkflowPendingDataTable').DataTable({
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

// var t = $('#add-row').DataTable();
// var counter = 1;
// $('#addRow').on('click', function () {
//     t.row.add([counter + '.1', counter + '.2', counter + '.3', counter + '.4', counter + '.5']).draw(false);
//     counter++;
// });

var applyResponsivenessProcessed = () => {
    $('#adminSubscriptionWorkflowProcessedDataTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
        },
        order: [[7, 'desc']],   //Soring by EventID decensing order
        "pageLength": 10,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ], dom: 'flirtBlp' //'Bfrtip'
    });
};

var applyResponsivenessBots = () => {
    $('#adminBotsListDataTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
        },
        order: [[0, 'desc']],   //Soring by BotID decensing order
        "pageLength": 25,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ], dom: 'flirtBlp' //'Bfrtip'
    });
};

var applyResponsivenessUsers = () => {
    $('#adminUsersListDataTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
        },
        order: [[0, 'desc']],   //Soring by BotID decensing order
        "pageLength": 25,
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ], dom: 'flirtBlp' //'Bfrtip'
    });
};

var processRequest = (reqId, reqType, reqAction, botId, userEmailID) => {
    // reqAction =1 then APPROVED
    // reqAction =0 then REJECTED
    //reqType = UNSUBSCRIBE & SUBSCRIBE
    //call /api/subscription/processRequest service
    let reqActionValue;
    if(reqAction == 1) {
        reqActionValue = "APPROVED";
    } else if ( reqAction == 0) {
        reqActionValue = "REJECTED";
    }

    const authToken = localStorage.getItem('authToken');
    axios.post(
            targetEndPointUrlBase+'/api/subscription/processRequest',
            {
                reqId : reqId,
                reqType : reqType,
                reqStatusRevised : reqActionValue,
                botId : botId,
                reqResolution : "request processed",
                userEmailId : userEmailID
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            if (res.status == 200) {
                console.log(res.data);
                //const pendingRequests = (res.data.pendingRequests!=undefined && res.data.pendingRequests!=null)?res.data.pendingRequests:null;
                if(reqAction == 1) {
                    console.log(reqId + "  " + reqType + " APPROVED " + botId + " processed " + userEmailID);
                    showToastAlerts('process-stats-success', 'alert-success-msg', 'Approved request# '+reqId);
                } else if ( reqAction == 0) {
                    console.log(reqId + "  " + reqType + " REJECTED " + botId + " processed " + userEmailID);
                    reqActionValue = "REJECTED";
                    showToastAlerts('process-stats-success', 'alert-success-msg', 'Rejected request# '+reqId);
                }
                setTimeout(()=> {
                    window.location.href = 'admin-workflow.html';
                }, delayInMS);
            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            showToastAlerts('process-stats-error','alert-error-msg',err.response.data.message);
            if (err.response.status == 401) {
                setTimeout(() => {
                  window.location.href = 'sign-in-cover.html';
                }, delayInMS);
              }
        });
};

var showToastAlerts = (divId, spanId, msg) => {
    document.getElementById(spanId).innerHTML = msg;
    const middlecentertoastExample = document.getElementById(divId);
    const toast = new bootstrap.Toast(middlecentertoastExample, { delay: delayInMS });
    toast.show();
};

var loadAdminBots = () => {
    loadHeaderData();

    const profile = JSON.parse(localStorage.getItem('profileObj'));
    const authToken = localStorage.getItem('authToken');
    if (profile.ROLE_CODE == 99) {
        //showToastAlerts('admin-bots-success', 'alert-success-msg', 'You are eligible to access');
        axios
            .get(
                targetEndPointUrlBase + '/api/botdata/getAllBots',
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            )
            .then(res => {
                if (res.status == 200) {
                    console.log(res.data);
                    const bots = (res.data.bots != undefined && res.data.bots != null) ? res.data.bots : null;

                    for (let i = 0; i < bots.length; i++) {
                        createTableRowsBots(
                            bots[i].BOT_ID,
                            bots[i].BOT_SYMBOL,
                            bots[i].BOT_TIMEFRAME,
                            bots[i].BOT_EXCHANGE,
                            bots[i].BOT_NAME,
                            bots[i].BOT_SIMULATE,
                            bots[i].BOT_STATUS,
                            bots[i].BOT_BASE_ICON,
                            bots[i].BOT_TOKEN_ICON,
                            bots[i].CURRENCY_ID,
                            bots[i].CREATED_ON,
                            bots[i].UPDATED_ON
                        );
                    }
                    applyResponsivenessBots();
                }
            }).catch(err => {
                console.log("inside err");
                console.log(err, err.response);
                showToastAlerts('admin-bots-error','alert-error-msg',err.response.data.message);
                if (err.response.status == 401) {
                    setTimeout(()=> {
                       window.location.href = 'sign-in-cover.html';
                     }, delayInMS);
                }
            });
    } else {
        showToastAlerts('admin-bots-error', 'alert-error-msg', 'Unauthorized access');
        setTimeout(() => {
            window.location.href = 'index.html';
          }, delayInMS);
    }
};

var loadAdminUsers = () => {
    loadHeaderData();

    const profile = JSON.parse(localStorage.getItem('profileObj'));
    const authToken = localStorage.getItem('authToken');
    if (profile.ROLE_CODE == 99) {
        //showToastAlerts('admin-bots-success', 'alert-success-msg', 'You are eligible to access');
        axios
            .get(
                targetEndPointUrlBase + '/api/auth/getAllUsers',
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            )
            .then(res => {
                if (res.status == 200) {
                    console.log(res.data);
                    const users = (res.data.users != undefined && res.data.users != null) ? res.data.users : null;

                    for (let i = 0; i < users.length; i++) {
                        createTableRowsUsers(
                            users[i].USER_ID,
                            users[i].EMAIL_ID,
                            users[i].NAME_CLIENT_ID,
                            users[i].NAME_FIRST,
                            users[i].NAME_LAST,
                            users[i].COUNTRY,
                            users[i].PHONE_PRIMARY,
                            users[i].ROLE_CODE,
                            users[i].STATUS,
                            users[i].CREATED_TS,
                            users[i].UPDATED_TS
                        );
                    }
                    applyResponsivenessUsers();
                }
            }).catch(err => {
                console.log("inside err");
                console.log(err, err.response);
                showToastAlerts('admin-users-error','alert-error-msg',err.response.data.message);
                if (err.response.status == 401) {
                    setTimeout(()=> {
                       window.location.href = 'sign-in-cover.html';
                     }, 0);
                }
            });
    } else {
        showToastAlerts('admin-users-error', 'alert-error-msg', 'Unauthorized access');
        setTimeout(() => {
            window.location.href = 'index.html';
          }, delayInMS);
    }
}

var addBotClicked = () => {
    var parentPage = 0; //parentPage = 0 -> Add Bot, 1 -> Update Bot
    window.location.href = 'bot-add.html?code='+parentPage;
}

var loadAddBotPage = () => {
    loadHeaderData();
}

var loadHeaderData = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
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
}

var createBot = () => {
    resetAddBotInputFields();
    var botSymbol = document.getElementById('bot-symbol').value;
    var botTimeframe = document.getElementById('bot-timeframe').options[document.getElementById('bot-timeframe').selectedIndex].text;
    var botExchange = document.getElementById('bot-exchange').value;
    var botBaseIcon = document.getElementById('bot-base-icon').value;
    var botTokenIcon = document.getElementById('bot-token-icon').value;
    var currencyId = document.getElementById('currency-id').value;

    if(botSymbol.length == 0){
        document.getElementById('bot-symbol').classList.add("is-invalid");
        document.getElementById('bot-symbol-empty').style.display = 'block';
    }
    if(botTimeframe == 'Select Timeframe'){
        document.getElementById('bot-timeframe').classList.add("is-invalid");
        document.getElementById('bot-timeframe-empty').style.display = 'block';
    }
    if(botExchange.length == 0){
        document.getElementById('bot-exchange').classList.add("is-invalid");
        document.getElementById('bot-exchange-empty').style.display = 'block';
    }
    if(botBaseIcon.length == 0){
        document.getElementById('bot-base-icon').classList.add("is-invalid");
        document.getElementById('bot-base-icon-empty').style.display = 'block';
    }
    if(botTokenIcon.length == 0){
        document.getElementById('bot-token-icon').classList.add("is-invalid");
        document.getElementById('bot-token-icon-empty').style.display = 'block';
    }
    if(currencyId <= 0){
        document.getElementById('currency-id').classList.add("is-invalid");
        document.getElementById('currency-id-empty').style.display = 'block';
    }

    if(botSymbol.length > 0 && botTimeframe != 'Select Timeframe' && botExchange.length > 0 
        && botBaseIcon.length > 0 && botTokenIcon.length > 0 && currencyId > 0) {
        
        document.getElementById('create-bot-button').disabled = true;

        const botData = {
            botSymbol: botSymbol.toUpperCase(),
            botTimeframe: botTimeframe.toUpperCase(),
            botExchange: botExchange.toUpperCase(),
            botSimulate: document.getElementById("bot-simulate").checked ? 1 : 0,
            botStatus: document.querySelector('input[name="bot-status-radio"]:checked').value == 'active' ? 1 : 0,
            botBaseIcon: botBaseIcon,
            botTokenIcon: botTokenIcon,
            currencyId: currencyId
        }

        console.log(botData);

        const authToken = localStorage.getItem('authToken');
        //const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
         axios
            .post(
                targetEndPointUrlBase +'/api/botdata/createBot',
                botData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            )
            .then(res => {
                console.log("res: " + JSON.stringify(res.data));
                showToastAlerts('add-bot-success','alert-success-msg',res.data.message);
                if (res.status == 201) {
                    setTimeout(()=> {
                        window.location.href='admin-bots.html';
                    }, delayInMS);
                }
            })
            .catch(err => {
                console.log(err);
                showToastAlerts('add-bot-error','alert-error-msg',err.response.data.message);
                if (err.response.status == 401) {
                    setTimeout(()=> {
                        location.href = "sign-in-cover.html";
                     }, delayInMS);
                }
            });
    }
}

var resetAddBotInputFields = () => {
    document.getElementById('bot-symbol-empty').style.display = 'none';
    document.getElementById('bot-symbol').classList.remove("is-invalid");
    document.getElementById('bot-timeframe-empty').style.display = 'none';
    document.getElementById('bot-timeframe').classList.remove("is-invalid");
    document.getElementById('bot-exchange-empty').style.display = 'none';
    document.getElementById('bot-exchange').classList.remove("is-invalid");
    document.getElementById('bot-base-icon-empty').style.display = 'none';
    document.getElementById('bot-base-icon').classList.remove("is-invalid");
    document.getElementById('bot-token-icon-empty').style.display = 'none';
    document.getElementById('bot-token-icon').classList.remove("is-invalid");
    document.getElementById('currency-id-empty').style.display = 'none';
    document.getElementById('currency-id').classList.remove("is-invalid");
}

var updateBot = (botId,botSymbol,botTimeframe,botExchange,botSimulate,botStatus,botBaseIcon,botTokenIcon,currencyId) => { //parentPage = 0 -> delete request, parentPage = 1 -> update request

const updatedBot = {
                botId: botId,
                botSymbol: botSymbol.toUpperCase(),
                botTimeframe: botTimeframe.toUpperCase(),
                botExchange: botExchange.toUpperCase(),
                botSimulate: botSimulate,
                botStatus: botStatus,
                botBaseIcon: botBaseIcon,
                botTokenIcon: botTokenIcon,
                currencyId: currencyId
            }

const authToken = localStorage.getItem('authToken');
    axios
        .post(
            targetEndPointUrlBase +'/api/botdata/updateBot',
            updatedBot,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            console.log("res: " + JSON.stringify(res.data));
            if (res.status == 200) {
                    showToastAlerts('admin-bots-success','alert-success-msg',res.data.message);
                    setTimeout(()=> {
                        window.location.href='admin-bots.html';
                    }
                    ,delayInMS);
            }
        })
        .catch(err => {
            console.log(err);
            showToastAlerts('admin-bots-error','alert-success-msg',err.response.data.message);
            if (err.response.status == 401) {
                setTimeout(()=> {
                    window.location.href='sign-in-cover.html';
                }, delayInMS);
            }
        });
};

var deleteBot = (botId) => { //TODO: need to implement modal before deleting the bot (its a physical delete)

    const updatedBot = {
        botId: botId
    }
    const authToken = localStorage.getItem('authToken');
    axios
        .post(
            targetEndPointUrlBase +'/api/botdata/deleteBot',
            updatedBot,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            console.log("res: " + JSON.stringify(res.data));
            if (res.status == 200) {
                showToastAlerts('admin-bots-success','alert-success-msg',res.data.message);
                setTimeout(()=> {
                    window.location.href='admin-bots.html';
                },delayInMS);
            }
        })
        .catch(err => {
            console.log(err);
            showToastAlerts('admin-bots-error','alert-error-msg',"Error while deleting this bot"); // err.response.data.message); //FIXME: error message is getting undefined.
            if (err.response.status == 401) {
                setTimeout(()=> {
                    window.location.href='sign-in-cover.html';
                }, delayInMS);
            }
        });
};

var loadUpdateBotModal = (botId,botSymbol,botTimeframe,botExchange,botName,botSimulate,botStatus,botBaseIcon,botTokenIcon,currencyId) => {
    $("#updateBotModal").modal('show'); 
    document.getElementById("staticBackdropLabel").innerHTML = "Update Bot: " + botName;
    document.getElementById('bot-symbol').value = botSymbol;
    document.getElementById('bot-timeframe').value = botTimeframe;
    document.getElementById('bot-exchange').value = botExchange;
    document.getElementById("bot-simulate").checked = botSimulate == 1 ? true : false;
    if(botStatus == 1){
        document.getElementById("bot-status-active").checked = true;
    }
    else if(botStatus == 0){
        document.getElementById("bot-status-inactive").checked = true;
    }

    document.getElementById('bot-base-icon').value = botBaseIcon;
    document.getElementById('bot-token-icon').value = botTokenIcon;
    document.getElementById('currency-id').value = currencyId;

    var updateBotButton = document.getElementById("update-modal-submit");
    updateBotButton.onclick = function callValidateUpdateBotInput() {
        validateUpdateBotInput(botId);
    }
}

var loadUpdateUserModal = (email, userStatus, roleCode, clientId) => {
    $("#updateUserModal").modal('show'); 
    if(userStatus == 1){
        document.getElementById("user-status-active").checked = true;
    }
    else if(userStatus == 0){
        document.getElementById("user-status-inactive").checked = true;
    }

    document.getElementById('role-code').value = roleCode;
    document.getElementById('client-id').value = clientId;

    var updateBotButton = document.getElementById("update-user-modal-submit");
    updateBotButton.onclick = function callValidateUpdateUserInput() {
        validateUpdateUserInput(email);
    }
}

var validateUpdateBotInput = (botId) => {
    document.getElementById('bot-symbol-empty').style.display = 'none';
    document.getElementById('bot-symbol').classList.remove("is-invalid");
    document.getElementById('bot-exchange-empty').style.display = 'none';
    document.getElementById('bot-exchange').classList.remove("is-invalid");
    document.getElementById('bot-base-icon-empty').style.display = 'none';
    document.getElementById('bot-base-icon').classList.remove("is-invalid");
    document.getElementById('bot-token-icon-empty').style.display = 'none';
    document.getElementById('bot-token-icon').classList.remove("is-invalid");
    document.getElementById('currency-id-empty').style.display = 'none';
    document.getElementById('currency-id').classList.remove("is-invalid");
    
    var botSymbol = document.getElementById('bot-symbol').value;
    var botTimeframe = document.getElementById('bot-timeframe').options[document.getElementById('bot-timeframe').selectedIndex].text;
    var botExchange = document.getElementById('bot-exchange').value;
    var botSimulate = document.getElementById("bot-simulate").checked ? 1 : 0;
    var botStatus = document.querySelector('input[name="bot-status-radio"]:checked').value == 'active' ? 1 : 0;
    var botBaseIcon = document.getElementById('bot-base-icon').value;
    var botTokenIcon = document.getElementById('bot-token-icon').value;
    var currencyId = document.getElementById('currency-id').value;

    if(botSymbol.length == 0){
        document.getElementById('bot-symbol').classList.add("is-invalid");
        document.getElementById('bot-symbol-empty').style.display = 'block';
    }
    if(botExchange.length == 0){
        document.getElementById('bot-exchange').classList.add("is-invalid");
        document.getElementById('bot-exchange-empty').style.display = 'block';
    }
    if(botBaseIcon.length == 0){
        document.getElementById('bot-base-icon').classList.add("is-invalid");
        document.getElementById('bot-base-icon-empty').style.display = 'block';
    }
    if(botTokenIcon.length == 0){
        document.getElementById('bot-token-icon').classList.add("is-invalid");
        document.getElementById('bot-token-icon-empty').style.display = 'block';
    }
    if(currencyId <= 0){
        document.getElementById('currency-id').classList.add("is-invalid");
        document.getElementById('currency-id-empty').style.display = 'block';
    }

    if(botSymbol.length > 0 && botExchange.length > 0 && botBaseIcon.length > 0 && botTokenIcon.length > 0 && currencyId > 0) {
        updateBot(botId,botSymbol,botTimeframe,botExchange,botSimulate,botStatus,botBaseIcon,botTokenIcon,currencyId);
        $("#updateBotModal").modal('hide');
    }
} 

var validateUpdateUserInput = (email) => {
    document.getElementById('role-code-empty').style.display = 'none';
    document.getElementById('role-code').classList.remove("is-invalid");
    document.getElementById('client-id-empty').style.display = 'none';
    document.getElementById('client-id').classList.remove("is-invalid");
    
    //var botSimulate = document.getElementById("bot-simulate").checked ? 1 : 0;
    var userStatus = document.querySelector('input[name="user-status-radio"]:checked').value == 'active' ? 1 : 0;
    var roleCode = document.getElementById('role-code').value;
    var clientId = document.getElementById('client-id').value;

    if(roleCode.length == 0){
        document.getElementById('role-code').classList.add("is-invalid");
        document.getElementById('role-code-empty').style.display = 'block';
    }

    if(clientId.length == 0){
        document.getElementById('client-id').classList.add("is-invalid");
        document.getElementById('client-id-empty').style.display = 'block';
    }

    if(roleCode.length > 0 && clientId.length > 0) {
        updateUserData(email,userStatus,roleCode,clientId);
        $("#updateUserModal").modal('hide');
    }
} 

var updateUserData = (email,status,role,clientId) => {
    const updatedUserData = {
                    email: email,
                    status: status,
                    role_code: role,
                    name_client_id: clientId
                }
                
    const authToken = localStorage.getItem('authToken');
        axios
            .post(
                targetEndPointUrlBase +'/api/auth/updateUserData',
                updatedUserData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            )
            .then(res => {
                console.log("res: " + JSON.stringify(res.data));
                if (res.status == 200) {
                        showToastAlerts('admin-users-success','alert-success-msg',res.data.message);
                        setTimeout(()=> {
                            window.location.href='admin-users.html';
                        }
                        ,delayInMS);
                }
            })
            .catch(err => {
                console.log(err);
                showToastAlerts('admin-users-error','alert-success-msg',err.response.data.message);
                if (err.response.status == 401) {
                    setTimeout(()=> {
                        window.location.href='sign-in-cover.html';
                    }, delayInMS);
                }
            });
}
//******************************************* */