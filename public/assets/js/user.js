$(document).ready(function () {
  let userId;
  //get user infos from db  
  $.ajax({
    url: "/api/users/status",
    method: 'GET'
  }).then(function (userInfo) {
    //console.log(userInfo);
    //set the input field with the existing data
    userId = userInfo.id;
    $("#email-input").val(userInfo.email);
    $("#firstName-input").val(userInfo.firstName);
    $("#lastName-input").val(userInfo.lastName);
    $("#photo").attr("src", userInfo.photo);
  });
  //event listener on update user account
  $('#post-form').on('submit', function (e) {
    e.preventDefault();

    //check if password exists then make user that the 2 inputs are equal

    //build an object of the user infos
    const userUpdate = {
      firstName: $("#firstName-input").val().trim(),
      lastName: $("#lastName-input").val().trim()
     // password: $("#pass-input").val().trim()
    };
    /* const confirmPassword = $("#passConfirm-input").val().trim();

    //console.log(userUpdate);
    // client side registration 
    // min 6 charcters long
    if (userUpdate.password.length < 6) {
      alert(`Password requirements do not match. Please have a minimum length of 6 characters.`);
      return false;
    } else {
      true;
    }

    // before ajax call is made do a client side verfication to make sure both password inputs are the same
    if (userUpdate.password === confirmPassword) {
      true;
    } else {
      alert("Passwords do not match");
      return false;
    } */

    // create formData object (needed for sending image)
    const form = new FormData();
    form.append('firstName', userUpdate.firstName);
    form.append('lastName', userUpdate.lastName);

    //grab the image file
    const imageData = document.getElementById("photo-update").files[0];
    if (imageData) {
      form.append('photo', imageData, imageData.name);
    }

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
        //console.log(data.photo);
        //display new image
        $("#photo").attr("src", data.photo);
        //display user photo 
        $("#user-avatar").attr("src", data.photo).width(30);
        $("#user-avatar").attr("src", data.photo).height(30);
        //set the local storage data 
        localStorage.setItem("photoUrl", data.photo);
      });
  });

});