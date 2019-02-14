$(document).ready(function () {
  console.log("ready");


  $("#registerAccountBtn").on("click", function (event) {

    //passConfirm = $("#passConfirm-input").val().trim();

    event.preventDefault();

    const userInfo = {
      lastName: $("#lastName-input").val().trim(),
      firstName: $("#firstName-input").val().trim(),
      email: $("#email-input").val().trim(),
      password: $("#pass-input").val().trim()
    };

    const confirmPassword = $("#passConfirm-input").val().trim();

    console.log(userInfo);
    console.log(userInfo.password);
    console.log(confirmPassword);
    // client side registration checks stuff here

    // min 6 charcters long
    if (userInfo.password.length < 6) {
      alert(`Password requirements do not match. Please have a minimum length of 6 characters.`);
      return false;
    } else {
      true;
    }


    // before ajax call is made do a client side verfication to make sure both password inputs are the same
     if (userInfo.password === confirmPassword) {
      true;
     } else {
       alert("passwords do not match");
       return false;
     }
    
    //ajax call to create the user
    $.ajax({
        url: "/api/users",
        method: "POST",
        data: userInfo
      })
      .then((userInfo) => {
        console.log(userInfo);
        location.replace(userInfo)
      })
      .catch(err => console.log(err));
  });
});