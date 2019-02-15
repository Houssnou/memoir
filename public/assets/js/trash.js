$(document).ready(function () {

  /* THIS AREA IS FOR DELETED ENTRIES THE VIEW DELETED JOURNALS ARE ABOVE */
  const userId = localStorage.getItem("userId");
  console.log(`USER ID : ${userId}`);


  // on load display all deleted entries on the modal area
  $.ajax({
    url: "/api/entries/deleted/" + userId,
    method: "GET"
  }).then(deletedEntries => {
    //console.log(deletedEntries);

    deletedEntries.forEach((entry, index) => {

      //accordion is just a card with header and body so lets have fun.          
      //build the card

      const $card = $("<card>");

      //the header
      const $cardheader = $(`<div class='card-header text-align' role='tab' id='heading${index+1}'>`);
      //div row to wrap the line : title dates actions
      //inside the header we will have a row with 3colums 2-8-2
      const $row = $("<div class='row align-items-center'>");
      const $colTitle = $("<div class='col-2 d-flex align-content-start'>");
      const $colDates = $("<div class='col-8 d-flex align-content-start text-dark'>");
      const $colActions = $("<div class='col-2 d-flex justify-content-end'>");

      //inline style to be removed later #collapse-link {color: black; font-weight: bold; text-decoration: none;
      //button to make the title clikable
      const $buttonTitle = $(
        `<a data-parent='#entries-accordion' href='#entry${index+1}' 
                            data-toggle='collapse' data-target='#entry${index+1}'
                            aria-expanded='true' aria-controls='entry${index+1}'
                            style='color: black; font-weight: bold; text-decoration: none'
                            >`
      ).text(entry.title).appendTo($colTitle);

      //build the line //build the line: entry 1 created: modified edit and suppress icon 
      const $spanCreated = $("<span class='mr-2'>").text("Created :").appendTo($colDates);
      const $spanCreatedContent = $("<span style='font-weight: bold'>").text(` ${moment(entry.createdAt).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);
      const $spanLastAccess = $("<span class='mx-2'>").text("Last access :").appendTo($colDates);
      const $spanLastAccessContent = $("<span style='font-weight: bold'>").text(`  ${moment(entry.updatedAt).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);

      const $delete = $("<span class='fas fa-trash-alt text-danger'>").appendTo($colActions);

      //append them to the 
      //$cardheader.append($buttonTitle, $spanCreated, $spanModified, $update, $delete);
      $row.append($colTitle, $colDates, $colActions);
      $cardheader.append($row);

      //the body
      const $divCollapse = $(
        `<div id='entry${index+1}' aria-labelledby='heading${index+1}'  role='tabpanel' data-parent='#entries-accordion'>`);

      //quick check to determine if it should be a class collapse show or not        
      (index === 0) ? $divCollapse.addClass("blue-grey lighten-5 collapse show"): $divCollapse.addClass("blue-grey lighten-5 collapse");

      const $cardBody = $("<div class='card-body'>");

      //adding a div to display the content of the editor
      // adding class to add colors to p tag
      const entryDescription = $("<p>");
      entryDescription.addClass("text-dark");

      //cut down entry.body to 50 characters?
      const maxShown = 50;
      const trimmedEntryBody = entry.body.substring(0, maxShown);

      const $divContent = entryDescription.append(trimmedEntryBody).appendTo($cardBody);

      $cardBody.appendTo($divCollapse);

      //build the card content
      $card.append($cardheader, $divCollapse).appendTo("#entries-accordion");

    });
  });

  /* THIS IS THE DELETED JOURNALS AREA */

  // on load display all deleted entries on the modal area
  $.ajax({
    url: "/api/journals/deleted/" + userId,
    method: "GET"
  }).then(deletedJournals => {
    //console.log(deletedJournals);

    deletedJournals.forEach((journal, index) => {

      const $card = $("<card>");

      //the header
      const $cardheader = $(`<div class='card-header text-align' role='tab' id='heading${index+1}'>`);
      //div row to wrap the line : title dates actions
      //inside the header we will have a row with 3colums 2-8-2
      const $row = $("<div class='row align-items-center'>");
      const $colTitle = $("<div class='col-2 d-flex align-content-start'>");
      const $colDates = $("<div class='col-8 d-flex align-content-start text-dark'>");
      const $colActions = $("<div class='col-2 d-flex justify-content-end'>");

      //inline style to be removed later #collapse-link {color: black; font-weight: bold; text-decoration: none;
      //button to make the title clikable
      const $buttonTitle = $(
        `<a data-parent='#deletedJournals-accordion' href='#deletedjournal${index+1}' 
                            data-toggle='collapse' data-target='#deletedjournal${index+1}'
                            aria-expanded='true' aria-controls='deletedjournal${index+1}'
                            style='color: black; font-weight: bold; text-decoration: none'
                            >`
      ).text(journal.title).appendTo($colTitle);

      //build the line //build the line: entry 1 created: modified edit and suppress icon 
      const $spanCreated = $("<span class='mr-2'>").text("Created :").appendTo($colDates);
      const $spanCreatedContent = $("<span style='font-weight: bold'>").text(` ${moment(journal.createdAt).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);
      const $spanLastAccess = $("<span class='mx-2'>").text("Last access :").appendTo($colDates);
      const $spanLastAccessContent = $("<span style='font-weight: bold'>").text(`  ${moment(journal.updatedAt).format("ddd, MMM Do YYYY, h:mm a")}`).appendTo($colDates);

      const $delete = $("<span class='fas fa-trash-alt text-danger'>").appendTo($colActions);

      //append them to the 
      //$cardheader.append($buttonTitle, $spanCreated, $spanModified, $update, $delete);
      $row.append($colTitle, $colDates, $colActions);
      $cardheader.append($row);

      //the body
      const $divCollapse = $(
        `<div id='deletedjournal${index+1}' aria-labelledby='heading${index+1}'  role='tabpanel' data-parent='#deletedJournals-accordion'>`);

      //quick check to determine if it should be a class collapse show or not        
      (index === 0) ? $divCollapse.addClass("blue-grey lighten-5 collapse show"): $divCollapse.addClass("blue-grey lighten-5 collapse");

      const $cardBody = $("<div class='card-body'>");

      //adding a div to display the content of the editor
      // adding class to add colors to p tag
      const deletedJournalDescription = $("<p>");
      deletedJournalDescription.addClass("text-dark");

      const $divContent = deletedJournalDescription.append(journal.description).appendTo($cardBody);

      $cardBody.appendTo($divCollapse);

      //build the card content
      $card.append($cardheader, $divCollapse).appendTo("#deletedJournals-accordion");

    });
  });






}); //end of document.ready