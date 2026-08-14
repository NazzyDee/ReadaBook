import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { doc, setDoc, updateDoc, onSnapshot, collection, query, where, addDoc, deleteDoc, getDocs, writeBatch, arrayRemove } from 'firebase/firestore';
import { db, storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { books } from '../lib/booksData';
import { ChevronLeft, ChevronRight, Play, Square, Users, MessageSquare, BookOpen, Plus, Clipboard, Trash2, Pin, Volume2, VolumeX, Mic, MicOff, AlertTriangle, Radio, Shield, Activity, Star, Video, Circle, Save } from 'lucide-react';
import { saveVideoBlob } from '../lib/recordingsDb';
import '../App.css';

interface ChatMessage {
  id: string;
  text: string;
  username: string;
  createdAt: any;
  type?: 'announcement' | 'normal';
}

interface FirestoreBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  pages: string[];
  uploaderId: string;
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  icon: string;
  text: string;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [streamTitle, setStreamTitle] = useState('Chill Sunday Classics Reading ☕');
  const [streamGenre, setStreamGenre] = useState('Fantasy');
  
  // Custom books state
  const [customBooks, setCustomBooks] = useState<FirestoreBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState(books[0].id);
  const [isLive, setIsLive] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Streamer Studio features
  const [liveUptime, setLiveUptime] = useState('00:00:00');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [emoteOnly, setEmoteOnly] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [showAnnouncementInput, setShowAnnouncementInput] = useState(false);
  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [pinnedMessageText, setPinnedMessageText] = useState<string | null>(null);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [isTtsReading, setIsTtsReading] = useState(false);
  const [followerCount, setFollowerCount] = useState(148); // mock follower baseline

  // Add book form state
  const [showAddBook, setShowAddBook] = useState(false);
  const [familyCode, setFamilyCode] = useState('');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('Fantasy');
  const [newBookText, setNewBookText] = useState('');
  const [addBookError, setAddBookError] = useState('');
  const [addBookSuccess, setAddBookSuccess] = useState('');
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parsingStatus, setParsingStatus] = useState('');

  // Info modal state
  const [showEditInfo, setShowEditInfo] = useState(false);

  // Recording Mode state
  const [dashboardMode, setDashboardMode] = useState<'live' | 'record' | 'upload' | 'sync-editor' | 'children'>('live');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('');
  const [syncPageFlips, setSyncPageFlips] = useState<{ pageIndex: number; time: number }[]>([]);
  const [syncCurrentPageIndex, setSyncCurrentPageIndex] = useState<number>(0);
  const syncVideoRef = useRef<HTMLVideoElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [skipCloudUpload, setSkipCloudUpload] = useState(false);
  const [activeBookPages, setActiveBookPages] = useState<string[]>([]);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);
  
  // Child Profiles States
  const [childProfiles, setChildProfiles] = useState<{ id: string; displayName: string; pin: string }[]>([]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildPin, setNewChildPin] = useState('');
  const [showChildPinMap, setShowChildPinMap] = useState<Record<string, boolean>>({});
  const [connectedDevices, setConnectedDevices] = useState<{ id: string; profileName?: string }[]>([]);

  // Co-Parenting & Invite States
  const [familyAdminId, setFamilyAdminId] = useState('');
  const [isFamilyAdmin, setIsFamilyAdmin] = useState(true);
  const [coParents, setCoParents] = useState<{ id: string; email?: string }[]>([]);
  const [tempInviteCode, setTempInviteCode] = useState('');
  const [inviteTimeLeft, setInviteTimeLeft] = useState(0); // in seconds
  const [inviteCodeInput, setInviteCodeInput] = useState('');

  // Invite code expiration timer countdown
  useEffect(() => {
    if (inviteTimeLeft <= 0) {
      if (tempInviteCode) {
        setTempInviteCode('');
      }
      return;
    }
    const interval = setInterval(() => {
      setInviteTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [inviteTimeLeft, tempInviteCode]);

  // Fetch connected child devices / active sessions
  useEffect(() => {
    if (!user || !familyAdminId) return;
    const q = query(collection(db, 'users'), where('parentUid', '==', familyAdminId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setConnectedDevices(list);
    });
    return () => unsubscribe();
  }, [user, familyAdminId]);

  const handleDisconnectDevice = async (childUid: string) => {
    if (!user || !familyAdminId) return;
    try {
      // 1. Remove child UID from parent's connectedChildren array
      await updateDoc(doc(db, 'users', familyAdminId), {
        connectedChildren: arrayRemove(childUid)
      });
      
      // 2. Disconnect child's anonymous document from parent
      await updateDoc(doc(db, 'users', childUid), {
        connectedAdults: arrayRemove(familyAdminId),
        parentUid: ''
      });
      
      setRecordingSuccess("Device disconnected. Access revoked.");
      setTimeout(() => setRecordingSuccess(''), 3000);
    } catch (err: any) {
      console.error("Failed to disconnect child device:", err);
      setRecordingError("Failed to disconnect device.");
    }
  };
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [pageFlips, setPageFlips] = useState<{ pageIndex: number; time: number }[]>([]);
  const [recordingTitle, setRecordingTitle] = useState('My Cozy Story Reading 📖');
  const [recordingSuccess, setRecordingSuccess] = useState('');
  const [recordingError, setRecordingError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const pageFlipsRef = useRef<{ pageIndex: number; time: number }[]>([]);

  // Twitch Stream Manager States
  const [visibleWidgets, setVisibleWidgets] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('readabook_visible_widgets');
    return saved ? JSON.parse(saved) : {
      monitor: true,
      actions: true,
      reader: true,
      activity: true,
      chat: true,
      polls: true
    };
  });
  const [activityFilter, setActivityFilter] = useState<'all' | 'follows' | 'system' | 'moderation'>('all');
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [showActionsConfigModal, setShowActionsConfigModal] = useState(false);
  const [activeQuickActions, setActiveQuickActions] = useState<string[]>(() => {
    const saved = localStorage.getItem('readabook_quick_actions');
    return saved ? JSON.parse(saved) : [
      'mute', 'emote', 'announce', 'clear', 'sfx', 'shield', 'ad', 'raid', 'automod'
    ];
  });
  const [muteSfx, setMuteSfx] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [autoModActive, _setAutoModActive] = useState(true);

  // Chat settings & moderation
  const [shieldModeActive, setShieldModeActive] = useState(false);
  const [focusedUser, setFocusedUser] = useState<{ username: string; x: number; y: number } | null>(null);
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [moderators, setModerators] = useState<string[]>([]);
  const [timedOutUsers, setTimedOutUsers] = useState<Record<string, number>>({});

  // Poll state
  const [isPollActive, setIsPollActive] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('What should we read next? 📚');
  const [pollOptions, setPollOptions] = useState<{ text: string; votes: number }[]>([
    { text: 'Chapter 2 (Action)', votes: 0 },
    { text: 'Chapter 3 (Mystery)', votes: 0 }
  ]);
  const [pollTimer, setPollTimer] = useState(0);

  // Simulated Overlay States
  const [adTimeRemaining, setAdTimeRemaining] = useState(0);
  const [raidTimeRemaining, setRaidTimeRemaining] = useState(0);
  const [raidTargetChannel, setRaidTargetChannel] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const ttsUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Merge static books and custom books
  const allBooks = [...books, ...customBooks];
  const selectedBookRaw = allBooks.find(b => b.id === selectedBookId) || books[0];

  // Fetch full book pages dynamically
  useEffect(() => {
    const activeBook = allBooks.find(b => b.id === selectedBookId);
    if (!activeBook) return;
    
    const isDefaultBook = books.some(b => b.id === selectedBookId);
    if (isDefaultBook) {
      fetch(`/books/${selectedBookId}.json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.pages) {
            setActiveBookPages(data.pages);
          } else {
            setActiveBookPages(activeBook.pages || []);
          }
        })
        .catch(err => {
          console.error("Failed to load book pages:", err);
          setActiveBookPages(activeBook.pages || []);
        });
    } else {
      setActiveBookPages(activeBook.pages || []);
    }
  }, [selectedBookId, customBooks]);

  const selectedBook = {
    ...selectedBookRaw,
    pages: activeBookPages.length > 0 ? activeBookPages : selectedBookRaw.pages
  };

  // Helper to add activity events
  const addEvent = (text: string, icon: string) => {
    const newEvent: ActivityEvent = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      icon,
      text
    };
    setActivityFeed(prev => [newEvent, ...prev].slice(0, 30));
  };

  // Uptime counter hook
  useEffect(() => {
    if (!isLive || !startTime) {
      setLiveUptime('00:00:00');
      return;
    }

    const interval = setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(secondsElapsed / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((secondsElapsed % 3600) / 60).toString().padStart(2, '0');
      const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
      setLiveUptime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

  return () => clearInterval(interval);
  }, [isLive, startTime]);

  // Recording timer hook
  useEffect(() => {
    if (!isRecording || !recordingStartTime) {
      setRecordingTime('00:00');
      return;
    }

    const interval = setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
      const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
      const seconds = (secondsElapsed % 60).toString().padStart(2, '0');
      setRecordingTime(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, recordingStartTime]);

  // Fetch user's profile to get familyCode and familyAdminId
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.familyCode) {
          setFamilyCode(userData.familyCode);
        }
        if (userData.familyAdminId) {
          setFamilyAdminId(userData.familyAdminId);
          setIsFamilyAdmin(userData.familyAdminId === user.uid);
        } else {
          setFamilyAdminId(user.uid);
          setIsFamilyAdmin(true);
        }
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Subscribe to Child Profiles sub-collection
  useEffect(() => {
    if (!user || !familyAdminId) return;
    const childrenColRef = collection(db, 'users', familyAdminId, 'children');
    const unsubscribe = onSnapshot(childrenColRef, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setChildProfiles(list);
    });
    return () => unsubscribe();
  }, [user, familyAdminId]);

  // Subscribe to Co-Parents in the family group
  useEffect(() => {
    if (!user || !isFamilyAdmin) {
      setCoParents([]);
      return;
    }
    const q = query(
      collection(db, 'users'), 
      where('familyAdminId', '==', user.uid), 
      where('role', '==', 'adult')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          list.push({ id: doc.id, email: doc.data().email });
        }
      });
      setCoParents(list);
    });
    return () => unsubscribe();
  }, [user, isFamilyAdmin]);

  // Fetch custom books uploaded by the user
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'books'), where('uploaderId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: FirestoreBook[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as FirestoreBook);
      });
      setCustomBooks(list);
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to streamer's own stream document when live
  useEffect(() => {
    if (!user || !isLive) return;

    const streamDocRef = doc(db, 'streams', user.uid);
    const unsubscribe = onSnapshot(streamDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentPageIndex(data.currentPage || 0);
        setViewerCount(data.viewerCount || 0);
        setEmoteOnly(data.emoteOnly || false);
        setPinnedMessageText(data.pinnedMessage || null);
      }
    });

    return () => unsubscribe();
  }, [user, isLive]);

  // Subscribe to chat messages for this streamer's channel
  useEffect(() => {
    if (!user || !isLive) return;

    const q = query(
      collection(db, 'messages'),
      where('streamId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      // Sort client-side by createdAt ascending, then limit to 50
      msgs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds || 0);
        return timeA - timeB;
      });
      setChatMessages(msgs.slice(-50));
    });

    return () => unsubscribe();
  }, [user, isLive]);

  // Subscribe to followers count trigger
  useEffect(() => {
    if (!user || !isLive) return;
    // Since we nested follows as a subcollection in Firestore rules: `/users/{userId}/follows/{streamerId}`
    // Let's listen to the follows subcollection directly (requires collectionGroup) or trigger mock follow bumps when active
    const interval = setInterval(() => {
      // simulate followers changing slightly
      setFollowerCount(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 45000);

    return () => clearInterval(interval);
  }, [user, isLive]);

  // sound synthesis helper using HTML5 Web Audio API
  const playAlertSound = (type: 'chat' | 'follow' | 'mod') => {
    if (muteSfx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'chat') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'follow') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
        gain2.gain.setValueAtTime(0.04, ctx.currentTime + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.23);
        osc2.start(ctx.currentTime + 0.08);
        
        osc.stop(ctx.currentTime + 0.15);
        osc2.stop(ctx.currentTime + 0.23);
      } else if (type === 'mod') {
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("AudioContext block:", e);
    }
  };

  // Sound Alerts Effect (Play chat beep when new messages arrive)
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      const username = user?.email ? user.email.split('@')[0] : 'Broadcaster';
      if (lastMsg.username !== 'System' && lastMsg.username !== username && lastMsg.type !== 'announcement') {
        playAlertSound('chat');
      }
    }
  }, [chatMessages]);

  // Sound alerts for follows/activity feed events
  useEffect(() => {
    if (activityFeed.length > 0) {
      const lastEvent = activityFeed[0];
      if (lastEvent.icon === "❤️" || lastEvent.text.includes("followed") || lastEvent.text.includes("subscribed")) {
        playAlertSound('follow');
      }
    }
  }, [activityFeed]);

  // Timer Effect for Polls
  useEffect(() => {
    if (!isPollActive || pollTimer <= 0) {
      if (isPollActive && pollTimer === 0) {
        setIsPollActive(false);
        const maxVotes = Math.max(...pollOptions.map(o => o.votes));
        const winners = pollOptions.filter(o => o.votes === maxVotes);
        const winnerText = winners.map(w => `"${w.text}" (${w.votes} votes)`).join(' and ');
        
        addDoc(collection(db, 'messages'), {
          text: `📊 POLL ENDED: Winner is ${winnerText}!`,
          username: 'System',
          streamId: user?.uid,
          createdAt: new Date(),
          type: 'announcement'
        });
        addEvent(`Poll ended. Winner: ${winners[0]?.text}`, "📊");
        playAlertSound('mod');
      }
      return;
    }

    const interval = setInterval(() => {
      setPollTimer(prev => prev - 1);
      
      setPollOptions(prev => {
        return prev.map(opt => {
          const newVotes = Math.random() > 0.6 ? opt.votes + Math.floor(Math.random() * 5) + 1 : opt.votes;
          return { ...opt, votes: newVotes };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPollActive, pollTimer, pollOptions, user]);

  // Timer Effect for Ads
  useEffect(() => {
    if (adTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setAdTimeRemaining(prev => {
        if (prev <= 1) {
          addEvent("Advertisement finished. Video preview restored.", "📢");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [adTimeRemaining]);

  // Timer Effect for Raids
  useEffect(() => {
    if (raidTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setRaidTimeRemaining(prev => {
        if (prev <= 1) {
          addDoc(collection(db, 'messages'), {
            text: `🚀 RAID ALERT: Raiding channel "${raidTargetChannel}" with 53 viewers! Bye everyone!`,
            username: 'System',
            streamId: user?.uid,
            createdAt: new Date(),
            type: 'announcement'
          });
          addEvent(`Host Raid successful to: ${raidTargetChannel}`, "🚀");
          playAlertSound('follow');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [raidTimeRemaining, raidTargetChannel, user]);

  // Persist layout settings to localStorage
  useEffect(() => {
    localStorage.setItem('readabook_visible_widgets', JSON.stringify(visibleWidgets));
  }, [visibleWidgets]);

  useEffect(() => {
    localStorage.setItem('readabook_quick_actions', JSON.stringify(activeQuickActions));
  }, [activeQuickActions]);

  // Auto-Mod Spam Filter Effect
  useEffect(() => {
    if (!autoModActive || chatMessages.length === 0) return;
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg.username === 'System' || lastMsg.type === 'announcement') return;
    
    // Pattern to catch links and typical spam
    const linkPattern = /https?:\/\/[^\s]+|www\.[^\s]+|\.com\b|\.net\b|\.org\b/i;
    const isSpam = linkPattern.test(lastMsg.text);
    
    if (isSpam) {
      handleDeleteMessage(lastMsg.id);
      handleTimeoutUser(lastMsg.username);
      addEvent(`Auto-Mod: Blocked spam link from ${lastMsg.username}`, "🛡️");
      
      addDoc(collection(db, 'messages'), {
        text: `🛡️ Auto-Mod: Removed message containing link from ${lastMsg.username} and timed them out for 5m.`,
        username: 'System',
        streamId: user?.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
    }
  }, [chatMessages, autoModActive, user]);

  // Handle camera permission and display
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      addEvent("Camera feed connected successfully.", "📷");
    } catch (err) {
      console.warn("Camera/Mic access denied: ", err);
      addEvent("Camera feed offline: permissions missing.", "⚠️");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Option B (Timeline Sync Editor) Helpers
  const handleVideoUploadAndEditSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedVideoFile) {
      setRecordingError("Please select a video file first.");
      return;
    }
    
    setRecordingError('');
    setRecordingSuccess('');
    
    // Check if we should skip Cloud upload for testing
    if (skipCloudUpload || [
      'Person_reading_a_book.mp4',
      'Person_reading_a_book_into_the.mp4',
      'Make_a_high_reto_video_of_a_pe.mp4',
      'Make_a_high_reso_video_of_a_pe.mp4'
    ].includes(uploadedVideoFile.name)) {
      setIsUploading(true);
      setUploadProgress(100);
      setRecordingSuccess("Local mode: Loading pre-copied asset video...");
      setTimeout(() => {
        setUploadedVideoUrl(`/assets/${uploadedVideoFile.name}`);
        setRecordingSuccess('');
        setIsUploading(false);
        setSyncPageFlips([{ pageIndex: 0, time: 0 }]);
        setSyncCurrentPageIndex(0);
        setDashboardMode('sync-editor');
      }, 600);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const recId = 'rec_' + Date.now();
    const storageRef = ref(storage, `recordings/${recId}_uploaded.mp4`);
    const uploadTask = uploadBytesResumable(storageRef, uploadedVideoFile);
    
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
        setRecordingSuccess(`Uploading video: ${progress}%`);
      },
      (error) => {
        console.error("Video upload failed, using local asset fallback:", error);
        setIsUploading(false);
        setUploadedVideoUrl(`/assets/${uploadedVideoFile.name}`);
        setRecordingSuccess('Using local pre-copied asset fallback for offline testing!');
        setTimeout(() => {
          setRecordingSuccess('');
          setSyncPageFlips([{ pageIndex: 0, time: 0 }]);
          setSyncCurrentPageIndex(0);
          setDashboardMode('sync-editor');
        }, 1500);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadedVideoUrl(downloadURL);
          setRecordingSuccess('');
          setIsUploading(false);
          setSyncPageFlips([{ pageIndex: 0, time: 0 }]);
          setSyncCurrentPageIndex(0);
          setDashboardMode('sync-editor');
        } catch (err: any) {
          console.error("Failed to retrieve download URL:", err);
          setIsUploading(false);
          setUploadedVideoUrl(`https://readabook-b8675.firebasestorage.app/mock-video-${recId}.webm`);
          setSyncPageFlips([{ pageIndex: 0, time: 0 }]);
          setSyncCurrentPageIndex(0);
          setDashboardMode('sync-editor');
        }
      }
    );
  };

  const handleMarkPageSync = () => {
    if (!syncVideoRef.current) return;
    const currentTime = syncVideoRef.current.currentTime;
    const timeSec = parseFloat(currentTime.toFixed(1));
    const nextPageIndex = syncCurrentPageIndex + 1;
    if (nextPageIndex < selectedBook.pages.length) {
      setSyncPageFlips(prev => [...prev, { pageIndex: nextPageIndex, time: timeSec }]);
      setSyncCurrentPageIndex(nextPageIndex);
    }
  };

  const handleResetSync = () => {
    setSyncPageFlips([{ pageIndex: 0, time: 0 }]);
    setSyncCurrentPageIndex(0);
    if (syncVideoRef.current) {
      syncVideoRef.current.currentTime = 0;
      syncVideoRef.current.pause();
    }
  };

  const handlePublishSyncStory = async () => {
    try {
      const recId = 'rec_' + Date.now();
      const videoDuration = syncVideoRef.current ? Math.floor(syncVideoRef.current.duration) || 120 : 120;
      
      await addDoc(collection(db, 'recordings'), {
        id: recId,
        title: recordingTitle || `${selectedBook.title} - Uploaded Story`,
        genre: streamGenre,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        bookAuthor: selectedBook.author,
        bookPages: selectedBook.pages,
        bookCoverUrl: selectedBook.coverUrl || '',
        pageFlips: syncPageFlips,
        duration: videoDuration,
        readerId: user!.uid,
        readerName: user!.email ? user!.email.split('@')[0] : 'Storyteller',
        videoUrl: uploadedVideoUrl,
        createdAt: new Date(),
        appType: 'adults'
      });

      setRecordingSuccess('Uploaded storybook published successfully!');
      setUploadedVideoFile(null);
      setDashboardMode('live');
      setTimeout(() => {
        setRecordingSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error("Failed to publish video sync story:", err);
      setRecordingError(err.message || 'Failed to publish storybook.');
    }
  };

  useEffect(() => {
    if (dashboardMode !== 'sync-editor') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleMarkPageSync();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dashboardMode, syncCurrentPageIndex, syncPageFlips]);

  const handleAddChildProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !familyAdminId) return;
    if (newChildPin.length !== 4 || !/^\d{4}$/.test(newChildPin)) {
      setRecordingError("Child PIN must be exactly 4 digits.");
      return;
    }
    try {
      const childId = 'child_' + Date.now();
      await setDoc(doc(db, 'users', familyAdminId, 'children', childId), {
        id: childId,
        displayName: newChildName,
        pin: newChildPin,
        createdAt: new Date()
      });
      setNewChildName('');
      setNewChildPin('');
      setRecordingSuccess("Child profile created successfully!");
      setTimeout(() => setRecordingSuccess(''), 3000);
    } catch (err: any) {
      console.error("Failed to create child profile:", err);
      setRecordingError(err.message || "Failed to create profile.");
    }
  };

  const handleDeleteChildProfile = async (childId: string) => {
    if (!user || !familyAdminId) return;
    try {
      await deleteDoc(doc(db, 'users', familyAdminId, 'children', childId));
      setRecordingSuccess("Child profile deleted.");
      setTimeout(() => setRecordingSuccess(''), 3000);
    } catch (err: any) {
      console.error("Failed to delete child profile:", err);
    }
  };

  const handleGenerateInviteCode = async () => {
    if (!user) return;
    try {
      setRecordingError('');
      setRecordingSuccess('');
      
      const codeNum = Math.floor(100000000 + Math.random() * 900000000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      await setDoc(doc(db, 'family_invites', codeNum), {
        code: codeNum,
        adminId: user.uid,
        expiresAt: expiresAt
      });
      
      const formatted = codeNum.slice(0, 3) + '-' + codeNum.slice(3, 6) + '-' + codeNum.slice(6, 9);
      setTempInviteCode(formatted);
      setInviteTimeLeft(600);
      
      setRecordingSuccess("Invite code generated! Share it with the other parent.");
      setTimeout(() => setRecordingSuccess(''), 3000);
    } catch (err: any) {
      console.error("Failed to generate invite code:", err);
      setRecordingError("Failed to generate invite code.");
    }
  };

  const handleJoinFamilyGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const cleanCode = inviteCodeInput.replace(/\D/g, '');
    if (cleanCode.length !== 9) {
      setRecordingError("Invite code must be exactly 9 digits.");
      return;
    }
    
    setRecordingError('');
    setRecordingSuccess('');
    try {
      const inviteSnap = await getDocs(query(collection(db, 'family_invites'), where('code', '==', cleanCode)));
      
      if (inviteSnap.empty) {
        setRecordingError("Invalid invite code. Please verify the code.");
        return;
      }
      
      const inviteData = inviteSnap.docs[0].data();
      const expiresAt = inviteData.expiresAt.toDate ? inviteData.expiresAt.toDate() : new Date(inviteData.expiresAt);
      
      if (expiresAt < new Date()) {
        setRecordingError("This invite code has expired. Ask the admin parent to generate a new one.");
        return;
      }
      
      const adminId = inviteData.adminId;
      const adminSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', adminId)));
      if (adminSnap.empty) {
        setRecordingError("Admin parent account not found.");
        return;
      }
      const adminData = adminSnap.docs[0].data();
      const adminFamilyCode = adminData.familyCode;
      
      await updateDoc(doc(db, 'users', user.uid), {
        familyAdminId: adminId,
        familyCode: adminFamilyCode
      });
      
      await deleteDoc(doc(db, 'family_invites', cleanCode));
      
      setInviteCodeInput('');
      setRecordingSuccess("Successfully joined family group!");
      setTimeout(() => setRecordingSuccess(''), 3000);
    } catch (err: any) {
      console.error("Failed to join family group:", err);
      setRecordingError(err.message || "Failed to join family group.");
    }
  };

  const handleRemoveCoParent = async (coParentUid: string) => {
    if (!user) return;
    try {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      await updateDoc(doc(db, 'users', coParentUid), {
        familyAdminId: '',
        familyCode: newCode
      });
      
      setRecordingSuccess("Co-parent removed from the family group.");
      setTimeout(() => setRecordingSuccess(''), 3000);
    } catch (err: any) {
      console.error("Failed to remove co-parent:", err);
      setRecordingError("Failed to remove co-parent.");
    }
  };

  const handleLeaveFamilyGroup = async () => {
    if (!user) return;
    try {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await updateDoc(doc(db, 'users', user.uid), {
        familyAdminId: '',
        familyCode: newCode
      });
      setRecordingSuccess("You have left the family group.");
      setTimeout(() => setRecordingSuccess(''), 3000);
    } catch (err: any) {
      console.error("Failed to leave family group:", err);
    }
  };

  const handleStartRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setRecordingError('');
    setRecordingSuccess('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      recordedChunksRef.current = [];
      let options = { mimeType: 'video/webm;codecs=vp9,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm;codecs=vp8,opus' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: '' };
      }

      const recorder = new MediaRecorder(stream, options);
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      const recId = 'rec_' + Date.now();
      const startTimeVal = Date.now();

      recorder.onstop = async () => {
        try {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          await saveVideoBlob(recId, blob);

          const durationVal = Math.floor((Date.now() - startTimeVal) / 1000);
          
          await addDoc(collection(db, 'recordings'), {
            id: recId,
            title: recordingTitle || `${selectedBook.title} - Recording`,
            genre: streamGenre,
            bookId: selectedBook.id,
            bookTitle: selectedBook.title,
            bookAuthor: selectedBook.author,
            bookPages: selectedBook.pages,
            bookCoverUrl: selectedBook.coverUrl,
            pageFlips: pageFlipsRef.current,
            duration: durationVal,
            readerId: user.uid,
            readerName: user.email ? user.email.split('@')[0] : 'Storyteller',
            createdAt: new Date(),
            appType: 'adults'
          });

          setRecordingSuccess('Story recording saved successfully! View it in Watch Later.');
          setTimeout(() => {
            setIsRecording(false);
            setRecordingStartTime(null);
            setDashboardMode('live');
            setRecordingSuccess('');
          }, 3000);
        } catch (err: any) {
          console.error("Error saving recording: ", err);
          setRecordingError(err.message || "Failed to save recording metadata.");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);

      setRecordingStartTime(startTimeVal);
      setIsRecording(true);
      setCurrentPageIndex(0);
      pageFlipsRef.current = [{ pageIndex: 0, time: 0 }];
      setPageFlips([{ pageIndex: 0, time: 0 }]);
    } catch (err: any) {
      console.error("Error starting recording: ", err);
      setRecordingError(err.message || "Could not access camera/mic for recording.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopCamera();
  };

  const handleRecordingPageChange = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= selectedBook.pages.length) return;
    
    const elapsed = (Date.now() - (recordingStartTime || Date.now())) / 1000;
    const timeSec = parseFloat(elapsed.toFixed(1));
    const nextFlips = [...pageFlipsRef.current, { pageIndex: newIndex, time: timeSec }];
    pageFlipsRef.current = nextFlips;
    setPageFlips(nextFlips);
    setCurrentPageIndex(newIndex);
  };

  const handleGoLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const initialPageIndex = 0;
    const randomViewers = Math.floor(Math.random() * 80) + 12;
    const now = Date.now();

    try {
      await setDoc(doc(db, 'streams', user.uid), {
        streamerId: user.uid,
        streamerName: user.email ? user.email.split('@')[0] : 'Streamer',
        title: streamTitle,
        genre: streamGenre,
        bookId: selectedBookId,
        currentPage: initialPageIndex,
        isLive: true,
        viewerCount: randomViewers,
        emoteOnly: false,
        pinnedMessage: null,
        updatedAt: new Date()
      });

      setStartTime(now);
      setIsLive(true);
      setViewerCount(randomViewers);
      setCurrentPageIndex(initialPageIndex);
      
      setActivityFeed([]); // reset activity feed
      addEvent(`Broadcast Started: ${streamTitle}`, "🔴");
      addEvent(`Active Book: ${selectedBook.title}`, "📖");

      await startCamera();
    } catch (err) {
      console.error("Error going live: ", err);
    }
  };

  const handleEndStream = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        isLive: false,
        updatedAt: new Date()
      });

      setIsLive(false);
      setStartTime(null);
      stopCamera();
      
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsTtsReading(false);
    } catch (err) {
      console.error("Error ending stream: ", err);
    }
  };

  const handleParagraphClick = async (pIdx: number) => {
    setActiveParagraphIndex(pIdx);
    if (!user || !isLive) return;

    try {
      const streamRef = doc(db, 'streams', user.uid);
      const streamKidsRef = doc(db, 'streams_kids', user.uid);
      await updateDoc(streamRef, { currentParagraph: pIdx });
      await updateDoc(streamKidsRef, { currentParagraph: pIdx });
    } catch (err) {
      console.error("Error syncing active paragraph:", err);
    }
  };

  const handlePageChange = async (newIndex: number) => {
    if (!user || !isLive) return;
    if (newIndex < 0 || newIndex >= selectedBook.pages.length) return;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        currentPage: newIndex,
        currentParagraph: 0,
        updatedAt: new Date()
      });
      await updateDoc(doc(db, 'streams_kids', user.uid), {
        currentPage: newIndex,
        currentParagraph: 0,
        updatedAt: new Date()
      });
      setCurrentPageIndex(newIndex);
      setActiveParagraphIndex(0);
      addEvent(`Flipped to Page ${newIndex + 1}`, "📖");
      
      // Stop speech synthesis if it was speaking and restart on the new page
      if (isTtsReading) {
        speakPageText(selectedBook.pages[newIndex], 0);
      }
    } catch (err) {
      console.error("Error changing page: ", err);
    }
  };

  // Text-To-Speech Reader Assistant
  const toggleTtsReading = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported on this browser!");
      return;
    }

    if (isTtsReading) {
      window.speechSynthesis.cancel();
      setIsTtsReading(false);
      addEvent("Text-to-speech reading paused.", "🔈");
    } else {
      setIsTtsReading(true);
      addEvent("Text-to-speech reading active.", "🔊");
      const startIdx = activeParagraphIndex >= 0 ? activeParagraphIndex : 0;
      speakPageText(selectedBook.pages[currentPageIndex], startIdx);
    }
  };

  const speakPageText = (text: string, startParagraphIdx: number = 0) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // clear queue

    if (!text) return;

    const paras = text.split('\n\n').map(p => p.trim()).filter(p => p.length > 0);
    if (paras.length === 0) return;

    const speakParagraph = (idx: number) => {
      if (idx >= paras.length) {
        // Finished all paragraphs on this page - turn page!
        if (currentPageIndex < selectedBook.pages.length - 1) {
          handlePageChange(currentPageIndex + 1);
        } else {
          setIsTtsReading(false);
          setActiveParagraphIndex(-1);
          addEvent("Reached the end of the story.", "🏁");
        }
        return;
      }

      // Highlight this paragraph & sync to kids
      handleParagraphClick(idx);

      const utterance = new SpeechSynthesisUtterance(paras[idx]);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (window.speechSynthesis && !window.speechSynthesis.paused) {
          // Speak next paragraph
          speakParagraph(idx + 1);
        }
      };

      utterance.onerror = (e) => {
        console.error("TTS utterance error: ", e);
        setIsTtsReading(false);
      };

      ttsUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakParagraph(startParagraphIdx);
  };

  // Moderation: Clear Chat
  const handleClearChat = async () => {
    if (!user || !isLive) return;
    
    try {
      const q = query(collection(db, 'messages'), where('streamId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      addEvent("Chat messages cleared.", "⚠️");
      
      // Post system message
      await addDoc(collection(db, 'messages'), {
        text: "🚨 Chat was cleared by the streamer.",
        username: "System",
        streamId: user.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
    } catch (err) {
      console.error("Error clearing chat: ", err);
    }
  };

  // Moderation: Toggle Emote Only Mode
  const handleToggleEmoteOnly = async () => {
    if (!user || !isLive) return;
    const nextState = !emoteOnly;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        emoteOnly: nextState
      });
      setEmoteOnly(nextState);
      addEvent(`Emote-only chat ${nextState ? 'enabled' : 'disabled'}.`, "💬");
      
      // Log notification message to viewers
      await addDoc(collection(db, 'messages'), {
        text: nextState ? "💬 Emote-Only mode has been enabled by the streamer." : "💬 Standard chat mode has been restored.",
        username: "System",
        streamId: user.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
    } catch (err) {
      console.error("Error toggling emote mode: ", err);
    }
  };

  // Moderation: Toggle Streamer Microphone State
  const handleToggleMic = () => {
    if (!mediaStreamRef.current) return;
    
    const nextState = !micMuted;
    mediaStreamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !nextState;
    });
    setMicMuted(nextState);
    addEvent(`Microphone ${nextState ? 'muted' : 'unmuted'}.`, nextState ? "🎙️❌" : "🎙️");
  };

  // Quick Action: Send Announcement Message
  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !announcementText.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: `📢 ANNOUNCEMENT: ${announcementText}`,
        username: user.email ? user.email.split('@')[0] : 'Broadcaster',
        streamId: user.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
      addEvent(`Announcement posted: ${announcementText.substring(0, 20)}...`, "📢");
      setAnnouncementText('');
      setShowAnnouncementInput(false);
    } catch (err) {
      console.error("Error sending announcement: ", err);
    }
  };

  // Moderation: Delete Single Chat Message
  const handleDeleteMessage = async (msgId: string) => {
    try {
      await deleteDoc(doc(db, 'messages', msgId));
      addEvent("Removed an inappropriate message.", "🛡️");
    } catch (err) {
      console.error("Error deleting message: ", err);
    }
  };

  // Moderation: Pin Chat Message
  const handlePinMessage = async (msgText: string, msgId: string) => {
    if (!user) return;
    
    const nextPinText = pinnedMessageId === msgId ? null : msgText;
    const nextPinId = pinnedMessageId === msgId ? null : msgId;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        pinnedMessage: nextPinText
      });
      setPinnedMessageId(nextPinId);
      setPinnedMessageText(nextPinText);
      addEvent(nextPinText ? `Pinned message: "${msgText.substring(0,20)}..."` : "Unpinned message.", "📌");
    } catch (err) {
      console.error("Error pinning message: ", err);
    }
  };

  // Edit Stream Details Live
  const handleUpdateStreamDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        title: streamTitle,
        genre: streamGenre
      });
      addEvent(`Updated stream details: ${streamTitle}`, "⚙️");
      setShowEditInfo(false);
    } catch (err) {
      console.error("Error updating stream info: ", err);
    }
  };

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(script);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAddBookError('');
    setAddBookSuccess('');
    setIsParsingFile(true);
    setParsingStatus('Loading document parser...');

    // Auto-fill title from filename
    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[_-]/g, " ")    // replace underscores/dashes with spaces
      .replace(/\b\w/g, c => c.toUpperCase()); // capitalize words
    setNewBookTitle(cleanTitle);

    const reader = new FileReader();

    if (file.name.endsWith('.pdf')) {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js');
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

        reader.onload = async () => {
          try {
            setParsingStatus('Extracting pages from PDF...');
            const arrayBuffer = reader.result as ArrayBuffer;
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            let extractedPages: string[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
              setParsingStatus(`Reading page ${i} of ${pdf.numPages}...`);
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
              
              if (pageText) {
                extractedPages.push(pageText);
              }
            }

            if (extractedPages.length === 0) {
              setAddBookError('Could not extract any text from this PDF. Is it scanned?');
            } else {
              setNewBookText(extractedPages.join('\n\n'));
              setAddBookSuccess(`Successfully extracted ${extractedPages.length} pages from PDF!`);
              setTimeout(() => setAddBookSuccess(''), 4000);
            }
            setIsParsingFile(false);
          } catch (err: any) {
            console.error(err);
            setAddBookError('Failed to parse PDF: ' + err.message);
            setIsParsingFile(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err: any) {
        setAddBookError('Failed to load PDF library: ' + err.message);
        setIsParsingFile(false);
      }
    } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
        const mammoth = (window as any).mammoth;

        reader.onload = async () => {
          try {
            setParsingStatus('Parsing Word document...');
            const arrayBuffer = reader.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            const rawText = result.value;
            
            // Split docx text into paragraphs and chunk them into pages of ~3-4 paragraphs each
            const paragraphs = rawText
              .split('\n')
              .map((p: string) => p.trim())
              .filter((p: string) => p.length > 0);

            if (paragraphs.length === 0) {
              setAddBookError('The Word document appears to be empty.');
            } else {
              // Group paragraphs into pages
              const pageSize = 3;
              const extractedPages: string[] = [];
              for (let i = 0; i < paragraphs.length; i += pageSize) {
                const chunk = paragraphs.slice(i, i + pageSize);
                extractedPages.push(chunk.join('\n\n'));
              }

              setNewBookText(extractedPages.join('\n\n'));
              setAddBookSuccess(`Successfully parsed Word document into ${extractedPages.length} pages!`);
              setTimeout(() => setAddBookSuccess(''), 4000);
            }
            setIsParsingFile(false);
          } catch (err: any) {
            console.error(err);
            setAddBookError('Failed to parse Word document: ' + err.message);
            setIsParsingFile(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err: any) {
        setAddBookError('Failed to load Word document library: ' + err.message);
        setIsParsingFile(false);
      }
    } else {
      // Treat as plain text
      reader.onload = () => {
        const text = reader.result as string;
        setNewBookText(text);
        setAddBookSuccess('Successfully loaded text file!');
        setTimeout(() => setAddBookSuccess(''), 4000);
        setIsParsingFile(false);
      };
      reader.readAsText(file);
    }
  };

  // Add new custom book to Firestore
  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAddBookError('');
    setAddBookSuccess('');

    const pages = newBookText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (pages.length === 0) {
      setAddBookError('Book text cannot be empty! Paste paragraphs separated by double newlines.');
      return;
    }

    const generateBookCoverSvgUrl = (title: string, author: string, genre: string): string => {
      let bgSolidColor = '#1e1e24';
      let textAccent = '#ffde6a';
      if (genre === 'Sci-Fi') {
        bgSolidColor = '#0077b6';
        textAccent = '#ffffff';
      } else if (genre === 'Classics') {
        bgSolidColor = '#fb8500';
        textAccent = '#2b2d42';
      } else if (genre === 'Mystery') {
        bgSolidColor = '#8f0030';
        textAccent = '#ffffff';
      }

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
          <rect width="300" height="400" fill="${bgSolidColor}" rx="15"/>
          <rect x="15" y="15" width="270" height="370" fill="none" stroke="${textAccent}" stroke-width="2" rx="10" opacity="0.6"/>
          <text x="50%" y="150" font-family="'Comic Sans MS', cursive, sans-serif" font-size="20" font-weight="bold" fill="${textAccent}" text-anchor="middle">
            ${title.substring(0, 20)}${title.length > 20 ? '...' : ''}
          </text>
          <text x="50%" y="200" font-family="sans-serif" font-size="14" fill="#aaa" text-anchor="middle">
            By ${author}
          </text>
          <text x="50%" y="300" font-family="sans-serif" font-size="12" font-weight="bold" fill="${textAccent}" text-anchor="middle" opacity="0.8">
            📖 ${genre.toUpperCase()}
          </text>
        </svg>
      `;
      return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg.trim())));
    };

    try {
      const bookRef = await addDoc(collection(db, 'books'), {
        title: newBookTitle,
        author: newBookAuthor,
        genre: newBookGenre,
        pages,
        coverUrl: generateBookCoverSvgUrl(newBookTitle, newBookAuthor, newBookGenre),
        uploaderId: user.uid,
        createdAt: new Date()
      });

      setAddBookSuccess('Book uploaded successfully!');
      setSelectedBookId(bookRef.id);
      setNewBookTitle('');
      setNewBookAuthor('');
      setNewBookText('');
      setTimeout(() => {
        setShowAddBook(false);
        setAddBookSuccess('');
      }, 2000);
    } catch (err: any) {
      setAddBookError(err.message || 'Failed to upload book.');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleUserClick = (username: string, e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setFocusedUser({
      username,
      x: rect.left,
      y: rect.top + window.scrollY + 20
    });
  };

  const handleTimeoutUser = (username: string) => {
    const expiry = Date.now() + 5 * 60 * 1000;
    setTimedOutUsers(prev => ({ ...prev, [username]: expiry }));
    addEvent(`Timed out ${username} for 5 minutes.`, "🛡️");
    playAlertSound('mod');
    setFocusedUser(null);
    addDoc(collection(db, 'messages'), {
      text: `🛡️ ${username} has been timed out for 5 minutes.`,
      username: 'System',
      streamId: user?.uid,
      createdAt: new Date(),
      type: 'announcement'
    });
  };

  const handleBanUser = (username: string) => {
    setBannedUsers(prev => [...prev, username]);
    addEvent(`Banned user ${username}.`, "🛡️");
    playAlertSound('mod');
    setFocusedUser(null);
    addDoc(collection(db, 'messages'), {
      text: `🚨 ${username} has been permanently banned from this channel.`,
      username: 'System',
      streamId: user?.uid,
      createdAt: new Date(),
      type: 'announcement'
    });
  };

  const handlePromoteMod = (username: string) => {
    if (moderators.includes(username)) {
      setModerators(prev => prev.filter(u => u !== username));
      addEvent(`Removed moderator rights from ${username}.`, "🛡️");
    } else {
      setModerators(prev => [...prev, username]);
      addEvent(`Promoted ${username} to moderator.`, "🛡️");
    }
    playAlertSound('mod');
    setFocusedUser(null);
  };

  const renderQuickActions = () => {
    return activeQuickActions.map(action => {
      switch (action) {
        case 'mute':
          return (
            <button type="button" key="mute" onClick={handleToggleMic} className={`action-tile ${micMuted ? 'active-red' : ''}`}>
              {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
              <span>{micMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
            </button>
          );
        case 'emote':
          return (
            <button type="button" key="emote" onClick={handleToggleEmoteOnly} className={`action-tile ${emoteOnly ? 'active-purple' : ''}`}>
              <MessageSquare size={18} />
              <span>{emoteOnly ? 'Standard Chat' : 'Emote-Only'}</span>
            </button>
          );
        case 'announce':
          return (
            <button type="button" key="announce" onClick={() => setShowAnnouncementInput(!showAnnouncementInput)} className="action-tile">
              <span>📢</span>
              <span>Announce</span>
            </button>
          );
        case 'clear':
          return (
            <button type="button" key="clear" onClick={() => { handleClearChat(); playAlertSound('mod'); }} className="action-tile danger-tile">
              <AlertTriangle size={18} />
              <span>Clear Chat</span>
            </button>
          );
        case 'sfx':
          return (
            <button type="button" key="sfx" onClick={() => setMuteSfx(!muteSfx)} className={`action-tile ${!muteSfx ? 'active-purple' : ''}`}>
              {muteSfx ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span>{muteSfx ? 'Unmute SFX' : 'Mute SFX'}</span>
            </button>
          );
        case 'shield':
          return (
            <button type="button" key="shield" onClick={() => { setShieldModeActive(!shieldModeActive); playAlertSound('mod'); }} className={`action-tile ${shieldModeActive ? 'active-red' : ''}`}>
              <Shield size={18} />
              <span>{shieldModeActive ? 'Disable Shield' : 'Shield Mode'}</span>
            </button>
          );
        case 'ad':
          return (
            <button type="button" key="ad" onClick={() => { setAdTimeRemaining(30); addEvent("Started 30s advertisement break", "📢"); playAlertSound('mod'); }} className="action-tile" disabled={adTimeRemaining > 0}>
              <span>📺</span>
              <span>Run 30s Ad</span>
            </button>
          );
        case 'raid':
          return (
            <button type="button" key="raid" onClick={() => { setRaidTargetChannel('BookWormLofi'); setRaidTimeRemaining(10); addEvent("Initiating raid to BookWormLofi in 10s", "🚀"); playAlertSound('mod'); }} className="action-tile" disabled={raidTimeRemaining > 0}>
              <span>🚀</span>
              <span>Raid Channel</span>
            </button>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main studio-main">
        
        {/* Studio Title Bar */}
        <div className="studio-header">
          <div>
            <h1 className="dashboard-title">Creator Studio</h1>
            <p className="studio-subtitle">Stream control room, dashboard analytics, and live page manager{familyCode && <span style={{ marginLeft: "12px", background: "rgba(157, 78, 221, 0.15)", color: "var(--accent-primary)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>Family Code: {familyCode}</span>}</p>
          </div>
          <div className="flex-center gap-sm">
            <button 
              type="button"
              onClick={() => setPerformanceMode(!performanceMode)} 
              className={`btn-layout-toggle flex-center gap-sm ${performanceMode ? 'active-red' : ''}`}
              style={{ borderColor: performanceMode ? 'var(--accent-danger)' : '' }}
              title="Toggle Low-CPU Performance Mode (disables video preview to save CPU)"
            >
              <span>{performanceMode ? 'Performance Mode: ON ⚡' : 'Performance Mode: OFF'}</span>
            </button>
            <button 
              type="button"
              onClick={() => setShowLayoutModal(true)} 
              className="btn-layout-toggle flex-center gap-sm"
              title="Customize Studio Layout"
            >
              <span>Layout Settings ⚙️</span>
            </button>
            {!isLive && (
              <button 
                onClick={() => setShowAddBook(!showAddBook)} 
                className="btn-primary flex-center gap-sm"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-main)', border: '1px solid var(--border-color)', boxShadow: 'none' }}
              >
                <Plus size={16} />
                <span>{showAddBook ? 'Back to Setup' : 'Upload Custom Book'}</span>
              </button>
            )}
          </div>
        </div>

        {isLive && (
          /* Live Streamer Metrics Bar */
          <div className="studio-metrics-bar glass-panel">
            <div className="metric-item">
              <span className="metric-dot red-pulse"></span>
              <div className="metric-info">
                <span className="label">STATUS</span>
                <span className="value text-red font-bold">LIVE</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon"><Users size={16} color="var(--accent-secondary)" /></span>
              <div className="metric-info">
                <span className="label">VIEWERS</span>
                <span className="value">{viewerCount}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon"><Star size={16} color="var(--accent-tertiary)" /></span>
              <div className="metric-info">
                <span className="label">FOLLOWERS</span>
                <span className="value">{followerCount}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon"><Activity size={16} color="var(--accent-success)" /></span>
              <div className="metric-info">
                <span className="label">UPTIME</span>
                <span className="value font-mono">{liveUptime}</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon"><Shield size={16} color="var(--accent-success)" /></span>
              <div className="metric-info">
                <span className="label">HEALTH</span>
                <span className="value text-green">EXCELLENT</span>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard setup state panels */}
        {!isLive && showAddBook ? (
          /* Add Custom Book Form */
          <div className="dashboard-card glass-panel">
            <h2 className="flex-center gap-sm">
              <BookOpen size={20} color="var(--accent-secondary)" />
              <span>Upload Custom Book</span>
            </h2>
            <p className="card-instructions">
              Paste your book content below. Separate pages or chapters with <strong>double newlines</strong> (hit Enter twice).
            </p>

            {addBookError && <div className="login-error">{addBookError}</div>}
            {addBookSuccess && <div className="login-success">{addBookSuccess}</div>}

            <form onSubmit={handleAddBookSubmit} className="dashboard-form">
              {/* File Drop/Upload Zone */}
              <div 
                style={{
                  border: '2px dashed var(--accent-secondary)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'rgba(157, 78, 221, 0.04)',
                  marginBottom: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s, border-color 0.2s'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.background = 'rgba(157, 78, 221, 0.08)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.background = 'rgba(157, 78, 221, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.background = 'rgba(157, 78, 221, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--accent-secondary)';
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const inputEl = document.getElementById('book-file-input') as HTMLInputElement;
                    if (inputEl) {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(file);
                      inputEl.files = dataTransfer.files;
                      const event = new Event('change', { bubbles: true });
                      inputEl.dispatchEvent(event);
                    }
                  }
                }}
              >
                <input 
                  type="file" 
                  id="book-file-input"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  disabled={isParsingFile}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '2.5rem' }}>📄</span>
                  <strong style={{ fontSize: '1rem', color: '#fff' }}>
                    Drag & drop PDF, Word (.docx) or Text (.txt) files here
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    or click to browse your files
                  </span>
                  
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'rgba(255, 183, 3, 0.12)',
                    border: '1px solid rgba(255, 183, 3, 0.25)',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#ffde6a',
                    fontWeight: '500'
                  }}>
                    <span>💡 Using Google Docs? Go to **File &gt; Download** as **PDF (.pdf)** or **Word (.docx)**</span>
                  </div>
                </div>
              </div>

              {isParsingFile && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(157, 78, 221, 0.1)',
                  border: '1px solid var(--accent-primary)',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.2rem', animation: 'spin 1.5s linear infinite' }}>⏳</span>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>{parsingStatus}</span>
                </div>
              )}

              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Book Title</label>
                  <input 
                    type="text" 
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    placeholder="e.g., My Original Novel"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Author</label>
                  <input 
                    type="text" 
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Genre</label>
                  <select 
                    value={newBookGenre}
                    onChange={(e) => setNewBookGenre(e.target.value)}
                  >
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Classics">Classics</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Book Content (Extracted content will appear here, edit as needed)</label>
                <textarea 
                  value={newBookText}
                  onChange={(e) => setNewBookText(e.target.value)}
                  placeholder={`Chapter 1\n\nThis is page 1 content...\n\nThis is page 2 content...`}
                  rows={10}
                  required
                />
              </div>

              <button type="submit" className="btn-primary flex-center gap-sm">
                <Clipboard size={18} />
                <span>Upload Novel</span>
              </button>
            </form>
          </div>
        ) : !isLive && !isRecording && dashboardMode !== 'sync-editor' ? (
          /* Stream Setup Form */
          <div className="dashboard-card glass-panel">
            <div className="dashboard-mode-selector flex-center gap-md" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <button 
                type="button"
                onClick={() => setDashboardMode('live')}
                className={`btn-mode-tab ${dashboardMode === 'live' ? 'active' : ''}`}
                style={{
                  background: dashboardMode === 'live' ? 'var(--accent-primary)' : 'transparent',
                  color: dashboardMode === 'live' ? '#fff' : 'var(--text-muted)',
                  border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                Go Live (Stream)
              </button>
              <button 
                type="button"
                onClick={() => setDashboardMode('record')}
                className={`btn-mode-tab ${dashboardMode === 'record' ? 'active' : ''}`}
                style={{
                  background: dashboardMode === 'record' ? 'var(--accent-secondary)' : 'transparent',
                  color: dashboardMode === 'record' ? '#fff' : 'var(--text-muted)',
                  border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                Record Story (Watch Later)
              </button>
              <button 
                type="button"
                onClick={() => setDashboardMode('upload')}
                className={`btn-mode-tab ${dashboardMode === 'upload' ? 'active' : ''}`}
                style={{
                  background: dashboardMode === 'upload' ? 'var(--accent-primary)' : 'transparent',
                  color: dashboardMode === 'upload' ? '#fff' : 'var(--text-muted)',
                  border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                Upload Video (Sync Timeline)
              </button>
              <button 
                type="button"
                onClick={() => setDashboardMode('children')}
                className={`btn-mode-tab ${dashboardMode === 'children' ? 'active' : ''}`}
                style={{
                  background: dashboardMode === 'children' ? 'var(--accent-primary)' : 'transparent',
                  color: dashboardMode === 'children' ? '#fff' : 'var(--text-muted)',
                  border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                Child Profiles
              </button>
            </div>

            {dashboardMode === 'live' ? (
              <>
                <h2>Live Stream Setup</h2>
                <form onSubmit={handleGoLive} className="dashboard-form">
                  <div className="form-group">
                    <label>Stream Title</label>
                    <input 
                      type="text" 
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      placeholder="e.g., Chill Sunday Classics Reading"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Genre / Category</label>
                      <select 
                        value={streamGenre} 
                        onChange={(e) => setStreamGenre(e.target.value)}
                      >
                        <option value="Fantasy">Fantasy</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Classics">Classics</option>
                        <option value="Mystery">Mystery</option>
                      </select>
                    </div>

                    <div className="form-group flex-2">
                      <label>Select Book to Read</label>
                      <select 
                        value={selectedBookId} 
                        onChange={(e) => setSelectedBookId(e.target.value)}
                      >
                        <optgroup label="Default Public Domain Books">
                          {books.map((b) => (
                            <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                          ))}
                        </optgroup>
                        {customBooks.length > 0 && (
                          <optgroup label="My Uploaded Books">
                            {customBooks.map((b) => (
                              <option key={b.id} value={b.id}>{b.title} (Custom)</option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary flex-center gap-sm">
                    <Play size={18} />
                    <span>Go Live Now</span>
                  </button>
                </form>
              </>
            ) : dashboardMode === 'record' ? (
              <>
                <h2>Record Story Setup</h2>
                {recordingError && <div className="login-error" style={{ marginBottom: '16px' }}>{recordingError}</div>}
                {recordingSuccess && <div className="login-success" style={{ marginBottom: '16px', color: 'var(--accent-secondary)' }}>{recordingSuccess}</div>}
                
                <form onSubmit={handleStartRecording} className="dashboard-form">
                  <div className="form-group">
                    <label>Recording Title</label>
                    <input 
                      type="text" 
                      value={recordingTitle}
                      onChange={(e) => setRecordingTitle(e.target.value)}
                      placeholder="e.g., Grandpa reading Frankenstein"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Genre / Category</label>
                      <select 
                        value={streamGenre} 
                        onChange={(e) => setStreamGenre(e.target.value)}
                      >
                        <option value="Fantasy">Fantasy</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Classics">Classics</option>
                        <option value="Mystery">Mystery</option>
                      </select>
                    </div>

                    <div className="form-group flex-2">
                      <label>Select Book to Record</label>
                      <select 
                        value={selectedBookId} 
                        onChange={(e) => setSelectedBookId(e.target.value)}
                      >
                        <optgroup label="Default Public Domain Books">
                          {books.map((b) => (
                            <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                          ))}
                        </optgroup>
                        {customBooks.length > 0 && (
                          <optgroup label="My Uploaded Books">
                            {customBooks.map((b) => (
                              <option key={b.id} value={b.id}>{b.title} (Custom)</option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary flex-center gap-sm" style={{ background: 'var(--accent-secondary)' }}>
                    <Video size={18} />
                    <span>Start Recording Session</span>
                  </button>
                </form>
              </>
            ) : dashboardMode === 'upload' ? (
              <>
                <h2>Upload Video Storytime</h2>
                {recordingError && <div className="login-error" style={{ marginBottom: '16px' }}>{recordingError}</div>}
                {recordingSuccess && <div className="login-success" style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>{recordingSuccess}</div>}
                
                <form onSubmit={handleVideoUploadAndEditSync} className="dashboard-form">
                  <div className="form-group">
                    <label>Story title</label>
                    <input 
                      type="text" 
                      value={recordingTitle}
                      onChange={(e) => setRecordingTitle(e.target.value)}
                      placeholder="e.g., Sunday Uploaded Storytime"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Genre / Category</label>
                      <select 
                        value={streamGenre} 
                        onChange={(e) => setStreamGenre(e.target.value)}
                      >
                        <option value="Fantasy">Fantasy</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Classics">Classics</option>
                        <option value="Mystery">Mystery</option>
                      </select>
                    </div>

                    <div className="form-group flex-2">
                      <label>Select Book to Sync</label>
                      <select 
                        value={selectedBookId} 
                        onChange={(e) => setSelectedBookId(e.target.value)}
                      >
                        <optgroup label="Default Public Domain Books">
                          {books.map((b) => (
                            <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                          ))}
                        </optgroup>
                        {customBooks.length > 0 && (
                          <optgroup label="My Uploaded Books">
                            {customBooks.map((b) => (
                              <option key={b.id} value={b.id}>{b.title} (Custom)</option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Select Video File (.mp4, .mov, .webm)</label>
                    <input 
                      type="file" 
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setUploadedVideoFile(file);
                          // Auto-detect local pre-copied assets
                          const isLocal = [
                            'Person_reading_a_book.mp4',
                            'Person_reading_a_book_into_the.mp4',
                            'Make_a_high_reto_video_of_a_pe.mp4',
                            'Make_a_high_reso_video_of_a_pe.mp4'
                          ].includes(file.name);
                          setSkipCloudUpload(isLocal);
                        }
                      }}
                      required
                      style={{ padding: '8px', border: '1px dashed var(--border-color)', width: '100%', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', color: '#fff' }}
                    />
                  </div>

                  <div className="form-group flex-row gap-xs" style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
                    <input 
                      type="checkbox" 
                      id="skip-cloud-upload" 
                      checked={skipCloudUpload}
                      onChange={(e) => setSkipCloudUpload(e.target.checked)}
                      style={{ width: 'auto', marginRight: '8px', cursor: 'pointer' }}
                    />
                    <label htmlFor="skip-cloud-upload" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      ⚡ Skip Firebase upload and use local `/assets/` version (recommended for fast testing)
                    </label>
                  </div>

                  <button type="submit" className="btn-primary flex-center gap-sm" style={{ background: 'var(--accent-primary)' }} disabled={isUploading}>
                    <Save size={18} />
                    <span>{isUploading ? `Uploading (${uploadProgress}%)...` : 'Upload & Start Timeline Sync'}</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Family Group & Members (Admin Panel)</h2>
                {recordingError && <div className="login-error" style={{ marginBottom: '16px' }}>{recordingError}</div>}
                {recordingSuccess && <div className="login-success" style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>{recordingSuccess}</div>}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
                  {/* Left Column: Profile Manager or Joining Box */}
                  <div>
                    {isFamilyAdmin ? (
                      <form onSubmit={handleAddChildProfile} className="dashboard-form" style={{ width: '100%' }}>
                        <h3 style={{ marginBottom: '12px' }}>Add Child Profile</h3>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <label>Profile Display Name (non-PII)</label>
                          <input 
                            type="text" 
                            value={newChildName}
                            onChange={(e) => setNewChildName(e.target.value)}
                            placeholder="e.g., Bobby"
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                          <label>4-Digit Access PIN</label>
                          <input 
                            type="text" 
                            maxLength={4}
                            value={newChildPin}
                            onChange={(e) => setNewChildPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g., 1234"
                            required
                          />
                        </div>
                        <button type="submit" className="btn-primary w-full">
                          Create Child Profile
                        </button>
                      </form>
                    ) : (
                      <div className="glass-panel" style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</span>
                        <h3>Co-Parent Member</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0 20px 0' }}>
                          You are a member of this family group. Only the admin parent can add/delete child profiles or manage active invite codes.
                        </p>
                        <button 
                          type="button" 
                          onClick={handleLeaveFamilyGroup}
                          className="btn-danger w-full"
                          style={{ padding: '12px' }}
                        >
                          Leave Family Group
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Profiles List */}
                  <div className="glass-panel" style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '12px' }}>Active Children Profiles</h3>
                    {childProfiles.length === 0 ? (
                      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: 'auto 0', textAlign: 'center' }}>
                        No child profiles created yet. {isFamilyAdmin ? "Add one on the left so kids can sign in safely." : "Ask the family admin to add child profiles."}
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto' }}>
                        {childProfiles.map((child) => (
                          <div key={child.id} className="flex-between" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{child.displayName}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                PIN: {showChildPinMap[child.id] ? child.pin : '••••'}{' '}
                                <button 
                                  type="button" 
                                  className="text-link" 
                                  style={{ fontSize: '0.75rem', padding: '0 4px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: 'bold' }}
                                  onClick={() => setShowChildPinMap(prev => ({ ...prev, [child.id]: !prev[child.id] }))}
                                >
                                  {showChildPinMap[child.id] ? 'Hide' : 'Show'}
                                </button>
                              </div>
                            </div>
                            {isFamilyAdmin && (
                              <button 
                                type="button" 
                                onClick={() => handleDeleteChildProfile(child.id)}
                                className="btn-danger"
                                style={{ padding: '6px 10px', fontSize: '0.8rem', cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Co-Parent Invitations / Administration */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
                  
                  {/* Co-Parent Section */}
                  <div className="glass-panel" style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    {isFamilyAdmin ? (
                      <>
                        <h3 style={{ marginBottom: '12px' }}>Invite Co-Parent / Partner</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                          Generate a secure, single-use 9-digit code. The code will expire in 10 minutes.
                        </p>
                        
                        {tempInviteCode ? (
                          <div style={{ textAlign: 'center', background: 'rgba(157, 78, 221, 0.1)', padding: '16px', borderRadius: '8px', border: '1px dashed var(--accent-primary)', margin: 'auto 0' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-primary)', letterSpacing: '2px' }}>
                              {tempInviteCode}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                              Expires in: {Math.floor(inviteTimeLeft / 60)}:{(inviteTimeLeft % 60).toString().padStart(2, '0')}
                            </div>
                          </div>
                        ) : (
                          <button 
                            type="button" 
                            onClick={handleGenerateInviteCode}
                            className="btn-primary w-full"
                            style={{ margin: 'auto 0 0 0', padding: '12px' }}
                          >
                            Generate 9-Digit Invite Code
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <h3 style={{ marginBottom: '12px' }}>Family Group Admin</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 'auto 0' }}>
                          Your family group is managed by your partner. Standard profile configurations are synced in real time.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Joined Co-Parents List or Join Group Form */}
                  <div className="glass-panel" style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    {isFamilyAdmin ? (
                      <>
                        <h3 style={{ marginBottom: '12px' }}>Co-Parents / Partners</h3>
                        {coParents.length === 0 ? (
                          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', margin: 'auto 0' }}>
                            No co-parents have joined your family group yet.
                          </p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                            {coParents.map((parent) => (
                              <div key={parent.id} className="flex-between" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                <div>
                                  <div style={{ fontWeight: 'bold' }}>{parent.email ? parent.email.split('@')[0] : 'Co-Parent'}</div>
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{parent.email}</div>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveCoParent(parent.id)}
                                  className="btn-danger"
                                  style={{ padding: '6px 10px', fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <form onSubmit={handleJoinFamilyGroup} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ marginBottom: '12px' }}>Join Another Family Group</h3>
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                          <input 
                            type="text"
                            maxLength={11} // includes dashes
                            value={inviteCodeInput}
                            onChange={(e) => {
                              // format as XXX-XXX-XXX dynamically
                              const stripped = e.target.value.replace(/\D/g, '').slice(0, 9);
                              let formatted = stripped;
                              if (stripped.length > 6) {
                                formatted = stripped.slice(0, 3) + '-' + stripped.slice(3, 6) + '-' + stripped.slice(6);
                              } else if (stripped.length > 3) {
                                formatted = stripped.slice(0, 3) + '-' + stripped.slice(3);
                              }
                              setInviteCodeInput(formatted);
                            }}
                            placeholder="e.g., 123-456-789"
                            style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '1px' }}
                            required
                          />
                        </div>
                        <button type="submit" className="btn-primary w-full" style={{ padding: '12px' }}>
                          Join Group
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Connected Devices / Group Members Section */}
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '24px' }}>
                  <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📱 Connected Family Devices</span>
                    <span style={{ fontSize: '0.8rem', background: 'var(--accent-primary)', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>
                      {isFamilyAdmin ? "Admin: You" : "Co-Parent Access"}
                    </span>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    These child devices have authenticated using your Family Code. {isFamilyAdmin ? "As the admin, you can remove them to instantly revoke their access." : "Only the admin parent can disconnect child devices."}
                  </p>
                  
                  {connectedDevices.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                      No active child devices currently connected.
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {connectedDevices.map((device) => (
                        <div key={device.id} className="flex-between" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>👶 {device.profileName || 'Active Kid Profile'}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Device ID: {device.id.slice(0, 8)}...
                            </div>
                          </div>
                          {isFamilyAdmin && (
                            <button 
                              type="button"
                              onClick={() => handleDisconnectDevice(device.id)}
                              className="btn-danger"
                              style={{ padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                              Remove Device
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : isRecording ? (
          /* Recording Studio Layout */
          <div className="studio-grid">
            {/* Left Column: Webcam Monitor & Stop Action */}
            <div className="studio-left-column">
              <div className="studio-card glass-panel">
                <div className="studio-card-header">
                  <Video size={16} color="var(--accent-secondary)" />
                  <span>Recording Session Monitor</span>
                </div>
                <div className="preview-video-container border-glow" style={{ borderColor: 'var(--accent-secondary)' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="webcam-preview" 
                  />
                  <div className="live-overlay-indicator" style={{ background: 'var(--accent-secondary)' }}>
                    <span className="dot red-pulse"></span>
                    <span>RECORDING</span>
                  </div>
                </div>
                <div className="preview-info-panel">
                  <h3>{recordingTitle}</h3>
                  <p className="card-sub">Category: <strong>{streamGenre}</strong> | Book: <strong>{selectedBook.title}</strong></p>
                  
                  <div className="studio-metrics-bar glass-panel" style={{ margin: '12px 0', padding: '8px' }}>
                    <div className="metric-item">
                      <span className="metric-icon"><Circle size={14} fill="var(--accent-secondary)" color="var(--accent-secondary)" /></span>
                      <div className="metric-info">
                        <span className="label">TIME ELAPSED</span>
                        <span className="value font-mono">{recordingTime}</span>
                      </div>
                    </div>
                    <div className="metric-item">
                      <span className="metric-icon"><BookOpen size={14} color="var(--accent-secondary)" /></span>
                      <div className="metric-info">
                        <span className="label">PAGES TURNED</span>
                        <span className="value">{pageFlips.length}</span>
                      </div>
                    </div>
                  </div>

                  {recordingSuccess && <div className="login-success" style={{ marginBottom: '12px', color: 'var(--accent-secondary)' }}>{recordingSuccess}</div>}
                  {recordingError && <div className="login-error" style={{ marginBottom: '12px' }}>{recordingError}</div>}

                  <button onClick={handleStopRecording} className="btn-danger w-full flex-center gap-sm" style={{ background: 'var(--accent-danger)', marginTop: '8px' }}>
                    <Save size={14} />
                    <span>Finish & Save Recording</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Synced Reader */}
            <div className="studio-center-column" style={{ gridColumn: 'span 2' }}>
              <div className="studio-card glass-panel streamer-reader-card" style={{ height: '100%' }}>
                <div className="studio-card-header text-between">
                  <span className="flex-center gap-sm">
                    <BookOpen size={16} color="var(--accent-secondary)" />
                    <span>Story Recorder Book View</span>
                  </span>
                </div>
                
                <div className="reader-meta-row">
                  <img src={selectedBook.coverUrl} alt="Cover" className="studio-mini-cover" />
                  <div>
                    <h3>{selectedBook.title}</h3>
                    <p>Page {currentPageIndex + 1} of {selectedBook.pages.length}</p>
                  </div>
                  <div className="studio-page-nav">
                    <button 
                      onClick={() => handleRecordingPageChange(currentPageIndex - 1)} 
                      disabled={currentPageIndex === 0}
                      className="studio-nav-btn"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={() => handleRecordingPageChange(currentPageIndex + 1)} 
                      disabled={currentPageIndex === selectedBook.pages.length - 1}
                      className="studio-nav-btn"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="studio-page-content scrollbar-paper" style={{ minHeight: '300px' }}>
                  {selectedBook.pages[currentPageIndex] ? (
                    selectedBook.pages[currentPageIndex].split('\n\n').map((para, idx) => {
                      const isActive = idx === activeParagraphIndex;
                      return (
                        <p 
                          key={idx} 
                          onClick={() => handleParagraphClick(idx)}
                          style={{ 
                            marginBottom: '16px', 
                            lineHeight: '1.6', 
                            fontSize: '1.1rem', 
                            textIndent: '16px',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: isActive ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--accent-secondary)' : '3px solid transparent',
                            transition: 'all 0.15s'
                          }}
                        >
                          {para}
                        </p>
                      );
                    })
                  ) : (
                    <p>Opening story text...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : dashboardMode === 'sync-editor' ? (
          /* Sync Editor Layout (dashboardMode === 'sync-editor') */
          <div className="studio-grid">
            {/* Left Column: Video Player & Controls */}
            <div className="studio-left-column">
              <div className="studio-card glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="studio-card-header flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Video size={16} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 'bold' }}>Timeline Sync Editor</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                    Uploaded Video
                  </span>
                </div>

                <div className="preview-video-container border-glow" style={{ borderColor: 'var(--accent-primary)', marginBottom: '16px' }}>
                  <video 
                    ref={syncVideoRef}
                    src={uploadedVideoUrl}
                    controls
                    className="webcam-preview" 
                    style={{ maxHeight: '360px', width: '100%', background: '#000' }}
                  />
                </div>

                {/* Event Logs Timeline */}
                <div style={{ flex: 1, minHeight: '120px', overflowY: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Registered Page Flips</h4>
                  {syncPageFlips.length <= 1 ? (
                    <p style={{ margin: '0', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No timestamps registered yet. Play the video and mark page flips.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {syncPageFlips.map((flip, idx) => (
                        <div key={idx} className="flex-between" style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', fontSize: '0.85rem', borderLeft: '3px solid var(--accent-primary)' }}>
                          <span>Page {flip.pageIndex + 1}</span>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{flip.time.toFixed(1)}s</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Page sync controls */}
                <div className="flex-center gap-md" style={{ marginTop: 'auto' }}>
                  <button 
                    type="button" 
                    onClick={handleMarkPageSync}
                    className="btn-primary w-full flex-center gap-sm"
                    style={{ background: 'var(--accent-primary)', padding: '12px', cursor: 'pointer' }}
                    disabled={syncCurrentPageIndex >= selectedBook.pages.length - 1}
                  >
                    <span>Mark Page Turn (Right Arrow)</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={handleResetSync}
                    className="btn-secondary"
                    style={{ padding: '12px 18px', cursor: 'pointer' }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Book Page Preview & Publish */}
            <div className="studio-center-column flex-2">
              <div className="studio-card glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="studio-card-header flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 'bold' }}>Book Page Preview: {selectedBook.title}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Page {syncCurrentPageIndex + 1} of {selectedBook.pages.length}
                  </span>
                </div>

                {/* Book pages viewer */}
                <div style={{ flex: 1, minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '24px', position: 'relative', overflowY: 'auto' }}>
                  <div style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#fff', whiteSpace: 'pre-wrap', textAlign: 'center', margin: 'auto 0' }}>
                    {selectedBook.pages[syncCurrentPageIndex]}
                  </div>
                </div>

                {/* Publish Bar */}
                <div className="flex-between" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    type="button" 
                    onClick={() => { setDashboardMode('live'); setUploadedVideoFile(null); }}
                    className="btn-secondary"
                    style={{ cursor: 'pointer' }}
                  >
                    Cancel Upload
                  </button>
                  <button 
                    type="button" 
                    onClick={handlePublishSyncStory}
                    className="btn-primary flex-center gap-sm"
                    style={{ background: 'var(--accent-success)', borderColor: 'var(--accent-success)', cursor: 'pointer' }}
                  >
                    <Save size={18} />
                    <span>Save & Publish Storytime</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="studio-grid" style={{
            gridTemplateColumns: `${visibleWidgets.monitor || visibleWidgets.actions ? '320px' : ''} ${visibleWidgets.reader || visibleWidgets.activity || visibleWidgets.polls ? '1fr' : ''} ${visibleWidgets.chat ? '340px' : ''}`.trim() || '1fr'
          }}>
            
            {/* Left Column: Stream Monitor & Quick Actions */}
            {(visibleWidgets.monitor || visibleWidgets.actions) && (
              <div className="studio-left-column">
                
                {/* Stream Preview (Video Feed) */}
                {visibleWidgets.monitor && (
                  <div className="studio-card glass-panel">
                    <div className="studio-card-header">
                      <Radio size={16} color="var(--accent-primary)" />
                      <span>Broadcast Monitor</span>
                    </div>
                    <div className="preview-video-container border-glow">
                      
                      {/* Simulated ad run overlay banner */}
                      {adTimeRemaining > 0 && (
                        <div className="preview-overlay-banner">
                          <span>📺</span>
                          <h4>Ad Break Running</h4>
                          <p>Preview is paused during advertisement.</p>
                          <div className="countdown-number">{adTimeRemaining}s</div>
                        </div>
                      )}

                      {/* Simulated raid countdown overlay banner */}
                      {raidTimeRemaining > 0 && (
                        <div className="preview-overlay-banner">
                          <span>🚀</span>
                          <h4>Raiding {raidTargetChannel}</h4>
                          <p>Prepping viewers for transition...</p>
                          <div className="countdown-number">{raidTimeRemaining}s</div>
                        </div>
                      )}

                      {performanceMode ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '16px', textAlign: 'center' }}>
                          <span>📷 Camera Feed Active</span>
                          <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px' }}>Video preview hidden to maximize streaming CPU performance.</span>
                        </div>
                      ) : (
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="webcam-preview" 
                          style={{ opacity: adTimeRemaining > 0 ? 0.2 : 1 }}
                        />
                      )}
                      {micMuted && (
                        <div className="mic-muted-badge flex-center">
                          <MicOff size={20} color="#fff" />
                        </div>
                      )}
                      <div className="live-overlay-indicator">
                        <span className="dot"></span>
                        <span>LIVE</span>
                      </div>
                    </div>
                    <div className="preview-info-panel">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3>{streamTitle}</h3>
                          <p className="card-sub">Category: <strong>{streamGenre}</strong> | Book: <strong>{selectedBook.title}</strong></p>
                        </div>
                        <button onClick={() => setShowEditInfo(true)} className="btn-edit-info" title="Edit Stream Info">⚙️ Edit</button>
                      </div>
                      <button onClick={handleEndStream} className="btn-danger w-full flex-center gap-sm" style={{ marginTop: '12px' }}>
                        <Square size={14} />
                        <span>End Stream / Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Actions Panel */}
                {visibleWidgets.actions && (
                  <div className="studio-card glass-panel">
                    <div className="studio-card-header text-between">
                      <span className="flex-center gap-sm">
                        <Shield size={16} color="var(--accent-secondary)" />
                        <span>Quick Actions</span>
                      </span>
                      <button onClick={() => setShowActionsConfigModal(true)} className="btn-action-cog" title="Configure Quick Actions">
                        ⚙️
                      </button>
                    </div>
                    
                    <div className="quick-actions-grid">
                      {renderQuickActions()}
                    </div>

                    {/* Announcement overlay input */}
                    {showAnnouncementInput && (
                      <form onSubmit={handleSendAnnouncement} className="announcement-inline-form">
                        <input 
                          type="text" 
                          placeholder="Type announcement message..." 
                          value={announcementText}
                          onChange={(e) => setAnnouncementText(e.target.value)}
                          required
                          autoFocus
                        />
                        <button type="submit" className="btn-primary">Send</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Center Column: Interactive Reader & Activity Feed & Polls */}
            {(visibleWidgets.reader || visibleWidgets.activity || visibleWidgets.polls) && (
              <div className="studio-center-column">
                
                {/* Synced Reader Page Control */}
                {visibleWidgets.reader && (
                  <div className="studio-card glass-panel streamer-reader-card">
                    <div className="studio-card-header text-between">
                      <span className="flex-center gap-sm">
                        <BookOpen size={16} color="var(--accent-secondary)" />
                        <span>Active Reader</span>
                      </span>
                      <button 
                        onClick={toggleTtsReading} 
                        className={`btn-tts-speaker ${isTtsReading ? 'active' : ''}`}
                        title={isTtsReading ? "Pause Text-to-Speech" : "Activate Text-to-Speech Assistant"}
                      >
                        <Volume2 size={16} />
                        <span>{isTtsReading ? 'Mute AI' : 'Speech AI'}</span>
                      </button>
                    </div>
                    
                    <div className="reader-meta-row">
                      <img src={selectedBook.coverUrl} alt="Cover" className="studio-mini-cover" />
                      <div>
                        <h3>{selectedBook.title}</h3>
                        <p>Page {currentPageIndex + 1} of {selectedBook.pages.length}</p>
                      </div>
                      <div className="studio-page-nav">
                        <button 
                          onClick={() => handlePageChange(currentPageIndex - 1)} 
                          disabled={currentPageIndex === 0}
                          className="studio-nav-btn"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button 
                          onClick={() => handlePageChange(currentPageIndex + 1)} 
                          disabled={currentPageIndex === selectedBook.pages.length - 1}
                          className="studio-nav-btn"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="studio-page-content scrollbar-paper">
                      {selectedBook.pages[currentPageIndex] ? (
                        selectedBook.pages[currentPageIndex].split('\n\n').map((para, idx) => {
                          const isActive = idx === activeParagraphIndex;
                          return (
                            <p 
                              key={idx} 
                              onClick={() => handleParagraphClick(idx)}
                              style={{ 
                                marginBottom: '16px', 
                                lineHeight: '1.6', 
                                fontSize: '1.1rem', 
                                textIndent: '16px',
                                cursor: 'pointer',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                backgroundColor: isActive ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                                borderLeft: isActive ? '3px solid var(--accent-secondary)' : '3px solid transparent',
                                transition: 'all 0.15s'
                              }}
                            >
                              {para}
                            </p>
                          );
                        })
                      ) : (
                        <p>Opening story text...</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Interactive Poll Widget */}
                {visibleWidgets.polls && (
                  <div className="studio-card glass-panel">
                    <div className="studio-card-header text-between">
                      <span className="flex-center gap-sm">
                        <span>📊 Live Channel Poll</span>
                      </span>
                      {isPollActive && <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', fontSize: '0.75rem' }}>⏱️ {pollTimer}s left</span>}
                    </div>

                    <div className="poll-widget-container">
                      {!isPollActive ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div className="form-group">
                            <label>Poll Question</label>
                            <input 
                              type="text" 
                              value={pollQuestion}
                              onChange={(e) => setPollQuestion(e.target.value)}
                              placeholder="e.g. Which chapter next?"
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                              type="text" 
                              value={pollOptions[0].text}
                              onChange={(e) => setPollOptions([ { text: e.target.value, votes: 0 }, pollOptions[1] ])}
                              placeholder="Option 1"
                              style={{ flex: 1, padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                            />
                            <input 
                              type="text" 
                              value={pollOptions[1].text}
                              onChange={(e) => setPollOptions([ pollOptions[0], { text: e.target.value, votes: 0 } ])}
                              placeholder="Option 2"
                              style={{ flex: 1, padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => { setIsPollActive(true); setPollTimer(30); setPollOptions(pollOptions.map(o => ({ ...o, votes: 0 }))); addEvent(`Poll started: ${pollQuestion}`, "📊"); playAlertSound('mod'); }}
                            className="btn-primary" 
                            style={{ marginTop: '8px', background: 'var(--accent-secondary)' }}
                          >
                            Start 30-Second Poll
                          </button>
                        </div>
                      ) : (
                        <div className="poll-active-view">
                          <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{pollQuestion}</h4>
                          {pollOptions.map((opt, i) => {
                            const totalVotes = pollOptions.reduce((acc, o) => acc + o.votes, 0) || 1;
                            const percent = Math.round((opt.votes / totalVotes) * 100);
                            return (
                              <div key={i} className="poll-option-row">
                                <div className="poll-option-labels">
                                  <span>{opt.text}</span>
                                  <span>{opt.votes} votes ({percent}%)</span>
                                </div>
                                <div className="poll-progress-bar">
                                  <div 
                                    className={i === 0 ? "poll-progress-fill" : "poll-progress-fill-alt"} 
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Activity Feed Widget */}
                {visibleWidgets.activity && (
                  <div className="studio-card glass-panel studio-activity-card">
                    <div className="studio-card-header text-between">
                      <span className="flex-center gap-sm">
                        <Activity size={16} color="var(--accent-success)" />
                        <span>Studio Activity Feed</span>
                      </span>
                      <div className="flex-center gap-sm">
                        <select 
                          value={activityFilter} 
                          onChange={(e: any) => setActivityFilter(e.target.value)}
                          style={{ background: 'var(--bg-dark)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.75rem', padding: '2px 8px' }}
                        >
                          <option value="all">All Events</option>
                          <option value="follows">Follows / Subs</option>
                          <option value="system">System Logs</option>
                          <option value="moderation">Mod Alerts</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="activity-feed-list">
                      {activityFeed.filter(event => {
                        if (activityFilter === 'all') return true;
                        if (activityFilter === 'follows') return event.icon === "❤️" || event.text.includes("followed") || event.text.includes("subscribed");
                        if (activityFilter === 'system') return event.icon === "📖" || event.icon === "⚙️" || event.icon === "📷";
                        if (activityFilter === 'moderation') return event.icon === "🛡️" || event.icon === "⚠️";
                        return true;
                      }).length === 0 ? (
                        <p className="no-activity">No events match filter.</p>
                      ) : (
                        activityFeed.filter(event => {
                          if (activityFilter === 'all') return true;
                          if (activityFilter === 'follows') return event.icon === "❤️" || event.text.includes("followed") || event.text.includes("subscribed");
                          if (activityFilter === 'system') return event.icon === "📖" || event.icon === "⚙️" || event.icon === "📷";
                          if (activityFilter === 'moderation') return event.icon === "🛡️" || event.icon === "⚠️";
                          return true;
                        }).map((event) => (
                          <div key={event.id} className="activity-event-item">
                            <span className="event-time font-mono">{event.timestamp}</span>
                            <span className="event-icon">{event.icon}</span>
                            <span className="event-text">{event.text}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right Column: Interactive Chat Manager */}
            {visibleWidgets.chat && (
              <div className="studio-right-column">
                <div className={`studio-card glass-panel studio-chat-card ${shieldModeActive ? 'shield-active' : ''}`}>
                  <div className="studio-card-header text-between" style={{ borderBottom: shieldModeActive ? '1px solid var(--accent-danger)' : '' }}>
                    <span className="flex-center gap-sm" style={{ color: shieldModeActive ? 'var(--accent-danger)' : '' }}>
                      <MessageSquare size={16} color={shieldModeActive ? 'var(--accent-danger)' : 'var(--accent-secondary)'} />
                      <span>Live Chat Moderation</span>
                    </span>
                    
                    <div className="chat-header-actions">
                      <button 
                        type="button"
                        onClick={() => { setShieldModeActive(!shieldModeActive); playAlertSound('mod'); }} 
                        className={`shield-mode-btn ${shieldModeActive ? 'active' : ''}`}
                        title="Toggle Shield Mode (Emergency Chat Lock)"
                      >
                        <Shield size={12} />
                        <span>Shield</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setMuteSfx(!muteSfx)} 
                        className={`btn-sfx-toggle ${!muteSfx ? 'active' : ''}`}
                        title={muteSfx ? 'Unmute Chat Alerts' : 'Mute Chat Alerts'}
                      >
                        {muteSfx ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Pinned message preview at top of studio chat */}
                  {pinnedMessageText && (
                    <div className="studio-pinned-preview flex-between">
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Pin size={14} fill="currentColor" color="var(--accent-secondary)" />
                        <span className="pinned-preview-text">"{pinnedMessageText.substring(0, 30)}..."</span>
                      </div>
                      <button onClick={() => handlePinMessage('', '')} className="btn-unpin" title="Clear Pin">✕</button>
                    </div>
                  )}

                  <div className="studio-chat-messages">
                    {chatMessages.length === 0 ? (
                      <p className="no-chat font-bold">Chat feed is silent.</p>
                    ) : (
                      chatMessages.map((msg) => {
                        const isBanned = bannedUsers.includes(msg.username);
                        const isTimedOut = timedOutUsers[msg.username] > Date.now();
                        
                        return (
                          <div key={msg.id} className={`studio-chat-msg ${msg.type === 'announcement' ? 'announcement-msg' : ''}`}>
                            <div className="msg-row-top">
                              <span 
                                className="msg-user chat-user-clickable" 
                                onClick={(e) => handleUserClick(msg.username, e)}
                                style={{ 
                                  color: moderators.includes(msg.username) ? 'var(--accent-success)' : 'var(--accent-secondary)',
                                  textDecoration: isBanned ? 'line-through' : 'none',
                                  opacity: isTimedOut ? 0.5 : 1
                                }}
                              >
                                {moderators.includes(msg.username) ? '🛡️ ' : ''}{msg.username}
                              </span>
                              <div className="moderator-actions">
                                <button 
                                  type="button"
                                  onClick={() => handlePinMessage(msg.text, msg.id)}
                                  className={`btn-mod-action ${pinnedMessageId === msg.id ? 'pinned' : ''}`}
                                  title="Pin Message to Stream"
                                >
                                  <Pin size={12} fill={pinnedMessageId === msg.id ? "currentColor" : "none"} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="btn-mod-action delete-action"
                                  title="Delete Message"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <span className="msg-body" style={{ opacity: isBanned || isTimedOut ? 0.4 : 1, fontStyle: isTimedOut ? 'italic' : 'normal' }}>
                              {isBanned ? '[Message deleted - User Banned]' : isTimedOut ? '[Message deleted - User Timed Out]' : msg.text}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Edit Info Dialog Modal */}
      {showEditInfo && (
        <div className="studio-modal-overlay flex-center">
          <div className="studio-modal-card glass-panel">
            <h2>Edit Broadcast Information</h2>
            <form onSubmit={handleUpdateStreamDetails} className="dashboard-form">
              <div className="form-group">
                <label>Stream Title</label>
                <input 
                  type="text" 
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Genre / Category</label>
                <select 
                  value={streamGenre} 
                  onChange={(e) => setStreamGenre(e.target.value)}
                  style={{ background: 'var(--bg-dark)', color: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Fantasy">Fantasy</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Classics">Classics</option>
                  <option value="Mystery">Mystery</option>
                </select>
              </div>
              <div className="modal-buttons flex-center gap-md" style={{ marginTop: '16px' }}>
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" onClick={() => setShowEditInfo(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Moderation Options Tooltip Menu */}
      {focusedUser && (
        <div 
          className="user-mod-tooltip" 
          style={{ left: focusedUser.x, top: focusedUser.y }}
        >
          <div className="user-mod-title">Moderating {focusedUser.username}</div>
          <button 
            type="button" 
            onClick={() => handleTimeoutUser(focusedUser.username)}
            className="btn-mod-action-item"
          >
            ⏱️ Timeout (5m)
          </button>
          <button 
            type="button" 
            onClick={() => handleBanUser(focusedUser.username)}
            className="btn-mod-action-item danger-action"
          >
            🚨 Ban User
          </button>
          <button 
            type="button" 
            onClick={() => handlePromoteMod(focusedUser.username)}
            className="btn-mod-action-item"
          >
            🛡️ {moderators.includes(focusedUser.username) ? 'Demote Mod' : 'Make Moderator'}
          </button>
          <button 
            type="button" 
            onClick={() => setFocusedUser(null)}
            className="btn-mod-action-item"
            style={{ textAlign: 'center', opacity: 0.5, marginTop: '4px' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Customize Studio Panels Layout Modal */}
      {showLayoutModal && (
        <div className="studio-modal-overlay flex-center" onClick={() => setShowLayoutModal(false)}>
          <div className="studio-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Customize Studio Widgets</h2>
            <p className="card-instructions">Toggle visibility of stream panels to design your perfect layout.</p>
            <div className="layout-checklist">
              {Object.keys(visibleWidgets).map(widget => (
                <label key={widget} className="layout-check-item">
                  <input 
                    type="checkbox" 
                    checked={visibleWidgets[widget]}
                    onChange={(e) => setVisibleWidgets(prev => ({ ...prev, [widget]: e.target.checked }))}
                  />
                  <span style={{ textTransform: 'capitalize' }}>
                    {widget === 'monitor' ? 'Broadcast Monitor' : 
                     widget === 'actions' ? 'Quick Actions' : 
                     widget === 'reader' ? 'Active Reader' : 
                     widget === 'activity' ? 'Activity Feed' : 
                     widget === 'chat' ? 'Live Chat' : 
                     widget === 'polls' ? 'Live Polls' : widget}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex-center" style={{ marginTop: '24px' }}>
              <button type="button" onClick={() => setShowLayoutModal(false)} className="btn-primary w-full">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Customize Quick Actions Modal */}
      {showActionsConfigModal && (
        <div className="studio-modal-overlay flex-center" onClick={() => setShowActionsConfigModal(false)}>
          <div className="studio-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Configure Quick Actions</h2>
            <p className="card-instructions">Choose which actions appear in your stream dashboard quick control grid.</p>
            <div className="quick-action-checklist">
              {[
                { id: 'mute', label: 'Mic Control (Mute)' },
                { id: 'emote', label: 'Emote-Only Chat' },
                { id: 'announce', label: 'Announcement Broadcaster' },
                { id: 'clear', label: 'Clear Chat History' },
                { id: 'sfx', label: 'Sound Alerts (Mute/Unmute)' },
                { id: 'shield', label: 'Shield Mode (Lockout)' },
                { id: 'ad', label: 'Simulate Ad Break (30s)' },
                { id: 'raid', label: 'Simulate Host Raid' },
                { id: 'automod', label: 'Auto-Mod Spam Filter' }
              ].map(action => {
                const isChecked = activeQuickActions.includes(action.id);
                return (
                  <label key={action.id} className="layout-check-item">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setActiveQuickActions(prev => prev.filter(x => x !== action.id));
                        } else {
                          setActiveQuickActions(prev => [...prev, action.id]);
                        }
                      }}
                    />
                    <span>{action.label}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex-center" style={{ marginTop: '24px' }}>
              <button type="button" onClick={() => setShowActionsConfigModal(false)} className="btn-primary w-full">Apply Layout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
