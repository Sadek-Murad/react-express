import mysql from 'mysql';

// Verbindung zur Datenbank herstellen
const connection = mysql.createConnection({
  host: 'db', 
  user: 'root',
  password: '',
  database: 'react_express'
});

connection.connect((err) => {
  if (err) {
    console.error('Fehler beim Verbinden mit der Datenbank:', err);
    return;
  }
  console.log('Erfolgreich mit der MySQL-Datenbank verbunden');
});

export default connection;
