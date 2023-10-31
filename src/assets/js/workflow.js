var delayInMS = 3000;
var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';
const botId = localStorage.getItem('botId');
const authToken = localStorage.getItem('authToken');
const userSubscriptionStatusValue = localStorage.getItem('userSubscriptionStatus');
let backToPreviousPage = "token-stats.html";

var loadWorkflowPage = () => {
    //Read parent page from this
    var url_string = window.location.search;
    const urlParams = new URLSearchParams(url_string);
    const parentPage = urlParams.get('code');

    console.log("## parentPage::", parentPage);

    const profileObj = JSON.parse(localStorage.getItem('profileObj'));
    var username = profileObj.NAME_FIRST + " " + profileObj.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profileObj.PROFILE_PHOTO;
    if(profileObj.ROLE_CODE == 99){
        document.getElementById('admin-menu').style.display = 'block';
      }

    var targetEndPointUrl = targetEndPointUrlBase+'/api/tradingdata/getTokenStats';
    if (parentPage == 1) {
      targetEndPointUrl = targetEndPointUrlBase+'/api/subscription/getBotStats';
      backToPreviousPage = "bot-stats.html";
    }
    console.log("## targetEndPointUrl:", targetEndPointUrl);

    axios.post(
        targetEndPointUrl,
        {
          botId: botId
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })
        .then(res => {
          console.log("### Inside getTokenStats:res.data: " + res.data);
          if (res.status == 200) {
            console.log("### Inside getTokenStats:res.data.tradeTransHistoryOneRow:", res.data.tradeTransHistoryOneRow);
            const botDetails = res.data.tradeTransHistoryOneRow; // 1st row from history
            const serviceFor = userSubscriptionStatusValue == 0 ? 'SUBSCRIBE' : 'UNSUBSCRIBE';  //FIXME: date format needs to be changes and Date format

            //const appCurrentDateTime = new Date().toLocaleString("sv");
            //console.log("### Date & Timezone:", appCurrentDateTime);

            const currentMonth = new Date();
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const currentDateTime =  new Date().getDate() + "-"
                            + months[currentMonth.getMonth()]  + "-" 
                            + new Date().getFullYear() + " "  
                            + new Date().getHours() + ":"  
                            + new Date().getMinutes() + ":" 
                            + new Date().getSeconds();
            document.getElementById("workflow-bot-id").innerHTML = botDetails.BOT_ID;
            document.getElementById("workflow-bot-name").innerHTML = botDetails.BOT_NAME;
            document.getElementById("workflow-base-icon").src = botDetails.BOT_BASE_ICON;
            document.getElementById("workflow-token-icon").src = botDetails.BOT_TOKEN_ICON;
            document.getElementById("subscription-date").innerHTML = currentDateTime;
            document.getElementById("service-for").innerHTML = serviceFor;
          }
        })
        .catch(err => {
          console.log("### Inside getTokenStats:err.response", err);
          
          if (err.response.status == 401) {
            showToastAlerts('workflow-error', 'alert-error-msg', err.response.data.message);
            setTimeout(() => {
              window.location.href = 'sign-in-cover.html';
            }
              , delayInMS);
          }
        });
}

var validateInputs = () => {
    if(document.getElementById('workflow-whitelist').checked && document.getElementById('workflow-ip-address').checked
        && document.getElementById('workflow-terms').checked && document.getElementById('workflow-consent').checked
        && document.getElementById('workflow-file').value.length > 0 && document.getElementById('workflow-remarks').value.length > 0)
        {
            document.getElementById('workflow-submit-request').disabled = false;
        }
    else{
        document.getElementById('workflow-submit-request').disabled = true;
    }
    if(document.getElementById('workflow-whitelist').checked && document.getElementById('workflow-ip-address').checked
        && document.getElementById('workflow-terms').checked && document.getElementById('workflow-consent').checked
        && document.getElementById('workflow-lockin').checked)
        {
            document.getElementById('workflow-generate-pdf').disabled = false;
        }
    else{
    document.getElementById('workflow-generate-pdf').disabled = true;
    }
}

var htmlToPdf = () => {
    /* const element = document.getElementById('invoice');
				// Choose the element and save the PDF for your user.
				html2pdf().from(element).save(); */

    var element = document.getElementById('workflow-container');
    var opt = {
        margin:       0,
        filename:     'subscription-form.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
}

var goBackToPreviousPage = () => {
  window.location.href=backToPreviousPage;//'bots-list.html';
};

var submitRequest = () => {
  let botName = document.getElementById("workflow-bot-name").innerHTML;
  let requestDescription = botName + " - " + document.getElementById('workflow-remarks').value;
    const requestBody = {
        reqType: document.getElementById("service-for").innerHTML,
        reqDesc: requestDescription,
        botId: botId,
        agreeWhitelist: document.getElementById('workflow-whitelist').checked ? 1 : 0,
        agreeIpAdded: document.getElementById('workflow-ip-address').checked ? 1 : 0,
        agreeTerms: document.getElementById('workflow-terms').checked ? 1 : 0,
        agreeConsent: document.getElementById('workflow-consent').checked ? 1 : 0,
        agreeLockInDays: document.getElementById('workflow-lockin').checked ? 1 : 0,
        agreeTermsDocPath: document.getElementById('workflow-file').value,
        botName : botName
    }
    
    //authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lX2ZpcnN0IjoiU2FkaXNoIiwibmFtZV9sYXN0IjoiViIsImVtYWlsIjoic2FkaXNoLnZAZ21haWwuY29tIn0sImlhdCI6MTY5NTgwODc1MSwiZXhwIjoxNjk1ODEyMzUxfQ.pAhMCZx9hehFfrioJEBaHQ3GvsQ2VXPduKN7QkRtAiE';
   axios
    .post(
        targetEndPointUrlBase +'/api/subscription/placeRequest',
        requestBody,
        {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }
    )
    .then(res => {
        console.log("res: " + JSON.stringify(res.data));
        if (res.status == 200) {
            showToastAlerts('workflow-success','alert-success-msg',res.data.message);
            document.getElementById('workflow-submit-request').disabled = true;
            setTimeout(()=> {
              goBackToPreviousPage();
            }
            ,delayInMS);
        }
    })
    .catch(err => {
        console.log(err);
            if (err.response.status == 401) {
            showToastAlerts('workflow-error','alert-error-msg',err.response.data.message);
            setTimeout(()=> {
                location.href = "sign-in-cover.html";
                }
                ,delayInMS);
        }
    });
}
