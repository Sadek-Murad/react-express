import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/register', { username, password });
      if (response.status === 200) {
        onRegister();
      } else {
        setError('Registrierung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      setError('Fehler bei der Registrierung. Bitte versuchen Sie es erneut.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Lädt...' : 'Register'}</button>
      </form>
      <p>Bereits einen Account? <Link to="/login">Hier einloggen</Link></p>
    </div>
  );
}

export default Register;
