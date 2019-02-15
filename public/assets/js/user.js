$(document).ready(function () {
  //check if a picture exist
  const photoUrl = localStorage.getItem("photoUrl");
  let userId;
  /* const userFirstName = localStorage.getItem("userFirstName");
  const userLastName = localStorage.getItem("userLastName");
  const userEmail = localStorage.getItem("email"); */
  $.ajax({
    url: "/api/users/status",
    method: 'GET'
  }).then(function (userInfo) {
    //console.log(userInfo);
    //set the input field with the existing data
    userId=userInfo.id;
    $("#email-input").val(userInfo.email);
    $("#firstName-input").val(userInfo.firstName);
    $("#lastName-input").val(userInfo.lastName);
    $("#photo").attr("src", userInfo.photo);
  });
  //event listener on update user account
  $('#post-form').on('submit', function (e) {
    e.preventDefault();

    //build an object of the user infos
    const userUpdate = {
      firstName: $("#firstName-input").val().trim(),
      lastName: $("#lastName-input").val().trim()
    };
    console.log(userUpdate);

    // create formData object (needed for sending image)
    const form = new FormData();
    form.append('firstName', userUpdate.firstName);
    form.append('lastName', userUpdate.lastName);

    //grab the image file
    const imageData = document.getElementById("photo-update").files[0];
    if (imageData) {
      form.append('photo', imageData, imageData.name);
    }

    console.log(form);

    //ajax call to update the username account
    $.ajax({
        url: "/api/users/" + userId,
        method: "PUT",
        data: form,
        cache: false,
        contentType: false,
        processData: false,
      })
      .then(function (data) {
        console.log(data);
      });
  });

});