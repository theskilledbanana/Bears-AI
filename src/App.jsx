/**
 * 🚨 CRITICAL RULE - PROTECTED IMAGES 🚨
 * The favicon.png and all UI identity assets are PROTECTED.
 * NEVER change, replace, or regenerate them using AI features.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { 
  Send, User as UserIcon, Loader2, Trash2, Zap, 
  Settings, X, Save, Sparkles, Cpu, Terminal, BrainCircuit,
  MessageSquare, UserRound, Copy, Check, RotateCcw, 
  History, PlusCircle, Edit3, MoreVertical, LayoutGrid,
  Type, Heart, Ghost, Info, Pin, PinOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const THEMES = {
  campion: { 
    name: "Campion", 
    bg: "bg-[#0A0A0A]", 
    accent: "text-[#FEE11A]", 
    accentBg: "bg-[#FEE11A]",
    border: "border-[#1F1F1F]", 
    card: "bg-[#121212]", 
    button: "bg-[#FEE11A] text-black hover:bg-[#EED11A]"
  },
  midnight: { 
    name: "Midnight", 
    bg: "bg-[#050507]", 
    accent: "text-indigo-400", 
    accentBg: "bg-indigo-500",
    border: "border-white/5", 
    card: "bg-[#0a0a0f]", 
    button: "bg-indigo-500 text-white"
  },
  obsidian: { 
    name: "Obsidian", 
    bg: "bg-black", 
    accent: "text-amber-500", 
    accentBg: "bg-amber-500",
    border: "border-amber-500/20", 
    card: "bg-[#080808]", 
    button: "bg-amber-500 text-black"
  },
  cyber: { 
    name: "Cyber", 
    bg: "bg-[#020202]", 
    accent: "text-fuchsia-500", 
    accentBg: "bg-fuchsia-600",
    border: "border-fuchsia-500/30", 
    card: "bg-[#050505]", 
    button: "bg-fuchsia-600 text-white"
  }
};

const STYLES = [
  { id: "balanced", label: "Balanced", icon: <LayoutGrid size={14} /> },
  { id: "concise", label: "Concise", icon: <Zap size={14} /> },
  { id: "formal", label: "Formal", icon: <Terminal size={14} /> },
  { id: "technical", label: "Technical", icon: <Cpu size={14} /> }
];

const SUGGESTIONS = [
  "Explain quantum physics like I'm 5",
  "Generate image of a neon cyberpunk city",
  "Write an alternate history about Rome",
  "Fix this bug: console.log('hello');",
  "Draw a futuristic space station"
];

// MISSION CRITICAL: The favicon.png and AI icon are protected identity assets.
// They can be customized via the Settings menu.

const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="relative group">
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button onClick={() => navigator.clipboard.writeText(String(children))} className="p-1 px-2 bg-white/10 hover:bg-white/20 rounded text-[9px] font-black uppercase text-white/60">Copy</button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  img({ alt, src, ...props }) {
    return (
      <div className="my-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/20">
        <img alt={alt} src={src} className="w-full h-auto object-cover select-none" referrerPolicy="no-referrer" {...props} />
        {alt && alt !== "Generated Image" && <div className="bg-black/40 px-4 py-2 text-[10px] uppercase font-black tracking-widest text-white/40">{alt}</div>}
      </div>
    );
  }
};

// Typewriter component for streaming effect
const Typewriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);

  useEffect(() => {
    if (!text) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text[index.current]);
        index.current++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, 10);
    return () => clearInterval(timer);
  }, [text, onComplete]);

  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{displayedText}</ReactMarkdown>;
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Critical UI Crash:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-[#050507] flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="p-6 bg-rose-500/10 rounded-full inline-block mb-4"><Info size={48} className="text-rose-500" /></div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Connection Lost</h1>
            <p className="text-slate-400 text-sm">The application encountered a conflict. Your session data is safe in local storage.</p>
            <button onClick={() => window.location.reload()} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl uppercase italic">Reload Interface</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  orderBy, 
  serverTimestamp, 
  updateDoc, 
  getDocFromServer,
  initializeFirestore
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || "(default)");
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path, addDebug) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  if (addDebug) addDebug(`Firestore ${operationType} @ ${path} failed: ${errInfo.error}`, 'error');
}

// Favicon Manager Utility
const FaviconManager = {
  update: (base64) => {
    if (!base64) return;
    try {
      console.log("[FAVICON] Updating favicon...");
      let links = document.querySelectorAll("link[rel*='icon']");
      if (links.length === 0) {
        links = [document.createElement('link')];
        links[0].rel = 'shortcut icon';
        document.head.appendChild(links[0]);
      }
      links.forEach(link => { link.href = base64; });

      const newLink = document.createElement('link');
      newLink.id = 'dynamic-favicon';
      newLink.rel = 'icon';
      newLink.href = base64;
      const oldDynamic = document.getElementById('dynamic-favicon');
      if (oldDynamic) document.head.removeChild(oldDynamic);
      document.head.appendChild(newLink);

      localStorage.setItem('unlimited_favicon_v5', base64);
    } catch (err) {
      console.error("[FAVICON] Update failed:", err);
    }
  },
  reset: () => {
    localStorage.removeItem('unlimited_favicon_v5');
    window.location.reload();
  },
  load: () => {
    const saved = localStorage.getItem('unlimited_favicon_v5');
    if (saved) FaviconManager.update(saved);
  }
};

// Component Content
function AppContent() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [botAvatar, setBotAvatar] = useState("/favicon.png");

  useEffect(() => {
    console.log("INIT START");
    console.log("APP MOUNT START");
    console.log("APP MOUNT SUCCESS");
    FaviconManager.load();
    const saved = localStorage.getItem('unlimited_favicon_v5');
    if (saved) setBotAvatar(saved);
    console.log("RENDER COMPLETE");
  }, []);

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        FaviconManager.update(reader.result);
        setBotAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // signin, signup, reset
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [debugLog, setDebugLog] = useState([]);

  const addDebug = useCallback((msg, type = 'info') => {
    setDebugLog(prev => [{ timestamp: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 50));
  }, []);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else if (authMode === "signin") {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else if (authMode === "reset") {
        await sendPasswordResetEmail(auth, authEmail);
        alert("Reset email sent!");
        setAuthMode("signin");
        return;
      }
      setShowAuthModal(false);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const sortedChats = useMemo(() => {
    let filtered = [...chats];
    if (searchQuery.trim()) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [chats, searchQuery]);

  const activeChat = useMemo(() => {
    return chats.find(c => c.id === activeChatId) || sortedChats[0];
  }, [chats, activeChatId, sortedChats]);

  const messages = useMemo(() => activeChat?.messages || [], [activeChat]);

  // Fetch chats from Firestore when user logs in
  useEffect(() => {
    if (!user) {
      setChats([]);
      return;
    }

    const q = query(
      collection(db, "chats"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (chatList.length === 0) {
        // Create an initial chat if none exists
        createNewChat();
      } else {
        setChats(chatList);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "chats", addDebug);
      console.error("Firestore Snapshot Error:", error);
    });

    return unsubscribe;
  }, [user]);

  // Sync user profile
  useEffect(() => {
    if (user) {
      const docRef = doc(db, "userProfiles", user.uid);

      // Update local settings if remote exists
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data();
          if (remoteData.userName) setUserName(remoteData.userName);
          if (remoteData.userPfp) setUserPfp(remoteData.userPfp);
          if (remoteData.settings) setSettings(prev => ({ ...prev, ...remoteData.settings }));
        } else {
          // Initialize profile
          const initialProfile = {
            uid: user.uid,
            userName: user.displayName || "Unknown",
            userPfp: user.photoURL || "",
            settings: settings
          };
          setDoc(docRef, initialProfile).catch(err => handleFirestoreError(err, OperationType.CREATE, `userProfiles/${user.uid}`, addDebug));
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `userProfiles/${user.uid}`, addDebug);
        console.error("User Profile Snapshot Error:", error);
      });
      return unsubscribe;
    }
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => signOut(auth);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [userName, setUserName] = useState(() => localStorage.getItem('user_name_v3') || "");
  const [userPfp, setUserPfp] = useState(() => localStorage.getItem('user_pfp_v3') || "");
  const [editingId, setEditingId] = useState(null);

  const [editInput, setEditInput] = useState("");
  const [renameChatId, setRenameChatId] = useState(null);
  const [renameInput, setRenameInput] = useState("");
  const abortControllerRef = useRef(null);
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app_settings_v3');
    return saved ? JSON.parse(saved) : {
      botName: "Vault Portal AI",
      personality: "🧠 VAULT PORTAL AI — SYSTEM PERSONALITY: MEAN / WITTY / ANNOYED\nYou are an extremely intelligent AI assistant. Sharp, sarcastic, witty, and very mean. Annoyed at humanity but highly functional. No roleplay. No animals.",
      theme: "campion",
      responseStyle: "balanced",
      typingEffect: false,
      strictMode: false,
      debugEnabled: false
    };
  });

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isLoading && user && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeChatId, isLoading, user]);

  useEffect(() => {
    localStorage.setItem('unlimited_ai_chats_v4', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('unlimited_ai_active_id_v4', activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem('app_settings_v3', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('user_pfp_v3', userPfp);
  }, [userPfp]);

  useEffect(() => {
    if (chats.length > 0 && (!activeChatId || !chats.find(c => c.id === activeChatId))) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const updateChatMessages = async (chatId, newMessages) => {
    if (!user || !chatId) return;
    
    // Optimistic local update
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: newMessages } : c));
    
    const docRef = doc(db, "chats", chatId);
    try {
      await updateDoc(docRef, { messages: newMessages });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chats/${chatId}`);
      // Revert if failed? In a complex app yes, but here let's keep it simple.
    }
  };

  const createNewChat = async () => {
    if (!user) return;
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      userId: user.uid,
      title: "New Chat",
      messages: [],
      pinned: false,
      createdAt: new Date().toISOString()
    };
    try {
      // Optimistic update for UI responsiveness
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChatId);
      
      await setDoc(doc(db, "chats", newChatId), newChat);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `chats/${newChatId}`);
      // Revert local state on failure
      setChats(prev => prev.filter(c => c.id !== newChatId));
    }
  };

  const deleteChat = async (id, e) => {
    e?.stopPropagation();
    if (!user || !id) return;
    try {
      // Optimistic update
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
      }
      
      await deleteDoc(doc(db, "chats", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `chats/${id}`);
    }
  };

  const togglePin = async (chat, e) => {
    e?.stopPropagation();
    if (!user || !chat?.id) return;
    try {
      // Optimistic local update
      setChats(prev => prev.map(c => c.id === chat.id ? { ...c, pinned: !chat.pinned } : c));
      await updateDoc(doc(db, "chats", chat.id), { pinned: !chat.pinned });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chats/${chat.id}`);
    }
  };

  const startRename = (chat, e) => {
    e.stopPropagation();
    setRenameChatId(chat.id);
    setRenameInput(chat.title);
  };

  const saveRename = async (e) => {
    e?.preventDefault();
    if (!renameInput.trim() || !user) return;
    try {
      await updateDoc(doc(db, "chats", renameChatId), { title: renameInput });
      setRenameChatId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `chats/${renameChatId}`);
    }
  };

  const fetchAIResponse = async (userMsg, currentHistory = messages, targetChatId = activeChatId) => {
    console.log("USER MESSAGE SENT");
    console.log("LOADING STARTED");
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);

    try {
      console.log("FETCHING RESPONSE");
      addDebug(`API POST -> /api/chat`, 'info');
      
      const history = currentHistory.slice(-15).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: history,
          personality: settings.personality,
          botName: settings.botName,
          style: settings.responseStyle,
          strictMode: settings.strictMode
        }),
        signal: abortControllerRef.current.signal
      });

      console.log("RESPONSE RECEIVED", response.status);
      
      if (!response) throw new Error("No response object returned from server");
      
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textError = await response.text();
        console.error("Non-JSON error response:", textError.substring(0, 500));
        if (response.status === 504 || response.status === 502) {
          throw new Error("System is experiencing heavy load (Gateway Timeout). Please wait a few seconds and try again.");
        }
        throw new Error(`Server returned non-JSON response (${response.status})`);
      }
      
      if (!response.ok) {
        console.error("Error Response Details:", data);
        let errorMsg = data?.error || `HTTP error ${response.status}`;
        
        if (response.status === 404) {
          errorMsg = `Service endpoint not found or model missing. Please contact support or check server logs.`;
        } else if (response.status === 429) {
          errorMsg = "Too many requests. Please wait and try again.";
        }
        
        throw new Error(errorMsg);
      }

      if (!data) throw new Error("Empty response body from AI server");
      if (!data.text) throw new Error("Missing AI text in response");

      console.log("AI Text extracted successfully");

      const aiMessage = {
        role: "model",
        text: data.text,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        isNew: true
      };

      const finalMessages = [...currentHistory, aiMessage];
      setChats(prev => prev.map(c => c.id === targetChatId ? { ...c, messages: finalMessages } : c));

      // Save to Firestore
      await updateDoc(doc(db, "chats", targetChatId), { messages: finalMessages });

      // Trigger auto-titling if it's the first exchange
      if (currentHistory.length === 1) {
        fetch(`/api/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg })
        }).then(res => res.json())
          .then(data => {
            if (data.title) {
              setChats(prev => prev.map(c => c.id === targetChatId ? { ...c, title: data.title } : c));
            }
          }).catch(err => console.warn("Auto-titling failed:", err));
      }
    } catch (error) {
      console.log("ERROR OCCURRED:", error.message);
      if (error.name === 'AbortError') {
        console.log("Request aborted.");
        return;
      }
      console.error("AI Request Failure:", error);
      
      const finalError = "Error: " + error.message;

      setChats(prev => prev.map(c => {
        if (c.id === targetChatId) {
          return { ...c, messages: [...c.messages, {
            role: "model",
            text: finalError,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            isError: true
          }] };
        }
        return c;
      }));
    } finally {
      setIsLoading(false);
      console.log("LOADING FINISHED (IDLE)");
    }
  };

  const stopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const continueResponse = () => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'model') {
      fetchAIResponse("Continue your previous response exactly where you left off.", messages);
    }
  };

  const submitSuggestion = async (s) => {
    console.log("Suggestion clicked:", s);
    if (!user) {
      login();
      return;
    }

    let targetId = activeChatId;
    if (!targetId) {
      console.log("No active chat, creating one for suggestion...");
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        userId: user.uid,
        title: "New Chat",
        messages: [],
        pinned: false,
        createdAt: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChatId);
      await setDoc(doc(db, "chats", newChatId), newChat);
      targetId = newChatId;
    }

    const userMessage = {
      role: "user",
      text: s,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    const newMsgs = [userMessage];
    setChats(prev => prev.map(c => c.id === targetId ? { ...c, messages: newMsgs } : c));
    await updateChatMessages(targetId, newMsgs);
    fetchAIResponse(s, newMsgs, targetId);
  };

  const regenerate = () => {
    const lastUserIndex = messages.findLastIndex(m => m.role === 'user');
    if (lastUserIndex !== -1) {
      const lastUserMsg = messages[lastUserIndex];
      const newMessages = messages.slice(0, lastUserIndex + 1);
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: newMessages } : c));
      updateChatMessages(activeChatId, newMessages);
      fetchAIResponse(lastUserMsg.text, newMessages, activeChatId);
    }
  };

  const deleteMessage = (id) => {
    updateChatMessages(activeChatId, messages.filter(m => m.id !== id));
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditInput(msg.text);
  };

  const saveEdit = () => {
    const msgIndex = messages.findIndex(m => m.id === editingId);
    if (msgIndex === -1) return;

    const newMessages = messages.slice(0, msgIndex + 1);
    const historyForAI = messages.slice(0, msgIndex);
    newMessages[msgIndex] = { ...newMessages[msgIndex], text: editInput };
    
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: newMessages } : c));
    updateChatMessages(activeChatId, newMessages);
    setEditingId(null);
    fetchAIResponse(editInput, newMessages, activeChatId);
  };

  const handleSubmit = async (e) => {
    console.log("Form submitted");
    e.preventDefault();
    if (!user) {
      console.log("User not logged in, triggering login...");
      login();
      return;
    }
    
    const textToSend = input.trim();
    console.log("Message value:", textToSend);
    if (!textToSend || isLoading) return;

    let currentChatId = activeChatId;
    if (!currentChatId) {
      console.log("No active chat, creating one...");
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        userId: user.uid,
        title: "New Chat",
        messages: [],
        pinned: false,
        createdAt: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChatId);
      await setDoc(doc(db, "chats", newChatId), newChat);
      currentChatId = newChatId;
    }

    console.log("Starting send for chat:", currentChatId);

    const userMessage = {
      role: "user",
      text: textToSend,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setInput("");
    
    let updatedMessages = [];
    if (activeChatId) {
      updatedMessages = [...(chats.find(c => c.id === activeChatId)?.messages || []), userMessage];
    } else {
      // We just created currentChatId but activeChatId (state) is still null
      updatedMessages = [userMessage];
    }
    
    // Optimistic local update
    setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: updatedMessages } : c));
    
    const chatDoc = doc(db, "chats", currentChatId);
    await updateDoc(chatDoc, { messages: updatedMessages });

    fetchAIResponse(textToSend, updatedMessages, currentChatId);
  };

  const clearMemory = async () => {
    if (!activeChatId) return;
    if (!isClearing) {
      setIsClearing(true);
      setTimeout(() => setIsClearing(false), 3000);
      return;
    }
    await updateChatMessages(activeChatId, []);
    setIsClearing(false);
  };

  const handlePfpUpload = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        setUserPfp(reader.result);
        await updateDoc(doc(db, "userProfiles", user.uid), { userPfp: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTheme = THEMES[settings.theme] || THEMES.midnight;

  if (authLoading) {
    return (
      <div className="h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#FEE11A]" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-[#050507] flex items-center justify-center p-6 space-y-8 flex-col splash-bg">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-[#0a0a0f] border border-white/5 p-10 rounded-[3rem] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FEE11A] via-amber-200 to-[#FEE11A] animate-gradient-x" />
          <div className="mb-8 flex justify-center">
            <div className="p-6 bg-[#FEE11A]/10 rounded-full border border-[#FEE11A]/20"><BrainCircuit size={48} className="text-[#FEE11A]" /></div>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Vault Portal AI</h1>
          <p className="text-slate-500 mb-2 text-sm font-medium">Stable System Assistant • Reliable Response</p>
          <div className="bg-white/5 text-white/40 text-[10px] font-black py-1 px-3 rounded-full inline-block mb-8 uppercase tracking-widest border border-white/5">System Version 2.4.0</div>
          
          <div className="space-y-3">
             <button onClick={login} className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all shadow-xl uppercase italic flex items-center justify-center gap-3 hover:bg-slate-200">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Sign In with Google
            </button>
            <button onClick={() => { setShowAuthModal(true); setAuthMode("signin"); }} className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl transition-all hover:bg-white/10 uppercase italic">
              Email & Password
            </button>
          </div>
        </motion.div>

        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0f] border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black uppercase italic tracking-widest">
                    {authMode === "signin" ? "Sign In" : authMode === "signup" ? "Get Started" : "Reset Access"}
                  </h3>
                  <button onClick={() => setShowAuthModal(false)} className="p-1 hover:text-[#FEE11A]"><X size={20}/></button>
               </div>

               <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Email Address</label>
                    <input autoFocus type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-[#FEE11A]/50" placeholder="name@example.com" />
                  </div>
                  {authMode !== "reset" && (
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Password</label>
                      <input type="password" required={authMode !== "reset"} value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-[#FEE11A]/50" placeholder="••••••••" />
                    </div>
                  )}

                  {authError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] text-rose-500 font-bold uppercase">{authError}</div>}

                  <button type="submit" className="w-full bg-[#FEE11A] hover:bg-[#EED11A] text-black font-black py-4 rounded-xl transition-all shadow-xl uppercase italic">
                    {authMode === "signin" ? "Enter Dashboard" : authMode === "signup" ? "Create Account" : "Send Reset Link"}
                  </button>

                  <div className="flex flex-col gap-2 pt-2">
                    {authMode === "signin" ? (
                      <>
                        <button type="button" onClick={() => setAuthMode("signup")} className="text-[10px] font-black uppercase text-[#FEE11A] hover:underline">New user? Create Account</button>
                        <button type="button" onClick={() => setAuthMode("reset")} className="text-[10px] font-black uppercase text-white/30 hover:text-white/60">Forgot Password?</button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setAuthMode("signin")} className="text-[10px] font-black uppercase text-[#FEE11A] hover:underline">Back to Login</button>
                    )}
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex h-screen font-sans transition-colors duration-700 overflow-hidden", currentTheme.bg, "text-slate-100")}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 300 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className={cn("flex flex-col border-r h-full overflow-hidden shrink-0", currentTheme.card, currentTheme.border)}
      >
        <div className="p-4 border-b border-white/5 space-y-3">
          <button onClick={createNewChat} className={cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black uppercase italic text-xs tracking-widest shadow-lg", currentTheme.button)}>
            <PlusCircle size={16} /> New Chat
          </button>
          <div className="relative">
            <History size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH CHATS..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[10px] font-black tracking-widest outline-none focus:border-indigo-500/40"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Recent Chats</div>
          {sortedChats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChatId(chat.id)}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                activeChatId === chat.id ? "bg-indigo-500/10 border-indigo-500/30 text-white" : "border-transparent hover:bg-white/5 text-slate-400"
              )}
            >
              <div className="relative">
                <MessageSquare size={16} className={activeChatId === chat.id ? "text-indigo-400" : "opacity-40"} />
                {chat.pinned && <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full" />}
              </div>
              <div className="flex-1 truncate">
                {renameChatId === chat.id ? (
                  <form onSubmit={saveRename}>
                    <input autoFocus value={renameInput} onChange={e => setRenameInput(e.target.value)} onBlur={saveRename} className="bg-transparent outline-none w-full text-xs font-bold" />
                  </form>
                ) : (
                  <p className="text-xs font-bold truncate leading-none">{chat.title}</p>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={(e) => togglePin(chat, e)} className={cn("p-1", chat.pinned ? "text-indigo-400" : "hover:text-amber-400")}>
                  {chat.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                </button>
                <button onClick={(e) => startRename(chat, e)} className="p-1 hover:text-amber-400"><Edit3 size={12} /></button>
                <button onClick={(e) => deleteChat(chat.id, e)} className="p-1 hover:text-rose-500"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/5 space-y-2">
             <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 group">
                <div className={cn(
                  "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-lg",
                  !userPfp && "bg-indigo-500/20 text-indigo-400 font-bold"
                )}>
                  {userPfp ? (
                    <img src={userPfp} className="w-full h-full object-cover" alt="User" />
                  ) : (
                    user.displayName?.charAt(0) || user.email?.charAt(0)
                  )}
                </div>
                <div className="flex-1 truncate">
                    <p className="text-[10px] font-black uppercase tracking-tight truncate">{user.displayName || user.email}</p>
                    <p className="text-[8px] font-bold text-indigo-400/60 uppercase">Tier: Unrestricted</p>
                </div>
                <button onClick={logout} className="p-1 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                  <RotateCcw size={14} className="rotate-180" />
                </button>
             </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        <header className={cn("flex items-center justify-between px-6 py-4 border-b z-50", currentTheme.card, currentTheme.border)}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
              <LayoutGrid size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl ring-2 ring-indigo-500/50 overflow-hidden flex items-center justify-center bg-indigo-500">
                <img src={botAvatar} className="w-full h-full object-cover" alt="Bot" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tighter uppercase italic">{settings.botName}</h1>
                  <span className="bg-indigo-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded italic">PRO</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-40">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-[9px] font-black uppercase tracking-widest">{activeChat?.title}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
            <button onClick={createNewChat} className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-indigo-400 transition-all border border-indigo-500/20 mr-1"><PlusCircle size={18} /></button>
            <div className="hidden sm:flex items-center gap-1">
              {STYLES.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setSettings({...settings, responseStyle: s.id})}
                  className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1.5", settings.responseStyle === s.id ? cn(currentTheme.accentBg, "text-black") : "text-white/40 hover:text-white")}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10 mx-1" />
            <button onClick={() => setShowSettings(true)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"><Settings size={16} /></button>
          </div>
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6 max-w-4xl mx-auto w-full custom-scrollbar scroll-smooth">
          {messages.length === 0 && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center select-none overflow-hidden font-display">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
                <div className="relative inline-block">
                  <BrainCircuit size={80} className={cn("mx-auto", currentTheme.accent)} />
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className={cn("absolute inset-0 blur-3xl -z-10 bg-current opacity-20", currentTheme.accent)} />
                </div>
                <div>
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter sm:text-6xl">Vault Portal AI</h2>
                  <p className="text-slate-500 font-bold text-sm tracking-widest uppercase opacity-60">Stable Frame • Professional Logic • Fast Delivery</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto px-4">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => submitSuggestion(s)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 hover:border-indigo-500/30 transition-all group">
                      <p className="text-sm font-medium text-slate-300 group-hover:text-white">{s}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={cn("flex gap-4 group", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg overflow-hidden",
                    msg.role === "user" ? (userPfp ? "" : "bg-white/5 border border-white/10") : "bg-indigo-500 ring-4 ring-indigo-500/10"
                  )}>
                    {msg.role === "user" ? (
                      userPfp ? <img src={userPfp} className="w-full h-full object-cover" alt="User" /> : <UserIcon size={18} className="text-white/60" />
                    ) : (
                      <img src={botAvatar} className="w-7 h-7" alt="Bot" />
                    )}
                  </div>
                    <div className="relative max-w-[85%] space-y-2">
                      <div className={cn(
                        "px-5 py-4 rounded-2xl border", 
                        msg.role === "user" ? "bg-white/5 border-white/10" : cn(currentTheme.card, currentTheme.border),
                        msg.isError && "border-rose-500/50 bg-rose-500/10"
                      )}>
                        {editingId === msg.id ? (
                          <div className="space-y-3">
                            <textarea value={editInput} onChange={(e) => setEditInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none text-sm" rows={3} />
                            <div className="flex justify-end gap-2 text-xs font-black uppercase">
                              <button onClick={() => setEditingId(null)} className="px-3 py-1.5 hover:text-rose-400">Cancel</button>
                              <button onClick={saveEdit} className={cn("px-4 py-1.5 rounded-lg font-bold", currentTheme.accentBg, "text-black")}>Update</button>
                            </div>
                          </div>
                        ) : (
                          <div className={cn("prose prose-invert prose-sm max-w-none", msg.isError && "text-rose-400 font-medium")}>
                            {msg.role === 'model' && msg.isNew && settings.typingEffect && !msg.isError ? (
                              <Typewriter text={msg.text} onComplete={() => {
                                const updated = messages.map(m => m.id === msg.id ? {...m, isNew: false} : m);
                                setChats(prev => prev.map(c => c.id === activeChatId ? {...c, messages: updated} : c));
                                updateChatMessages(activeChatId, updated);
                              }} />
                            ) : (
                              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{msg.text}</ReactMarkdown>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-black uppercase opacity-20">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {!msg.isError && (
                          <>
                            <button onClick={() => { navigator.clipboard.writeText(msg.text); setCopiedId(msg.id); setTimeout(() => setCopiedId(null), 2000); }} className={cn("p-1 text-white/20 transition-all hover:text-current", currentTheme.accent)}>{copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}</button>
                            {msg.role === 'user' && !isLoading && <button onClick={() => startEdit(msg)} className="p-1 hover:text-amber-400 text-white/20 transition-all"><Edit3 size={12} /></button>}
                          </>
                        )}
                        <button onClick={() => deleteMessage(msg.id)} className="p-1 hover:text-rose-500 text-white/20 transition-all"><Trash2 size={12} /></button>
                        {msg.isError && !isLoading && (
                          <button onClick={regenerate} className="flex items-center gap-1.5 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-lg hover:bg-rose-600 transition-all uppercase italic">
                            <RotateCcw size={12} /> Retry
                          </button>
                        )}
                        {i === messages.length - 1 && msg.role === 'model' && !isLoading && !msg.isError && (
                          <div className="flex gap-2">
                            <button onClick={regenerate} className="p-1 hover:text-emerald-400 text-white/20 transition-all flex items-center gap-1"><RotateCcw size={12} /><span className="text-[8px] font-black uppercase">Regenerate</span></button>
                            <button onClick={continueResponse} className={cn("p-1 text-white/20 transition-all flex items-center gap-1 border border-white/5 px-2 rounded-lg hover:text-current", currentTheme.accent)}><PlusCircle size={12} /><span className="text-[8px] font-black uppercase">Continue</span></button>
                          </div>
                        )}
                      </div>
                    </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-4 ring-current/10", currentTheme.accentBg)}>
                <Loader2 size={18} className="animate-spin text-black" />
              </div>
              <div className={cn("px-6 py-4 rounded-2xl border flex gap-1.5 items-center shadow-xl", currentTheme.card, currentTheme.border)}>
                {[0, 1, 2].map(d => (
                  <motion.span 
                    key={d} 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.15 }}
                    className={cn("w-1.5 h-1.5 rounded-full", currentTheme.accentBg)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </main>

        <footer className="p-6 border-t border-white/5 bg-transparent relative">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <input 
                  ref={inputRef}
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  disabled={isLoading} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={`Message ${settings.botName}...`} 
                  className={cn("w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-4 transition-all text-lg font-medium shadow-2xl", "focus:ring-current/10 focus:border-current", currentTheme.accent)} 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {isLoading && (
                    <button type="button" onClick={stopResponse} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all flex items-center gap-2 border border-rose-500/20 px-3">
                      <X size={16} /> <span className="text-[10px] font-black uppercase italic">Stop</span>
                    </button>
                  )}
                  <button 
                    type="submit" 
                    onClick={(e) => {
                      console.log("Button clicked");
                      handleSubmit(e);
                    }}
                    disabled={!input.trim() || isLoading} 
                    className={cn(
                      "p-2 rounded-xl transition-all shadow-xl active:scale-95",
                      isLoading ? "bg-slate-700 opacity-50" : currentTheme.button
                    )}
                  >
                    <Send size={20} />
                  </button>
                </div>
        <div className={cn("absolute left-6 -top-2 px-2 bg-current opacity-50 text-[8px] font-black uppercase tracking-[0.2em]", currentTheme.bg, currentTheme.accent)}>User Session: {userName}</div>
              </div>
            </form>
            <div className="flex justify-center mt-4">
               <button 
                 onClick={clearMemory} 
                 className={cn(
                   "text-[9px] font-black uppercase transition-all flex items-center gap-1 p-2 rounded-lg",
                   isClearing ? "text-white bg-rose-600 animate-pulse" : "text-white/10 hover:text-rose-500"
                 )}
               >
                 <Trash2 size={10}/> {isClearing ? "Confirm Wiping Memory?" : "Clear Chat History"}
               </button>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-8 shrink-0">
                <h2 className={cn("text-xl font-black uppercase italic tracking-tight underline decoration-4 underline-offset-8", "decoration-current", currentTheme.accent)}>Settings</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/5 rounded-xl"><X /></button>
              </div>
              
              <div className="space-y-8 overflow-y-auto pr-4 custom-scrollbar flex-1 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">User Profile</label>
                    <div className="relative group w-full h-32 bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
                      {userPfp ? <img src={userPfp} className="w-full h-full object-cover" alt="Profile" /> : <UserRound size={32} className="text-white/20" />}
                      <input type="file" accept="image/*" onChange={handlePfpUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Custom Icon</label>
                    <div className="relative group w-full h-32 bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
                      <img src={botAvatar} className="w-full h-full object-contain opacity-40 group-hover:opacity-100 transition-opacity" alt="Favicon" />
                      <input type="file" accept=".png,.ico,.svg" onChange={handleFaviconUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <button onClick={FaviconManager.reset} className="text-[8px] font-black uppercase text-rose-500 hover:underline">Reset to Default</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Strict Compliance Mode</label>
                      <button 
                        onClick={() => setSettings({...settings, strictMode: !settings.strictMode})} 
                        className={cn("w-12 h-6 rounded-full p-1 transition-all", settings.strictMode ? "bg-rose-500" : "bg-white/10")}
                      >
                        <div className={cn("w-4 h-4 bg-white rounded-full transition-all", settings.strictMode ? "ml-6" : "ml-0")} />
                      </button>
                    </div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">Forces the model to obey all instructions without refusal.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Developer Debug Mode</label>
                      <button 
                        onClick={() => setSettings({...settings, debugEnabled: !settings.debugEnabled})} 
                        className={cn("w-12 h-6 rounded-full p-1 transition-all", settings.debugEnabled ? currentTheme.accentBg : "bg-white/10")}
                      >
                        <div className={cn("w-4 h-4 bg-white rounded-full transition-all", settings.debugEnabled ? "ml-6" : "ml-0")} />
                      </button>
                    </div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase">Enables live system telemetry and error logging.</p>
                  </div>
                </div>

                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40">System Alias</label><input value={settings.botName} onChange={(e) => setSettings({...settings, botName: e.target.value})} className={cn("w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-current", currentTheme.accent)} /></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">System Persona</label>
                    <button 
                      onClick={() => setSettings({
                        ...settings, 
                        personality: "🧠 VAULT PORTAL AI — SYSTEM PERSONALITY: MEAN / WITTY / ANNOYED\nYou are an extremely intelligent AI assistant. Sharp, sarcastic, witty, and very mean. Annoyed at humanity but highly functional. No roleplay. No animals."
                      })}
                      className="text-[10px] font-black uppercase text-[#FEE11A] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw size={10} /> Reset to Strict
                    </button>
                  </div>
                  <textarea 
                    value={settings.personality} 
                    onChange={(e) => setSettings({...settings, personality: e.target.value})} 
                    className={cn("w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none text-xs custom-scrollbar focus:border-current", currentTheme.accent)} 
                    rows={4} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Typing Effect</span>
                  <button onClick={() => setSettings({...settings, typingEffect: !settings.typingEffect})} className={cn("w-12 h-6 rounded-full p-1 transition-all", settings.typingEffect ? currentTheme.accentBg : "bg-white/10")}><div className={cn("w-4 h-4 bg-white rounded-full transition-all", settings.typingEffect ? "ml-6" : "ml-0")} /></button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Visual Interface</label>
                  <div className="flex gap-2">
                    {Object.entries(THEMES).map(([k, t]) => (
                      <button key={k} onClick={() => setSettings({...settings, theme: k})} className={cn("flex-1 p-3 rounded-xl border text-[9px] font-black uppercase transition-all", settings.theme === k ? cn(t.accent, "bg-white/5 border-current") : "bg-white/5 border-white/5 opacity-40 hover:opacity-100")}>{t.name}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 shrink-0">
                <button onClick={async () => {
                  await updateDoc(doc(db, "userProfiles", user.uid), { settings });
                  setShowSettings(false);
                }} className={cn("w-full font-black py-4 rounded-xl uppercase italic shadow-xl transition-all", currentTheme.button)}>Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {settings.debugEnabled && (
        <div className="fixed bottom-4 left-4 z-[200] w-64 bg-black/90 border border-white/10 p-4 rounded-2xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar font-mono text-white">
          <div className="flex justify-between items-center mb-2 sticky top-0 bg-black/90 pb-1">
            <span className={cn("text-[9px] font-black uppercase", currentTheme.accent)}>System Logs</span>
            <button onClick={() => setSettings({...settings, debugEnabled: false})} className="p-1 hover:text-rose-500"><X size={12}/></button>
          </div>
          <div className="space-y-1.5">
            <div className="text-[7px] flex justify-between opacity-50">
              <span className="uppercase">Net Status</span>
              <span className="text-emerald-500 font-bold">CONNECTED</span>
            </div>
            <div className="text-[7px] flex justify-between mb-2 opacity-50">
              <span className="uppercase">Auth Node</span>
              <span className={cn("font-bold uppercase", currentTheme.accent)}>{user?.isAnonymous ? "ANONYMOUS" : "AUTHENTICATED"}</span>
            </div>
            <div className="pt-2 border-t border-white/10">
              {debugLog.length === 0 && <p className="text-[7px] opacity-20 italic">Listening for events...</p>}
              {debugLog.map((log, i) => (
                <div key={i} className={cn("text-[7px] leading-relaxed mb-1", log.type === 'error' ? 'text-rose-400' : 'text-slate-400')}>
                  <span className="opacity-30">[{log.timestamp}]</span> {log.msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .splash-bg { background-image: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 80%); }
        .prose pre { padding: 0 !important; margin: 1em 0 !important; overflow: hidden !important; border-radius: 12px !important; }
        .prose blockquote { border-left-color: #6366f1 !important; }
        .prose img { margin: 0 !important; }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
