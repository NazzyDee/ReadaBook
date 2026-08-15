import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Users, Plus, Key, Calendar, MessageSquare, BarChart2, BookOpen, AlertTriangle, ArrowLeft, Send } from 'lucide-react';
import { books } from '../lib/booksData';

interface BookClub {
  id: string;
  name: string;
  description: string;
  adminId: string;
  currentBookId: string;
  currentBookTitle: string;
  groupCode: string;
  members: string[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  pageNo?: number;
  createdAt: any;
}

interface PollOption {
  text: string;
  votes: string[]; // array of member Uids
}

interface GroupPoll {
  id: string;
  question: string;
  options: PollOption[];
  active: boolean;
  createdAt: any;
}

interface ClubMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  videoLink: string;
  rsvps: Record<string, 'yes' | 'no'>; // maps memberUid -> rsvp
}

export const BookClubsPage: React.FC = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<BookClub[]>([]);
  const [activeClub, setActiveClub] = useState<BookClub | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'polls' | 'meetings'>('chat');
  
  // Modals / Input states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');
  const [newClubBookId, setNewClubBookId] = useState(books[0].id);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  
  // Chat Room states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [newMsgPage, setNewMsgPage] = useState<number>(0);
  const [userReadingPage, setUserReadingPage] = useState<number>(1);
  const [filterSpoilers, setFilterSpoilers] = useState(true);
  const [revealSpoilersMap, setRevealSpoilersMap] = useState<Record<string, boolean>>({});

  // Poll states
  const [polls, setPolls] = useState<GroupPoll[]>([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('');
  const [pollOpt2, setPollOpt2] = useState('');
  const [pollOpt3, setPollOpt3] = useState('');

  // Meeting states
  const [meetings, setMeetings] = useState<ClubMeeting[]>([]);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  // Bookship Multimedia / Video Meeting / OCR states
  const [showHighlighterModal, setShowHighlighterModal] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState<ClubMeeting | null>(null);
  const [ocrBookPage, setOcrBookPage] = useState<number>(1);
  const [videoCallMuted, setVideoCallMuted] = useState(false);
  const [videoCallCameraOff, setVideoCallCameraOff] = useState(false);

  // Feedback states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Subscribe to User's Joined Clubs
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'book_clubs'), where('members', 'array-contains', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: BookClub[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as BookClub);
      });
      setClubs(list);
      // Keep active club metadata fresh if selected
      if (activeClub) {
        const updated = list.find(c => c.id === activeClub.id);
        if (updated) setActiveClub(updated);
      }
    });
    return () => unsubscribe();
  }, [user, activeClub?.id]);

  // 2. Subscribe to Active Club details (Messages, Polls, Meetings)
  useEffect(() => {
    if (!activeClub) {
      setMessages([]);
      setPolls([]);
      setMeetings([]);
      return;
    }

    // Subscribe to messages
    const msgsQ = query(collection(db, 'book_clubs', activeClub.id, 'messages'));
    const unsubscribeMsgs = onSnapshot(msgsQ, (snapshot) => {
      const list: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      // Sort by creation time
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0);
        return timeA - timeB;
      });
      setMessages(list);
    });

    // Subscribe to polls
    const pollsQ = query(collection(db, 'book_clubs', activeClub.id, 'polls'));
    const unsubscribePolls = onSnapshot(pollsQ, (snapshot) => {
      const list: GroupPoll[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as GroupPoll);
      });
      setPolls(list);
    });

    // Subscribe to meetings
    const mtgsQ = query(collection(db, 'book_clubs', activeClub.id, 'meetings'));
    const unsubscribeMtgs = onSnapshot(mtgsQ, (snapshot) => {
      const list: ClubMeeting[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ClubMeeting);
      });
      setMeetings(list);
    });

    return () => {
      unsubscribeMsgs();
      unsubscribePolls();
      unsubscribeMtgs();
    };
  }, [activeClub?.id]);

  // Handle Create Club
  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const clubId = 'club_' + Date.now();
      const code = 'CLUB-' + Math.floor(100000 + Math.random() * 900000).toString();
      const selectedBook = books.find(b => b.id === newClubBookId);
      
      await setDoc(doc(db, 'book_clubs', clubId), {
        id: clubId,
        name: newClubName,
        description: newClubDesc,
        adminId: user.uid,
        currentBookId: newClubBookId,
        currentBookTitle: selectedBook ? selectedBook.title : 'None',
        groupCode: code,
        members: [user.uid],
        createdAt: new Date()
      });

      setSuccessMsg("Book Club created successfully!");
      setNewClubName('');
      setNewClubDesc('');
      setShowCreateModal(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to create book club.");
    }
  };

  // Handle Join Club via Code
  const handleJoinClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg('');
    setSuccessMsg('');
    const cleanCode = joinCodeInput.trim().toUpperCase();
    try {
      const q = query(collection(db, 'book_clubs'), where('groupCode', '==', cleanCode));
      const snap = await getDocs(q);
      if (snap.empty) {
        setErrorMsg("Club Invite Code not found. Please verify details.");
        return;
      }
      const clubDoc = snap.docs[0];
      const clubData = clubDoc.data() as BookClub;

      if (clubData.members.includes(user.uid)) {
        setErrorMsg("You are already a member of this book club!");
        return;
      }

      await updateDoc(doc(db, 'book_clubs', clubDoc.id), {
        members: arrayUnion(user.uid)
      });

      setSuccessMsg(`Joined book club: ${clubData.name}!`);
      setJoinCodeInput('');
      setShowJoinModal(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to join book club.");
    }
  };

  // Post chat message
  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeClub || !newMsgText.trim()) return;
    try {
      const msgId = 'msg_' + Date.now();
      await setDoc(doc(db, 'book_clubs', activeClub.id, 'messages', msgId), {
        id: msgId,
        senderId: user.uid,
        senderName: user.email ? user.email.split('@')[0] : 'Reader',
        text: newMsgText.trim(),
        pageNo: newMsgPage > 0 ? newMsgPage : null,
        createdAt: new Date()
      });
      setNewMsgText('');
      setNewMsgPage(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Create Poll
  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeClub) return;
    try {
      const pollId = 'poll_' + Date.now();
      const optionsArray: PollOption[] = [];
      if (pollOpt1.trim()) optionsArray.push({ text: pollOpt1.trim(), votes: [] });
      if (pollOpt2.trim()) optionsArray.push({ text: pollOpt2.trim(), votes: [] });
      if (pollOpt3.trim()) optionsArray.push({ text: pollOpt3.trim(), votes: [] });

      await setDoc(doc(db, 'book_clubs', activeClub.id, 'polls', pollId), {
        id: pollId,
        question: pollQuestion.trim(),
        options: optionsArray,
        active: true,
        createdAt: new Date()
      });

      setPollQuestion('');
      setPollOpt1('');
      setPollOpt2('');
      setPollOpt3('');
      setShowCreatePoll(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Vote
  const handleVotePoll = async (pollId: string, optionIndex: number) => {
    if (!user || !activeClub) return;
    try {
      const pollRef = doc(db, 'book_clubs', activeClub.id, 'polls', pollId);
      const activePoll = polls.find(p => p.id === pollId);
      if (!activePoll) return;

      // Map options to remove user's vote from other options, and add to selected
      const updatedOptions = activePoll.options.map((opt, idx) => {
        let votes = [...opt.votes];
        // Remove vote if previously voted
        votes = votes.filter(v => v !== user.uid);
        if (idx === optionIndex) {
          votes.push(user.uid);
        }
        return { text: opt.text, votes };
      });

      await updateDoc(pollRef, {
        options: updatedOptions
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Schedule Meeting
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeClub) return;
    try {
      const mtgId = 'mtg_' + Date.now();
      await setDoc(doc(db, 'book_clubs', activeClub.id, 'meetings', mtgId), {
        id: mtgId,
        title: meetingTitle,
        date: meetingDate,
        time: meetingTime,
        videoLink: meetingLink,
        rsvps: {}
      });

      setMeetingTitle('');
      setMeetingDate('');
      setMeetingTime('');
      setMeetingLink('');
      setShowCreateMeeting(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookAuthorTour = async (authorName: string, date: string, time: string) => {
    if (!user || !activeClub) return;
    try {
      const mtgId = 'meeting_' + Date.now();
      const newMtg = {
        id: mtgId,
        title: `📖 Meet the Author Live: ${authorName} Book Tour`,
        date: date,
        time: time,
        videoLink: `readabook.org/room/${activeClub.id}_meet_${authorName.replace(/\s+/g, '_')}`,
        rsvps: { [user.uid]: 'yes' }
      };
      
      await setDoc(doc(db, 'book_clubs', activeClub.id, 'meetings', mtgId), newMtg);
      setSuccessMsg(`Reserved virtual meeting with ${authorName} successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error("Failed to book author meeting:", err);
      setErrorMsg("Failed to book virtual tour.");
    }
  };
  const handleRsvpMeeting = async (meetingId: string, status: 'yes' | 'no') => {
    if (!user || !activeClub) return;
    try {
      const mtgRef = doc(db, 'book_clubs', activeClub.id, 'meetings', meetingId);
      await updateDoc(mtgRef, {
        [`rsvps.${user.uid}`]: status
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Leave Book Club
  const handleLeaveClub = async (clubId: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to leave this book club?")) return;
    try {
      await updateDoc(doc(db, 'book_clubs', clubId), {
        members: arrayRemove(user.uid)
      });
      setActiveClub(null);
      setSuccessMsg("You have left the book club.");
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: '24px', color: '#fff' }}>
      
      {/* Directory View */}
      {!activeClub ? (
        <>
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <div>
              <h1 className="dashboard-title">Book Clubs</h1>
              <p className="studio-subtitle">Join reading circles, buddy read classics, and discuss chapter by chapter</p>
            </div>
            <div className="flex-center gap-md">
              <button onClick={() => setShowJoinModal(true)} className="btn-secondary flex-center gap-sm" style={{ cursor: 'pointer' }}>
                <Key size={16} />
                <span>Join Club</span>
              </button>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary flex-center gap-sm" style={{ cursor: 'pointer' }}>
                <Plus size={16} />
                <span>Create Club</span>
              </button>
            </div>
          </div>

          {successMsg && <div className="login-success" style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>{successMsg}</div>}
          {errorMsg && <div className="login-error" style={{ marginBottom: '16px' }}>{errorMsg}</div>}

          {/* Joined Clubs List */}
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-muted)' }}>My Joined Clubs</h2>
          {clubs.length === 0 ? (
            <div className="glass-panel text-center" style={{ padding: '48px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>No Book Clubs Joined</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Create your own reading circle or input an invite code to join a co-parent group!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {clubs.map((club) => {
                const book = books.find(b => b.id === club.currentBookId);
                return (
                  <div key={club.id} className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontWeight: 'bold' }}>{club.name}</h3>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                        {club.groupCode}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1, marginBottom: '16px' }}>
                      {club.description || 'No description provided.'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
                      <BookOpen size={14} color="var(--accent-primary)" />
                      <span>Reading: <strong>{book?.title || club.currentBookTitle}</strong></span>
                    </div>

                    <div className="flex-between">
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👥 {club.members.length} members</span>
                      <button 
                        onClick={() => { setActiveClub(club); setActiveTab('chat'); }} 
                        className="btn-primary"
                        style={{ padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Enter Room
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create Club Modal */}
          {showCreateModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '480px' }}>
                <h3>Create New Book Club</h3>
                <form onSubmit={handleCreateClub} className="dashboard-form" style={{ marginTop: '16px' }}>
                  <div className="form-group">
                    <label>Club Name</label>
                    <input type="text" value={newClubName} onChange={e => setNewClubName(e.target.value)} placeholder="e.g., Weekly Sci-Fi Circle" required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={newClubDesc} onChange={e => setNewClubDesc(e.target.value)} placeholder="Describe the reading list, meeting schedule, and guidelines." style={{ minHeight: '80px', width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px', padding: '8px' }} />
                  </div>
                  <div className="form-group">
                    <label>Active Story Book</label>
                    <select value={newClubBookId} onChange={e => setNewClubBookId(e.target.value)}>
                      {books.map(b => (
                        <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-center gap-md" style={{ marginTop: '20px' }}>
                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary w-full">Cancel</button>
                    <button type="submit" className="btn-primary w-full">Create Club</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Join Club Modal */}
          {showJoinModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px' }}>
                <h3>Join Book Club</h3>
                <form onSubmit={handleJoinClub} className="dashboard-form" style={{ marginTop: '16px' }}>
                  <div className="form-group">
                    <label>Invite Code</label>
                    <input 
                      type="text" 
                      value={joinCodeInput} 
                      onChange={e => setJoinCodeInput(e.target.value)} 
                      placeholder="e.g. CLUB-123456" 
                      required 
                      style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '1.2rem', letterSpacing: '1px' }}
                    />
                  </div>
                  <div className="flex-center gap-md" style={{ marginTop: '20px' }}>
                    <button type="button" onClick={() => setShowJoinModal(false)} className="btn-secondary w-full">Cancel</button>
                    <button type="submit" className="btn-primary w-full">Join Club</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Club Active Room View */
        <div>
          {/* Header */}
          <div className="flex-between" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setActiveClub(null)} className="btn-secondary" style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%' }}>
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="dashboard-title" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{activeClub.name}</span>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(157, 78, 221, 0.15)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    Invite Code: {activeClub.groupCode}
                  </span>
                </h1>
                <p className="studio-subtitle" style={{ margin: 0 }}>Active Book: <strong>{activeClub.currentBookTitle}</strong></p>
              </div>
            </div>
            <button 
              onClick={() => handleLeaveClub(activeClub.id)} 
              className="btn-danger"
              style={{ padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Leave Club
            </button>
          </div>

          {/* Sub-panel Tabs */}
          <div className="dashboard-mode-selector flex-center gap-md" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button 
              onClick={() => setActiveTab('chat')} 
              className={`btn-mode-tab ${activeTab === 'chat' ? 'active' : ''}`}
              style={{ background: activeTab === 'chat' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'chat' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              <span className="flex-center gap-sm"><MessageSquare size={14} /> Buddy Read Chat</span>
            </button>
            <button 
              onClick={() => setActiveTab('polls')} 
              className={`btn-mode-tab ${activeTab === 'polls' ? 'active' : ''}`}
              style={{ background: activeTab === 'polls' ? 'var(--accent-secondary)' : 'transparent', color: activeTab === 'polls' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              <span className="flex-center gap-sm"><BarChart2 size={14} /> Selection Polls</span>
            </button>
            <button 
              onClick={() => setActiveTab('meetings')} 
              className={`btn-mode-tab ${activeTab === 'meetings' ? 'active' : ''}`}
              style={{ background: activeTab === 'meetings' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'meetings' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              <span className="flex-center gap-sm"><Calendar size={14} /> Meetings & RSVPs</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          
          {/* TAB 1: BUDDY READ CHAT (SPOILER-SAFE) */}
          {activeTab === 'chat' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
              
              {/* Chat Thread */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
                <div style={{ flex: 1, minHeight: '280px', maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', padding: '8px' }}>
                  {messages.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', margin: 'auto 0' }}>
                      Welcome to the buddy read chat! Say hi to your team.
                    </p>
                  ) : (
                    messages.map((msg) => {
                      const isSpoiler = filterSpoilers && msg.pageNo && msg.pageNo > userReadingPage;
                      const revealed = revealSpoilersMap[msg.id];
                      
                      return (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: msg.pageNo ? '3px solid var(--accent-primary)' : '1px solid var(--border-color)' }}>
                          <div className="flex-between" style={{ marginBottom: '4px', fontSize: '0.8rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{msg.senderName}</span>
                            {msg.pageNo && (
                              <span style={{ background: 'rgba(157, 78, 221, 0.1)', color: 'var(--accent-primary)', padding: '1px 6px', borderRadius: '4px' }}>
                                Page {msg.pageNo}
                              </span>
                            )}
                          </div>
                          
                          {isSpoiler && !revealed ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 183, 3, 0.05)', border: '1px dashed #ffb703', padding: '8px', borderRadius: '6px', marginTop: '4px' }}>
                              <AlertTriangle size={14} color="#ffb703" />
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Spoiler warning (tagged past page {userReadingPage}).</span>
                              <button 
                                onClick={() => setRevealSpoilersMap(prev => ({ ...prev, [msg.id]: true }))} 
                                className="text-link" 
                                style={{ fontSize: '0.85rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-secondary)', fontWeight: 'bold' }}
                              >
                                Reveal
                              </button>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.95rem', color: '#fff', whiteSpace: 'pre-wrap' }}>
                              {msg.text}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handlePostMessage} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '100px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tag Page (Opt)</label>
                      <input 
                        type="number" 
                        value={newMsgPage || ''} 
                        onChange={(e) => setNewMsgPage(parseInt(e.target.value) || 0)} 
                        placeholder="Page #" 
                        style={{ padding: '8px', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Message</label>
                      <input 
                        type="text" 
                        value={newMsgText} 
                        onChange={e => setNewMsgText(e.target.value)} 
                        placeholder="Discuss this page with the circle..." 
                        required 
                        style={{ padding: '8px' }}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowHighlighterModal(true)} 
                      className="btn-secondary" 
                      style={{ padding: '10px 16px', height: 'fit-content', marginTop: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-hover)', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}
                      title="Virtual Highlighter OCR Page Text Scanner"
                    >
                      🖍️ <span>Highlight Quote</span>
                    </button>
                    <button type="submit" className="btn-primary" style={{ padding: '10px 16px', height: 'fit-content', marginTop: '18px', cursor: 'pointer' }}>
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Spoiler Controls */}
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '12px', fontSize: '1rem' }}>Spoiler Shield Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="flex-between">
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Active Shield</label>
                    <input 
                      type="checkbox" 
                      checked={filterSpoilers} 
                      onChange={e => setFilterSpoilers(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>My Reading Progress (Page)</label>
                    <input 
                      type="number" 
                      value={userReadingPage} 
                      onChange={e => setUserReadingPage(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ padding: '8px' }}
                    />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Messages tagged at a higher page number than your current reading progress will be hidden behind a spoiler barrier.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SELECTION POLLS */}
          {activeTab === 'polls' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
              
              {/* Poll List */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', minHeight: '400px' }}>
                <h3 style={{ marginBottom: '16px' }}>Group Reading Polls</h3>
                
                {polls.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', marginTop: '64px' }}>
                    No reading selection polls active in this club.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {polls.map((poll) => {
                      // Calculate total votes
                      const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                      
                      return (
                        <div key={poll.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 'bold' }}>{poll.question}</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {poll.options.map((opt, oIdx) => {
                              const voted = opt.votes.includes(user!.uid);
                              const percent = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                              
                              return (
                                <div key={oIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                                    <span style={{ fontWeight: voted ? 'bold' : 'normal', color: voted ? 'var(--accent-secondary)' : '#fff' }}>
                                      {opt.text} {voted && '✔️'}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>{opt.votes.length} votes ({percent}%)</span>
                                  </div>
                                  
                                  {/* Progress bar container */}
                                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                                      <div style={{ width: `${percent}%`, height: '100%', background: voted ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}></div>
                                    </div>
                                    <button 
                                      type="button" 
                                      onClick={() => handleVotePoll(poll.id, oIdx)}
                                      className={voted ? "btn-secondary" : "btn-primary"}
                                      style={{ padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer' }}
                                    >
                                      Vote
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Create Poll Box (only visible to admin or all parents for simple shared config) */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
                {!showCreatePoll ? (
                  <button 
                    onClick={() => setShowCreatePoll(true)} 
                    className="btn-primary w-full"
                    style={{ padding: '12px' }}
                  >
                    Create Selection Poll
                  </button>
                ) : (
                  <form onSubmit={handleCreatePoll} className="dashboard-form">
                    <h3>New Reading Poll</h3>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label>Question</label>
                      <input type="text" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} placeholder="e.g. What book are we reading in September?" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label>Option 1</label>
                      <input type="text" value={pollOpt1} onChange={e => setPollOpt1(e.target.value)} placeholder="e.g. Dracula" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label>Option 2</label>
                      <input type="text" value={pollOpt2} onChange={e => setPollOpt2(e.target.value)} placeholder="e.g. Frankenstein" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label>Option 3 (Optional)</label>
                      <input type="text" value={pollOpt3} onChange={e => setPollOpt3(e.target.value)} placeholder="e.g. The Time Machine" />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => setShowCreatePoll(false)} className="btn-secondary w-full">Cancel</button>
                      <button type="submit" className="btn-primary w-full">Create</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MEETINGS & RSVPS */}
          {activeTab === 'meetings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
              
              {/* Meeting list */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', minHeight: '400px' }}>
                <h3 style={{ marginBottom: '16px' }}>Scheduled Group Discussions</h3>
                {meetings.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', marginTop: '64px' }}>
                    No group discussion meetings scheduled yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {meetings.map((mtg) => {
                      const rsvpedYes = mtg.rsvps && mtg.rsvps[user!.uid] === 'yes';
                      const rsvpedNo = mtg.rsvps && mtg.rsvps[user!.uid] === 'no';
                      const yesCount = Object.values(mtg.rsvps || {}).filter(v => v === 'yes').length;
                      
                      return (
                        <div key={mtg.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 'bold' }}>{mtg.title}</h4>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                            <div>📅 Date: <strong>{mtg.date}</strong></div>
                            <div>🕒 Time: <strong>{mtg.time}</strong></div>
                            {mtg.videoLink && (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                                <span>🔗 Room Link:</span>
                                <button 
                                  type="button" 
                                  onClick={() => setActiveVideoCall(mtg)} 
                                  className="btn-primary" 
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'var(--accent-success)', borderColor: 'var(--accent-success)', cursor: 'pointer' }}
                                >
                                  📞 Start One-Tap Call
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👥 Attending: <strong>{yesCount} members</strong></span>
                            
                            <div className="flex-center gap-sm">
                              <button 
                                onClick={() => handleRsvpMeeting(mtg.id, 'yes')}
                                className={rsvpedYes ? "btn-primary" : "btn-secondary"}
                                style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}
                              >
                                I'm Attending
                              </button>
                              <button 
                                onClick={() => handleRsvpMeeting(mtg.id, 'no')}
                                className={rsvpedNo ? "btn-primary" : "btn-secondary"}
                                style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', background: rsvpedNo ? 'var(--accent-secondary)' : 'transparent' }}
                              >
                                Can't Go
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Create Meeting Box */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
                {!showCreateMeeting ? (
                  <button 
                    onClick={() => setShowCreateMeeting(true)} 
                    className="btn-primary w-full"
                    style={{ padding: '12px' }}
                  >
                    Schedule Discussion
                  </button>
                ) : (
                  <form onSubmit={handleCreateMeeting} className="dashboard-form">
                    <h3>Schedule Discussion</h3>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label>Title / Chapter</label>
                      <input type="text" value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)} placeholder="e.g. Chapters 1-3 Discussion" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label>Date</label>
                      <input type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label>Time</label>
                      <input type="time" value={meetingTime} onChange={e => setMeetingTime(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label>Video Call Link</label>
                      <input type="text" value={meetingLink} onChange={e => setMeetingLink(e.target.value)} placeholder="e.g. zoom.us/j/12345" />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => setShowCreateMeeting(false)} className="btn-secondary w-full">Cancel</button>
                      <button type="submit" className="btn-primary w-full">Schedule</button>
                    </div>
                  </form>
                )}
              </div>

              {/* Meet the Author booking widget */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content', marginTop: '20px' }}>
                <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🌟 Meet the Author Bookings</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Book a virtual live storytelling session with a bestselling creator directly into your club calendar!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'Dr. Seuss 🎩', topic: 'Rhyme & Imagination', date: '2026-08-18', time: '16:00' },
                    { name: 'Roald Dahl 🍫', topic: 'Mischief & Magic', date: '2026-08-20', time: '17:30' },
                    { name: 'J.K. Rowling 🧙‍♀️', topic: 'Fantasy World-Building', date: '2026-08-22', time: '18:00' }
                  ].map((author) => (
                    <div key={author.name} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{author.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Focus: {author.topic}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 {author.date} at {author.time}</div>
                      <button 
                        type="button" 
                        onClick={() => handleBookAuthorTour(author.name, author.date, author.time)}
                        className="btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%', cursor: 'pointer', background: 'var(--accent-primary)', border: 'none' }}
                      >
                        Book Live Tour Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Virtual Highlighter OCR Scanner Modal */}
      {showHighlighterModal && activeClub && (
        <div className="studio-modal-overlay flex-center" style={{ zIndex: 100 }} onClick={() => setShowHighlighterModal(false)}>
          <div className="studio-modal-card glass-panel" style={{ width: '560px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h2>Virtual Highlighter (OCR Scanner)</h2>
            <p className="card-instructions">Simulate Bookship's page scanner. Select a text quote from the current book page to share it instantly with notes!</p>
            
            <div style={{ margin: '16px 0', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Active Book: {activeClub.currentBookTitle}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem' }}>Page:</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={ocrBookPage} 
                    onChange={e => setOcrBookPage(parseInt(e.target.value) || 1)} 
                    style={{ width: '60px', padding: '4px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff', textAlign: 'center' }} 
                  />
                </div>
              </div>

              {/* Simulated Page Content with highlightable sentences */}
              <div style={{ background: '#fff', color: '#111', padding: '16px', borderRadius: '6px', fontSize: '0.95rem', minHeight: '140px', lineHeight: '1.6', border: '2px solid var(--accent-primary)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(157, 78, 221, 0.2)', color: 'var(--accent-primary)', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                  📸 CAMERA VIEW FINDER
                </div>
                <p style={{ margin: 0, cursor: 'pointer' }}>
                  {[
                    "Once upon a time, in a cozy forest cabin, lived a young bear who loved reading.",
                    "He spent his nights looking at the bright stars and reading tales of ancient wizard castles.",
                    "His friends thought he was sleeping, but his flashlight was always glowing under the blankets.",
                    "One morning, he discovered a mysterious golden key hidden inside a hollow oak tree."
                  ].map((sentence, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => {
                        setNewMsgText(`> "${sentence}" -- (Page ${ocrBookPage}) \n\nCheck out this beautiful passage from our book!`);
                        setNewMsgPage(ocrBookPage);
                        setShowHighlighterModal(false);
                      }}
                      style={{ transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 235, 59, 0.4)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {sentence}{" "}
                    </span>
                  ))}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '6px' }}>
                  💡 Hover & click any sentence above to highlight and scan it!
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowHighlighterModal(false)} className="btn-secondary w-full">Cancel Scanner</button>
            </div>
          </div>
        </div>
      )}

      {/* Bookship Simulated Live Video call Overlay Modal */}
      {activeVideoCall && (
        <div className="studio-modal-overlay flex-center" style={{ zIndex: 101, background: 'rgba(5, 1, 15, 0.95)' }}>
          <div className="studio-modal-card glass-panel" style={{ width: '800px', maxWidth: '95vw', padding: '24px' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>📞 Bookship Live Video Meeting</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Meeting room: {activeVideoCall.title}</p>
              </div>
              <span className="live-overlay-indicator" style={{ position: 'static' }}>ACTIVE</span>
            </div>

            {/* Video Feeds Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              
              {/* User 1: Me */}
              <div style={{ background: '#111', borderRadius: '8px', overflow: 'hidden', height: '180px', position: 'relative', border: '2px solid var(--accent-success)' }}>
                {videoCallCameraOff ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: '#888' }}>
                    Camera Turned Off
                  </div>
                ) : (
                  <div style={{ height: '100%', background: 'linear-gradient(135deg, #0b011d 0%, #00b4d8 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      ME
                    </div>
                    <span style={{ fontSize: '0.8rem', marginTop: '8px' }}>Broadcaster (Active)</span>
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#fff' }}>
                  Me {videoCallMuted && '🔇'}
                </div>
              </div>

              {/* User 2: Co-Parent 1 */}
              <div style={{ background: '#111', borderRadius: '8px', overflow: 'hidden', height: '180px', position: 'relative', border: '1px solid var(--border-color)' }}>
                <div style={{ height: '100%', background: 'linear-gradient(135deg, #051c24 0%, #7209b7 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', border: '2px solid var(--accent-primary)' }}>
                    PJ
                  </div>
                  <span style={{ fontSize: '0.8rem', marginTop: '8px' }}>Papa Joe 👨</span>
                </div>
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#39ff14', borderRadius: '50%', display: 'inline-block' }} className="pulse"></span>
                  <span>Talking...</span>
                </div>
              </div>

              {/* User 3: Co-Parent 2 */}
              <div style={{ background: '#111', borderRadius: '8px', overflow: 'hidden', height: '180px', position: 'relative', border: '1px solid var(--border-color)' }}>
                <div style={{ height: '100%', background: 'linear-gradient(135deg, #3a0ca3 0%, #f72585 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    GS
                  </div>
                  <span style={{ fontSize: '0.8rem', marginTop: '8px' }}>Grandma Sarah 👵</span>
                </div>
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#fff' }}>
                  🔇 Muted
                </div>
              </div>

              {/* User 4: Author / Moderator */}
              <div style={{ background: '#111', borderRadius: '8px', overflow: 'hidden', height: '180px', position: 'relative', border: '1px solid var(--border-color)' }}>
                <div style={{ height: '100%', background: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fff', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    UT
                  </div>
                  <span style={{ fontSize: '0.8rem', marginTop: '8px' }}>Uncle Todd 🧔</span>
                </div>
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#fff' }}>
                  🎙️ Active
                </div>
              </div>

            </div>

            {/* Video Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button 
                type="button" 
                onClick={() => setVideoCallMuted(!videoCallMuted)} 
                className="btn-secondary" 
                style={{ padding: '10px 20px', cursor: 'pointer', background: videoCallMuted ? 'var(--accent-danger)' : '' }}
              >
                {videoCallMuted ? '🔇 Unmute' : '🎙️ Mute'}
              </button>
              <button 
                type="button" 
                onClick={() => setVideoCallCameraOff(!videoCallCameraOff)} 
                className="btn-secondary" 
                style={{ padding: '10px 20px', cursor: 'pointer', background: videoCallCameraOff ? 'var(--accent-danger)' : '' }}
              >
                {videoCallCameraOff ? '📷 Turn Camera On' : '📹 Hide Camera'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  alert("Screen Sharing Active! Broadcasting layout view to other co-parents.");
                }} 
                className="btn-secondary" 
                style={{ padding: '10px 20px', cursor: 'pointer' }}
              >
                🖥️ Share Screen
              </button>
              <button 
                type="button" 
                onClick={() => setActiveVideoCall(null)} 
                className="btn-primary" 
                style={{ padding: '10px 24px', background: 'var(--accent-danger)', borderColor: 'var(--accent-danger)', cursor: 'pointer' }}
              >
                🔴 Leave Meeting
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
