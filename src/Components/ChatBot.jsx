import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Cpu, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import api from '../api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [contextData, setContextData] = useState({ 
        projects: [], 
        skills: [], 
        about: {}, 
        education: [], 
        achievements: [], 
        leetcode: {},
        certificates: [],
        experience: [],
        sociallinks: []
    });
    const messagesEndRef = useRef(null);
    const synth = window.speechSynthesis;
    const recognitionRef = useRef(null);
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false; // We want to capture single commands/sentences
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript); // Auto-send
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        // Smart Greeting System
        const currentHour = new Date().getHours();
        let greeting = "";
        if (currentHour >= 5 && currentHour < 12) greeting = "Good morning…";
        else if (currentHour >= 12 && currentHour < 17) greeting = "Good afternoon…";
        else greeting = "Good evening…";

        const isReturning = localStorage.getItem('isReturningUser');
        let initialMessage = "";

        if (isReturning) {
            initialMessage = `${greeting} Welcome back… good to see you again. Feel free to ask me anything or explore.`;
        } else {
            localStorage.setItem('isReturningUser', 'true');
            initialMessage = `${greeting} Welcome to my portfolio… I’m here to walk you through my profile. How can I assist you today?`;
        }

        const timer = setTimeout(() => {
            setIsOpen(true);
            speakAndType(initialMessage);
        }, 1500);

        // Load data
        const fetchData = async () => {
            try {
                const [projectsRes, skillsRes, aboutRes, educationRes, achievementsRes, leetcodeRes, certificatesRes, experienceRes, sociallinksRes] = await Promise.all([
                    api.get('/projects').catch(() => ({ data: [] })),
                    api.get('/skills').catch(() => ({ data: [] })),
                    api.get('/about').catch(() => ({ data: [{}] })),
                    api.get('/education').catch(() => ({ data: [] })),
                    api.get('/achievements').catch(() => ({ data: [] })),
                    api.get('/leetcode').catch(() => ({ data: {} })),
                    api.get('/certificates').catch(() => ({ data: [] })),
                    api.get('/experience').catch(() => ({ data: [] })),
                    api.get('/sociallinks').catch(() => ({ data: [] }))
                ]);
                
                setContextData({
                    projects: projectsRes.data,
                    skills: skillsRes.data,
                    about: aboutRes.data[0] || {},
                    education: educationRes.data || [],
                    achievements: achievementsRes.data || [],
                    leetcode: leetcodeRes.data || {},
                    certificates: certificatesRes.data || [],
                    experience: experienceRes.data || [],
                    sociallinks: sociallinksRes.data || []
                });
            } catch (err) {
                console.error("Bot failed to load context");
            }
        };
        fetchData();

        return () => {
            clearTimeout(timer);
            synth.cancel();
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakAndType = (fullText) => {
        const msgId = Date.now() + Math.random(); // Unique Id template triggers accurately
        setMessages(prev => [...prev, { id: msgId, text: "", isBot: true }]);
        
        if (isMuted) {
            let index = 0;
            let currentText = "";
            const interval = setInterval(() => {
                if (index < fullText.length) {
                    currentText += fullText[index++];
                    setMessages(prev => {
                        const updated = [...prev];
                        const item = updated.find(m => m.id === msgId);
                        if (item) item.text = currentText;
                        return updated;
                    });
                } else {
                    clearInterval(interval);
                }
            }, 30);
            return;
        }

        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'en-US';
        utterance.rate = 1.25;
        const voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft David')) || voices[0];
        if (voice) utterance.voice = voice;

        let hasSpoken = false;

        utterance.onboundary = (event) => {
            hasSpoken = true;
            if (event.name === 'word') {
                const charIndex = event.charIndex;
                const length = event.charLength || (fullText.substring(charIndex).split(/\s+/)[0] || "").length;
                const revealIndex = charIndex + length;

                setMessages(prev => {
                    const updated = [...prev];
                    const item = updated.find(m => m.id === msgId);
                    if (item) item.text = fullText.substring(0, revealIndex);
                    return updated;
                });
            }
        };

        utterance.onend = () => {
             hasSpoken = true;
             setMessages(prev => {
                 const updated = [...prev];
                 const item = updated.find(m => m.id === msgId);
                 if (item) item.text = fullText;
                 return updated;
             });
        };

        synth.speak(utterance);

        // Failsafe for Autoplay Block (e.g., initial load greeting)
        setTimeout(() => {
            if (!hasSpoken) {
                let index = 0;
                let currentText = "";
                const interval = setInterval(() => {
                    if (index < fullText.length) {
                        currentText += fullText[index++];
                        setMessages(prev => {
                            const updated = [...prev];
                            const item = updated.find(m => m.id === msgId);
                            if (item) item.text = currentText;
                            return updated;
                        });
                    } else {
                        clearInterval(interval);
                    }
                }, 25);
            }
        }, 500);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted) synth.cancel();
    };

    // Combined speech and typing logic initialized as speakAndType

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (text = input) => {
        if (!text.trim()) return;

        const userMsg = { text: text, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        processResponse(text);
    };

    const processResponse = async (userInput) => {
        const lowerInput = userInput.trim().toLowerCase();
        
        let responseObj = {
            reply: "I’m not entirely sure about that yet… but feel free to explore more or ask me something else.",
            action: "",
            highlight: ""
        };

        let useAI = true;

        if (useAI) {
            try {
                const res = await api.post('/chat', { message: userInput, context: contextData });
                if (res.data && res.data.reply) {
                    responseObj = res.data;
                    setTimeout(() => {
                        speakAndType(responseObj.reply);

                        if (responseObj.action) {
                             const section = document.getElementById(responseObj.action);
                             if (section) {
                                  section.scrollIntoView({ behavior: 'smooth' });
                                  if (responseObj.highlight) {
                                       const itemId = `${responseObj.action}-${responseObj.highlight.replace(/\s+/g, '-')}`;
                                       const element = document.getElementById(itemId);
                                       if (element) {
                                            element.classList.add('glow-glow');
                                            setTimeout(() => element.classList.remove('glow-glow'), 4000);
                                       }
                                  }
                             }
                        }
                    }, 600);
                    return; // Exit if AI handled
                }
            } catch (error) {
                console.error("AI chat failed, falling back to rule-based:", error);
            }
        }

        // --- RULE-BASED FALLBACK ---

        // 1. Direct Project Title Match Or Certificate Match
        const projectMatch = contextData.projects?.find(p => p.title && (lowerInput.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(lowerInput)));
        const certificateMatch = contextData.certificates?.find(c => c.title && (lowerInput.includes(c.title.toLowerCase()) || c.title.toLowerCase().includes(lowerInput)));
        const skillMatch = contextData.skills?.find(s => s.name && lowerInput.includes(s.name.toLowerCase()));

        if (projectMatch) {
            responseObj = {
                reply: `That’s one of my key projects. I created ${projectMatch.title} which is a ${projectMatch.category} application. ${projectMatch.description || ""}`,
                action: "projects",
                highlight: projectMatch.title.toLowerCase()
            };
        } 
        else if (certificateMatch) {
            responseObj = {
                reply: `That’s one of my certificates. I earned the certification in ${certificateMatch.title} from ${certificateMatch.issuer || "my collection"}.`,
                action: "certificates",
                highlight: certificateMatch.title.toLowerCase()
            };
        }
        else if (skillMatch) {
            responseObj = {
                reply: `That’s something I use quite often. I’ve worked with ${skillMatch.name} to build dynamic and responsive interfaces, especially in my full-stack applications.`,
                action: "skills",
                highlight: skillMatch.name.toLowerCase()
            };
        }
        // 4. Bio / Personal Info queries
        else if (lowerInput.includes('who is praveen') || lowerInput.includes('tell me about praveen') || lowerInput.includes('describe praveen') || lowerInput.includes('about you') || lowerInput.includes('about yourself') || lowerInput === "praveen") {
             const about = contextData.about || {};
             const bio = about.description || about.summary || "I am a passionate developer.";
             responseObj = {
                 reply: `I am ${about.title || "a Developer"}. ${bio} I have built expertise in various tech stacks and have completed ${contextData.projects?.length || 0} notable projects.`,
                 action: "",
                 highlight: ""
             };
        }
        // 5. Quantity Queries
        else if (lowerInput.includes('how many') && (lowerInput.includes('project') || lowerInput.includes('work'))) {
             responseObj = {
                 reply: `I have worked on and completed a total of ${contextData.projects?.length || 0} projects. Let me take you to my projects section to see them.`,
                 action: "projects",
                 highlight: ""
             };
        }
        // Keyword Match Fallbacks
        else if (lowerInput.includes('project') || lowerInput.includes('work')) {
            responseObj = {
                reply: "Alright… let me take you through my work. I’ve moved to the projects section. One of my key projects focuses on analyzing real-world data to extract meaningful insights.",
                action: "projects",
                highlight: ""
            };
        }
        // 3. Navigation intents
        else if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
            responseObj = {
                reply: "Let me show you my skills section. I’ve built expertise in various tech stacks like Python and MERN. Here is what I use frequently.",
                action: "skills",
                highlight: ""
            };
        }
        else if (lowerInput.includes('leetcode') || lowerInput.includes('problem') || lowerInput.includes('rank')) {
            responseObj = {
                reply: "Let me show you that. I’ve navigated to my LeetCode section. I’ve solved over several hundred problems, which really strengthened my problem-solving ability.",
                action: "leetcode",
                highlight: ""
            };
        }
        else if (lowerInput.includes('education') || lowerInput.includes('college') || lowerInput.includes('study')) {
            responseObj = {
                reply: "I’ve taken you to my education section. I completed my degree in a field that built a strong foundation for my development and analytical skills.",
                action: "education",
                highlight: ""
            };
        }
        else if (lowerInput.includes('achievement') || lowerInput.includes('award')) {
            responseObj = {
                reply: "Here are some of my achievements and milestones. I’m always striving to push my boundaries and learn more.",
                action: "achievements",
                highlight: ""
            };
        }
        else if (lowerInput.includes('experience') || lowerInput.includes('job') || lowerInput.includes('internship')) {
            responseObj = {
                reply: "Let me show you my experience section. I’ve worked on various responsibilities that sharpened my software engineering skills.",
                action: "experience",
                highlight: ""
            };
        }
        else if (lowerInput.includes('certificate') || lowerInput.includes('certification')) {
            responseObj = {
                reply: "Let me show you my certificate section. I’ve worked on multiple skill courses to bolster my development profile.",
                action: "certificates",
                highlight: ""
            };
        }
        else if (lowerInput.includes('contact') || lowerInput.includes('hire') || lowerInput.includes('email')) {
            responseObj = {
                reply: "You can reach out to me via my contact form or email. I’ve taken you to the contact section.",
                action: "contact",
                highlight: ""
            };
        }
        else if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
            responseObj = {
                reply: "Hello there! How can I assist you in exploring my profile today?",
                action: "",
                highlight: ""
            };
        }

        setTimeout(() => {
            speakAndType(responseObj.reply);

            if (responseObj.action) {
                 const section = document.getElementById(responseObj.action);
                 if (section) {
                     section.scrollIntoView({ behavior: 'smooth' });
                     
                     if (responseObj.highlight) {
                          const itemId = `${responseObj.action}-${responseObj.highlight.replace(/\s+/g, '-')}`;
                          const element = document.getElementById(itemId);
                          if (element) {
                               element.classList.add('glow-glow');
                               setTimeout(() => element.classList.remove('glow-glow'), 4000);
                          }
                     }
                 }
            }
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {isOpen && (
                <div className="bg-gray-900 border border-cyan-500/30 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-fade-in-up backdrop-blur-md">
                    <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="bg-cyan-500/20 p-2 rounded-full">
                                <Cpu size={20} className="text-cyan-400" />
                            </div>
                            <div>
                                 <h3 className="text-white font-bold">Praveen</h3>
                                <p className="text-xs text-cyan-400">Online • Portfolio Guide</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={toggleListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-white'}`} title="Voice Input">
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                            <button onClick={toggleMute} className="text-gray-400 hover:text-white" title={isMuted ? "Unmute" : "Mute"}>
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900/90 scrollbar-thin scrollbar-thumb-gray-700">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.isBot
                                    ? 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                                    : 'bg-cyan-600 text-white rounded-tr-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-gray-800 border-t border-gray-700">
                        {isListening && <p className="text-xs text-cyan-400 mb-2 animate-pulse">Listening...</p>}
                        <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1 border border-gray-700 focus-within:border-cyan-500 transition-colors">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isListening ? "Listening..." : "Ask about projects..."}
                                className="flex-1 bg-transparent text-white p-2 text-sm outline-none placeholder-gray-500"
                            />
                             <button onClick={() => handleSend()} className="p-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-500 transition-colors">
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-lg shadow-cyan-600/30 transition-all transform hover:scale-110 flex items-center gap-2 group"
                >
                    <MessageSquare size={24} />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pr-2">
                        Chat with Me
                    </span>
                </button>
            )}
        </div>
    );
};

export default ChatBot;
