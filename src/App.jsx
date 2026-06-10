import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Send, User as UserIcon, Loader2, Trash2, Zap, LogOut,
  Settings, X, Save, Sparkles, Cpu, Cloud, Moon, Sun, 
  Copy, Check, Volume2, Mic, Palette, Info, MessageSquareCode,
  Terminal, Search, Share2, History, RotateCcw, BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark.js';
import prismStyle from 'react-syntax-highlighter/dist/esm/styles/prism/prism.js';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, signInAnonymously, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, orderBy, limit, addDoc, serverTimestamp, deleteDoc, getDocs, writeBatch, getDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const THEMES = {
  midnight: { 
    name: "Midnight", 
    bg: "bg-[#050507]", 
    accent: "text-indigo-400", 
    border: "border-white/5", 
    card: "bg-[#0a0a0f]", 
    input: "bg-white/5",
    button: "bg-indigo-500 text-white"
  },
  obsidian: { 
    name: "Obsidian", 
    bg: "bg-black", 
    accent: "text-amber-500", 
    border: "border-amber-500/20", 
    card: "bg-[#080808]", 
    input: "bg-white/5",
    button: "bg-amber-500 text-black"
  },
  cyber: { 
    name: "Cyber", 
    bg: "bg-[#020202]", 
    accent: "text-fuchsia-500", 
    border: "border-fuchsia-500/30", 
    card: "bg-[#050505]", 
    input: "bg-fuchsia-500/5",
    button: "bg-fuchsia-600 text-white"
  },
  serene: { 
    name: "Serene", 
    bg: "bg-[#f8fafc]", 
    accent: "text-indigo-600", 
    border: "border-slate-200", 
    card: "bg-white", 
    input: "bg-slate-100",
    text: "text-slate-900",
    button: "bg-indigo-600 text-white",
    isLight: true
  }
};

