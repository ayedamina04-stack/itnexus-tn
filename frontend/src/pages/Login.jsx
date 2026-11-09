
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, Mail, LogIn } from 'lucide-react';
import api from '../services/api';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/login', { email, password });
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Connexion impossible. Vérifie tes identifiants.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    marginTop: '8px',
    background: '#111a2e',
    border: '1px solid #26344d',
    borderRadius: '10px',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#080d1b',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '25px'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Link to="/" style={{
          color: '#22d3ee',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '35px'
        }}>
          <ArrowLeft size={18} /> Retour à l'accueil
        </Link>

        <div style={{
          background: '#111a2e',
          border: '1px solid #26344d',
          borderRadius: '20px',
          padding: '35px'
        }}>
          <div style={{
            width: '55px',
            height: '55px',
            borderRadius: '15px',
            background: '#12344a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '22px'
          }}>
            <LockKeyhole color="#22d3ee" size={27} />
          </div>

          <p style={{ color: '#22d3ee', letterSpacing: '2px' }}>
            ITNEXUS TN
          </p>

        

          <p style={{ color: '#aab4ca', marginBottom: '30px' }}>
            Connecte-toi pour accéder à ton espace.
          </p>

          <form onSubmit={handleSubmit}>
            <label>
              Adresse e-mail
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="#8996ad"
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '22px'
                  }}
                />
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingLeft: '42px' }}
                />
              </div>
            </label>

            <label style={{
              display: 'block',
              marginTop: '22px'
            }}>
              Mot de passe
              <input
                type="password"
                placeholder="Ton mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </label>

            {error && (
              <p style={{
                color: '#fb7185',
                fontSize: '14px',
                marginTop: '18px'
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '25px',
                padding: '15px',
                border: 'none',
                borderRadius: '10px',
                background: '#22d3ee',
                color: '#080d1b',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              <LogIn size={17} style={{
                verticalAlign: 'middle',
                marginRight: '8px'
              }} />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p style={{
            color: '#aab4ca',
            textAlign: 'center',
            marginTop: '25px',
            fontSize: '14px'
          }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{
              color: '#22d3ee',
              textDecoration: 'none'
            }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
