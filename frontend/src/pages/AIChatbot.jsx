import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Send, Bot, User, Loader2, Sparkles, PanelLeft } from 'lucide-react';
import { createConversation, sendMessage, getConversation } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /* ─── Load conversation ─── */
  useEffect(() => {
    if (id) {
      setInitialLoading(true);
      getConversation(id)
        .then(({ data }) => {
          setMessages(data.messages || []);
        })
        .catch(err => {
          console.error('Failed to load conversation', err);
          navigate('/chat');
        })
        .finally(() => setInitialLoading(false));
    } else {
      setMessages([]);
    }
  }, [id, navigate]);

  /* ─── Auto scroll ─── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  /* ─── Auto resize textarea ─── */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
  }, [message]);

  /* ─── Simulate streaming ─── */
  const simulateStreaming = (text) => {
    return new Promise((resolve) => {
      let i = 0;
      setStreamingText('');
      setIsStreaming(true);

      const words = text.split(' ');
      const interval = setInterval(() => {
        if (i < words.length) {
          setStreamingText(prev => prev + (i === 0 ? '' : ' ') + words[i]);
          i++;
        } else {
          clearInterval(interval);
          setIsStreaming(false);
          setStreamingText('');
          resolve();
        }
      }, 30);
    });
  };

  /* ─── Send handler ─── */
  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessage('');
    setLoading(true);

    const userMessage = { role: 'user', content: userMsg };
    setMessages(prev => [...prev, userMessage]);

    try {
      let aiContent;

      if (!id) {
        const { data } = await createConversation(userMsg);
        const assistantMsg = data.messages.find(m => m.role === 'assistant');
        aiContent = assistantMsg?.content || 'No response received.';
        await simulateStreaming(aiContent);
        setMessages(data.messages);
        navigate(`/chat/${data._id}`, { replace: true });
      } else {
        const { data } = await sendMessage(id, userMsg);
        const assistantMsg = data.messages.find(m => m.role === 'assistant');
        aiContent = assistantMsg?.content || 'No response received.';
        await simulateStreaming(aiContent);
        setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errMsg = error?.response?.data?.message || error?.response?.data?.error || 'Failed to get a response. Please check your API key in backend/.env.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **Error:** ${errMsg}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Enter key ─── */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ─── Suggested prompts ─── */
  const suggestions = [
    'What skills should I learn for web development?',
    'Help me prepare for a technical interview',
    'Suggest projects for my resume',
    'How to write a strong cover letter?'
  ];

  /* ─── Empty state ─── */
  if (!id && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 bg-[#F8FAFC]">
        {context && !context.sidebarOpen && (
          <button
            onClick={context.onToggleSidebar}
            className="fixed top-4 left-4 z-40 p-2 bg-white border border-surface-200 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-50 transition-all shadow-sm"
          >
            <PanelLeft size={18} />
          </button>
        )}

        <div className="max-w-2xl w-full text-center animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={24} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">AI Career Assistant</h1>
          <p className="text-surface-500 mb-10">Ask me about careers, skills, interviews, or anything else.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setMessage(s); textareaRef.current?.focus(); }}
                className="text-left px-4 py-3 surface text-sm text-surface-600 hover:border-surface-300 hover:text-surface-900 transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="w-full">
            <div className="flex items-end surface px-4 py-3 focus-within:border-primary-300 transition-all">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Message InternHub AI..."
                className="flex-1 bg-transparent resize-none text-surface-900 placeholder-surface-400 focus:outline-none text-sm max-h-40 overflow-y-auto"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || loading}
                className="ml-3 p-2.5 bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-30 disabled:hover:bg-primary-600 rounded-lg transition-all active:scale-95"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-surface-400 mt-2 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Chat view ─── */
  return (
    <div className="flex-1 flex flex-col h-screen bg-[#F8FAFC]">
      {context && !context.sidebarOpen && (
        <button
          onClick={context.onToggleSidebar}
          className="fixed top-4 left-4 z-40 p-2 bg-white border border-surface-200 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-50 transition-all shadow-sm"
        >
          <PanelLeft size={18} />
        </button>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-surface-400" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4"
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${msg.role === 'user' ? 'bg-surface-200' : 'bg-primary-600'
                    }`}>
                    {msg.role === 'user'
                      ? <User size={14} className="text-surface-600" />
                      : <Bot size={14} className="text-white" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-surface-400 mb-1.5">
                      {msg.role === 'user' ? 'You' : 'InternHub AI'}
                    </p>
                    {msg.role === 'assistant' ? (
                      <MarkdownRenderer content={msg.content} />
                    ) : (
                      <p className="text-surface-700 leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming response */}
            {isStreaming && streamingText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mt-0.5">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-surface-400 mb-1.5">InternHub AI</p>
                  <MarkdownRenderer content={streamingText} />
                  <span className="inline-block w-2 h-4 bg-primary-600 animate-blink ml-0.5" />
                </div>
              </motion.div>
            )}

            {/* Loading indicator */}
            {loading && !isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mt-0.5">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-surface-400 mb-2">InternHub AI</p>
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-surface-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end surface px-4 py-3 focus-within:border-primary-300 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Message InternHub AI..."
              className="flex-1 bg-transparent resize-none text-surface-900 placeholder-surface-400 focus:outline-none text-sm max-h-40 overflow-y-auto"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || loading}
              className="ml-3 p-2.5 bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-30 disabled:hover:bg-primary-600 rounded-lg transition-all active:scale-95"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <p className="text-xs text-surface-400 mt-2 text-center">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
