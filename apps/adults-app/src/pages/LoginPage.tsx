import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import loginHero from '../assets/login_hero.jpg';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const ensureUserDoc = async (userId: string, userEmail: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        const generateFamilyCode = () => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let code = '';
          for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return code;
        };
        await setDoc(userDocRef, {
          uid: userId,
          email: userEmail,
          role: 'adult',
          familyCode: generateFamilyCode(),
          connectedChildren: [],
          createdAt: new Date()
        });
      }
    } catch (err) {
      console.error("Failed to ensure user doc in firestore:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await ensureUserDoc(result.user.uid, result.user.email || '');
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google authentication.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) {
          await ensureUserDoc(result.user.uid, result.user.email || email);
        }
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (result.user) {
          await ensureUserDoc(result.user.uid, result.user.email || email);
        }
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-card glass-panel">
          <h1 className="login-title">
            ReadaBook <span>Live</span>
          </h1>
          <h2 className="login-subtitle">{isLogin ? 'Welcome Back' : 'Join the Community'}</h2>
          
          {error && <div className="login-error">{error}</div>}
          
          <button type="button" onClick={handleGoogleSignIn} className="btn-primary w-full" style={{ background: '#fff', color: '#333', border: '1px solid #ccc', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" style={{ width: '20px' }} />
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: 'var(--text-muted)' }}>
            <hr style={{ flex: 1, borderColor: 'var(--border-color)', borderTop: 'none' }} />
            <span style={{ padding: '0 12px', fontSize: '0.9rem' }}>or</span>
            <hr style={{ flex: 1, borderColor: 'var(--border-color)', borderTop: 'none' }} />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="reader@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="btn-primary w-full" style={{ marginTop: '16px' }}>
              {isLogin ? 'Sign In with Email' : 'Sign Up with Email'}
            </button>
          </form>

          <div className="login-footer">
            {isLogin ? (
              <p>New to ReadaBook? <button className="text-link" onClick={() => setIsLogin(false)}>Sign Up</button></p>
            ) : (
              <p>Already have an account? <button className="text-link" onClick={() => setIsLogin(true)}>Sign In</button></p>
            )}
          </div>
        </div>
      </div>
      <div className="login-right" style={{ backgroundImage: `url(${loginHero})` }}>
        <div className="hero-overlay">
          <h1>Experience Books, <span>Live.</span></h1>
          <p>Join your favorite influencers as they read, react, and discuss novels in real-time with the community. Stream your reading journey and connect with fellow book lovers.</p>
        </div>
      </div>
    </div>
  );
};
