let note = [];
let editingNoteId = null;

function loadNotes() {
  const savedNotes = localStorage.getItem("quickNotes");
  return savedNotes ? JSON.parse(savedNotes) : []
}

function openNoteDialog(noteId) {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById('noteTitle');
  const contentInput = document.getElementById("noteContent");
  

  if(noteId) {
    const noteToEdit = note.find(note => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById('dialogTitle').textContent = 'Edit Note' ;
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  }
  else {
    editingNoteId = null
    document.getElementById('dialogTitle').textContent = 'Add New Note' ;
    titleInput.value = '' ;
    contentInput.value = '' ;
  }

  dialog.showModal()
  titleInput.focus()
}

function saveNote(event) {
  event.preventDefault()

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  note.unshift(
    {
      id : generateId(),
      title: title,
      content: content
    }
  ) 

  saveNotes();
  renderNotes();
}

function generateId() {
  return Date.now().toString();
}

function saveNotes(){
  localStorage.setItem("quickNotes", JSON.stringify(note))
} 

function deleteNote(noteId) {
  note = note.filter(note => note.id != noteId);
  saveNotes();
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById("notesContainer")
   
  if(note.length === 0){
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No notes yet</h2>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
        
      </div>
    `
    return
  }

  notesContainer.innerHTML = note.map(note => `
    <div class="note-card">
    <h3 class="note-title">${note.title}</h3>
    <p class="note-content">${note.content}</p>
    <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog(${note.id})" title="Edit Note">
          ✏️
        </button>
        <button class="delete-btn" onclick="deleteNote(${note.id})" title="Delete Note">
          x
        </button>
      </div>
    </div>
    `).join('');

}


function closeNoteDialog() {

  document.getElementById("noteDialog").close();

}

document.addEventListener( 'DOMContentLoaded', function() {

  note = loadNotes();

  renderNotes();

  document.getElementById("noteForm").addEventListener("submit", saveNote);

}

)
