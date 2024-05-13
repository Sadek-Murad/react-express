// routes.js

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db'; // Importiere die Verbindung zur Datenbank

const route = express.Router();

// Registrierung
route.post('/register', async (req, res) => {
    try {
        // Benutzerdaten aus dem Anfragekörper extrahieren
        const { username, password } = req.body;

        // Überprüfen, ob der Benutzer bereits existiert
        const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
        db.query(checkUserQuery, [username], async (err, results) => {
            if (err) {
                console.error('Fehler bei der Abfrage:', err);
                res.status(500).json({ message: 'Interner Serverfehler' });
                return;
            }
            if (results.length > 0) {
                res.status(400).json({ message: 'Benutzer existiert bereits' });
                return;
            }

            // Hash des Passworts erstellen
            const hashedPassword = await bcrypt.hash(password, 10);

            // Neuen Benutzer zur Datenbank hinzufügen
            const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(insertUserQuery, [username, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Fehler beim Einfügen des Benutzers:', err);
                    res.status(500).json({ message: 'Interner Serverfehler' });
                    return;
                }
                res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
            });
        });
    } catch (error) {
        console.error('Fehler bei der Registrierung:', error);
        res.status(500).json({ message: 'Interner Serverfehler' });
    }
});

// Login
route.post('/login', async (req, res) => {
    try {
        // Benutzerdaten aus dem Anfragekörper extrahieren
        const { username, password } = req.body;

        // Benutzer aus der Datenbank abrufen
        const getUserQuery = 'SELECT * FROM users WHERE username = ?';
        db.query(getUserQuery, [username], async (err, results) => {
            if (err) {
                console.error('Fehler bei der Abfrage:', err);
                res.status(500).json({ message: 'Interner Serverfehler' });
                return;
            }
            if (results.length === 0) {
                res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
                return;
            }

            const user = results[0];

            // Überprüfen, ob das Passwort übereinstimmt
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
                return;
            }

            // Token generieren
            const token = jwt.sign({ username }, '1234');

            res.status(200).json({ token });
        });
    } catch (error) {
        console.error('Fehler beim Login:', error);
        res.status(500).json({ message: 'Interner Serverfehler' });
    }
});

export default route;
