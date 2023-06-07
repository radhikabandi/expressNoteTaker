const express= require('express')
const fs= require('fs')
const path = require("path");
//const PORT = 3001;

const app=express()
const PORT = process.env.PORT || 3001
//db
const allNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  res.json(allNotes.slice(1));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//takeNotes and write it to db.json file
function takeNotes(body, allNotes) {
  const newNote = body;

  console.log('newNote',newNote)
  if (!Array.isArray(allNotes))
    allNotes = [];

  if (allNotes.length === 0)
    allNotes.push(0);

  body.id = allNotes[0];
  allNotes[0]++;

  allNotes.push(newNote);
  console.log('notesArray',allNotes)
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(allNotes, null, 2)
  );
  return newNote;
}

app.post('/api/notes', (req, res) => {
  const newNote = takeNotes(req.body, allNotes);
  res.json(newNote);
});


//delete notes- update db.json
function deleteNote(id, allNotes) {
  for (let i = 0; i < allNotes.length; i++) {
    let note = allNotes[i];

    if (note.id == id) {
      allNotes.splice(i, 1);
      console.log('notesArray in delete',allNotes)
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(allNotes, null, 2)
      );
      break;
    }
  }
}

app.delete('/api/notes/:id', (req, res) => {
  deleteNote(req.params.id, allNotes);
  res.json(true);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});