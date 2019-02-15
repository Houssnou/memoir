$(document).ready(function () {
   //event listener for a click on login
  $("#loginBtn").on("click", function (event) {

    event.preventDefault();

    const userInfo = {
      email: $("#loginEmail").val().trim(),
      password: $("#loginPass").val().trim()
    };

    console.log(userInfo);
    //ajax call to login the user
    $.ajax({
        url: "api/users/login",
        method: "POST",
        data: userInfo
      })
      .then((userInfo) => {
        console.log(userInfo);
        location.replace(userInfo)
      })
      .catch(err => {
        console.log(err);
        console.log("incorrect user info");
        $("#loginError").text("Incorrect login information. Please try again.");
      })
  });

});