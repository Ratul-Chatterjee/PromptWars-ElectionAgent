import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Info, MapPin, Calendar, CheckCircle2, ChevronRight, Menu, X, Loader2, Key, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null); // 'success' | 'error' | null
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVerifyAndSave = async (e) => {
    e.preventDefault();
    const keyToTest = tempKey.trim();
    if (!keyToTest) return;

    setIsVerifying(true);
    setVerifyStatus(null);
    setErrorMsg('');

    try {
      const genAI = new GoogleGenerativeAI(keyToTest);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // Simple test prompt to verify key
      await model.generateContent("test");
      
      localStorage.setItem('gemini_api_key', keyToTest);
      setApiKey(keyToTest);
      setVerifyStatus('success');
      setTimeout(() => {
        setShowKeyModal(false);
        setMessages(prev => [...prev, { role: 'assistant', content: '✅ API Key Verified! Your connection is secure. How can I help you learn about elections today?' }]);
      }, 1000);
    } catch (error) {
      console.error('Verification Error:', error);
      setVerifyStatus('error');
      setErrorMsg("Invalid API Key. Please ensure you copied it correctly from Google AI Studio.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setShowKeyModal(true);
    setTempKey('');
    setVerifyStatus(null);
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

      let formattedHistory = currentHistory
        .filter(msg => !msg.content.includes("Please enter your Gemini API key"))
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

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
      let errorText = "AI Service Error. Please check your API key.";
      if (error.message?.includes("API_KEY_INVALID")) {
        errorText = "Your API key is invalid or has expired. Please update it in settings.";
      }
      setErrorMsg(errorText);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error. This usually happens if the API key is incorrect." }]);
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="header-icon-bg"><Key size={20} /></div>
              <h2>AI Setup Guide</h2>
              <button className="close-modal" onClick={() => apiKey && setShowKeyModal(false)}>
                {apiKey ? <X size={20} /> : null}
              </button>
            </div>
            
            <div className="modal-body scrollable">
              <div className="privacy-badge">
                <ShieldCheck size={14} />
                <span>Private & Local Storage</span>
              </div>

              <p className="modal-intro">CivicGuide is a privacy-first app. To start, you'll need a free Gemini API key from Google. Your key stays on your device.</p>
              
              <div className="setup-steps">
                <div className="step">
                  <span className="step-num">1</span>
                  <div className="step-text">
                    Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio <ExternalLink size={12} /></a>
                  </div>
                </div>
                <div className="step">
                  <span className="step-num">2</span>
                  <div className="step-text">Click <strong>"Create API key"</strong></div>
                </div>
                <div className="step">
                  <span className="step-num">3</span>
                  <div className="step-text">Copy and paste it below</div>
                </div>
              </div>

              <div className="visual-guide">
                <div className="browser-mockup">
                  <div className="browser-controls">
                    <span className="b-dot"></span><span className="b-dot"></span><span className="b-dot"></span>
                  </div>
                  <div className="browser-ui">
                    <div className="ui-btn">Create API key</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyAndSave} className="key-setup-form">
                <div className="input-field">
                  <input 
                    type="password" 
                    placeholder="Enter API Key (AIza...)" 
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    className={verifyStatus}
                  />
                  {isVerifying && <RefreshCw size={18} className="input-spinner" />}
                </div>
                
                {verifyStatus === 'error' && <p className="field-error">{errorMsg}</p>}
                
                <button 
                  type="submit" 
                  className={`action-btn ${verifyStatus}`} 
                  disabled={!tempKey.trim() || isVerifying}
                >
                  {isVerifying ? 'Verifying Key...' : verifyStatus === 'success' ? 'Connection Ready!' : 'Activate CivicGuide'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar logic remains consistent but with cleaner key management */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

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
            <h3>Education Hub</h3>
            <p>Neutral education on the voting process and democratic mechanics.</p>
          </div>

          <div className="key-management-card">
            <div className="key-status">
              <Key size={14} />
              <span>{apiKey ? 'Key Active' : 'No Key Set'}</span>
            </div>
            <button className="text-link-btn" onClick={() => {
              setTempKey(apiKey);
              setShowKeyModal(true);
              setSidebarOpen(false);
            }}>
              {apiKey ? 'Update Key' : 'Configure Key'}
            </button>
            {apiKey && <button className="text-link-btn danger" onClick={handleClearKey}>Remove</button>}
          </div>

          <h3 className="section-title">Educational Topics</h3>
          <ul className="quick-links-list">
            {[
              { icon: <CheckCircle2 size={18} />, title: "Am I registered?", query: "How do I check if I am registered to vote?" },
              { icon: <MapPin size={18} />, title: "Where do I vote?", query: "How can I find my polling place?" },
              { icon: <Calendar size={18} />, title: "Important Dates", query: "What are the general important dates in an election cycle?" },
              { icon: <Info size={18} />, title: "Voter ID Laws", query: "What kind of ID do I need to bring to vote?" },
            ].map((link, idx) => (
              <li key={idx}>
                <button className="quick-link-btn" onClick={() => handleQuickLink(link.query)}>
                  <span className="link-icon">{link.icon}</span>
                  <span className="link-title">{link.title}</span>
                  <ChevronRight size={16} className="link-arrow" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="header-title">
            <h1>Election Education App</h1>
            <span className="status-badge">AI Powered</span>
          </div>
          {apiKey && (
            <button className="header-key-btn" onClick={() => setShowKeyModal(true)}>
              <Key size={18} />
              <span className="btn-label">API Key</span>
            </button>
          )}
        </header>

        {errorMsg && !showKeyModal && (
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
                  {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : <p>{msg.content}</p>}
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
              placeholder={apiKey ? "Ask about the voting process..." : "Enter API key to chat"}
              disabled={isLoading || !apiKey}
            />
            <button type="submit" disabled={!input.trim() || isLoading || !apiKey} className="send-btn">
              {isLoading ? <Loader2 size={20} className="spinner" /> : <Send size={20} />}
            </button>
          </form>
          <div className="input-footer">
            CivicGuide is an educational tool. Verify deadlines with local authorities.
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
