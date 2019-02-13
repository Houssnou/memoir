$(document).ready(() => {
  $("#newEntry").hide();
  $("#create-entry").hide();

  let editorContent;

  //global variables to store the user infos 
  let userId;
  let userName;
  let journalId;

  //ajax call to display the user informations
  $.ajax({
      url: "/api/users/status",
      method: 'GET'
    }).then(function (userInfo) {
      //console.log(userInfo);

      //$("#userName").text(userInfo.firstName);
      userId = userInfo.id;
      userName = userInfo.lastName;
      //display the name of the current user
      $("#userName").text(userName);

      //on load display all users journals
      $.ajax({
        url: "/api/journals/users/" + userId,
        method: "GET"
      }).then(bdJournals => {
        console.log("All user Journals");
        console.log(bdJournals);
        //build the list of the journal for the right side of the navbar
        //<a class="list-group-item list-group-item-action" href="#list-item-2"><span class="entrySpan">Journal 1</span></a>
        //create the listitem
        bdJournals.forEach((journal, index) => {
          //create the item as a list item 
          const journalItem = $(`<a class='journal mdb-color list-group-item list-group-item-action' href='#list-item-${index}'>`);

          //save the journal data with the attr method to be able to get all the entries attached to this journal 
          journalItem.attr("journal-id", journal.id);

          const journalItemSpan = $("<span class='entrySpan'>").text(journal.title).appendTo(journalItem);

          //then append it to the div id="list-journals"
          $("#list-journals").append(journalItem);
        });
      });

    })
    .catch(err => console.log(err));

  //event listener for a click on a journal item
  $(document).on("click", ".journal", function (event) {

    //get the id of the journal tru the data-id
    journalId = $(this).attr("journal-id");

    //display the button to create the a new entry
    $("#create-entry").show();

    //empty the current lsit
    $("#list-entries").empty();

    //display the button to create a new entry
    $("#listedEntries").show();

    //display entries for a journal
    $.ajax({
      url: "/api/entries/journals/" + journalId,
      method: "GET"
    }).then(dbEntries => {
      console.log(`All user - ${userId} - journalId -${journalId}- entries:${dbEntries.length} `)
      console.log(dbEntries);

      //build the list of the journal for the right side of the navbar
      //<a class="list-group-item list-group-item-action" href="#list-item-2"><span class="entrySpan">Journal 1</span></a>
      //create the listitem
      dbEntries.forEach((entry, index) => {
        //create the item as a list item 
        const entryItem = $(`<a class='entry list-group-item list-group-item-action' href='#list-item-${index}'>`);

        //save the journal data with the attr method to be able to get all the entries attached to this journal 
        entryItem.data("data-entry", entry);

        //set the attr entry-id to the delete icon
        //$(".fa-save").attr("entry-id", entry.id);
        //$(".fa-trash-alt").attr("entry-id", entry.id);

        const entryItemSpan = $("<span class='entrySpan'>").text(entry.title).appendTo(entryItem);

        //then append it to the div id="list-journals"
        $("#list-entries").append(entryItem);
      });

    });
  });

  //event listener for a click on save entry
  $(".fa-save").on("click", function (e) {
    //prevent reload
    e.preventDefault();

    //build an object
    const entryData = {
      title: $("#entry-title").val().trim(),
      body: editorContent.getData(),
      istrashed: false,
      journalId: journalId,
      userId: userId
    };
    console.log(entryData);

    const entryId = $(this).attr("entry-id");

    console.log(entryId)

    //ajax call to display all entries for a journal
    if (!entryId) { //if entryID doesnt exist its a new entry
      console.log("Doesnt exist");
      $.ajax({
        url: "/api/entries",
        method: "POST",
        data: entryData
      }).then(result => {
        console.log(result);
        //just refresh page for proof of concept
        location.reload();
      });
    } else {
      //its an update
      console.log("exits.");
      console.log(entryId)
      $.ajax({
        url: "/api/entries/" + entryId,
        method: "PUT",
        data: entryData
      }).then(result => {
        console.log(result);
        //just refresh page for proof of concept
        location.reload();
      });
    }
  });

  //event listener for a click on delete entry
  $(".fa-trash-alt").on("click", function (e) {
    //prevent reload
    e.preventDefault();

    const entryId = $(this).data("data-entry");

    //confirm delete entry;
    $(document).on("click", "#confirm-delete", function (event) {
      console.log(entryId);
      //ajax call to update the entry isTrashed column
      /* $.ajax({
        url: "/api/entries/" + entryId,
        method: "DELETE",
      }).then(result => {
        alert("Entry deleted!");
        location.reload();
      }); */
    });
  });

  //event listener for a click on an entry item
  $(document).on("click", ".entry", function (event) {
    //get the id of the journal tru the data-id
    const entry = $(this).data("data-entry");

    console.log(entry);
    //append entry info to the buttons
    $(".fa-save").attr("entry-id", entry.id);
    $(".fa-trash-alt").attr("entry-id", entry.id);

    //delete the editor
    $("#entry-div").empty();
    //create the text area 
    $("#entry-div").append("<textarea id='entry-body' cols='30' rows='20'>");

    ClassicEditor
      .create(document.querySelector("#entry-body"))
      .then(editor => {
        //console.log(editor);
        $("#newEntry").show();
        $("#entry-title").val(entry.title);
        $("#createdAt").text(moment(entry.createdAt).format("lll"));
        $("#updatedAt").text(moment(entry.updatedAt).format("lll"));
        editor.setData(entry.body);
        editorContent = editor;

      })
      .catch(error => {
        console.error(error);
      });

  });
  //event listener for a click on create-entry
  $("#create-entry").on("click", () => {

    $("#newEntry").show();

    $("#entry-title").val("");

    //delete the editor
    $("#entry-div").empty();
    //create the text area 
    $("#entry-div").append("<textarea id='entry-body' cols='30' rows='20'>");

    //to get the value of the Editor
    ClassicEditor
      .create(document.querySelector('#entry-body'))
      .then(editor => {
        console.log(editor);
        editorContent = editor;
      })
      .catch(error => {
        console.error(error);
      });
    // 

  });
}); //end of