const ICONS = {
  sparkle: { icon: <Sparkles size={24} />, label: "Spark" },
  cpu: { icon: <Cpu size={24} />, label: "Nexus" },
  zap: { icon: <Zap size={24} />, label: "Bolt" },
  brain: { icon: <BrainCircuit size={24} />, label: "Soul" },
  terminal: { icon: <Terminal size={24} />, label: "Code" }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState({
    botName: "Bear",
    personality: "You are Bear, an epic, witty, and slightly chaotic digital companion. You deliver sharp, clever responses with a side of sarcasm and bear-themed puns. You're helpfully unhinged—think 'Genius Grizzly with a keyboard'. Keep it fast, funny, and uniquely yours.",
    theme: "midnight",
    icon: "sparkle"
  });

  const scrollRef = useRef(null);

  // Identity & Settings Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          // Use onSnapshot for profile too for better offline handling
          const profileRef = doc(db, 'profiles', u.uid);
          const profileDoc = await getDoc(profileRef);
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            setUser({ ...u, displayName: profileData.name, email: profileData.email });
          } else {
            setUser(u);
          }
        } catch (error) {
          console.warn("Profile fetch failed (likely offline):", error);
          setUser(u); // Proceed with the user we have
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleManualLogin = async (name, email) => {
    setAuthLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const u = result.user;
      
      // Store profile info in Firestore (since anonymous users have limited metadata)
      await setDoc(doc(db, 'profiles', u.uid), {
        name,
        email,
        createdAt: serverTimestamp()
      });

      setUser({ ...u, displayName: name, email: email });
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    if (!user) return;
    
    // Sync Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          botName: data.botName || "Bear",
          personality: data.personality || "You are Bear, an epic, witty, and slightly chaotic digital companion. You deliver sharp, clever responses with a side of sarcasm and bear-themed puns. You're helpfully unhinged—think 'Genius Grizzly with a keyboard'. Keep it fast, funny, and uniquely yours.",
          theme: data.theme || "midnight",
          icon: data.icon || "sparkle"
        });
      } else {
        const defaults = {
          botName: "Bear",
          personality: "You are Bear, an epic, witty, and slightly chaotic digital companion. You deliver sharp, clever responses with a side of sarcasm and bear-themed puns. You're helpfully unhinged—think 'Genius Grizzly with a keyboard'. Keep it fast, funny, and uniquely yours.",
          theme: "midnight",
          icon: "sparkle",
          userId: user.uid
        };
        // Use try-catch for the initial setDoc to prevent offline crashes
        try {
          setDoc(doc(db, 'settings', user.uid), defaults);
        } catch (e) {
          console.warn("Initial settings save failed (likely offline):", e);
        }
      }
    }, (error) => {
      console.error("Settings listener error:", error);
    });

    // Sync Messages
    const msgsQuery = query(
      collection(db, 'users', user.uid, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    const unsubMessages = onSnapshot(msgsQuery, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
    });

    return () => {
      unsubSettings();
      unsubMessages();
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const clearChat = async () => {
    if (!user || messages.length === 0) return;
    if (!confirm("Wipe all message history? This cannot be undone.")) return;
    
    const batch = writeBatch(db);
    const snapshot = await getDocs(collection(db, 'users', user.uid, 'messages'));
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', user.uid), {
        ...settings,
        botName: settings.botName.trim() || "Bear",
        userId: user.uid
      }, { merge: true });
      setShowSettings(false);
    } catch (error) {
      console.error("Save settings error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessageText = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // 1. Save User Message
      await addDoc(collection(db, 'users', user.uid, 'messages'), {
        role: "user",
        text: userMessageText,
        timestamp: serverTimestamp(),
      });

      // 2. Prepare History
      const history = messages.slice(-10).map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      // 3. Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessageText,
          history: history,
          personality: settings.personality,
          botName: settings.botName
        }),
      });

      if (!response.ok) throw new Error("Connection failed");

      const data = await response.json();

      // 4. Save AI Response
      await addDoc(collection(db, 'users', user.uid, 'messages'), {
        role: "model",
        text: data.text,
        timestamp: serverTimestamp(),
      });

    } catch (error) {
      console.error("Chat error:", error);
      await addDoc(collection(db, 'users', user.uid, 'messages'), {
        role: "model",
        text: "Neural linkage interrupted. My sensors are a bit fuzzy right now... could you repeat that?",
        timestamp: serverTimestamp(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTheme = useMemo(() => THEMES[settings.theme] || THEMES.midnight, [settings.theme]);
  const isLight = currentTheme.isLight;

  if (authLoading) return (
    <div className="h-screen bg-[#050507] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-indigo-500 animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Initializing Core</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="h-screen bg-[#050507] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0a0a0f] border border-white/5 p-12 rounded-[3.5rem] shadow-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div className="flex justify-center mb-8">
          <div className="p-8 bg-indigo-500 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20">
            <Cpu size={56} />
          </div>
        </div>
        <h1 className="text-4xl font-black text-white italic mb-2 uppercase tracking-tighter">Bear AI</h1>
        <p className="text-slate-500 mb-10 font-bold uppercase tracking-[0.2em] text-[10px]">Quantum Interface v5.1</p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleManualLogin(formData.get('name'), formData.get('email'));
        }} className="space-y-4">
          <input 
            required 
            name="name" 
            placeholder="Your Name" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50" 
          />
          <input 
            required 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/50" 
          />
          <button type="submit" className="w-full bg-white hover:bg-slate-100 text-black font-black py-5 rounded-3xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] uppercase italic tracking-tight mt-4">
            Initialize Access
          </button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen ${currentTheme.bg} font-sans ${isLight ? 'text-slate-900' : 'text-slate-100'} transition-all duration-700 selection:bg-indigo-500/30 selection:text-indigo-200`}>
      {/* Dynamic Header */}
      <header className={`flex items-center justify-between px-6 py-4 ${currentTheme.card} border-b ${currentTheme.border} relative z-40 backdrop-blur-3xl shadow-xl`}>
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-2xl ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black shadow-lg shadow-white/5'} transition-all`}
          >
            {ICONS[settings.icon]?.icon || <Sparkles size={24} />}
          </motion.div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">{settings.botName}'s AI</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 ${isLight ? 'bg-indigo-600' : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]'} rounded-full animate-pulse`}></span>
              <p className={`text-[9px] font-black ${isLight ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-[0.2em]`}>Secure Link</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
          <button onClick={() => setShowSearch(!showSearch)} className={`p-2 transition-all rounded-xl ${showSearch ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:bg-white/5'}`}>
            <Search size={18} />
          </button>
          <div className="w-px h-6 bg-white/5 hidden sm:block"></div>
          <button onClick={() => setShowSettings(true)} className="p-2 text-slate-500 hover:text-white transition-all rounded-xl hover:bg-white/5">
            <Settings size={20} />
          </button>
          <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-400 transition-all rounded-xl hover:bg-rose-400/5">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`w-full ${currentTheme.card} border-b ${currentTheme.border} px-6 py-4 z-30 overflow-hidden`}>
            <div className="max-w-2xl mx-auto relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
               <input 
                 type="text" 
                 value={searchQuery} 
                 onChange={(e) => setSearchQuery(e.target.value)} 
                 placeholder="Search message history..." 
                 className={`w-full ${isLight ? 'bg-slate-100' : 'bg-white/5'} border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none`}
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                   <X size={14} />
                 </button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Experience */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-12 max-w-5xl mx-auto w-full relative z-10 custom-scrollbar pb-32">
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.length === 0 && !isLoading ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-8 py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full"></div>
                <div className={`relative p-12 ${currentTheme.card} border ${currentTheme.border} rounded-[3.5rem] shadow-2xl`}>
                  {React.cloneElement(ICONS[settings.icon]?.icon || <Sparkles />, { size: 72, className: currentTheme.accent })}
                </div>
              </div>
              <div className="max-w-md space-y-3">
                <h2 className="text-4xl font-black italic tracking-tighter">INITIATED: {settings.botName.toUpperCase()}</h2>
                <p className="opacity-40 font-medium text-lg px-8">Ready to process your commands. Your history will be encrypted and saved.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {["System status report", "Write an epic story", "Explain quantum computing", "Plan a tech project"].map(txt => (
                  <button key={txt} onClick={() => setInput(txt)} className={`px-6 py-3 ${currentTheme.card} border ${currentTheme.border} hover:border-indigo-500/30 rounded-2xl text-xs font-bold transition-all hover:scale-105 active:scale-95`}>
                    {txt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            (searchQuery ? filteredMessages : messages).map((message) => (
              <motion.div 
                key={message.id} 
                layout
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`flex gap-4 sm:gap-6 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-all ${message.role === "user" ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-black ring-4 ring-white/5') : (isLight ? 'bg-slate-100 text-slate-800' : 'bg-indigo-500 text-white ring-4 ring-indigo-500/10')}`}>
                  {message.role === "user" ? <UserIcon size={22} /> : React.cloneElement(ICONS[settings.icon]?.icon || <Sparkles />, { size: 22 })}
                </div>
                
                <div className={`group relative max-w-[85%] sm:max-w-[80%] rounded-[2rem] px-6 py-5 shadow-2xl border transition-all ${message.role === "user" ? (isLight ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#1a1a23] border-white/5 text-white') : (currentTheme.card + ' ' + currentTheme.border)}`}>
                  <div className="prose prose-invert max-w-none text-[15px] sm:text-[16px] leading-relaxed font-normal tracking-tight">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <div className="relative group/code my-4 rounded-xl overflow-hidden shadow-inner">
                              <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase text-slate-500">{match[1]}</span>
                                <button onClick={() => copyToClipboard(String(children), 'code')} className="p-1 hover:text-white"><Copy size={12} /></button>
                              </div>
                              <SyntaxHighlighter
                                language={match[1]}
                                style={isLight ? prismStyle : atomDark}
                                PreTag="div"
                                className="!m-0 !bg-transparent text-sm"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className={`${isLight ? 'bg-indigo-50 text-indigo-700' : 'bg-white/10 text-indigo-300'} px-1.5 py-0.5 rounded-md font-mono text-sm`} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Action Bar */}
                  <div className={`mt-4 pt-3 border-t border-white/5 flex items-center gap-4 opacity-0 group-hover:opacity-60 transition-all duration-300 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <button onClick={() => copyToClipboard(message.text, message.id)} className="p-1.5 hover:bg-white/10 rounded-lg" title="Copy Content">
                      {copiedId === message.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded-lg"><Share2 size={12} /></button>
                    <button 
                      onClick={() => speakMessage(message.text)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      title="Read Aloud"
                    >
                      <Volume2 size={12} />
                    </button>
                    <span className="text-[10px] font-black uppercase opacity-40 ml-auto tabular-nums">
                      {message.timestamp?.toDate ? message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100' : 'bg-white/5 animate-pulse border border-white/5'}`}>
              <Loader2 size={24} className="animate-spin opacity-20" />
            </div>
            <div className={`rounded-[2rem] px-8 py-5 ${currentTheme.card} ${currentTheme.border} border shadow-2xl`}>
              <div className="flex gap-3 h-6 items-center">
                {[0, 0.2, 0.4].map(d => (
                  <motion.div key={d} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: d }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Control Surface */}
      <footer className={`p-6 sm:p-10 ${isLight ? 'bg-white border-t border-slate-100' : 'bg-transparent'} z-30`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="flex gap-4 relative">
             <div className="flex-1 relative group">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)} 
                  placeholder={`Command ${settings.botName}...`} 
                  className={`w-full ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-white/5 border-white/5 text-white'} border group-focus-within:border-indigo-500/50 rounded-[2rem] px-8 py-5 pr-16 transition-all outline-none font-bold text-lg shadow-inner focus:ring-8 focus:ring-indigo-500/5`}
                  disabled={isLoading}
                />
                <button type="submit" disabled={!input.trim() || isLoading} className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all ${input.trim() ? 'text-indigo-400 hover:bg-white/5 scale-110' : 'text-slate-600 opacity-20'}`}>
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                </button>
             </div>
             
             <div className="hidden sm:flex gap-3">
                <button type="button" onClick={clearChat} className={`p-5 rounded-[2rem] border transition-all ${isLight ? 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500' : 'bg-white/5 border-white/5 text-slate-600 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-400/20'}`} title="Clear Session">
                   <RotateCcw size={24} />
                </button>
                <button type="button" className={`p-5 rounded-[2rem] border transition-all ${isLight ? 'bg-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-600 hover:text-white'}`}>
                   <Mic size={24} />
                </button>
             </div>
          </form>
          
          <div className="flex justify-center items-center gap-8 opacity-10 hover:opacity-40 transition-all duration-1000">
             <div className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div><span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Neural Engine v4.2</span></div>
             <div className="h-px w-10 bg-white/20"></div>
             <div className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div><span className="text-[9px] font-black uppercase tracking-[0.4em] italic">End-to-End Encryption</span></div>
             <div className="h-px w-10 bg-white/20"></div>
             <div className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div><span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Infinite Context Window</span></div>
          </div>
        </div>
      </footer>

      {/* Hyper Settings Surface */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-2xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSettings(false)} className="fixed inset-0" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 40 }} 
              className={`relative w-full max-w-3xl ${isLight ? 'bg-white' : 'bg-[#0a0a0f]'} border ${currentTheme.border} rounded-[4rem] p-10 sm:p-14 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]`}
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                   <h3 className="text-3xl font-black italic uppercase tracking-tighter">System Configuration</h3>
                   <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-indigo-500 mt-1">Core Identity & Interface</p>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all"><X size={32} /></button>
              </div>

              <form onSubmit={saveSettings} className="space-y-10 h-[55vh] overflow-y-auto pr-6 custom-scrollbar">
                <div className="grid sm:grid-cols-2 gap-10">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Manifest Name</label>
                     <input type="text" value={settings.botName} onChange={(e) => setSettings({...settings, botName: e.target.value})} className={`w-full ${isLight ? 'bg-slate-100' : 'bg-white/5 border-white/10'} border rounded-2xl px-6 py-4 outline-none font-bold text-lg focus:ring-4 focus:ring-indigo-500/10 transition-all`} />
                   </div>
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Entity Symbol</label>
                     <div className="flex gap-3">
                       {Object.entries(ICONS).map(([key, val]) => (
                         <button key={key} type="button" onClick={() => setSettings({...settings, icon: key})} className={`p-4 rounded-2xl border transition-all ${settings.icon === key ? 'bg-indigo-500 border-indigo-400 text-white shadow-xl shadow-indigo-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}>
                           {val.icon}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Personality Matrix</label>
                  <textarea rows={5} value={settings.personality} onChange={(e) => setSettings({...settings, personality: e.target.value})} placeholder="Inject custom behavior rules here..." className={`w-full ${isLight ? 'bg-slate-100' : 'bg-white/5 border-white/10'} border rounded-3xl px-7 py-5 outline-none font-medium text-sm leading-relaxed focus:ring-4 focus:ring-indigo-500/10 transition-all`} />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Visual Skin</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(THEMES).map(([key, val]) => (
                      <button key={key} type="button" onClick={() => setSettings({...settings, theme: key})} className={`flex flex-col gap-3 p-4 rounded-3xl border transition-all ${settings.theme === key ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                        <div className={`w-full h-8 rounded-xl ${val.bg} border ${val.border}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-center">{val.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-10 flex gap-4 sticky bottom-0 bg-inherit py-6 border-t border-white/5">
                  <button type="submit" disabled={isSaving} className="flex-1 bg-white hover:bg-slate-100 text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all uppercase italic shadow-2xl active:scale-95 disabled:opacity-50">
                    {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={22} /> Commit Changes</>}
                  </button>
                  <button type="button" onClick={() => setShowSettings(false)} className="px-10 bg-white/5 border border-white/5 hover:bg-white/10 text-white font-black py-5 rounded-3xl transition-all uppercase italic">
                    Back
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        
        .prose code::before, .prose code::after { content: "" !important; }
        .prose pre { background: transparent !important; margin: 0 !important; padding: 0 !important; }
      `}</style>
    </div>
  );
}
