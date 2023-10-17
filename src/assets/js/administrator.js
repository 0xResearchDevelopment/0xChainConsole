var delayInMS = 2000;
var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';

var loadAdminWorkflow = () => {
    const profile = JSON.parse(localStorage.getItem('profileObj'));
    const username = profile.NAME_FIRST + " " + profile.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profile.PROFILE_PHOTO;
    if(profile.ROLE_CODE == 99){
        document.getElementById('admin-menu').style.display = 'block';
    }

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


var applyResponsivenessProcessed = () => {
    $('#adminSubscriptionWorkflowProcessedDataTable').DataTable({
        responsive: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: ''
        },
        //order: [[7, 'desc']],   //Soring by EventID decensing order
        "pageLength": 10,
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
                    showToastAlerts('process-stats-error', 'alert-error-msg', 'Rejected request# '+reqId);
                }
            }
        }).catch(err => {
            console.log("inside err");
            console.log(err, err.response);
            showToastAlerts('process-stats-error', 'alert-error-msg', 'Rejected request# '+reqId);
            if (err.response.status == 401) {
                showToastAlerts('process-stats-error', 'alert-error-msg', 'Token expired');
                setTimeout(() => {
                  window.location.href = 'sign-in-cover.html';
                }
                  , delayInMS);
              }
        });
};

var showToastAlerts = (divId, spanId, msg) => {
    document.getElementById(spanId).innerHTML = msg;
    const middlecentertoastExample = document.getElementById(divId);
    const toast = new bootstrap.Toast(middlecentertoastExample, { delay: delayInMS });
    toast.show();
  };
//******************************************* */