let note = [];
let editingNoteId = null;

function loadNotes() {
  const savedNotes = localStorage.getItem("quickNotes");
  return savedNotes ? JSON.parse(savedNotes) : []
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");
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

  dialog.showModal();
}


function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

document.addEventListener("DOMContentLoaded", function () {
  const contentInput = document.getElementById("noteContent");
  const wordCounter = document.createElement("small");
  wordCounter.style.display = "block";
  wordCounter.style.marginTop = "0.5rem";
  wordCounter.style.color = "#666";

  contentInput.parentNode.appendChild(wordCounter);

  contentInput.addEventListener("input", function () {
    const wordCount = countWords(contentInput.value);
    wordCounter.textContent = `${wordCount}/400 words`;

    
  });
});


function saveNote(event) {
  event.preventDefault();

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  const wordCount = countWords(content);
  if (wordCount > WORD_LIMIT) {
    alert("Your note exceeds the 400 word limit! Please shorten it.");
    return;
  }

  if (editingNoteId) {
    const noteIndex = note.findIndex(n => n.id === editingNoteId);
    note[noteIndex] = {
      ...note[noteIndex],
      title: title,
      content: content
    };
  } else {
    note.unshift({
      id: generateId(),
      title: title,
      content: content
    });
  }

  closeNoteDialog();
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

  notesContainer.innerHTML = note.map(n => `
    <div class="note-card">
      <h3 class="note-title">${n.title}</h3>
      <p class="note-content">${n.content}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${n.id}')" title="Edit Note">✏️</button>
        <button class="delete-btn" onclick="deleteNote('${n.id}')" title="Delete Note">x</button>
      </div>
    </div>
  `).join('');
  
}


function closeNoteDialog() {

  document.getElementById("noteDialog").close();

}
const themeBtn = document.querySelector(".theme-button");

themeBtn.addEventListener("click", function() {
  document.body.classList.toggle("darktheme");
  themeBtn.textContent = document.body.classList.contains("darktheme") ? "☀️" : "🌙" ;
});

document.addEventListener( 'DOMContentLoaded', function() {

  note = loadNotes();

  renderNotes();

  document.getElementById("noteForm").addEventListener("submit", saveNote);
  document.getElementById("themeBtn").addEventListener("click", toggleTheme)

})
