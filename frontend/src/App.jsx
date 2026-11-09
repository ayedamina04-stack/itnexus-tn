
import { Routes, Route } from 'react-router-dom';

import Home from './Home.jsx';
import Articles from './pages/Articles.jsx';
import Evenements from './pages/Evenements.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function PageEnConstruction({ titre }) {
  return (
    <main style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '40px',
      color: '#fff',
      background: '#080d1b'
    }}>
      <h1>{titre}</h1>
      <p>Cette page arrive bientôt sur ITNEXUS TN.</p>
      <a href="/" style={{ color: '#22d3ee', marginTop: '20px' }}>
        Retour à l'accueil
      </a>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/evenements" element={<Evenements />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<PageEnConstruction titre="Page introuvable" />} />
    </Routes>
  );
}

export default App;
