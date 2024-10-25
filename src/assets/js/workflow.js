var delayInMS = 3000;
var targetEndPointUrlBase = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev';
var botName = '';
var subscriptionFilePath = '';
const botId = localStorage.getItem('botId');
const profileObj = JSON.parse(localStorage.getItem('profileObj'));
const authToken = localStorage.getItem('authToken');
const userSubscriptionStatusValue = localStorage.getItem('userSubscriptionStatus');
let backToPreviousPage = "token-stats.html";

var loadWorkflowPage = () => {
    //Read parent page from this
    var url_string = window.location.search;
    const urlParams = new URLSearchParams(url_string);
    const parentPage = urlParams.get('code');

    console.log("## parentPage::", parentPage);

    var username = profileObj.NAME_FIRST + " " + profileObj.NAME_LAST;
    document.getElementById("header-user-name").innerHTML = username;
    document.getElementById("header-profile-photo").src = profileObj.PROFILE_PHOTO;
    if(profileObj.ROLE_CODE == 99){
        document.getElementById('admin-menu').style.display = 'block';
    }
    if(profileObj.ROLE_CODE <= 10){
      document.getElementById('equity-options-menu').style.display = 'none';
      document.getElementById('dashboard-menu-count').innerHTML = 1;
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
            botName = botDetails.BOT_NAME;
            const botNameSplitArray = botName.split("_");
            const tradeSymbol = botNameSplitArray[0];
            //API to call balance data for a symbol      
            getBalanceData(tradeSymbol)

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
 
            // var lockInEndDate = new Date(new Date().getTime()+(30*24*60*60*1000));                
            // lockInEndDate = (lockInEndDate.getDate()) + "-"
            //                         + months[lockInEndDate.getMonth()]  + "-" 
            //                         + lockInEndDate.getFullYear(); 
            document.getElementById("workflow-bot-id").innerHTML = botDetails.BOT_ID;
            document.getElementById("workflow-bot-name").innerHTML = botDetails.BOT_NAME;
            document.getElementById("workflow-base-icon").src = botDetails.BOT_BASE_ICON;
            document.getElementById("workflow-token-icon").src = botDetails.BOT_TOKEN_ICON;
            document.getElementById("subscription-date").innerHTML = currentDateTime;
            document.getElementById("service-for").innerHTML = serviceFor;
            // document.getElementById("workflow-lockin-text").innerHTML = 'I Agree for 30 days lock-in period ends on <b>' + lockInEndDate + '</b>';

            /*toImgBase64URL(
              botDetails.BOT_TOKEN_ICON,
              function(base64Url) {
                document.getElementById("workflow-token-icon").src = base64Url;
            });
            toImgBase64URL(
              botDetails.BOT_BASE_ICON,
              function(base64Url) {
                document.getElementById("workflow-base-icon").src = base64Url;
            });*/
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

var getBalanceData = (tradeSymbol) => {
  //###TODO need to replace all hardcoded values in this API call
  const endPointUrl = 'http://localhost:3000/api/binance/v1/getBalance';
  axios.post(
    endPointUrl,
    {
      'tradeSymbol': tradeSymbol
    },
    {
      headers: {
        'x-mbx-apiKey': 'oS1UaFODwH7tGrpYRvsX1BD3ETjDZYcGD1lTUp3u3dtMlbIOAnIDsow5MKpF7uDQ',
        'x-mbx-secretkey': 'vTx3T7BGkFPgJrwxTVLLxMQOLYCYWah92jWnwdL54HUuaTBEKcsctlNiAJiE8h3O',
        'target-endpoint-url': 'https://testnet.binance.vision/api/v3/account'
      }
    })
    .then(res => {
      console.log("### Inside getBalance:res.data: " + res.data);
      if (res.status == 200) {
        document.getElementById("workflow-free-balance").innerHTML = res?.data?.freeBalance ? res.data.freeBalance : 'NA';
        document.getElementById("workflow-locked-balance").innerHTML = res?.data?.lockedBalance ? res.data.freeBalance : 'NA';
      }
    })
    .catch(err => {
      console.log("### Inside getBalance:err.response", err);
    });
}

var validateInputs = () => {
    if(document.getElementById('workflow-whitelist').checked && document.getElementById('workflow-ip-address').checked
        && document.getElementById('workflow-terms').checked && document.getElementById('workflow-consent').checked
        && document.getElementById('workflow-remarks').value.length > 0)
        {
            document.getElementById('workflow-submit-request').disabled = false;
        }
    else{
        document.getElementById('workflow-submit-request').disabled = true;
    }

    if(document.getElementById('workflow-whitelist').checked && document.getElementById('workflow-ip-address').checked
        && document.getElementById('workflow-terms').checked && document.getElementById('workflow-consent').checked)
        {
            document.getElementById('workflow-generate-pdf').disabled = false;
        }
    else{
    document.getElementById('workflow-generate-pdf').disabled = true;
    }

    if(document.getElementById('workflow-file').value.length > 0){
      document.getElementById('workflow-upload').disabled = false;
    }
    else {
      document.getElementById('workflow-upload').disabled = true;
    }
}

var htmlToPdf = () => {
    /* const element = document.getElementById('invoice');
				// Choose the element and save the PDF for your user.
				html2pdf().from(element).save(); */
        
    var currentTimestamp = (new Date().getFullYear().toString() + '_' + (new Date().getMonth() + 1) + '_' + ( new Date().getDate()) + '_' + ( new Date().getHours() ) + '_' + ( new Date().getMinutes() ) + '_' + ( new Date().getSeconds()) );
    var pdfName = botId + '_' + botName + '_' + profileObj.USER_ID + '_' + profileObj.NAME_FIRST + '_' + profileObj.NAME_LAST + '_' + currentTimestamp;
    var element = document.getElementById('workflow-container');
    var opt = {
        margin:       0,
        filename:     pdfName,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, scrollY: 0 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    
    //console.log('element: '+ element);
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
        agreeLockInDays: 1 ,
        agreeTermsDocPath: subscriptionFilePath,
        botName : botName
    }
    
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

var uploadSubscriptionDoc = () => {
  var formData = new FormData();
  var subscriptionFile = document.getElementById('workflow-file');
  formData.append("file", subscriptionFile.files[0]);
    
   axios
    .post(
        targetEndPointUrlBase +'/api/subscription/uploadSubscriptionDoc',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
    )
    .then(res => {
        console.log("##uploadSubscriptionDoc## - res: " + JSON.stringify(res.data));
        subscriptionFilePath = res.data.filepath;
        if (res.status == 200) {
            showToastAlerts('workflow-success','alert-success-msg',res.data.message);
            validateInputs();
            document.getElementById('workflow-file-uploaded').style.display = 'block';
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

//Function to convert img source url to Base64 url
/* var toImgBase64URL = (src, callback, outputFormat) =>  {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
} */