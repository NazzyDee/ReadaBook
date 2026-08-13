import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign in.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Parents, please verify details.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-card glass-panel">
          <h1 className="login-title">
            🧸 ReadaBook <span>Kids</span>
          </h1>
          <h2 className="login-subtitle">
            {isLogin ? 'Hello Friend! Ask your parent to sign you in' : 'Create a New Account with your parent'}
          </h2>
          
          {error && <div className="login-error">{error}</div>}
          
          <button type="button" onClick={handleGoogleSignIn} className="btn-google w-full" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" style={{ width: '20px' }} />
            Parent 1-Click Sign In
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: 'var(--text-muted)' }}>
            <hr style={{ flex: 1, borderColor: 'var(--border-color)', borderTop: 'none' }} />
            <span style={{ padding: '0 12px', fontSize: '0.9rem' }}>or</span>
            <hr style={{ flex: 1, borderColor: 'var(--border-color)', borderTop: 'none' }} />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Parent's Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="parents@example.com"
              />
            </div>
            <div className="form-group">
              <label>Choose a Safe Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="btn-primary w-full" style={{ marginTop: '16px' }}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="login-footer">
            {isLogin ? (
              <p>Need a kids account? <button className="text-link" onClick={() => setIsLogin(false)}>Sign Up here</button></p>
            ) : (
              <p>Already registered? <button className="text-link" onClick={() => setIsLogin(true)}>Sign In here</button></p>
            )}
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="hero-overlay">
          <h1>Cozy Books, <span>Bubbly Voiced.</span></h1>
          <p>We read stories aloud in a friendly, safe environment. Kids can listen, react with cute emojis, and ask questions. Strictly monitored chat ensures a safe place for children to learn and explore stories!</p>
        </div>
      </div>
    </div>
  );
};
