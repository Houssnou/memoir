$(document).ready(() => {
  //global variables to store the user infos 
  let userId;
  let userName;
  let photoUrl;
  //ajax call to display the user informations
  $.ajax({
      url: "/api/users/status",
      method: 'GET'
    }).then(function (userInfo) {
      //console.log(userInfo);
      userId = userInfo.id;
      userName = userInfo.lastName;
      photoUrl = userInfo.photo;

      //set data to local storage
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("photoUrl", photoUrl);

      //display the name of the current user
      $("#userName").text(userName);

      //display user photo 
      //thats marian partssss
      

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
          const $numEntries = $("<span class='badge badge-light' style='color: black; font-weight: bold'>").text("4").appendTo($entries);
          const $update = $("<span class='fas fa-edit text-warning mr-2'>").appendTo($colActions);
          const $delete = $("<span class='fas fa-trash-alt text-danger'>").appendTo($colActions);

          //link the data to the button to be able to use it on click on the button
          $entries.attr("journal-id", journal.id);

          $update
            .attr("id", "update");
          /* .attr("data-toggle", "modal")
          .attr("data-target", "#update-modal"); */

          $delete
            .attr("id", "delete");
          /* .attr("data-toggle", "modal")
          .attr("data-target", "#delete-modal"); */

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
}); //end of .ready