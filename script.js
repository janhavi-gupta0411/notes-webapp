const WORD_LIMIT = 400;
let note = [];
let editingNoteId = null;

function loadNotes() {
  const savedNotes = localStorage.getItem("quickNotes");
  return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(note));
}

function generateId() {
  return Date.now().toString();
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  if (noteId) {
    const noteToEdit = note.find(n => n.id === noteId);
    editingNoteId = noteId;
    document.getElementById("dialogTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    editingNoteId = null;
    document.getElementById("dialogTitle").textContent = "Add New Note";
    titleInput.value = "";
    contentInput.value = "";
  }

  dialog.showModal();
}

function closeNoteDialog() {
  document.getElementById("noteDialog").close();
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function saveNote(event) {
  event.preventDefault();

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const wordCount = countWords(content);

  if (wordCount > WORD_LIMIT) {
    alert("Your note exceeds the 400 word limit!");
    return;
  }

  if (editingNoteId) {
    const index = note.findIndex(n => n.id === editingNoteId);
    note[index] = { ...note[index], title, content };
  } else {
    note.unshift({ id: generateId(), title, content });
  }

  saveNotes();
  renderNotes();
  closeNoteDialog();
}

function deleteNote(noteId) {
  note = note.filter(n => n.id !== noteId);
  saveNotes();
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");
  if (note.length === 0) {
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No notes yet</h2>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
      </div>`;
    return;
  }

  notesContainer.innerHTML = note.map(n => `
    <div class="note-card">
      <h3 class="note-title">${n.title}</h3>
      <p class="note-content">${n.content}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${n.id}')">✏️</button>
        <button class="delete-btn" onclick="deleteNote('${n.id}')">X</button>
      </div>
    </div>`).join("");
}

document.addEventListener("DOMContentLoaded", function () {
  note = loadNotes();
  renderNotes();

  const noteForm = document.getElementById("noteForm");
  noteForm.addEventListener("submit", saveNote);

  const themeBtn = document.getElementById("themeBtn");
  themeBtn.addEventListener("click", function () {
    document.body.classList.toggle("darktheme");
    themeBtn.textContent = document.body.classList.contains("darktheme") ? "🌙" :  "☀️" ;
  });
});
