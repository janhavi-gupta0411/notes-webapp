let note = [];

function openNoteDialog() {
  const dialog = document.getElementById("noteDialog");
  const contentInput = document.getElementById("noteContent");

  dialog.showModal();

}


function closeNoteDialog() {

  document.getElementById("noteDialog").close();

}

