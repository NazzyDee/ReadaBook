import React, { useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [loginStep, setLoginStep] = useState<'code' | 'profile' | 'pin'>('code');
  const [familyCodeInput, setFamilyCodeInput] = useState('');
  const [parentUid, setParentUid] = useState('');
  const [childProfiles, setChildProfiles] = useState<{ id: string; displayName: string; pin: string }[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<{ id: string; displayName: string; pin: string } | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Ensure anonymous auth is active for queries
    if (!auth.currentUser) {
      signInAnonymously(auth).catch((err) => {
        console.error("Anonymous authentication failed on mount:", err);
      });
    }
  }, []);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (familyCodeInput.trim().length !== 6) {
      setError("Family Invite Code must be exactly 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const code = familyCodeInput.trim().toUpperCase();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('familyCode', '==', code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Family Invite Code not found. Ask your parent for the code!");
        setLoading(false);
        return;
      }

      const parentDoc = querySnapshot.docs[0];
      const pUid = parentDoc.id;
      setParentUid(pUid);

      // Fetch children sub-profiles
      const childrenColRef = collection(db, 'users', pUid, 'children');
      const childrenSnapshot = await getDocs(childrenColRef);
      const profiles: any[] = [];
      childrenSnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() });
      });

      if (profiles.length === 0) {
        setError("No child profiles created yet. Parents must add profiles in their dashboard first!");
        setLoading(false);
        return;
      }

      setChildProfiles(profiles);
      setLoginStep('profile');
    } catch (err: any) {
      console.error("Error searching family code:", err);
      setError(err.message || "Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfile = (profile: { id: string; displayName: string; pin: string }) => {
    setSelectedProfile(profile);
    setPinInput('');
    setError('');
    setLoginStep('pin');
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedProfile) return;

    if (pinInput !== selectedProfile.pin) {
      setError("Wrong PIN! Try again or ask your parent!");
      return;
    }

    setLoading(true);
    try {
      // Authenticate anonymously for child safety (COPPA/GDPR-K compliance)
      const credential = await signInAnonymously(auth);
      if (credential.user) {
        const anonymousUid = credential.user.uid;
        
        // Link anonymous child profile to parent in Firestore
        await setDoc(doc(db, 'users', anonymousUid), {
          uid: anonymousUid,
          role: 'child',
          profileName: selectedProfile.displayName,
          connectedAdults: [parentUid],
          parentUid: parentUid,
          createdAt: new Date()
        });

        // Save selected profile details to localStorage
        localStorage.setItem('readabook_active_profile', JSON.stringify({
          displayName: selectedProfile.displayName,
          parentUid: parentUid
        }));

        navigate('/');
      }
    } catch (err: any) {
      console.error("Anonymous authentication error:", err);
      setError(err.message || "Failed to log in securely. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-card glass-panel" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 className="login-title">
            🧸 ReadaBook <span>Kids</span>
          </h1>

          {error && <div className="login-error" style={{ marginBottom: '16px' }}>{error}</div>}

          {loginStep === 'code' && (
            <form onSubmit={handleCodeSubmit} className="auth-form">
              <h2 className="login-subtitle">Enter your Family Invite Code</h2>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <input 
                  type="text" 
                  maxLength={6}
                  value={familyCodeInput} 
                  onChange={(e) => setFamilyCodeInput(e.target.value)} 
                  required 
                  placeholder="e.g. AB12XY"
                  style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '4px', textTransform: 'uppercase' }}
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Finding Family...' : 'Find My Profiles'}
              </button>
            </form>
          )}

          {loginStep === 'profile' && (
            <div style={{ width: '100%' }}>
              <h2 className="login-subtitle">Choose Your Profile</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '16px', margin: '20px 0' }}>
                {childProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleSelectProfile(profile)}
                    className="glass-panel"
                    style={{
                      padding: '16px 8px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>👶</span>
                    <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>
                      {profile.displayName}
                    </span>
                  </button>
                ))}
              </div>
              <button 
                type="button" 
                onClick={() => setLoginStep('code')} 
                className="btn-secondary w-full"
                style={{ padding: '8px' }}
              >
                Back
              </button>
            </div>
          )}

          {loginStep === 'pin' && selectedProfile && (
            <form onSubmit={handlePinSubmit} className="auth-form">
              <h2 className="login-subtitle">Enter PIN for <strong>{selectedProfile.displayName}</strong></h2>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <input 
                  type="password" 
                  maxLength={4}
                  value={pinInput} 
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))} 
                  required 
                  placeholder="••••"
                  style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '12px' }}
                  disabled={loading}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setLoginStep('profile')} 
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                  disabled={loading}
                >
                  Back
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, background: 'var(--accent-secondary)' }} disabled={loading}>
                  {loading ? 'Logging In...' : 'Let\'s Read!'}
                </button>
              </div>
            </form>
          )}

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
