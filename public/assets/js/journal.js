$(document).ready(() => {
  //global variables to store the user infos 
  var userId;
  var userName;
  //ajax call to display the user informations
  $.ajax({
      url: "/api/users/status",
      method: 'GET'
    }).then(function (userInfo) {
      //console.log(userInfo);

      //$("#userName").text(userInfo.firstName);
      userId = userInfo.id;
      userName = userInfo.lastName;

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
          const $spanLastAccess = $("<span class='mx-2'>").text("Last access :").appendTo($colDates);
          const $spanLastAccessContent = $("<span style='font-weight: bold'>").text(`  ${moment(journal.updatedAt).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);

          //$("<i class='fas fa-edit'>") <i class="fas fa-book-open"></i>
          // <button type="button" class="btn btn-primary">  Notifications <span class="badge badge-light">4</span>


          const $entries = $("<a href='./entries' class='btn-primary mr-2'>").text("Entries: ").appendTo($colActions);
          const $numEntries = $("<span class='badge badge-light' style='color: black; font-weight: bold'>").text("4").appendTo($entries);
          const $update = $("<span class='fas fa-edit text-warning mr-2'>").appendTo($colActions);
          const $delete = $("<span class='fas fa-trash-alt text-danger'>").appendTo($colActions);

          //link the data to the button to be able to use it on click on the button
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
          (index === 0) ? $divCollapse.addClass("collapse show"): $divCollapse.addClass("collapse");

          const $cardBody = $("<div class='card-body'>");

          //adding a div to display the content of the editor
          const $divContent = $("<p>").append(journal.description).appendTo($cardBody);

          $cardBody.appendTo($divCollapse);

          //build the card content
          $card.append($cardheader, $divCollapse).appendTo("#journals-accordion");

          console.log("end");
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
    console.log(journalData);

    //ajax call to insert the new journaL in the db
    $.ajax({
      url: "/api/journals",
      method: "POST",
      data: journalData
    }).then(result => {
      console.log(result);

      //empty the input fields
      $("#title-input").val("");
      $("#description-input").val("");
      //then hide the modal
      $("#addJournal-modal").hide();

      location.reload();

    });
  });

  //event listener for a click on a journal item
  $(document).on("click", ".list-group-item", function (event) {

    //get the id of the journal tru the data-id
    const journalId = $(this).attr("data-id");

    console.log(journalId);
    console.log(userId);
    //display the button to create a new entry
    $("#listedEntries").show();

    //display entries for a journal
    $.ajax({
      url: "/api/entries/journals/" + journalId,
      method: "GET"
    }).then(dbEntries => {
      console.log(dbEntries);
      //build the list of the journal for the right side of the navbar
      //<a class="list-group-item list-group-item-action" href="#list-item-2"><span class="entrySpan">Journal 1</span></a>
      //create the listitem
      dbEntries.forEach((entry, index) => {
        //create the item as a list item 
        const entryItem = $(`<a class='list-group-item list-group-item-action' href='#list-item-${index}'>`);

        //save the journal data with the attr method to be able to get all the entries attached to this journal 
        entryItem.attr("data-id", entry.id);

        const entryItemSpan = $("<span class='entrySpan'>").text(entry.title).appendTo(entryItem);

        //then append it to the div id="list-journals"
        $("#list-entries").append(entryItem);
      });

    });

    //event listener for a click on create entry
    $("#create-entry").on("click", () => {
      //display the form to input the journal title and the description
      $("#entry-form").show();
    });

    //event listener for a click on save entry
    $("#save-entry").on("click", (e) => {
      //prevent reload
      e.preventDefault();

      //build an object
      const entryData = {
        title: $("#entry-title").val().trim(),
        body: $("#entry-body").val().trim(),
        istrashed: false,
        journalId: journalId,
        userId: userId
      };
      console.log(entryData);
      //ajax call to display all entries for a journal
      $.ajax({
        url: "/api/entries",
        method: "POST",
        data: entryData
      }).then(result => {
        console.log(result);
        //just refresh page for proof of concept
        location.reload();
      });
    });

  });



  const updateSidenav = () => { //i copy n paste
    $.ajax({
        url: "/api/users/status",
        method: 'GET'
      }).then(function (userInfo) {

        userId = userInfo.id;
        userName = userInfo.lastName;

        $.ajax({
          url: "/api/journals/users/" + userId,
          method: "GET"
        }).then(bdJournals => {

          bdJournals.forEach((journal, index) => {

            const journalItem = $(`<a class='mdb-color list-group-item list-group-item-action' href='#list-item-${index}'>`);

            journalItem.attr("data-id", journal.id);

            const journalItemSpan = $("<span class='entrySpan'>").text(journal.title).appendTo(journalItem);

            $("#list-journals").append(journalItem);
          });
        });

      })
      .catch(err => console.log(err));
  }


}); //end of .ready