document.getElementById("personal-details-trigger").onclick= ()=>{

    resetInputFields();

    var firstName = document.getElementById('firstname-add').value;
    var lastName = document.getElementById('lastname-add').value;
    var displayName = document.getElementById('displayname-add').value; //optional
    //var photoUrl = document.getElementById('photourl-add').value;
    var primaryPhone = document.getElementById('primary-phoneno-add').value;
    var secondaryPhone = document.getElementById('secondary-phoneno-add').value; //optional
    var clientId = document.getElementById('clientid-add').value; //optional
    var address = document.getElementById('address-add').value;
    var pincode = document.getElementById('pincode-add').value;
    var city = document.getElementById('city-add').value;
    var state = document.getElementById('state-add').value;
    var country = document.getElementById('country-add').value;

    if(firstName.length == 0){
        document.getElementById('firstname-add').classList.add("is-invalid");
        document.getElementById('firstname-empty').style.display = 'block';
    }
    if(lastName.length == 0){
        document.getElementById('lastname-add').classList.add("is-invalid");
        document.getElementById('lastname-empty').style.display = 'block';
    }
  /*   if(photoUrl.length == 0){
        document.getElementById('photourl-add').classList.add("is-invalid");
        document.getElementById('photourl-empty').style.display = 'block';
    } */
    if(primaryPhone.length == 0){
        document.getElementById('primary-phoneno-add').classList.add("is-invalid");
        document.getElementById('primary-phoneno-empty').style.display = 'block';
    }
    if(address.length == 0){
        document.getElementById('address-add').classList.add("is-invalid");
        document.getElementById('address-empty').style.display = 'block';
    }
    if(pincode.length == 0){
        document.getElementById('pincode-add').classList.add("is-invalid");
        document.getElementById('pincode-empty').style.display = 'block';
    }
    if(city.length == 0){
        document.getElementById('city-add').classList.add("is-invalid");
        document.getElementById('city-empty').style.display = 'block';
    }
    if(state.length == 0){
        document.getElementById('state-add').classList.add("is-invalid");
        document.getElementById('state-empty').style.display = 'block';
    }
    if(country.length == 0){
        document.getElementById('country-add').classList.add("is-invalid");
        document.getElementById('country-empty').style.display = 'block';
    }

    if(firstName.length > 0 && lastName.length > 0 && primaryPhone.length > 0 && 
        address.length > 0 && pincode.length > 0 && city.length > 0 && state.length > 0 && country.length > 0) {
        resetInputFields();
        document.getElementById("confirmed-tab").click()
    }
}

document.getElementById("payment-trigger").onclick= ()=>{
    document.getElementById("shipped-tab").click()
}

document.getElementById("back-shipping-trigger").onclick= ()=>{
    document.getElementById("order-tab").click()
}

document.getElementById("back-personal-trigger").onclick= ()=>{
    document.getElementById("confirmed-tab").click()
}

document.getElementById("continue-payment-trigger").onclick= ()=>{
    document.getElementById("delivered-tab").click()
}

var resetInputFields = () => {
    document.getElementById('firstname-empty').style.display = 'none';
    document.getElementById('firstname-add').classList.remove("is-invalid");
    document.getElementById('lastname-empty').style.display = 'none';
    document.getElementById('lastname-add').classList.remove("is-invalid");
    //document.getElementById('photourl-empty').style.display = 'none';
    document.getElementById('photourl-add').classList.remove("is-invalid");
    document.getElementById('primary-phoneno-empty').style.display = 'none';
    document.getElementById('primary-phoneno-add').classList.remove("is-invalid");
    document.getElementById('address-empty').style.display = 'none';
    document.getElementById('address-add').classList.remove("is-invalid");
    document.getElementById('pincode-empty').style.display = 'none';
    document.getElementById('pincode-add').classList.remove("is-invalid");
    document.getElementById('city-empty').style.display = 'none';
    document.getElementById('city-add').classList.remove("is-invalid");
    document.getElementById('state-empty').style.display = 'none';
    document.getElementById('state-add').classList.remove("is-invalid");
    document.getElementById('country-empty').style.display = 'none';
    document.getElementById('country-add').classList.remove("is-invalid");
}