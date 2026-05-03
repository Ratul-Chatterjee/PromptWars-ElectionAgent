import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Info, MapPin, Calendar, CheckCircle2, ChevronRight, Menu, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am CivicGuide, your Election Education Assistant. My purpose is to help you learn about the democratic process. I can educate you on voter registration steps, how to locate polling places, understanding mail-in ballots, or the general election timeline. What would you like to learn about today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const currentHistory = [...messages];
    
    // Optimistically add user message to UI
    setMessages([...currentHistory, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Send the request securely to our Vercel Serverless Backend
      // The backend holds the API Key so it's completely hidden from the browser.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          history: currentHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch from secure backend.");
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setErrorMsg(error.message || "I encountered an error trying to process that request. Please try again.");
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered a server connection error. Please try again." 
      }]);
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
    setInput(query);
    setTimeout(() => {
        const form = document.getElementById('chat-form');
        if(form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 50);
  }

  return (
    <div className="app-container">
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
          <p className="disclaimer">Information provided is for general guidance. Always verify with local election officials.</p>
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
              placeholder="Ask me anything about the voting process..."
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading} className="send-btn">
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
