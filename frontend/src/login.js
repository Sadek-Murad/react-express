import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      if (response.status === 200) {
        
        navigate('/');
      } else {
        alert('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldeinformationen.');
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
      alert('Fehler beim Login. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>Noch keinen Account? <Link to="/register">Hier registrieren</Link></p>
    </div>
  );
}

export default Login;
