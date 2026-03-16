import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Cpu, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import api from '../api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! Welcome to Praveen's Portfolio. I'm Jarvis 🤖. How can I help you explore today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [contextData, setContextData] = useState({ projects: [], skills: [], about: {} });
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

        // Auto-greeting (Sound only, do not open)
        const timer = setTimeout(() => {
            // setIsOpen(true); // Removed auto-open
            // speak("Hello! Welcome to Praveen's Portfolio."); // Optional: decide if we want it to speak when hidden. User said "CLOSE... THEN ONLY... OPEN", so better to be silent until interaction or just notification.
            // Let's keep it silent to respect "Close... then only open".
        }, 2000);

        // Load data
        const fetchData = async () => {
            try {
                const [projectsRes, skillsRes, aboutRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/skills'),
                    api.get('/about')
                ]);
                setContextData({
                    projects: projectsRes.data,
                    skills: skillsRes.data,
                    about: aboutRes.data[0] || {}
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

    const speak = (text) => {
        if (isMuted) return;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        // Try to find a good English voice
        const voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft David') || v.lang === 'en-US') || voices[0];
        if (voice) utterance.voice = voice;
        utterance.pitch = 1;
        utterance.rate = 1;
        synth.speak(utterance);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted) synth.cancel();
    };

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
        processResponse(text);
        setInput('');
    };

    const processResponse = (userInput) => {
        const lowerInput = userInput.toLowerCase();
        let response = "I'm not sure about that, but feel free to check out the sections above!";

        // INTENT: Detailed Bio
        if (lowerInput.includes('tell me about praveen') ||
            lowerInput.includes('explain about praveen') ||
            lowerInput.includes('who is praveen') ||
            lowerInput.includes('describe praveen') ||
            lowerInput.includes('know about praveen')) {

            const about = contextData.about;
            const bio = about.description || about.summary || "Praveen is a passionate developer.";

            response = `Here is complete information about Praveen. he is a ${about.title}. ${bio} he has expertise in various technologies and has completed ${contextData.projects.length} notable projects.`;
        }
        // INTENT: Navigation
        else if (lowerInput.includes('project') || lowerInput.includes('work')) {
            const section = document.getElementById('projects');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            response = "I've scrolled to the Projects section for you. Here are some highlight works including Data Science analysis and Full Stack apps.";

            const foundProject = contextData.projects.find(p => lowerInput.includes(p.title.toLowerCase()));
            if (foundProject) {
                response = `Yes! The **${foundProject.title}** is a ${foundProject.category} project. ${foundProject.description}`;
            }
        }
        else if (lowerInput.includes('skill') || lowerInput.includes('stack') || lowerInput.includes('tech')) {
            const section = document.getElementById('skills');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            response = "Navigating to Skills. Praveen is proficient in Python, MERN Stack, and Data Science tools like Pandas and Tableau.";
        }
        else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('hire')) {
            const section = document.getElementById('contact');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            response = `You can contact Praveen at ${contextData.about.email || 'his email'}. I've taken you to the contact section.`;
        }
        else if (lowerInput.includes('leetcode') || lowerInput.includes('problem') || lowerInput.includes('rank')) {
            const section = document.getElementById('leetcode');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            response = "Here is Praveen's LeetCode performance. He has solved over 400 problems and earned multiple badges!";
        }
        else if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
            response = "Hello there! How can I help you explore the portfolio today?";
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { text: response, isBot: true }]);
            speak(response);
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
                                <h3 className="text-white font-bold">Jarvis</h3>
                                <p className="text-xs text-cyan-400">Online • AI Assistant</p>
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
                            <button onClick={handleSend} className="p-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-500 transition-colors">
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
                        Chat with Jarvis
                    </span>
                </button>
            )}
        </div>
    );
};

export default ChatBot;
