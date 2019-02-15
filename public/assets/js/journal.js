$(document).ready(() => {
  //global variables to store the user infos 
  let userId;
  let userName;
  let photoUrl;
  let userFirstName;
  let userLastName;
  let userEmail;
  //ajax call to display the user informations
  $.ajax({
      url: "/api/users/status",
      method: 'GET'
    }).then(function (userInfo) {
      //console.log(userInfo);
      userId = userInfo.id;
      userName = userInfo.lastName;
      photoUrl = userInfo.photo;
      userFirstName = userInfo.firstName;
      userLastName = userInfo.lastName;
      userEmail = userInfo.email;
      console.log(photoUrl);

      //set data to local storage
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("photoUrl", photoUrl);
      localStorage.setItem("userFirstName", userFirstName);
      localStorage.setItem("userLastName", userLastName);
      localStorage.setItem("email", userEmail)

      //display the name of the current user
      $("#userName").text(userName);

      //display user photo 
      $("#user-avatar").attr("src", userInfo.photo).width(30); 
      $("#user-avatar").attr("src", userInfo.photo).height(30);    

      //on load display all users journals
      $.ajax({
        url: "/api/journals/users/" + userId,
        method: "GET"
      }).then(bdJournals => {
        console.log("All user Journals");
        console.log(bdJournals);

        bdJournals.forEach((journal, index) => {
          //accordion is just a card with header and body so lets have fun.          
          //build the card

          const $card = $("<card>");

          //the header
          const $cardheader = $(`<div class='card-header text-align' role='tab' id='heading${index+1}'>`);
          //div row to wrap the line : title dates actions
          //inside the header we will have a row with 3colums 2-8-2
          const $row = $("<div class='row align-items-center'>");
          const $colTitle = $("<div class='col-2 d-flex align-content-start'>");
          const $colDates = $("<div class='col-8 d-flex align-content-start'>");
          const $colActions = $("<div class='col-2 d-flex justify-content-end'>");

          //inline style to be removed later #collapse-link {color: black; font-weight: bold; text-decoration: none;
          //button to make the title clikable
          const $buttonTitle = $(
            `<a data-parent='#journals-accordion' href='#journal${index+1}' 
                            data-toggle='collapse' data-target='#journal${index+1}'
                            aria-expanded='true' aria-controls='journal${index+1}'
                            style='color: black; font-weight: bold; text-decoration: none'
                            >`
          ).text(journal.title).appendTo($colTitle);

         

          //build the line //build the line: entry 1 created: modified edit and suppress icon 
          const $spanCreated = $("<span class='mr-2'>").text("Created :").appendTo($colDates);
          const $spanCreatedContent = $("<span style='font-weight: bold'>").text(` ${moment(journal.createdAt).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);
          const $spanLastAccess = $("<span class='mx-2 hiddenAtSmall'>").text("Last access :").appendTo($colDates);
          const $spanLastAccessContent = $("<span class='hiddenAtSmall' style='font-weight: bold'>").text(`  ${moment(journal.updatedAt).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);

          const $entries = $("<a href='./entries' class='btn-primary mr-2'>").text("Entries: ").appendTo($colActions);
          const $update = $("<span class='fas fa-edit text-warning mr-2'>").appendTo($colActions);
          const $delete = $("<span class='fas fa-trash-alt text-danger'>").appendTo($colActions);

          //ajax call to display the number of entries for a journal
          let numEntries;
          $.ajax({
            url: "/api/journals/entries/" + journal.id,
            method: "GET"
          }).then(dbEntries => {
            //console.log(dbEntries);
            numEntries = dbEntries.length;
            const $numEntriesSpan = $("<span class='badge badge-light' style='color: black; font-weight: bold'>").text(numEntries).appendTo($entries);
          });

          //link the data to the button to be able to use it on click on the button
          $entries.attr("journal-id", journal.id);

          $update
            .attr("id", "update")
            .attr("data-toggle", "modal")
            .attr("data-target", "#update-modal");

          $delete
            .attr("id", "delete")
            .attr("data-toggle", "modal")
            .attr("data-target", "#delete-modal");

          // Using the data method to append more data 
          $entries.data("data-journal", journal);
          $update.data("data-journal", journal);
          $delete.data("data-journal", journal);

          //append them to the 
          //$cardheader.append($buttonTitle, $spanCreated, $spanModified, $update, $delete);
          $row.append($colTitle, $colDates, $colActions);
          $cardheader.append($row);

          //the body
          const $divCollapse = $(
            `<div id='journal${index+1}' aria-labelledby='heading${index+1}'  role='tabpanel' data-parent='#journals-accordion'>`);

          //quick check to determine if it should be a class collapse show or not        
          (index === 0) ? $divCollapse.addClass("blue-grey lighten-5 collapse show"): $divCollapse.addClass("blue-grey lighten-5 collapse");

          const $cardBody = $("<div class='card-body'>");

          //adding a div to display the content of the editor
          // adding class to add colors to p tag
          const journalDescription = $("<p>");
          journalDescription.addClass("text-secondary");
          const $divContent = journalDescription.append(journal.description).appendTo($cardBody);

          $cardBody.appendTo($divCollapse);

          //build the card content
          $card.append($cardheader, $divCollapse).appendTo("#journals-accordion");
        });
      });

    })
    .catch(err => console.log(err));

  //event listener for a click on add new journal
  $("#save-journal").on("click", (e) => {
    //prevent reload
    e.preventDefault();

    //build an object
    const journalData = {
      title: $("#title-input").val().trim(),
      description: $("#description-input").val().trim(),
      istrashed: false,
      userId: userId
    };
    // console.log(journalData);

    //ajax call to insert the new journaL in the db
    $.ajax({
      url: "/api/journals",
      method: "POST",
      data: journalData
    }).then(result => {
      //console.log(result);
      //empty the input fields
      $("#title-input").val("");
      $("#description-input").val("");
      //then hide the modal
      $("#addJournal-modal").hide();
      location.reload();
    });
  });

  //event listener for a click on update journal
  $(document).on("click", ".fa-edit", function (e) {
    //prevent reload
    e.preventDefault();

    const journal = $(this).data("data-journal");

    //set the input values with the data
    $("#title-update").val(journal.title);
    $("#description-update").val(journal.description);

    //confirm delete entry;
    $(document).on("click", "#confirm-update", function (event) {
      console.log(journal.id);

      //build the update Object
      const journalUpdate = {
        title: $("#title-update").val().trim(),
        description: $("#description-update").val().trim()
      }
      //ajax call to update the journal
      $.ajax({
        url: "/api/journals/" + journal.id,
        method: "PUT",
        data: journalUpdate
      }).then(result => {
        alert("Journal Updated!");
        location.reload();
      });
    });
  });

  //event listener for a click on delete journal
  $(document).on("click", ".fa-trash-alt", function (e) {
    //prevent reload
    e.preventDefault();

    const journal = $(this).data("data-journal");

    //confirm delete entry;
    $(document).on("click", "#confirm-delete", function (event) {
      console.log(journal.id);
      //ajax call to update the entry isTrashed column
      $.ajax({
        url: "/api/journals/" + journal.id,
        method: "DELETE",
      }).then(result => {
        alert("Journal deleted!");
        location.reload();
      });
    });
  });



/* ADD ACTIVE CLASSES */
$("label.font-weight-bold").addClass("active");




}); //end of .ready