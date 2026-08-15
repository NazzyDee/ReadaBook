import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { doc, setDoc, updateDoc, onSnapshot, collection, query, where, addDoc, deleteDoc, getDocs, writeBatch, arrayRemove } from 'firebase/firestore';
import { db, storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { books } from '../lib/booksData';
import { ChevronLeft, ChevronRight, Play, Square, Users, MessageSquare, BookOpen, Plus, Clipboard, Trash2, Pin, Volume2, VolumeX, Mic, MicOff, AlertTriangle, Radio, Shield, Activity, Star, Video, Circle, Save, Clock } from 'lucide-react';
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
  ageRange?: string;
  readingLevel?: string;
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
  const [newBookAgeRange, setNewBookAgeRange] = useState('8-10');
  const [newBookReadingLevel, setNewBookReadingLevel] = useState('Level T');
  const [newBookText, setNewBookText] = useState('');
  const [addBookError, setAddBookError] = useState('');
  const [addBookSuccess, setAddBookSuccess] = useState('');
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [customCoverFile, setCustomCoverFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [parsingStatus, setParsingStatus] = useState('');
  const [coverSearchQuery, setCoverSearchQuery] = useState('');
  const [coverSearchResult, setCoverSearchResult] = useState<{ found: boolean; coverUrl: string | null } | null>(null);
  const [isSearchingCover, setIsSearchingCover] = useState(false);
  
  // OBS Studio configuration states
  const [broadcastSource, setBroadcastSource] = useState<'webcam' | 'obs'>('webcam');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isObsConnected, setIsObsConnected] = useState(false);

  // Info modal state
  const [showEditInfo, setShowEditInfo] = useState(false);

  // Recording Mode state
  // Recording Mode state
  const [dashboardMode, setDashboardMode] = useState<
    'studio-dashboard' | 'studio-content' | 'studio-analytics' | 'studio-subtitles' | 'studio-customisation' | 'studio-audio' | 'studio-settings' | 'studio-earn' | 'live' | 'record' | 'upload' | 'sync-editor' |
    'studio-analytics-channel' | 'studio-analytics-summary' |
    'studio-community-roles' | 'studio-community-followers' |
    'studio-rewards-points' | 'studio-rewards-emotes' |
    'studio-content-producer' | 'studio-content-clips' |
    'studio-settings-credentials' | 'studio-settings-moderation'
  >('studio-dashboard');
  
  // Twitch sidebar submenus expand states
  const [expandSidebarSections, setExpandSidebarSections] = useState({
    content: true,
    analytics: true,
    rewards: true,
    community: true,
    settings: true
  });
  
  // YouTube-Studio customization state variables
  const [profilePictureUrl, setProfilePictureUrl] = useState('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=150&q=80');
  const [bannerPictureUrl, setBannerPictureUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80');
  const [familyGreeting, setFamilyGreeting] = useState('Welcome to our Family Storytime! 🧸');
  const [videoWatermarkUrl, setVideoWatermarkUrl] = useState('https://img.icons8.com/color/96/fairytale.png');
  const [channelHandle, setChannelHandle] = useState('@familyreadings');
  const [recordings, setRecordings] = useState<any[]>([]);
  const [channelDescription, setChannelDescription] = useState('Welcome parents and children to our co-reading room!');
  // Twitch Study Sprinter Pomodoro and Co-Writing States
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroType, setPomodoroType] = useState<'work' | 'break'>('work');
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState(1500); // 25 mins Focus
  const [creatorWritingText, setCreatorWritingText] = useState('');
  const [keystrokesCount, setKeystrokesCount] = useState(0);
  const [typingWpm, setTypingWpm] = useState(0);
  // Physical Book Read-Aloud Setup States
  const [streamBookType, setStreamBookType] = useState<'uploaded' | 'physical'>('uploaded');
  const [physicalBookTitle, setPhysicalBookTitle] = useState('');
  const [physicalBookAuthor, setPhysicalBookAuthor] = useState('');
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [contentSubTab, setContentSubTab] = useState<'books' | 'recordings' | 'streams'>('books');
  const [selectedSubtitleBookId, setSelectedSubtitleBookId] = useState<string>('');
  const [editingSubtitlesPageIdx, setEditingSubtitlesPageIdx] = useState<number>(0);
  const [editingSubtitlesText, setEditingSubtitlesText] = useState<string>('');
  const [defaultGenre, setDefaultGenre] = useState('Fantasy');
  const [defaultAgeRange, setDefaultAgeRange] = useState('5-7');

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

  // Fetch recordings
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'recordings'), where('uploaderId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setRecordings(list);
    });
    return () => unsubscribe();
  }, [user]);

  // helper to sync stream state to both parents and kids streams collection
  const syncStreamState = async (fields: Record<string, any>) => {
    if (!user || !isLive) return;
    try {
      await updateDoc(doc(db, 'streams', user.uid), fields);
      await updateDoc(doc(db, 'streams_kids', user.uid), fields);
    } catch (err) {
      console.error("Failed to sync stream state:", err);
    }
  };

  // Pomodoro countdown timer tick
  useEffect(() => {
    let timer: any = null;
    if (pomodoroActive && pomodoroSecondsLeft > 0) {
      timer = setInterval(() => {
        setPomodoroSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            const nextType = pomodoroType === 'work' ? 'break' : 'work';
            const nextSeconds = nextType === 'work' ? 1500 : 300;
            setPomodoroType(nextType);
            setPomodoroSecondsLeft(nextSeconds);
            syncStreamState({
              pomodoroActive: true,
              pomodoroType: nextType,
              pomodoroStartMs: Date.now(),
              pomodoroDuration: nextSeconds
            });
            alert(`Interval finished! Switching to ${nextType === 'work' ? 'Reading focus' : 'Break'} time!`);
            return nextSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pomodoroActive, pomodoroType, pomodoroSecondsLeft]);

  // Debounced/Throttled live writing manuscript update to firestore
  useEffect(() => {
    if (!user || !isLive) return;
    const delay = setTimeout(() => {
      syncStreamState({ creatorWritingText });
    }, 800);
    return () => clearTimeout(delay);
  }, [creatorWritingText, isLive, user]);

  // sliding window keystroke calculator to compute typing WPM
  useEffect(() => {
    if (!isLive || !pomodoroActive) {
      setTypingWpm(0);
      setKeystrokesCount(0);
      return;
    }
    const interval = setInterval(() => {
      const wpmVal = Math.round((keystrokesCount / 5) * 12);
      setTypingWpm(wpmVal);
      setKeystrokesCount(0);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive, pomodoroActive, keystrokesCount]);

  const handleTogglePomodoro = async () => {
    const nextActive = !pomodoroActive;
    setPomodoroActive(nextActive);
    await syncStreamState({
      pomodoroActive: nextActive,
      pomodoroType,
      pomodoroStartMs: Date.now(),
      pomodoroDuration: pomodoroSecondsLeft
    });
  };

  const handleResetPomodoro = async (type: 'work' | 'break') => {
    const secs = type === 'work' ? 1500 : 300;
    setPomodoroActive(false);
    setPomodoroType(type);
    setPomodoroSecondsLeft(secs);
    await syncStreamState({
      pomodoroActive: false,
      pomodoroType: type,
      pomodoroStartMs: Date.now(),
      pomodoroDuration: secs
    });
  };

  const handleCreatorWritingChange = (text: string) => {
    setCreatorWritingText(text);
    setKeystrokesCount(prev => prev + 1);
  };

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

  // Twitch-style stream manager state variables
  const [chatSlowMode, setChatSlowMode] = useState(false);
  const [subscribersOnly, setSubscribersOnly] = useState(false);
  
  const [streamMarkers, setStreamMarkers] = useState<{ id: string; time: number; page: number; desc: string }[]>([]);
  const [clipsCollection, setClipsCollection] = useState<{ id: string; time: number; bookTitle: string; title?: string; creator?: string; duration?: number; views?: number; thumbnail?: string }[]>([]);
  
  // Community Goals state
  const [goalActive, setGoalActive] = useState(true);
  const [goalTitle, setGoalTitle] = useState('Read-A-Thon Target! 🧸');
  const [goalTarget, setGoalTarget] = useState(200);
  const [goalCurrent, setGoalCurrent] = useState(148);
  const [showGoalsConfig, setShowGoalsConfig] = useState(false);

  // Live Predictions state
  const [isPredictionActive, setIsPredictionActive] = useState(false);
  const [predictionQuestion, setPredictionQuestion] = useState('Will we finish the chapter in 10 minutes?');
  const [predictionOptions, setPredictionOptions] = useState([
    { text: 'Yes, definitely!', votes: 12, points: 2400 },
    { text: 'No way!', votes: 8, points: 1600 }
  ]);
  const [predictionTimer, setPredictionTimer] = useState(60);
  const [showPredictionConfig, setShowPredictionConfig] = useState(false);

  const [watchPartyActive, setWatchPartyActive] = useState(false);
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

  // Merge static books and custom books (combine pre-seeded books + custom books)
  const allBooks = [...books, ...customBooks];
  const selectedBookRaw = allBooks.find(b => b.id === selectedBookId) || books[0];

  // Fetch full book pages dynamically
  useEffect(() => {
    const activeBook = allBooks.find(b => b.id === selectedBookId);
    if (!activeBook) return;
    setActiveBookPages(activeBook.pages || []);
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
        setChatSlowMode(data.slowMode || false);
        setSubscribersOnly(data.subscribersOnly || false);
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

  // Timer Effect for Predictions
  useEffect(() => {
    if (!isPredictionActive || predictionTimer <= 0) {
      if (isPredictionActive && predictionTimer === 0) {
        setIsPredictionActive(false);
        const totalPoints = predictionOptions.reduce((acc, o) => acc + o.points, 0) || 1;
        const maxPoints = Math.max(...predictionOptions.map(o => o.points));
        const winners = predictionOptions.filter(o => o.points === maxPoints);
        
        addDoc(collection(db, 'messages'), {
          text: `🔮 PREDICTION ENDED: Winner is "${winners[0]?.text}" with ${winners[0]?.points} of ${totalPoints} total points!`,
          username: 'System',
          streamId: user?.uid,
          createdAt: new Date(),
          type: 'announcement'
        });
        addEvent(`Prediction ended: ${winners[0]?.text} won.`, "🔮");
        playAlertSound('mod');
      }
      return;
    }

    const interval = setInterval(() => {
      setPredictionTimer(prev => prev - 1);
      
      setPredictionOptions(prev => {
        return prev.map(opt => {
          const addVotes = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
          const addPoints = addVotes * (Math.floor(Math.random() * 150) + 50);
          return {
            ...opt,
            votes: opt.votes + addVotes,
            points: opt.points + addPoints
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPredictionActive, predictionTimer, predictionOptions, user]);

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

  const handleDeleteCustomBook = async (bookId: string) => {
    if (!window.confirm("Are you sure you want to delete this custom book? This will permanently remove its transcript page records.")) return;
    try {
      await deleteDoc(doc(db, "books", bookId));
      setCustomBooks(prev => prev.filter(b => b.id !== bookId));
      alert("Custom book deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete custom book:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteRecording = async (recId: string) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) return;
    try {
      await deleteDoc(doc(db, "recordings", recId));
      setRecordings(prev => prev.filter(r => r.id !== recId));
      alert("Recording deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete recording:", err);
      alert(`Error: ${err.message}`);
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

    let finalCoverUrl = '';
    let finalBookTitle = selectedBook.title;
    let finalBookAuthor = selectedBook.author;
    let finalBookId = selectedBookId;

    if (streamBookType === 'physical') {
      finalBookTitle = physicalBookTitle;
      finalBookAuthor = physicalBookAuthor;
      finalBookId = 'physical-read';

      try {
        const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(physicalBookTitle)}&fields=cover_i,cover_edition_key&limit=1`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        const docObj = data.docs?.[0];
        if (docObj) {
          if (docObj.cover_i) {
            finalCoverUrl = `https://covers.openlibrary.org/b/id/${docObj.cover_i}-L.jpg`;
          } else if (docObj.cover_edition_key) {
            finalCoverUrl = `https://covers.openlibrary.org/b/olid/${docObj.cover_edition_key}-L.jpg`;
          }
        }
      } catch (apiErr) {
        console.error("Open Library API cover look up failed, using procedural fallback cover:", apiErr);
      }

      if (!finalCoverUrl) {
        // Fallback SVG generator
        const bgSolidColor = '#1e1e24';
        const textAccent = '#ffde6a';
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
            <rect width="300" height="400" fill="${bgSolidColor}" rx="15"/>
            <rect x="15" y="15" width="270" height="370" fill="none" stroke="${textAccent}" stroke-width="2" rx="10" opacity="0.6"/>
            <text x="50%" y="150" font-family="'Comic Sans MS', cursive, sans-serif" font-size="20" font-weight="bold" fill="${textAccent}" text-anchor="middle">
              ${physicalBookTitle.substring(0, 20)}${physicalBookTitle.length > 20 ? '...' : ''}
            </text>
            <text x="50%" y="200" font-family="sans-serif" font-size="14" fill="#aaa" text-anchor="middle">
              By ${physicalBookAuthor}
            </text>
            <text x="50%" y="300" font-family="sans-serif" font-size="12" font-weight="bold" fill="${textAccent}" text-anchor="middle" opacity="0.8">
              📖 PHYSICAL COPY
            </text>
          </svg>
        `;
        finalCoverUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg.trim())));
      }
    } else {
      finalCoverUrl = selectedBook.coverUrl;
    }

    try {
      const streamData = {
        streamerId: user.uid,
        streamerName: user.email ? user.email.split('@')[0] : 'Streamer',
        title: streamTitle,
        genre: streamGenre,
        bookId: finalBookId,
        bookTitle: finalBookTitle,
        bookAuthor: finalBookAuthor,
        bookCoverUrl: finalCoverUrl,
        currentPage: initialPageIndex,
        isLive: true,
        viewerCount: randomViewers,
        emoteOnly: false,
        slowMode: false,
        subscribersOnly: false,
        pinnedMessage: null,
        broadcastSource,
        isObsConnected: broadcastSource === 'webcam', // auto-connected for webcam
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'streams', user.uid), streamData);
      await setDoc(doc(db, 'streams_kids', user.uid), streamData);

      setStartTime(now);
      setIsLive(true);
      setViewerCount(randomViewers);
      setCurrentPageIndex(initialPageIndex);
      setIsObsConnected(broadcastSource === 'webcam');
      
      setActivityFeed([]); // reset activity feed
      addEvent(`Broadcast Started: ${streamTitle}`, "🔴");
      addEvent(`Source Type: ${broadcastSource.toUpperCase()}`, "📡");
      addEvent(`Active Book: ${finalBookTitle}`, "📖");

      if (broadcastSource === 'webcam') {
        await startCamera();
      } else {
        // Auto-simulate OBS connecting after 1.5 seconds so the stream becomes active automatically
        setTimeout(async () => {
          try {
            await updateDoc(doc(db, 'streams', user.uid), { isObsConnected: true });
            await updateDoc(doc(db, 'streams_kids', user.uid), { isObsConnected: true });
            setIsObsConnected(true);
            addEvent("OBS Encoder signal connected successfully!", "🟢");
          } catch (connErr) {
            console.error("Failed to connect simulated OBS signal:", connErr);
          }
        }, 1500);
      }
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
      await updateDoc(doc(db, 'streams_kids', user.uid), {
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

  // Moderation: Toggle Chat Slow Mode
  const handleToggleSlowMode = async () => {
    if (!user || !isLive) return;
    const nextState = !chatSlowMode;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        slowMode: nextState
      });
      setChatSlowMode(nextState);
      addEvent(`Slow mode chat ${nextState ? 'enabled (5s delay)' : 'disabled'}.`, "⏱️");
      
      // Log notification message to viewers
      await addDoc(collection(db, 'messages'), {
        text: nextState ? "⏱️ Slow Mode has been enabled (5s message delay)." : "⏱️ Slow Mode has been disabled.",
        username: "System",
        streamId: user.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
    } catch (err) {
      console.error("Error toggling slow mode: ", err);
    }
  };

  // Moderation: Toggle Subscribers-Only Mode
  const handleToggleSubscribersOnly = async () => {
    if (!user || !isLive) return;
    const nextState = !subscribersOnly;

    try {
      await updateDoc(doc(db, 'streams', user.uid), {
        subscribersOnly: nextState
      });
      setSubscribersOnly(nextState);
      addEvent(`Subscribers-only chat ${nextState ? 'enabled' : 'disabled'}.`, "🔒");
      
      // Log notification message to viewers
      await addDoc(collection(db, 'messages'), {
        text: nextState ? "🔒 Subscribers-Only chat mode has been enabled by the streamer." : "🔒 Standard chat mode has been restored.",
        username: "System",
        streamId: user.uid,
        createdAt: new Date(),
        type: 'announcement'
      });
    } catch (err) {
      console.error("Error toggling subscribers-only: ", err);
    }
  };

  // Quick Action: Create Stream Clip Highlight
  const handleCreateClip = () => {
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const newClip = {
      id: `clip-${Math.random()}`,
      time: elapsed,
      bookTitle: selectedBook.title,
      title: `${selectedBook.title} Highlight - Clip #${Math.floor(Math.random() * 1000)}`,
      creator: user?.email ? user.email.split('@')[0] : 'Broadcaster',
      duration: 30,
      views: 1,
      thumbnail: selectedBook.coverUrl || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=200&q=80'
    };
    setClipsCollection(prev => [...prev, newClip]);
    addEvent(`🎬 Stream Clip captured at ${Math.floor(elapsed / 60)}m ${Math.floor(elapsed % 60).toString().padStart(2, '0')}s.`, "🎬");
    playAlertSound('mod');
    alert(`🎬 Clip captured successfully at ${Math.floor(elapsed / 60)}:${Math.floor(elapsed % 60).toString().padStart(2, '0')}!`);
  };

  // Quick Action: Add Stream Marker
  const handleAddStreamMarker = () => {
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const desc = prompt("Enter marker description:", "Interesting reading moment") || "Stream Marker";
    const newMarker = {
      id: `marker-${Math.random()}`,
      time: elapsed,
      page: currentPageIndex + 1,
      desc
    };
    setStreamMarkers(prev => [...prev, newMarker]);
    addEvent(`📍 Marker: "${desc}" added at page ${currentPageIndex + 1} (${Math.floor(elapsed / 60)}m).`, "📍");
    playAlertSound('mod');
  };

  // Quick Action: Toggle Prediction
  const handleTogglePrediction = () => {
    if (!isPredictionActive) {
      setShowPredictionConfig(true);
    } else {
      setIsPredictionActive(false);
      addEvent("Predictions closed.", "🔮");
    }
  };

  // Quick Action: Toggle Watch Party co-viewing simulation
  const handleToggleWatchParty = () => {
    const nextState = !watchPartyActive;
    setWatchPartyActive(nextState);
    addEvent(nextState ? "Co-Watching Watch Party started! 🍿" : "Watch Party ended.", "🍿");
    playAlertSound('follow');
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

  const handleCheckCoverArt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverSearchQuery.trim()) return;
    setIsSearchingCover(true);
    setCoverSearchResult(null);
    try {
      const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(coverSearchQuery)}&fields=cover_i,cover_edition_key&limit=1`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      const docObj = data.docs?.[0];
      if (docObj) {
        let url = null;
        if (docObj.cover_i) {
          url = `https://covers.openlibrary.org/b/id/${docObj.cover_i}-L.jpg`;
        } else if (docObj.cover_edition_key) {
          url = `https://covers.openlibrary.org/b/olid/${docObj.cover_edition_key}-L.jpg`;
        }
        
        if (url) {
          setCoverSearchResult({ found: true, coverUrl: url });
          setNewBookTitle(coverSearchQuery);
        } else {
          setCoverSearchResult({ found: false, coverUrl: null });
          setNewBookTitle(coverSearchQuery);
        }
      } else {
        setCoverSearchResult({ found: false, coverUrl: null });
      }
    } catch (err) {
      console.error("Cover check failed:", err);
      setCoverSearchResult({ found: false, coverUrl: null });
    } finally {
      setIsSearchingCover(false);
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

    let finalCoverUrl = '';

    if (customCoverFile) {
      try {
        setIsUploadingCover(true);
        const coverRef = ref(storage, `book_covers/${user.uid}_${Date.now()}_${customCoverFile.name}`);
        const uploadTask = await uploadBytesResumable(coverRef, customCoverFile);
        finalCoverUrl = await getDownloadURL(uploadTask.ref);
        setIsUploadingCover(false);
      } catch (storageErr: any) {
        console.error("Storage upload failed for custom cover:", storageErr);
        setIsUploadingCover(false);
        setAddBookError('Failed to upload custom cover art: ' + storageErr.message);
        return;
      }
    } else {
      try {
        const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(newBookTitle)}&fields=cover_i,cover_edition_key&limit=1`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        const docObj = data.docs?.[0];
        if (docObj) {
          if (docObj.cover_i) {
            finalCoverUrl = `https://covers.openlibrary.org/b/id/${docObj.cover_i}-L.jpg`;
          } else if (docObj.cover_edition_key) {
            finalCoverUrl = `https://covers.openlibrary.org/b/olid/${docObj.cover_edition_key}-L.jpg`;
          }
        }
      } catch (apiErr) {
        console.error("Open Library API cover look up failed, using procedural fallback cover:", apiErr);
      }
    }

    if (!finalCoverUrl) {
      finalCoverUrl = generateBookCoverSvgUrl(newBookTitle, newBookAuthor, newBookGenre);
    }

    try {
      const bookRef = await addDoc(collection(db, 'books'), {
        title: newBookTitle,
        author: newBookAuthor,
        genre: newBookGenre,
        ageRange: newBookAgeRange,
        readingLevel: newBookReadingLevel,
        pages,
        coverUrl: finalCoverUrl,
        uploaderId: user.uid,
        createdAt: new Date()
      });

      setAddBookSuccess('Book uploaded successfully!');
      setSelectedBookId(bookRef.id);
      setNewBookTitle('');
      setNewBookAuthor('');
      setNewBookText('');
      setCustomCoverFile(null);
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
        case 'clip':
          return (
            <button type="button" key="clip" onClick={handleCreateClip} className="action-tile active-purple">
              <span>🎬</span>
              <span>Clip That</span>
            </button>
          );
        case 'marker':
          return (
            <button type="button" key="marker" onClick={handleAddStreamMarker} className="action-tile">
              <span>📍</span>
              <span>Add Marker</span>
            </button>
          );
        case 'slow':
          return (
            <button type="button" key="slow" onClick={handleToggleSlowMode} className={`action-tile ${chatSlowMode ? 'active-red' : ''}`}>
              <span>⏱️</span>
              <span>{chatSlowMode ? 'Disable Slow' : 'Slow Mode'}</span>
            </button>
          );
        case 'sub':
          return (
            <button type="button" key="sub" onClick={handleToggleSubscribersOnly} className={`action-tile ${subscribersOnly ? 'active-red' : ''}`}>
              <span>🔒</span>
              <span>{subscribersOnly ? 'Standard Chat' : 'Subscribers-Only'}</span>
            </button>
          );
        case 'goals':
          return (
            <button type="button" key="goals" onClick={() => setShowGoalsConfig(!showGoalsConfig)} className={`action-tile ${goalActive ? 'active-purple' : ''}`}>
              <span>🎯</span>
              <span>Manage Goals</span>
            </button>
          );
        case 'prediction':
          return (
            <button type="button" key="prediction" onClick={handleTogglePrediction} className={`action-tile ${isPredictionActive ? 'active-purple' : ''}`}>
              <span>🔮</span>
              <span>Predictions</span>
            </button>
          );
        case 'watchparty':
          return (
            <button type="button" key="watchparty" onClick={handleToggleWatchParty} className={`action-tile ${watchPartyActive ? 'active-purple' : ''}`}>
              <span>🍿</span>
              <span>{watchPartyActive ? 'End WatchParty' : 'Watch Party'}</span>
            </button>
          );
        default:
          return null;
      }
    });
  };
  const renderChildrenProfileManager = () => {
    return (
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
    );
  };

  const renderStudioTabs = () => {
    switch (dashboardMode) {
      case 'studio-dashboard':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px', marginTop: '16px' }}>
            {/* Box 1: Latest Video Performance */}
            <div className="studio-card glass-panel" style={{ margin: 0 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Latest Storytime Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', height: '140px', background: 'rgba(255,255,255,0.03)' }}>
                  <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80" alt="Book Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>07:15</div>
                </div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Grammy reading Frankenstein (Ch. 1-2)</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Published: Aug 14, 2026</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', marginTop: '8px' }}>
                  <div className="flex-between">
                    <span>Views:</span>
                    <strong>48</strong>
                  </div>
                  <div className="flex-between">
                    <span>Average Watch Duration:</span>
                    <strong>04:42 (65.2%)</strong>
                  </div>
                  <div className="flex-between">
                    <span>Likes:</span>
                    <strong>12 (100%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Channel Analytics Summary */}
            <div className="studio-card glass-panel" style={{ margin: 0 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Channel Analytics Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Subscribers</span>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>148</div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)' }}>📈 +14 in last 28 days</span>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Last 28 Days Summary</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', marginTop: '8px' }}>
                    <div className="flex-between">
                      <span>Total Views:</span>
                      <strong>418</strong>
                    </div>
                    <div className="flex-between">
                      <span>Watch Time (hours):</span>
                      <strong>12.4h</strong>
                    </div>
                    <div className="flex-between">
                      <span>Vocabulary words unlocked:</span>
                      <strong>65 🧸</strong>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Milestone Target:</span>
                    <span>148 / 200</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginTop: '6px' }}>
                    <div style={{ background: 'var(--accent-primary)', width: '74%', height: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Recent Activity Feed */}
            <div className="studio-card glass-panel" style={{ margin: 0 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Recent Activity & Comments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
                {[
                  { user: 'Bobby', icon: '🧸', text: 'I loved the giant bear illustration! 💖', time: '1 hour ago' },
                  { user: 'Clara', icon: '🌟', text: 'Can we read chapter 3 tomorrow during live stream?', time: '3 hours ago' },
                  { user: 'parent_jane', icon: '🔑', text: 'Uploaded a custom story for school book club!', time: '1 day ago' },
                  { user: 'Teddy', icon: '🧸', text: 'Great reading pace! 📖', time: '2 days ago' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div className="flex-between" style={{ marginBottom: '4px', fontSize: '0.8rem' }}>
                      <strong style={{ color: 'var(--accent-secondary)' }}>{item.icon} {item.user}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>"{item.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'studio-content-producer':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            {/* Sub Tabs */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <button type="button" onClick={() => setContentSubTab('books')} className={`btn-mode-tab ${contentSubTab === 'books' ? 'active' : ''}`} style={{ background: contentSubTab === 'books' ? 'var(--accent-primary)' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Books Library</button>
              <button type="button" onClick={() => setContentSubTab('recordings')} className={`btn-mode-tab ${contentSubTab === 'recordings' ? 'active' : ''}`} style={{ background: contentSubTab === 'recordings' ? 'var(--accent-primary)' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Recorded Stories</button>
              <button type="button" onClick={() => setContentSubTab('streams')} className={`btn-mode-tab ${contentSubTab === 'streams' ? 'active' : ''}`} style={{ background: contentSubTab === 'streams' ? 'var(--accent-primary)' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Live Broadcast Logs</button>
            </div>

            {contentSubTab === 'books' && (
              <table className="studio-table">
                <thead>
                  <tr>
                    <th>Title & Author</th>
                    <th>Age Range</th>
                    <th>Reading Level</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customBooks.map(b => (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {b.author} (Custom Upload)</div>
                      </td>
                      <td>{b.ageRange || '5-7'}</td>
                      <td>{b.readingLevel || 'Level M'}</td>
                      <td><span style={{ background: 'rgba(157,78,221,0.15)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Family-Only</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button type="button" onClick={() => { setDashboardMode('studio-subtitles'); setSelectedSubtitleBookId(b.id); setEditingSubtitlesPageIdx(0); }} className="btn-action-cog" style={{ background: 'var(--bg-hover)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>✏️ Subtitles</button>
                          <button type="button" onClick={() => handleDeleteCustomBook(b.id)} className="btn-action-cog" style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {contentSubTab === 'recordings' && (
              <div>
                {recordings.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No story recordings saved yet. Click the "+ Create" button to record a storytime session!</p>
                ) : (
                  <table className="studio-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Associated Book</th>
                        <th>Duration</th>
                        <th>Date Saved</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recordings.map(rec => (
                        <tr key={rec.id}>
                          <td><strong>{rec.title}</strong></td>
                          <td>{rec.bookId}</td>
                          <td>{rec.duration ? `${Math.floor(rec.duration / 60)}m ${Math.floor(rec.duration % 60)}s` : 'Unknown'}</td>
                          <td>{rec.createdAt ? new Date(rec.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <button type="button" onClick={() => handleDeleteRecording(rec.id)} className="btn-action-cog" style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {contentSubTab === 'streams' && (
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Past streaming sessions and live metadata summaries.</p>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <strong>🔴 Live stream broadcasting logs (Simulated)</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>To run a new broadcast, click "+ Create" &gt; "Go Live" in the upper right hand corner.</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'studio-content-clips':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            <h3>Trimmed Clips Catalog</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Manage high-quality highlights trimmed by your community during storytime.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {clipsCollection.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '2rem' }}>🎬</span>
                  <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No clips created yet. Viewers can click the "Clip" action during live streams to save highlight clips!</p>
                </div>
              ) : (
                clipsCollection.map(clip => (
                  <div key={clip.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: '120px', background: 'var(--bg-dark)' }}>
                      <img src={clip.thumbnail || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=200&q=80"} alt="Clip Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                      <span style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.7rem' }}>{clip.duration}s</span>
                    </div>
                    <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clip.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Clipped by: {clip.creator}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--accent-success)' }}>👀 {clip.views} views</span>
                        <button type="button" onClick={() => alert("🔗 Link copied to clipboard!")} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>Share</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'studio-analytics-channel':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div className="studio-card glass-panel" style={{ margin: 0, padding: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Viewers</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>420</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>📈 +18% vs last week</span>
              </div>
              <div className="studio-card glass-panel" style={{ margin: 0, padding: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Followers Gained</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>+84</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>📈 +32% vs last week</span>
              </div>
              <div className="studio-card glass-panel" style={{ margin: 0, padding: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subscribers</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>148</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>📈 +8 new subs</span>
              </div>
              <div className="studio-card glass-panel" style={{ margin: 0, padding: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Est. Revenue</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-success)', margin: '4px 0' }}>$420.50</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>📈 +12% vs last week</span>
              </div>
            </div>

            <div className="studio-card glass-panel" style={{ margin: 0 }}>
              <h3>Viewer Distribution Graph</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Understand peak reader traffic levels based on daily focus schedules.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Morning Storytime (8:00 AM - 10:00 AM)', pct: 45, color: 'var(--accent-primary)', count: '180 kids' },
                  { label: 'Mid-day Quiet Time (1:00 PM - 3:00 PM)', pct: 85, color: 'var(--accent-secondary)', count: '340 kids' },
                  { label: 'Cozy Bedtime (7:00 PM - 9:00 PM)', pct: 95, color: 'var(--accent-tertiary)', count: '380 kids' },
                  { label: 'Late Night Study Room (10:00 PM - 12:00 AM)', pct: 25, color: 'var(--accent-success)', count: '100 kids' }
                ].map((row, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: '#fff' }}>{row.label}</span>
                      <strong>{row.count} ({row.pct}%)</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
                      <div style={{ background: row.color, width: `${row.pct}%`, height: '100%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'studio-analytics-summary':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            <h3>Past Stream Summaries</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Select a recent live broadcast to review its stats and viewer activity.</p>
            <table className="studio-table">
              <thead>
                <tr>
                  <th>Stream Date</th>
                  <th>Book Title & Chapter</th>
                  <th>Duration</th>
                  <th>Peak Viewers</th>
                  <th>Chat Activity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Aug 14, 2026</strong></td>
                  <td>Harry Potter & The Sorcerer's Stone (Ch. 1)</td>
                  <td>1h 15m</td>
                  <td>580</td>
                  <td>1,240 messages</td>
                </tr>
                <tr>
                  <td><strong>Aug 12, 2026</strong></td>
                  <td>Frankenstein (Intro / Preface)</td>
                  <td>45m</td>
                  <td>340</td>
                  <td>450 messages</td>
                </tr>
                <tr>
                  <td><strong>Aug 09, 2026</strong></td>
                  <td>The Fellowship of the Ring (Ch. 2-3)</td>
                  <td>2h 05m</td>
                  <td>720</td>
                  <td>2,100 messages</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'studio-rewards-points':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            <h3>Channel Points Reward Manager</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Configure custom viewer point costs for kids to interact with your storytime directly.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="audio-row" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>🪄 Ask a Question (Story Q&A)</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Let a child trigger an on-screen alert to ask the reader a question about the plot.</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" defaultValue={250} style={{ width: '80px', padding: '4px', textAlign: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Points</span>
                </div>
              </div>
              <div className="audio-row" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>🔊 Play a Magic Sound Alert</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Triggers a chimes or bell sound effect to ring on the broadcaster's headset.</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" defaultValue={500} style={{ width: '80px', padding: '4px', textAlign: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Points</span>
                </div>
              </div>
              <div className="audio-row" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>📖 Suggest Next Book</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Sends a recommendation to the broadcaster's queue for next storytime picks.</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" defaultValue={1000} style={{ width: '80px', padding: '4px', textAlign: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Points</span>
                </div>
              </div>
              <button type="button" onClick={() => alert("🪙 Channel points cost settings updated successfully!")} className="btn-primary" style={{ marginTop: '12px', alignSelf: 'flex-start' }}>Save Rewards Config</button>
            </div>
          </div>
        );

      case 'studio-rewards-emotes':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            <h3>Custom Emotes & Badge Assets</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Upload and manage the emoticons and sub badges viewers use in chat.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', textAlign: 'center' }}>
              {[
                { symbol: '🧸', name: 'cozy_bear' },
                { symbol: '🐉', name: 'epic_dragon' },
                { symbol: '🪄', name: 'magic_wand' },
                { symbol: '🦉', name: 'wise_owl' },
                { symbol: '🏰', name: 'castle_view' }
              ].map((emote, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '2rem' }}>{emote.symbol}</div>
                  <strong style={{ fontSize: '0.8rem', display: 'block', marginTop: '8px', color: '#fff' }}>:{emote.name}:</strong>
                  <button type="button" onClick={() => alert("Emote deleted successfully.")} style={{ marginTop: '8px', background: 'none', border: 'none', color: 'var(--accent-danger)', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                </div>
              ))}
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => alert("Select emote file to upload (PNG/GIF, max 256KB)")}>
                <span style={{ fontSize: '1.5rem' }}>➕</span>
                <strong style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-muted)' }}>Upload Emote</strong>
              </div>
            </div>
          </div>
        );

      case 'studio-community-roles':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            <h3>Roles Manager</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Assign moderators, VIPs, and editing staff roles to community helpers.</p>
            <table className="studio-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Current Roles</th>
                  <th>Date Assigned</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>@grannyreads</strong></td>
                  <td><span style={{ background: 'rgba(0, 229, 255, 0.15)', color: 'var(--accent-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>🛡️ Moderator</span></td>
                  <td>Jan 12, 2026</td>
                  <td><button type="button" onClick={() => alert("Grannyreads role settings opened.")} className="btn-action-cog" style={{ background: 'var(--bg-hover)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button></td>
                </tr>
                <tr>
                  <td><strong>@storytime_uncle</strong></td>
                  <td>
                    <span style={{ background: 'rgba(0, 229, 255, 0.15)', color: 'var(--accent-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginRight: '4px' }}>🛡️ Moderator</span>
                    <span style={{ background: 'rgba(255, 183, 3, 0.15)', color: '#ffb703', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>⭐ VIP</span>
                  </td>
                  <td>Feb 04, 2026</td>
                  <td><button type="button" onClick={() => alert("Uncle role settings opened.")} className="btn-action-cog" style={{ background: 'var(--bg-hover)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'studio-community-followers':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            <h3>Followers List</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>List of followers who have subscribed to your storytime updates.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { name: 'Billy & Sarah', since: 'Followed Aug 14, 2026', icon: '👦👧' },
                { name: 'CozyReaderMom', since: 'Followed Aug 11, 2026', icon: '👩' },
                { name: 'TimmyTheBookworm', since: 'Followed Aug 08, 2026', icon: '👶' },
                { name: 'LuluFantasy', since: 'Followed Aug 02, 2026', icon: '👧' }
              ].map((follower, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{follower.icon}</span>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block' }}>{follower.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{follower.since}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'studio-settings-credentials':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Stream Credentials & Ingest Info</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Copy RTMP server parameters and input stream keys into your encoder software (e.g. OBS Studio, Streamlabs).</p>
            
            <div className="form-group">
              <label>Primary Ingest RTMP URL</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" readOnly value="rtmp://stream.readabook.live/live" style={{ flex: 1, padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '4px' }} />
                <button type="button" onClick={() => { navigator.clipboard.writeText("rtmp://stream.readabook.live/live"); alert("📋 Ingest URL copied to clipboard!"); }} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Copy</button>
              </div>
            </div>

            <div className="form-group">
              <label>Private Stream Key</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type={showStreamKey ? "text" : "password"} 
                  readOnly 
                  value={`live_${user?.uid?.substring(0, 6)}_${user?.uid?.substring(user.uid.length - 6)}`} 
                  style={{ flex: 1, padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} 
                />
                <button type="button" onClick={() => setShowStreamKey(!showStreamKey)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                  {showStreamKey ? "Hide" : "Show"}
                </button>
                <button 
                  type="button" 
                  onClick={() => { 
                    navigator.clipboard.writeText(`live_${user?.uid?.substring(0, 6)}_${user?.uid?.substring(user.uid.length - 6)}`); 
                    alert("📋 Stream Key copied to clipboard! Keep this private."); 
                  }} 
                  className="btn-primary" 
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Stream Latency Preference</label>
              <select defaultValue="low" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: '4px' }}>
                <option value="ultra-low">Ultra-Low Latency (Realtime chat feedback, slight buffering hazard)</option>
                <option value="low">Low Latency (Cozy stream sync, recommended)</option>
                <option value="normal">Normal Latency (Maximum stability, fits poor connections)</option>
              </select>
            </div>

            <button type="button" onClick={() => alert("📡 Stream preferences saved successfully!")} className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Preferences</button>
          </div>
        );

      case 'studio-settings-moderation':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Moderation & Safety Rules</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage automated chat safety filters and enforce classroom-friendly chat streams.</p>

            <div className="form-group">
              <label>AutoMod Shield Level</label>
              <select defaultValue="medium" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: '4px' }}>
                <option value="low">Low Filter (Allows mild banter, locks swearing)</option>
                <option value="medium">Medium Filter (Deletes URLs, spam blocks, blocks bullying)</option>
                <option value="high">High Filter (Strict classroom filter - only matches safe vocabulary keywords)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Banned Words List (Comma separated)</label>
              <textarea 
                defaultValue="spam, troll, advertisement, free-money" 
                rows={3} 
                style={{ padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px' }} 
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" defaultChecked id="block-hyperlinks" style={{ width: 'auto', cursor: 'pointer' }} />
              <label htmlFor="block-hyperlinks" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>Block Hyperlinks (Auto deletes any text containing http:// or https:// in chat)</label>
            </div>

            <button type="button" onClick={() => alert("🛡️ Moderation safety options updated!")} className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Safety Config</button>
          </div>
        );

      case 'studio-earn':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* Left Column: Affiliate links & earnings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="studio-card glass-panel" style={{ margin: 0 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📢 Affiliate Referral Curation</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Configure your digital bookstore links to earn commissions when families purchase physical/digital books.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Audible Associate ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. readabook-20" 
                      defaultValue="readabook-20"
                      style={{ padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }} 
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amazon Store Affiliate URL Prefix</label>
                    <input 
                      type="text" 
                      placeholder="e.g. amazon.com/shop/readabook" 
                      defaultValue="amazon.com/shop/familyreadings"
                      style={{ padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }} 
                    />
                  </div>
                </div>

                <h4 style={{ margin: '20px 0 10px 0', fontSize: '0.9rem' }}>Bounty Fee Structures</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="flex-between" style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <span>Audible Free Trial SignUp Bounty</span>
                    <strong style={{ color: 'var(--accent-success)' }}>$5.00 / Lead</strong>
                  </div>
                  <div className="flex-between" style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <span>Audible Gold Monthly Membership</span>
                    <strong style={{ color: 'var(--accent-success)' }}>$10.00 / Signup</strong>
                  </div>
                  <div className="flex-between" style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <span>Kindle Digital E-Book Retail Sale</span>
                    <strong style={{ color: 'var(--accent-success)' }}>15% Royalty</strong>
                  </div>
                </div>
              </div>

              <div className="studio-card glass-panel" style={{ margin: 0 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem' }}>Commission Performance Metrics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clicks</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>148</div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bounty Leads</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>24</div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unpaid Payout</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-success)', marginTop: '4px' }}>$120.00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sponsorship segment retention graphs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="studio-card glass-panel" style={{ margin: 0 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem' }}>Live Sponsor Skip Analytics</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Audience retention graph showing video segment skip drop-offs when live ad sponsors are read.
                </p>

                {/* Simulated skip rate chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Squarespace (Intro Segment)</span>
                      <span style={{ color: 'var(--accent-danger)' }}>20% Skip Rate</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '20%', height: '100%', background: 'var(--accent-danger)' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>VPN Secure (Mid-Roll Segment)</span>
                      <span style={{ color: 'var(--accent-danger)' }}>78% Skip Rate ⚠️</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '78%', height: '100%', background: 'var(--accent-danger)' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Book of the Month (Outro Segment)</span>
                      <span style={{ color: 'var(--accent-danger)' }}>45% Skip Rate</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '45%', height: '100%', background: 'var(--accent-danger)' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255, 183, 3, 0.1)', border: '1px solid rgba(255, 183, 3, 0.2)', borderRadius: '6px', fontSize: '0.8rem', color: '#ffb703' }}>
                  <strong>💡 BookTube Retention Tip:</strong> Live reads embedded directly into cozy storytelling hours suffer 50% fewer skips than traditional video block interruptions. Keep the soundscapes looping!
                </div>
              </div>
            </div>
          </div>
        );

      case 'studio-subtitles':
        const allAvailableBooks = customBooks;
        const selectedBookObj = allAvailableBooks.find(b => b.id === selectedSubtitleBookId);
        
        // Fetch pages array safely
        const pagesArray: string[] = selectedBookObj ? (selectedBookObj.pages || ['Page 1 content...', 'Page 2 content...']) : [];

        const handleSaveSubtitle = () => {
          if (!selectedBookObj) return;
          if (!selectedBookObj.pages) {
            selectedBookObj.pages = [...pagesArray];
          }
          selectedBookObj.pages[editingSubtitlesPageIdx] = editingSubtitlesText;
          alert("📝 Subtitle page transcript updated locally! Subtitles synchronized successfully.");
        };

        const handleSelectSubtitlePage = (idx: number) => {
          setEditingSubtitlesPageIdx(idx);
          setEditingSubtitlesText(pagesArray[idx] || '');
        };

        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Select Book to edit Subtitles / Closed Captions</label>
              <select 
                value={selectedSubtitleBookId}
                onChange={(e) => {
                  const bId = e.target.value;
                  setSelectedSubtitleBookId(bId);
                  const bObj = allAvailableBooks.find(b => b.id === bId);
                  const bPages = bObj ? (bObj.pages || ['Page 1 content...', 'Page 2 content...']) : [];
                  setEditingSubtitlesPageIdx(0);
                  setEditingSubtitlesText(bPages[0] || '');
                }}
              >
                <option value="">-- Choose a storybook --</option>
                {allAvailableBooks.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>

            {selectedSubtitleBookId ? (
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
                  <strong>Pages</strong>
                  {pagesArray.map((_, idx) => (
                    <button 
                      key={idx} 
                      type="button"
                      onClick={() => handleSelectSubtitlePage(idx)}
                      style={{
                        padding: '8px',
                        background: editingSubtitlesPageIdx === idx ? 'var(--accent-primary)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        color: '#fff',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      Page {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="dashboard-form" style={{ marginTop: 0 }}>
                  <h3>Edit Closed Captions (Page {editingSubtitlesPageIdx + 1})</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Captions edited here will overlay dynamically at the bottom of child screens during live story readings.</p>
                  <div className="form-group">
                    <textarea 
                      value={editingSubtitlesText}
                      onChange={(e) => setEditingSubtitlesText(e.target.value)}
                      rows={6}
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>
                  <button type="button" onClick={handleSaveSubtitle} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Save Closed Caption Transcript
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Choose a book from the selector list to inspect page-by-page transcripts.</p>
            )}
          </div>
        );

      case 'studio-customisation':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Layout & Branding Customization</h3>
            
            <div className="form-group">
              <label>Broadcaster Profile Picture URL</label>
              <input 
                type="text" 
                value={profilePictureUrl} 
                onChange={(e) => setProfilePictureUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Creator Channel Banner URL</label>
              <input 
                type="text" 
                value={bannerPictureUrl} 
                onChange={(e) => setBannerPictureUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Child Screen Welcome Greeting Message</label>
              <input 
                type="text" 
                value={familyGreeting} 
                onChange={(e) => setFamilyGreeting(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Channel Handle</label>
              <input 
                type="text" 
                value={channelHandle} 
                onChange={(e) => setChannelHandle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Video Watermark Overlay URL (Branding Logo)</label>
              <input 
                type="text" 
                value={videoWatermarkUrl} 
                onChange={(e) => setVideoWatermarkUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Channel Description</label>
              <textarea 
                value={channelDescription} 
                onChange={(e) => setChannelDescription(e.target.value)}
                rows={3}
              />
            </div>

            <button type="button" onClick={() => alert("🎨 Custom branding layout saved successfully! Kids screen layout templates updated.")} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              Save Branding Layout
            </button>
          </div>
        );

      case 'studio-audio':
        const soundEffects = [
          { name: 'Magic Page Flip Chimes 🪄', file: 'magic_chime' },
          { name: 'Animated Storybook Bell 🔔', file: 'success_bell' },
          { name: 'Audience Round Applause 👏', file: 'applause' },
          { name: 'Playful Animal Giggles 🐼', file: 'animal_giggles' },
          { name: 'Sparkle Achievements Sound ✨', file: 'sparkle' }
        ];

        const playTestAudio = (file: string) => {
          playAlertSound(file === 'magic_chime' ? 'chat' : file === 'success_bell' ? 'mod' : 'follow');
          alert(`🎵 Auditioning effect: "${file}" locally.`);
        };

        return (
          <div className="studio-card glass-panel" style={{ margin: 0 }}>
            <h3>Creator Audio Library</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Audition free sound alerts and storytelling sound effects to stimulate kid attention span during live streams.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {soundEffects.map((sound, idx) => (
                <div key={idx} className="audio-row">
                  <div>
                    <strong>{sound.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: Free to broadcast | License: ReadaBook Original</div>
                  </div>
                  <button type="button" onClick={() => playTestAudio(sound.file)} className="btn-action-cog" style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: '20px', padding: '6px 14px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Play ▶️</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'studio-settings':
        return (
          <div className="studio-card glass-panel" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Creator Settings</h3>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Default Upload Genre</label>
                <select value={defaultGenre} onChange={(e) => setDefaultGenre(e.target.value)}>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Classics">Classics</option>
                  <option value="Mystery">Mystery</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Default Upload Age Group</label>
                <select value={defaultAgeRange} onChange={(e) => setDefaultAgeRange(e.target.value)}>
                  <option value="2-4">Toddler (2-4)</option>
                  <option value="5-7">Early Reader (5-7)</option>
                  <option value="8-10">Independent (8-10)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Profile Safety Lock PIN (4-Digits)</label>
              <input type="password" defaultValue="1234" maxLength={4} style={{ width: '120px', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.15em' }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" defaultChecked id="automod-links" style={{ width: 'auto', cursor: 'pointer' }} />
              <label htmlFor="automod-links" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>Auto-mod link filter (automatically deletes external links in streamer chats and times out users)</label>
            </div>

            <button type="button" onClick={() => alert("⚙️ Settings configuration saved successfully!")} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              Save General Preferences
            </button>
          </div>
        );

      default:
        return <p>Select a navigation link on the left side to get started.</p>;
    }
  };

  const hideSidebar = isLive || isRecording || dashboardMode === 'sync-editor' || dashboardMode === 'live' || dashboardMode === 'record' || dashboardMode === 'upload';

  return (
    <div className={hideSidebar ? "dashboard-container" : "studio-layout-wrapper"}>
      {!hideSidebar && (
        <aside className="studio-left-nav">
          <div className="studio-nav-brand">
            <span style={{ fontSize: '1.5rem' }}>🎒</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>ReadaBook</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Creator Studio</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '12px' }}>
            <img src={profilePictureUrl} alt="Branding Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', marginBottom: '8px' }} />
            <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{channelHandle}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Broadcaster</span>
          </div>

          <nav className="studio-nav-links" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            
            {/* Stream Manager link */}
            <button type="button" onClick={() => setDashboardMode('studio-dashboard')} className={`studio-nav-item ${dashboardMode === 'studio-dashboard' ? 'active' : ''}`}>
              <span>📡 Stream Manager</span>
            </button>

            {/* Content folder */}
            <div>
              <div 
                onClick={() => setExpandSidebarSections({ ...expandSidebarSections, content: !expandSidebarSections.content })}
                className="studio-nav-category-header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em' }}
              >
                <span>📂 Content</span>
                <span>{expandSidebarSections.content ? '▼' : '▶'}</span>
              </div>
              {expandSidebarSections.content && (
                <div className="studio-nav-submenu" style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button type="button" onClick={() => setDashboardMode('studio-content-producer')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-content-producer' ? 'active' : ''}`}>
                    <span>📚 Video Producer</span>
                  </button>
                  <button type="button" onClick={() => setDashboardMode('studio-content-clips')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-content-clips' ? 'active' : ''}`}>
                    <span>🎬 Trimmed Clips</span>
                  </button>
                </div>
              )}
            </div>

            {/* Analytics folder */}
            <div>
              <div 
                onClick={() => setExpandSidebarSections({ ...expandSidebarSections, analytics: !expandSidebarSections.analytics })}
                className="studio-nav-category-header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em' }}
              >
                <span>📈 Analytics</span>
                <span>{expandSidebarSections.analytics ? '▼' : '▶'}</span>
              </div>
              {expandSidebarSections.analytics && (
                <div className="studio-nav-submenu" style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button type="button" onClick={() => setDashboardMode('studio-analytics-channel')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-analytics-channel' ? 'active' : ''}`}>
                    <span>📊 Channel Analytics</span>
                  </button>
                  <button type="button" onClick={() => setDashboardMode('studio-analytics-summary')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-analytics-summary' ? 'active' : ''}`}>
                    <span>📝 Stream Summary</span>
                  </button>
                </div>
              )}
            </div>

            {/* Viewer Rewards folder */}
            <div>
              <div 
                onClick={() => setExpandSidebarSections({ ...expandSidebarSections, rewards: !expandSidebarSections.rewards })}
                className="studio-nav-category-header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em' }}
              >
                <span>🪙 Viewer Rewards</span>
                <span>{expandSidebarSections.rewards ? '▼' : '▶'}</span>
              </div>
              {expandSidebarSections.rewards && (
                <div className="studio-nav-submenu" style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button type="button" onClick={() => setDashboardMode('studio-rewards-points')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-rewards-points' ? 'active' : ''}`}>
                    <span>🪙 Channel Points</span>
                  </button>
                  <button type="button" onClick={() => setDashboardMode('studio-rewards-emotes')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-rewards-emotes' ? 'active' : ''}`}>
                    <span>🎭 Custom Emotes & Badges</span>
                  </button>
                </div>
              )}
            </div>

            {/* Community folder */}
            <div>
              <div 
                onClick={() => setExpandSidebarSections({ ...expandSidebarSections, community: !expandSidebarSections.community })}
                className="studio-nav-category-header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em' }}
              >
                <span>👥 Community</span>
                <span>{expandSidebarSections.community ? '▼' : '▶'}</span>
              </div>
              {expandSidebarSections.community && (
                <div className="studio-nav-submenu" style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button type="button" onClick={() => setDashboardMode('studio-community-roles')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-community-roles' ? 'active' : ''}`}>
                    <span>🛡️ Roles Manager</span>
                  </button>
                  <button type="button" onClick={() => setDashboardMode('studio-community-followers')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-community-followers' ? 'active' : ''}`}>
                    <span>❤️ Followers List</span>
                  </button>
                </div>
              )}
            </div>

            {/* Settings folder */}
            <div>
              <div 
                onClick={() => setExpandSidebarSections({ ...expandSidebarSections, settings: !expandSidebarSections.settings })}
                className="studio-nav-category-header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em' }}
              >
                <span>⚙️ Settings</span>
                <span>{expandSidebarSections.settings ? '▼' : '▶'}</span>
              </div>
              {expandSidebarSections.settings && (
                <div className="studio-nav-submenu" style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button type="button" onClick={() => setDashboardMode('studio-settings-credentials')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-settings-credentials' ? 'active' : ''}`}>
                    <span>📡 Stream Credentials</span>
                  </button>
                  <button type="button" onClick={() => setDashboardMode('studio-settings-moderation')} className={`studio-nav-item sub-item ${dashboardMode === 'studio-settings-moderation' ? 'active' : ''}`}>
                    <span>🛡️ Moderation Rules</span>
                  </button>
                </div>
              )}
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

            {/* Flat links for miscellaneous */}
            <button type="button" onClick={() => setDashboardMode('studio-earn')} className={`studio-nav-item ${dashboardMode === 'studio-earn' ? 'active' : ''}`}>
              <span>💰 Affiliate & Earnings</span>
            </button>
            <button type="button" onClick={() => setDashboardMode('studio-subtitles')} className={`studio-nav-item ${dashboardMode === 'studio-subtitles' ? 'active' : ''}`}>
              <span>📝 Subtitles</span>
            </button>
            <button type="button" onClick={() => setDashboardMode('studio-customisation')} className={`studio-nav-item ${dashboardMode === 'studio-customisation' ? 'active' : ''}`}>
              <span>🎨 Customisation</span>
            </button>
            <button type="button" onClick={() => setDashboardMode('studio-audio')} className={`studio-nav-item ${dashboardMode === 'studio-audio' ? 'active' : ''}`}>
              <span>🎵 Audio Library</span>
            </button>
          </nav>
        </aside>
      )}

      {/* Main Content Body */}
      <div className={hideSidebar ? "dashboard-main studio-main" : "studio-content-body"}>
        {!hideSidebar && (
          <div className="studio-top-bar">
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>
                {dashboardMode === 'studio-dashboard' && "Channel Dashboard"}
                {dashboardMode === 'studio-content-producer' && "Video Producer"}
                {dashboardMode === 'studio-content-clips' && "Trimmed Clips Catalog"}
                {dashboardMode === 'studio-analytics-channel' && "Channel Analytics Portal"}
                {dashboardMode === 'studio-analytics-summary' && "Stream Summary Statistics"}
                {dashboardMode === 'studio-rewards-points' && "Channel Points Reward Manager"}
                {dashboardMode === 'studio-rewards-emotes' && "Custom Emotes & Badge Assets"}
                {dashboardMode === 'studio-community-roles' && "Roles Manager (Moderators & VIPs)"}
                {dashboardMode === 'studio-community-followers' && "Followers List"}
                {dashboardMode === 'studio-settings-credentials' && "Stream Credentials Ingestion"}
                {dashboardMode === 'studio-settings-moderation' && "Moderation & Safety Rules"}
                {dashboardMode === 'studio-earn' && "Affiliate & Earnings Manager"}
                {dashboardMode === 'studio-subtitles' && "Subtitles Manager"}
                {dashboardMode === 'studio-customisation' && "Channel Customisation"}
                {dashboardMode === 'studio-audio' && "Audio Library"}
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage your channel content, interactive tools, and subscriber milestones.</p>
            </div>
            
            <div className="btn-create-dropdown">
              <button 
                type="button" 
                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                className="btn-primary flex-center gap-xs"
                style={{ background: 'var(--accent-primary)', padding: '10px 18px', borderRadius: '24px', fontWeight: 'bold' }}
              >
                <span>+ Create</span>
              </button>
              {showCreateDropdown && (
                <div className="create-dropdown-menu" onClick={() => setShowCreateDropdown(false)}>
                  <button type="button" onClick={() => { setDashboardMode('live'); setStreamTitle(`${user?.email ? user.email.split('@')[0] : 'Broadcaster'}'s Storytime Session`); }} className="create-dropdown-item">
                    <span>🔴 Go Live</span>
                  </button>
                  <button type="button" onClick={() => { setDashboardMode('record'); setRecordingTitle(`${user?.email ? user.email.split('@')[0] : 'Broadcaster'}'s Recording Session`); }} className="create-dropdown-item">
                    <span>🎥 Record Story</span>
                  </button>
                  <button type="button" onClick={() => setDashboardMode('upload')} className="create-dropdown-item">
                    <span>📄 Upload Custom Book</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!hideSidebar && (
          renderStudioTabs()
        )}

        {hideSidebar && (
          <>
        
        {/* Studio Title Bar */}
        <div className="studio-header">
          <div>
            <h1 className="dashboard-title">Creator Studio</h1>
            <p className="studio-subtitle">
              Stream control room, dashboard analytics, and live page manager
              {familyCode && <span style={{ marginLeft: "12px", background: "rgba(157, 78, 221, 0.15)", color: "var(--accent-primary)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>Family Code: {familyCode}</span>}
              {(clipsCollection.length > 0 || streamMarkers.length > 0) && (
                <span style={{ marginLeft: "12px", background: "rgba(0, 229, 255, 0.15)", color: "var(--accent-secondary)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>🎬 Clips: {clipsCollection.length} | 📍 Markers: {streamMarkers.length}</span>
              )}
            </p>
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

            {/* Cover Art Lookup Tool */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔍 Check Cover Art Availability
              </h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Search by book title to see if Open Library already has high-resolution cover art. If it doesn't, you can upload your own custom cover below!
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={coverSearchQuery} 
                  onChange={(e) => setCoverSearchQuery(e.target.value)}
                  placeholder="Enter book title to check..."
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff' }}
                />
                <button 
                  type="button" 
                  onClick={handleCheckCoverArt}
                  className="btn-action-cog"
                  style={{ background: 'var(--accent-secondary)', border: 'none', borderRadius: '6px', padding: '8px 16px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                  disabled={isSearchingCover}
                >
                  {isSearchingCover ? 'Searching...' : 'Check Cover'}
                </button>
              </div>

              {coverSearchResult && (
                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  {coverSearchResult.found && coverSearchResult.coverUrl ? (
                    <>
                      <img src={coverSearchResult.coverUrl} alt="Cover Preview" style={{ width: '50px', height: '70px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 'bold' }}>🟢 Cover Art Found!</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>We will automatically pull this cover. You do not need to upload a cover file below unless you want to override it.</div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div style={{ color: '#ff4d4d', fontSize: '0.85rem', fontWeight: 'bold' }}>🔴 No Cover Art Found.</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Please create the book and upload your own cover image file in the form below!</div>
                    </div>
                  )}
                </div>
              )}
            </div>

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
                <div className="form-group flex-1">
                  <label>Age Group</label>
                  <select 
                    value={newBookAgeRange}
                    onChange={(e) => setNewBookAgeRange(e.target.value)}
                  >
                    <option value="2-4">Toddler (2-4)</option>
                    <option value="5-7">Early Reader (5-7)</option>
                    <option value="8-10">Independent (8-10)</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>A-Z Level</label>
                  <select 
                    value={newBookReadingLevel}
                    onChange={(e) => setNewBookReadingLevel(e.target.value)}
                  >
                    <option value="Level I">Level I</option>
                    <option value="Level M">Level M</option>
                    <option value="Level P">Level P</option>
                    <option value="Level R">Level R</option>
                    <option value="Level S">Level S</option>
                    <option value="Level T">Level T</option>
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

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Upload Custom Cover Art (Optional - if left empty, we will look up Open Library cover art automatically)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCustomCoverFile(e.target.files[0]);
                      }
                    }}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  />
                  {customCoverFile && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-success)' }}>
                      Selected: {customCoverFile.name}
                    </span>
                  )}
                </div>
              </div>

              {isUploadingCover && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 183, 3, 0.1)',
                  border: '1px solid #ffde6a',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '1.2rem', animation: 'spin 1.5s linear infinite' }}>⏳</span>
                  <span style={{ fontSize: '0.9rem', color: '#ffde6a' }}>Uploading custom cover art to Storage...</span>
                </div>
              )}

              <button type="submit" className="btn-primary flex-center gap-sm" disabled={isUploadingCover || isParsingFile}>
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

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Broadcast Source</label>
                    <div style={{ display: 'flex', gap: '20px', margin: '8px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                        <input 
                          type="radio" 
                          name="broadcastSource" 
                          value="webcam" 
                          checked={broadcastSource === 'webcam'} 
                          onChange={() => setBroadcastSource('webcam')} 
                        />
                        📷 Web Browser Webcam Feed
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                        <input 
                          type="radio" 
                          name="broadcastSource" 
                          value="obs" 
                          checked={broadcastSource === 'obs'} 
                          onChange={() => setBroadcastSource('obs')} 
                        />
                        📡 OBS Studio (RTMP Stream Key)
                      </label>
                    </div>
                  </div>

                  {broadcastSource === 'obs' && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📡 OBS Ingestion Details
                      </h3>
                      
                      <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RTMP Server URL</label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <input 
                            type="text" 
                            value="rtmp://stream.readabook.live/live" 
                            readOnly 
                            style={{ flex: 1, fontSize: '0.85rem', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                          />
                          <button 
                            type="button" 
                            onClick={() => navigator.clipboard.writeText("rtmp://stream.readabook.live/live")} 
                            style={{ background: 'var(--accent-secondary)', border: 'none', borderRadius: '4px', padding: '6px 12px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stream Key</label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <input 
                            type={showStreamKey ? "text" : "password"} 
                            value={`live_${user?.uid.substring(0, 6)}_${user?.uid.substring(user?.uid.length - 6)}`} 
                            readOnly 
                            style={{ flex: 1, fontSize: '0.85rem', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff', fontFamily: 'monospace' }}
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowStreamKey(!showStreamKey)} 
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '6px 12px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            {showStreamKey ? "Hide" : "Show"}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => navigator.clipboard.writeText(`live_${user?.uid.substring(0, 6)}_${user?.uid.substring(user?.uid.length - 6)}`)} 
                            style={{ background: 'var(--accent-secondary)', border: 'none', borderRadius: '4px', padding: '6px 12px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div style={{
                        marginTop: '12px',
                        padding: '10px 12px',
                        background: 'rgba(0, 180, 216, 0.08)',
                        border: '1px solid rgba(0, 180, 216, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.4'
                      }}>
                        <strong>💡 How to setup OBS Studio:</strong>
                        <ol style={{ margin: '6px 0 0 16px', padding: 0 }}>
                          <li>Open OBS settings, click on the <strong>Stream</strong> tab.</li>
                          <li>Change Service dropdown to <strong>Custom...</strong>.</li>
                          <li>Paste the Server URL and Stream Key into the fields and save!</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Reading Mode</label>
                    <div style={{ display: 'flex', gap: '20px', margin: '8px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                        <input 
                          type="radio" 
                          name="streamBookType" 
                          value="uploaded" 
                          checked={streamBookType === 'uploaded'} 
                          onChange={() => setStreamBookType('uploaded')} 
                        />
                        📖 Use Uploaded Book (Syncs text pages)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                        <input 
                          type="radio" 
                          name="streamBookType" 
                          value="physical" 
                          checked={streamBookType === 'physical'} 
                          onChange={() => setStreamBookType('physical')} 
                        />
                        🎥 Read Physical Copy (Broadcasting cover art only)
                      </label>
                    </div>
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

                    {streamBookType === 'uploaded' ? (
                      <div className="form-group flex-2">
                        <label>Select Book to Read</label>
                        <select 
                          value={selectedBookId} 
                          onChange={(e) => setSelectedBookId(e.target.value)}
                        >
                          <optgroup label="Default Library Books">
                            {books.map((b) => (
                              <option key={b.id} value={b.id}>{b.title} (by {b.author})</option>
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
                    ) : (
                      <>
                        <div className="form-group flex-2">
                          <label>Physical Book Title</label>
                          <input 
                            type="text" 
                            value={physicalBookTitle}
                            onChange={(e) => setPhysicalBookTitle(e.target.value)}
                            placeholder="e.g., Harry Potter and the Sorcerer's Stone"
                            required
                          />
                        </div>
                        <div className="form-group flex-1">
                          <label>Physical Book Author</label>
                          <input 
                            type="text" 
                            value={physicalBookAuthor}
                            onChange={(e) => setPhysicalBookAuthor(e.target.value)}
                            placeholder="e.g., J.K. Rowling"
                            required
                          />
                        </div>
                      </>
                    )}
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
                        <optgroup label="Default Library Books">
                          {books.map((b) => (
                            <option key={b.id} value={b.id}>{b.title} (by {b.author})</option>
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
                        <optgroup label="Default Library Books">
                          {books.map((b) => (
                            <option key={b.id} value={b.id}>{b.title} (by {b.author})</option>
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
              renderChildrenProfileManager()
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
            gridTemplateColumns: '300px 1fr 360px'
          }}>
            
            {/* Left Column: Activity Feed, Goals, Predictions, Pomodoro, manuscripts */}
            <div className="studio-left-column">
              
              {/* Activity Feed Widget */}
              {visibleWidgets.activity && (
                <div className="studio-card glass-panel studio-activity-card">
                  <div className="studio-card-header text-between">
                    <span className="flex-center gap-sm">
                      <Activity size={16} color="var(--accent-success)" />
                      <span>Activity Feed</span>
                    </span>
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
                  
                  <div className="activity-feed-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
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

              {/* Community Goals Widget */}
              {goalActive && (
                <div className="studio-card glass-panel" style={{ marginTop: '0' }}>
                  <div className="studio-card-header text-between">
                    <span className="flex-center gap-sm">
                      <span>🎯 Community Goal Tracker</span>
                    </span>
                    <button onClick={() => setShowGoalsConfig(true)} className="btn-action-cog" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>⚙️ Edit</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#fff' }}>{goalTitle}</h4>
                    <div style={{ background: 'rgba(255,255,255,0.1)', height: '20px', borderRadius: '10px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ background: 'var(--accent-primary)', width: `${Math.min(100, (goalCurrent / goalTarget) * 100)}%`, height: '100%', position: 'absolute', left: 0, top: 0, transition: 'width 0.3s' }}></div>
                      <span style={{ zIndex: 2, fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>{goalCurrent} / {goalTarget} ({Math.round((goalCurrent / goalTarget) * 100)}%)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Predictions Widget */}
              {isPredictionActive && (
                <div className="studio-card glass-panel" style={{ marginTop: '0' }}>
                  <div className="studio-card-header text-between">
                    <span className="flex-center gap-sm">
                      <span>🔮 Predictions Tracker</span>
                    </span>
                    <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', fontSize: '0.75rem' }}>⏱️ {predictionTimer}s</span>
                  </div>

                  <div style={{ padding: '12px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#fff' }}>{predictionQuestion}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {predictionOptions.map((opt, i) => {
                        const totalPoints = predictionOptions.reduce((acc, o) => acc + o.points, 0) || 1;
                        const percent = Math.round((opt.points / totalPoints) * 100);
                        return (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 10px' }}>
                            <div className="flex-between" style={{ marginBottom: '4px', fontSize: '0.8rem' }}>
                              <strong style={{ color: i === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>{opt.text}</strong>
                              <span style={{ color: 'var(--text-muted)' }}>{opt.votes} votes ({percent}%)</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              <span>Points:</span>
                              <strong>{opt.points} 🪙</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Pomodoro Timer / Sprint Widget */}
              <div className="studio-card glass-panel" style={{ marginTop: '0' }}>
                <div className="studio-card-header flex-between">
                  <span className="flex-center gap-sm">
                    <Clock size={14} color="var(--accent-primary)" />
                    <span>Study Sprinter</span>
                  </span>
                  {pomodoroActive && (
                    <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      ⏳ ACTIVE
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)', letterSpacing: '1px', fontFamily: 'monospace' }}>
                      {Math.floor(pomodoroSecondsLeft / 60).toString().padStart(2, '0')}:{(pomodoroSecondsLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px', textAlign: 'center', fontWeight: 'bold' }}>
                      {pomodoroType === 'work' ? '📚 Focus Sprint' : '🧸 Chat Break'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                    <button type="button" onClick={handleTogglePomodoro} className="btn-primary w-full" style={{ padding: '6px', fontSize: '0.8rem', background: pomodoroActive ? 'var(--accent-danger)' : 'var(--accent-primary)', cursor: 'pointer' }}>
                      {pomodoroActive ? 'Pause' : 'Start'}
                    </button>
                    <button type="button" onClick={() => handleResetPomodoro('work')} className="btn-secondary" style={{ padding: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                      📚 25m
                    </button>
                    <button type="button" onClick={() => handleResetPomodoro('break')} className="btn-secondary" style={{ padding: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                      🧸 5m
                    </button>
                  </div>
                </div>
              </div>

              {/* Co-Writing Manuscript Editor */}
              <div className="studio-card glass-panel" style={{ marginTop: '0' }}>
                <div className="studio-card-header flex-between">
                  <span>✍️ Manuscript Editor</span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(0, 229, 255, 0.15)', color: 'var(--accent-secondary)', padding: '1px 6px', borderRadius: '4px' }}>
                    WPM: {typingWpm}
                  </span>
                </div>
                <div style={{ padding: '12px' }}>
                  <textarea
                    value={creatorWritingText}
                    onChange={(e) => handleCreatorWritingChange(e.target.value)}
                    placeholder="Type notes or live manuscript messages to kids..."
                    rows={4}
                    style={{ width: '100%', padding: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', resize: 'none' }}
                  />
                </div>
              </div>

            </div>

            {/* Center Column: Broadcast Monitor Preview, Active Reader, Channel Polls */}
            <div className="studio-center-column">
              
              {/* Broadcast Monitor (Large Widescreen Preview centerpiece!) */}
              {visibleWidgets.monitor && (
                <div className="studio-card glass-panel">
                  <div className="studio-card-header text-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Radio size={16} color="var(--accent-primary)" />
                      <span style={{ fontWeight: 'bold' }}>Broadcast Monitor Preview</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,48,48,0.15)', color: '#ff4d4d', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      LIVE FEED
                    </span>
                  </div>
                  <div className="preview-video-container border-glow" style={{ width: '100%', height: 'auto', aspectRatio: '16/9', maxHeight: 'none', minHeight: '340px' }}>
                    
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

                    {broadcastSource === 'obs' ? (
                      !isObsConnected ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#11032a', color: '#ffde6a', padding: '20px', textAlign: 'center' }}>
                          <span style={{ fontSize: '2.5rem', animation: 'pulse 1.5s infinite', display: 'block', marginBottom: '8px' }}>📡</span>
                          <strong style={{ fontSize: '0.95rem' }}>Waiting for OBS Signal...</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Configure and Start Streaming in OBS.</span>
                          <button 
                            type="button"
                            onClick={async () => {
                              if (user) {
                                try {
                                  await updateDoc(doc(db, 'streams', user.uid), { isObsConnected: true });
                                  await updateDoc(doc(db, 'streams_kids', user.uid), { isObsConnected: true });
                                  setIsObsConnected(true);
                                  addEvent("OBS Encoder signal connected manually!", "🟢");
                                } catch(e) {}
                              }
                            }}
                            style={{ marginTop: '10px', background: 'var(--accent-secondary)', border: 'none', borderRadius: '4px', padding: '6px 12px', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            Simulate OBS Connect
                          </button>
                        </div>
                      ) : (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0b011d', color: '#fff', padding: '20px', textAlign: 'center', position: 'relative' }}>
                          <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎬</span>
                          <strong style={{ color: 'var(--accent-success)', fontSize: '1.05rem' }}>🟢 OBS Connected & Streaming</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Feed Resolution: 1920x1080 @ 60 FPS</span>
                          <button 
                            type="button"
                            onClick={async () => {
                              if (user) {
                                try {
                                  await updateDoc(doc(db, 'streams', user.uid), { isObsConnected: false });
                                  await updateDoc(doc(db, 'streams_kids', user.uid), { isObsConnected: false });
                                  setIsObsConnected(false);
                                  addEvent("OBS Encoder signal disconnected.", "🔴");
                                } catch(e) {}
                              }
                            }}
                            style={{ marginTop: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer' }}
                          >
                            Simulate OBS Disconnect
                          </button>
                        </div>
                      )
                    ) : performanceMode ? (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '16px', textAlign: 'center' }}>
                        <span>📷 Camera Feed Active</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>Video preview hidden to maximize streaming CPU performance.</span>
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
                        <h3 style={{ margin: '0 0 2px 0', fontSize: '1.2rem' }}>{streamTitle}</h3>
                        <p className="card-sub">Category: <strong>{streamGenre}</strong> | Book: <strong>{selectedBook.title}</strong></p>
                      </div>
                      <button onClick={() => setShowEditInfo(true)} className="btn-edit-info" title="Edit Stream Info">⚙️ Edit Stream Info</button>
                    </div>
                    <button onClick={handleEndStream} className="btn-danger w-full flex-center gap-sm" style={{ marginTop: '12px', padding: '10px' }}>
                      <Square size={14} />
                      <span>End Stream & Disconnect Feed</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Synced Reader Page Control */}
              {visibleWidgets.reader && (
                <div className="studio-card glass-panel streamer-reader-card">
                  <div className="studio-card-header text-between">
                    <span className="flex-center gap-sm">
                      <BookOpen size={16} color="var(--accent-secondary)" />
                      <span>Active Storybook Pages (Viewer Sync Panel)</span>
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
                      <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{selectedBook.title}</h3>
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

                  <div className="studio-page-content scrollbar-paper" style={{ maxHeight: '350px', overflowY: 'auto' }}>
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

              {/* Live Channel Poll */}
              {visibleWidgets.polls && (
                <div className="studio-card glass-panel">
                  <div className="studio-card-header text-between">
                    <span className="flex-center gap-sm">
                      <span>📊 Interactive Viewer Poll</span>
                    </span>
                    {isPollActive && (
                      <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', fontSize: '0.8rem' }}>⏱️ {pollTimer}s left</span>
                    )}
                  </div>
                  
                  <div style={{ padding: '16px' }}>
                    {!isPollActive ? (
                      <div className="poll-setup-form">
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Poll Question</label>
                        <input 
                          type="text" 
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                          placeholder="e.g., Should we spare the dragon?"
                          style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff', marginBottom: '12px' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <input 
                            type="text" 
                            value={pollOptions[0].text}
                            onChange={(e) => setPollOptions([{ ...pollOptions[0], text: e.target.value }, pollOptions[1]])}
                            placeholder="Option 1"
                            style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                          />
                          <input 
                            type="text" 
                            value={pollOptions[1].text}
                            onChange={(e) => setPollOptions([pollOptions[0], { ...pollOptions[1], text: e.target.value }])}
                            placeholder="Option 2"
                            style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => { setIsPollActive(true); setPollTimer(30); setPollOptions(pollOptions.map(o => ({ ...o, votes: 0 }))); addEvent(`Poll started: ${pollQuestion}`, "📊"); playAlertSound('mod'); }}
                          className="btn-primary" 
                          style={{ marginTop: '12px', background: 'var(--accent-secondary)', width: '100%' }}
                        >
                          Start 30-Second Poll
                        </button>
                      </div>
                    ) : (
                      <div className="poll-active-view">
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>{pollQuestion}</h4>
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

            </div>

            {/* Right Column: Quick Actions & Live Chat Moderation */}
            <div className="studio-right-column">
              
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
                  
                  <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '12px' }}>
                    {renderQuickActions()}
                  </div>

                  {/* Announcement overlay input */}
                  {showAnnouncementInput && (
                    <form onSubmit={handleSendAnnouncement} className="announcement-inline-form" style={{ padding: '0 12px 12px 12px' }}>
                      <input 
                        type="text" 
                        placeholder="Type announcement message..." 
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        required
                        autoFocus
                        style={{ width: '100%', padding: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff', fontSize: '0.8rem' }}
                      />
                      <button type="submit" className="btn-primary w-full" style={{ marginTop: '6px', padding: '6px', fontSize: '0.8rem' }}>Send Announcement</button>
                    </form>
                  )}
                </div>
              )}

              {/* Chat Moderation widget */}
              {visibleWidgets.chat && (
                <div className={`studio-card glass-panel studio-chat-card ${shieldModeActive ? 'shield-active' : ''}`} style={{ flex: 1, minHeight: '400px' }}>
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

                  <div className="studio-chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                    {chatMessages.length === 0 ? (
                      <p className="no-chat font-bold">Chat feed is silent.</p>
                    ) : (
                      chatMessages.map((msg) => {
                        const isBanned = bannedUsers.includes(msg.username);
                        const isTimedOut = timedOutUsers[msg.username] > Date.now();
                        
                        return (
                          <div key={msg.id} className={`studio-chat-msg ${msg.type === 'announcement' ? 'announcement-msg' : ''}`} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <div className="msg-row-top flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span 
                                className="msg-user chat-user-clickable font-bold" 
                                onClick={(e) => handleUserClick(msg.username, e)}
                                style={{ 
                                  color: moderators.includes(msg.username) ? 'var(--accent-success)' : 'var(--accent-secondary)',
                                  textDecoration: isBanned ? 'line-through' : 'none',
                                  opacity: isTimedOut ? 0.5 : 1,
                                  cursor: 'pointer',
                                  fontSize: '0.85rem'
                                }}
                              >
                                {moderators.includes(msg.username) ? '🛡️ ' : ''}{msg.username}
                              </span>
                              <div className="moderator-actions" style={{ display: 'flex', gap: '4px' }}>
                                <button 
                                  type="button"
                                  onClick={() => handlePinMessage(msg.text, msg.id)}
                                  className={`btn-mod-action ${pinnedMessageId === msg.id ? 'pinned' : ''}`}
                                  title="Pin Message"
                                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}
                                >
                                  <Pin size={10} fill={pinnedMessageId === msg.id ? "currentColor" : "none"} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="btn-mod-action delete-action"
                                  title="Delete Message"
                                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', opacity: 0.6 }}
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                            <span className="msg-body" style={{ opacity: isBanned || isTimedOut ? 0.4 : 1, fontStyle: isTimedOut ? 'italic' : 'normal', fontSize: '0.85rem', color: '#eee', display: 'block', wordBreak: 'break-word' }}>
                              {isBanned ? '[Message deleted - User Banned]' : isTimedOut ? '[Message deleted - User Timed Out]' : msg.text}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
          </>
        )}

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
                { id: 'automod', label: 'Auto-Mod Spam Filter' },
                { id: 'clip', label: '🎬 Clip That (Highlight)' },
                { id: 'marker', label: '📍 Add Stream Marker' },
                { id: 'slow', label: '⏱️ Slow Mode (Chat Delay)' },
                { id: 'sub', label: '🔒 Subscribers-Only Mode' },
                { id: 'goals', label: '🎯 Community Goals Tracker' },
                { id: 'prediction', label: '🔮 Predictions Manager' },
                { id: 'watchparty', label: '🍿 Watch Party Simulation' }
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
      {/* Setup Community Goal Modal */}
      {showGoalsConfig && (
        <div className="studio-modal-overlay flex-center" onClick={() => setShowGoalsConfig(false)}>
          <div className="studio-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Setup Community Goal</h2>
            <div className="dashboard-form" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Goal Description</label>
                <input 
                  type="text" 
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Follower Milestone"
                />
              </div>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Current Count</label>
                  <input 
                    type="number" 
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Target Count</label>
                  <input 
                    type="number" 
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              <div className="flex-between" style={{ marginTop: '20px' }}>
                <button type="button" onClick={() => { setGoalActive(false); setShowGoalsConfig(false); }} className="btn-danger">Disable Goal</button>
                <button type="button" onClick={() => { setGoalActive(true); setShowGoalsConfig(false); addEvent(`Goal set: ${goalTitle}`, "🎯"); }} className="btn-primary">Activate Goal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Live Prediction Modal */}
      {showPredictionConfig && (
        <div className="studio-modal-overlay flex-center" onClick={() => setShowPredictionConfig(false)}>
          <div className="studio-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Start Live Prediction</h2>
            <div className="dashboard-form" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Prediction Question</label>
                <input 
                  type="text" 
                  value={predictionQuestion}
                  onChange={(e) => setPredictionQuestion(e.target.value)}
                  placeholder="e.g. Will Bobby guess the riddle?"
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  value={predictionOptions[0].text}
                  onChange={(e) => setPredictionOptions([{ ...predictionOptions[0], text: e.target.value }, predictionOptions[1]])}
                  placeholder="Option 1"
                  style={{ flex: 1, padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                />
                <input 
                  type="text" 
                  value={predictionOptions[1].text}
                  onChange={(e) => setPredictionOptions([predictionOptions[0], { ...predictionOptions[1], text: e.target.value }])}
                  placeholder="Option 2"
                  style={{ flex: 1, padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', color: '#fff' }}
                />
              </div>
              <div className="flex-center">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsPredictionActive(true);
                    setPredictionTimer(60);
                    setPredictionOptions(predictionOptions.map(o => ({ ...o, votes: 0, points: 0 })));
                    setShowPredictionConfig(false);
                    addEvent(`Prediction started: ${predictionQuestion}`, "🔮");
                    playAlertSound('mod');
                  }} 
                  className="btn-primary w-full"
                >
                  Start 60-Second Prediction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
