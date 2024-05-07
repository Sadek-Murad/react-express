const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

app.use(express.static('uploads')); 

// POST-Route für das Hochladen der Dateien
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ message: 'Datei erfolgreich hochgeladen!', file: req.file.path });
});


app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      res.status(500).send('Fehler beim Lesen des Verzeichnisses');
      return;
    }
    res.send(files);
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
