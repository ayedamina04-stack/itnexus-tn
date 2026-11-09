
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, User, Mail, Lock } from 'lucide-react';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register', {
        name,
        email,
        password
      });

      setSuccess('Compte créé avec succès ! Redirection vers la connexion...');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Inscription impossible. Vérifie les informations saisies.'
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
            <UserPlus color="#22d3ee" size={27} />
          </div>

          <p style={{ color: '#22d3ee', letterSpacing: '2px' }}>
            ITNEXUS TN
          </p>

          <h1 style={{ fontSize: '30px', marginBottom: '10px' }}>
            Rejoins la communauté !
          </h1>

          <p style={{ color: '#aab4ca', marginBottom: '30px' }}>
            Crée ton compte pour découvrir la communauté tech tunisienne.
          </p>

          <form onSubmit={handleSubmit}>
            <label>
              Nom complet
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  color="#8996ad"
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '22px'
                  }}
                />
                <input
                  type="text"
                  placeholder="Ton nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  style={{ ...inputStyle, paddingLeft: '42px' }}
                />
              </div>
            </label>

            <label style={{ display: 'block', marginTop: '20px' }}>
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

            <label style={{ display: 'block', marginTop: '20px' }}>
              Mot de passe
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="#8996ad"
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '22px'
                  }}
                />
                <input
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ ...inputStyle, paddingLeft: '42px' }}
                />
              </div>
            </label>

            {error && (
              <p style={{ color: '#fb7185', fontSize: '14px', marginTop: '18px' }}>
                {error}
              </p>
            )}

            {success && (
              <p style={{ color: '#22d3ee', fontSize: '14px', marginTop: '18px' }}>
                {success}
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
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <p style={{
            color: '#aab4ca',
            textAlign: 'center',
            marginTop: '25px',
            fontSize: '14px'
          }}>
            Déjà membre ?{' '}
            <Link to="/login" style={{
              color: '#22d3ee',
              textDecoration: 'none'
            }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
