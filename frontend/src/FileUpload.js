import React, { useState, useEffect } from 'react';
import axios from 'axios';


function FileUpload() {
  const [file, setFile] = useState(null);
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    fetchFiles(); // Ruft die Liste der hochgeladenen Dateien beim ersten Laden der Komponente auf
  }, []);

  const onFileChange = event => {
    setFile(event.target.files[0]); // Speichert die ausgewählte Datei im State
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file); // Fügt die Datei zum FormData-Objekt hinzu
    axios.post('http://localhost:3001/upload', formData).then(response => {
      alert('Datei erfolgreich hochgeladen!');
      fetchFiles(); // Ruft die Dateiliste erneut ab, um sie zu aktualisieren
    }).catch(error => {
      alert('Fehler beim Hochladen der Datei!');
    });
  };

  const fetchFiles = () => {
    axios.get('http://localhost:3001/files').then(response => {
      setFilesList(response.data); // Aktualisiert die Liste der Dateien im State
    });
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>
        Upload!
      </button>
      <div>
        <h3>Hochgeladene Dateien:</h3>
        <ul>
          {filesList.map(file => (
            <li key={file}>{file}</li> // Anzeigen jeder Datei in einer Liste
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <FileUpload />
    </div>
  );
}

export default App;
