import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Info, MapPin, Calendar, CheckCircle2, ChevronRight, Menu, X, Loader2, Key, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

const ELECTION_SYSTEM_INSTRUCTION = `
You are CivicGuide, an expert, friendly, and neutral Election Education Assistant.
Your goal is to help users learn about the democratic process.
You must remain completely politically neutral. Never endorse a candidate or party.
Focus on the mechanics of voting: registration, finding polling places, required ID, mail-in ballots, and key dates.
Structure your answers with bullet points and clear steps when applicable.
If you don't know the specific rules for a user's local area, advise them to check their local election office website.
`;

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am CivicGuide, your Election Education Assistant. My purpose is to help you learn about the democratic process. Please enter your Gemini API key to start learning!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(!localStorage.getItem('gemini_api_key'));
  const [tempKey, setTempKey] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (!tempKey.trim()) return;
    localStorage.setItem('gemini_api_key', tempKey.trim());
    setApiKey(tempKey.trim());
    setShowKeyModal(false);
    setMessages(prev => [...prev, { role: 'assistant', content: 'Great! Your API key is set. How can I help you learn about elections today?' }]);
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setShowKeyModal(true);
    setTempKey('');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    const currentHistory = [...messages];
    
    setMessages([...currentHistory, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setErrorMsg('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: ELECTION_SYSTEM_INSTRUCTION
      });

      // Filter and format history for Gemini
      let formattedHistory = currentHistory
        .filter(msg => !msg.content.includes("Please enter your Gemini API key"))
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      // Ensure history starts with user if not empty
      if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
        formattedHistory.shift();
      }

      const chat = model.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Gemini Error:', error);
      let errorText = "I encountered an error. Please check your API key.";
      if (error.message?.includes("API_KEY_INVALID")) {
        errorText = "The API key you provided is invalid. Please update it in settings.";
      }
      setErrorMsg(errorText);
      setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't process that. Please verify your API key in the settings." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLinks = [
    { icon: <CheckCircle2 size={18} />, title: "Am I registered?", query: "How do I check if I am registered to vote?" },
    { icon: <MapPin size={18} />, title: "Where do I vote?", query: "How can I find my polling place?" },
    { icon: <Calendar size={18} />, title: "Important Dates", query: "What are the general important dates in an election cycle?" },
    { icon: <Info size={18} />, title: "Voter ID Laws", query: "What kind of ID do I need to bring to vote?" },
  ];

  const handleQuickLink = (query) => {
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }
    setInput(query);
    setTimeout(() => {
        const form = document.getElementById('chat-form');
        if(form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 50);
  }

  return (
    <div className="app-container">
      {/* API Key Modal */}
      {showKeyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <Key size={24} className="key-icon-main" />
              <h2>Setup Your AI Assistant</h2>
              <button className="close-modal" onClick={() => apiKey && setShowKeyModal(false)}>
                {apiKey ? <X size={20} /> : null}
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-intro">To provide you with secure, personalized election education, CivicGuide requires a Gemini API key. Your key is stored <strong>locally in your browser</strong> and never sent to our servers.</p>
              
              <div className="guide-section">
                <h3>How to get your free API key:</h3>
                <ol className="guide-steps">
                  <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio <ExternalLink size={14} /></a></li>
                  <li>Sign in with your Google account.</li>
                  <li>Click on <strong>"Create API key"</strong>.</li>
                  <li>Copy your new key and paste it below.</li>
                </ol>
                <div className="guide-illustration">
                  <div className="mock-browser">
                    <div className="mock-header">
                      <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                    </div>
                    <div className="mock-content">
                      <div className="mock-sidebar"></div>
                      <div className="mock-main">
                        <div className="mock-btn-highlight">Create API key</div>
                        <div className="mock-key-box">AIzaSy...xxxx</div>
                      </div>
                    </div>
                  </div>
                  <p className="illustration-caption">Look for the "Create API key" button in Google AI Studio.</p>
                </div>
              </div>

              <form onSubmit={handleSaveKey} className="key-form">
                <div className="input-group">
                  <label htmlFor="api-key">Paste Gemini API Key:</label>
                  <input 
                    id="api-key"
                    type="password" 
                    placeholder="Enter key starting with AIza..." 
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button type="submit" className="save-key-btn" disabled={!tempKey.trim()}>
                  Start Learning
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon"><Bot size={24} color="white" /></div>
            <h2>CivicGuide</h2>
          </div>
          <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-content">
          <div className="info-card">
            <h3>Election Education Hub</h3>
            <p>Learn the mechanics of democracy. Get neutral, factual education on how, when, and where the voting process works.</p>
          </div>

          <button className="manage-key-btn" onClick={() => {
            setTempKey(apiKey);
            setShowKeyModal(true);
            setSidebarOpen(false);
          }}>
            <Key size={16} />
            <span>Manage API Key</span>
          </button>

          <h3 className="section-title">Educational Topics</h3>
          <ul className="quick-links-list">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <button className="quick-link-btn" onClick={() => {
                  setSidebarOpen(false);
                  handleQuickLink(link.query);
                }}>
                  <span className="link-icon">{link.icon}</span>
                  <span className="link-title">{link.title}</span>
                  <ChevronRight size={16} className="link-arrow" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="sidebar-footer">
          <p className="disclaimer">CivicGuide is an open educational tool. Your API key remains private on your device.</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-content">
        <header className="top-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="header-title">
            <h1>Election Education App</h1>
            <span className="status-badge">Learn</span>
          </div>
          {apiKey && (
            <button className="header-key-btn" onClick={() => setShowKeyModal(true)} title="Update API Key">
              <Key size={20} />
            </button>
          )}
        </header>

        {errorMsg && (
          <div className="error-banner">
            <Info size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="chat-container">
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-content">
                  {msg.role === 'assistant' ? (
                     <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant loading">
                <div className="message-avatar"><Bot size={20} /></div>
                <div className="message-content typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="input-area">
          <form id="chat-form" onSubmit={handleSend} className="input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={apiKey ? "Ask me anything about the voting process..." : "Please enter your API key first"}
              disabled={isLoading || !apiKey}
            />
            <button type="submit" disabled={!input.trim() || isLoading || !apiKey} className="send-btn">
              {isLoading ? <Loader2 size={20} className="spinner" /> : <Send size={20} />}
            </button>
          </form>
          <div className="input-footer">
            CivicGuide is an educational AI tool. Please verify official deadlines with local authorities.
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
