const signup = async() =>  {

     const myBody = {
        "name":document.getElementById("signup-fullname").value,
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
    }
    else if(myJson.code == 201){
        alert(JSON.stringify(myJson.message)); 
        location.href = "sign-up-verification.html";
    }
    
};

function signin() {
    alert("Inside signin");
    location.href=".";
};