
const signUp = async() =>  {

    const myBody = {
        "name_first":document.getElementById("signup-fname").value,
        "name_last":document.getElementById("signup-lname").value,
        "email":document.getElementById("signup-email").value,
        "password":document.getElementById("signup-password").value
    };
    console.log(myBody);
    const response = await fetch('https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myBody)
    });

    const myJson = await response.json();
    if(myJson.code == 422) {
        alert(JSON.stringify(myJson.errors.msg));
        document.getElementById("signup-fname").value = '';
        document.getElementById("signup-lname").value = '';
        document.getElementById("signup-email").value = '';
        document.getElementById("signup-password").value = '';
    }
    else if(myJson.code == 201){
        alert(JSON.stringify(myJson.message)); 
        sessionStorage.setItem('verfication-token', myJson.results.verification.token);
        location.href = "sign-up-verification.html";
    }

    /*await axios
    .post(
        'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/register',
        {
            name_first:document.getElementById("signup-fname").value,
            name_last:document.getElementById("signup-lname").value,
            email:document.getElementById("signup-email").value,
            password:document.getElementById("signup-password").value
        },
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    )
    .then(res => {
        console.log(res);
        if(res.status == 201){
            alert(JSON.stringify(myJson.message)); 
            //localStorage.setItem('verfication-token', myJson.results.verification.token);
            sessionStorage.setItem('verfication-token', myJson.results.verification.token);
            location.href = "sign-up-verification.html";
        }
    })
    .catch(err => {
        console.log(err.response);
        if(err.response.status == 422) {
            alert(err.response.data.errors);
        }
    });*/

};

const verifyAccount = () =>  {
    var verifyAccountUrl = 'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/verify/'+sessionStorage.getItem('verfication-token');

    axios.get(verifyAccountUrl)
    .then(res=>{
        console.log(res);
        if(res.status == 200){
            alert(res.data.message);
            sessionStorage.removeItem('verfication-token');
            location.href = "sign-in-cover.html";
        }
    }).catch(err=>{
        console.log(err,err.response);
        alert(err);
    })
};

const signIn = () => {
    axios
        .post(
            'https://euabq2smd3.execute-api.us-east-1.amazonaws.com/dev/api/auth/login',
            {
                email:document.getElementById("signin-username").value,
                password:document.getElementById("signin-password").value,
            }
        )
        .then(res => {
            console.log("res: "+res);
            if(res.status == 200){
                alert(res.data.message);
                console.log(res.data.results.token);
                localStorage.setItem('auth-token', res.data.results.token);
                location.href = "index.html";
            }
        })
        .catch(err => {
            console.log(err.response);
            if(err.response.status == 422) {
                alert(err.response.data.errors);
            }
        });
};
