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
    console.log(userInfo);
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