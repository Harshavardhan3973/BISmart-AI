import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, LanguageOption } from '../types';
import { LANGUAGES, STARTER_QUESTIONS } from '../data/standardsData';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  BookOpen, 
  ExternalLink,
  Copy,
  Globe2,
  ChevronDown
} from 'lucide-react';

interface ChatSectionProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ 
  initialPrompt, 
  onClearInitialPrompt 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Namaste! I am **BISmart AI**, your conversational assistant for **Bureau of Indian Standards (BIS)** services and Indian Standards, developed by **Team BISync** for **Smart India Hackathon 2026** (Problem Statement 26107).\n\nAsk me about:\n- **Applicable Standards** for your product (e.g. LED bulbs, drinking water, toys, cement)\n- **Certification Schemes** (ISI Mark Scheme-I, CRS Scheme-II, Hallmarking)\n- **Application Processes & Documents** on the e-BIS / Manakonline portal\n- **MSME & Startup Concessions** (up to 50% marking fee rebates)\n- **Consumer Verification** (checking CML numbers or 6-digit gold HUID codes via BIS Care)\n\nEvery answer is grounded in authentic BIS gazetted frameworks with cited standards.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: {
        standard: "BIS Act, 2016 & Conformity Assessment Regulations",
        scheme: "e-BIS / Manakonline Portal Frameworks",
        portal: "bis.gov.in & manakonline.in"
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{ checked: boolean; hasKey: boolean }>({ checked: false, hasKey: false });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check health and key status
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setServerStatus({ checked: true, hasKey: Boolean(data.hasGeminiKey) });
      })
      .catch(() => {
        setServerStatus({ checked: true, hasKey: false });
      });
  }, []);

  // Handle passed initial prompt from home page
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice speech-to-text setup
  const toggleVoiceInput = () => {
    const windowObj = window as any;
    const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("Voice speech input is not supported in this browser environment. Please type your query in the text box.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      showToast("Could not access microphone. Please check permissions or type your question.");
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for context
      const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          language: selectedLanguage
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.text || "I was unable to retrieve a response at this time. Please check your query or verify with the official BIS portal.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: data.isDemoMode,
        sources: data.sources || {
          standard: "Indian Standards Gazette & Quality Control Orders",
          scheme: "BIS Conformity Assessment Regulations",
          portal: "manakonline.in & bis.gov.in"
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I encountered a momentary difficulty connecting to the standards intelligence service. You can also directly search standards on the **e-BIS portal (manakonline.in)** or **bis.gov.in**.\n\n*Error details: ${err.message || 'Network error'}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
        sources: {
          standard: "Official Helpdesk Support",
          scheme: "Grievance & Support Cell",
          portal: "bis.gov.in > Feedback/Complaints"
        }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: "Conversation history cleared. How can I assist your enterprise or inquiry with Indian Standards today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: {
          standard: "Bureau of Indian Standards Catalog",
          scheme: "Conformity Assessment Services",
          portal: "manakonline.in"
        }
      }
    ]);
    setShowResetConfirm(false);
    showToast("Conversation cleared successfully.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between animate-fade-in border border-slate-700">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-3 text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-sm animate-fade-in">
          <div>
            <span className="font-semibold">Clear conversation history?</span>
            <p className="text-amber-700 mt-0.5">This will reset all current chat messages and start a fresh session.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={confirmResetChat}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              Yes, Clear
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-slate-700 font-medium rounded-lg border border-amber-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Header bar with controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0f2b48] to-[#1a4470] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-orange-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-serif-heading">
                BISmart AI Assistant
              </h2>
              {serverStatus.hasKey ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Gemini Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200" title="Curated BIS knowledge base active">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  BIS Knowledge Engine
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Grounded in Gazette Quality Control Orders & Bureau of Indian Standards manuals
            </p>
          </div>
        </div>

        {/* Controls: Language Selector & Reset */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Language Dropdown */}
          <div className="relative inline-block text-left">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
              <Globe2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium text-slate-600 hidden sm:inline">Language:</span>
              <select
                id="language-selector"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            id="reset-chat-btn"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Suggested Starter Questions Chips */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>Suggested Questions (Click to query):</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {STARTER_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              id={`starter-chip-${idx}`}
              onClick={() => handleSendMessage(q)}
              disabled={loading}
              className="text-xs text-left px-3 py-1.5 rounded-full bg-white hover:bg-orange-50 text-slate-700 hover:text-[#ea580c] border border-slate-200 hover:border-orange-300 transition-all shadow-xs disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[560px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#0f2b48] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-orange-300" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  {/* Bubble Container */}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#0f2b48] text-white rounded-tr-none shadow-sm'
                        : message.error
                        ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="space-y-3 prose prose-slate max-w-none text-sm leading-normal">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="my-0.5">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                            h3: ({ children }) => <h3 className="font-bold text-slate-900 text-sm mt-3 mb-1">{children}</h3>,
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#ea580c] font-medium underline hover:text-[#c2410c]">
                                {children}
                              </a>
                            )
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Sources & Next Steps Box for Assistant Messages */}
                    {!isUser && message.sources && (
                      <div className="mt-4 pt-3 border-t border-slate-200/80 bg-white/70 rounded-xl p-3 text-xs space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                          <span className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Official Sources & Next Steps
                          </span>
                          <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className="text-slate-400 hover:text-slate-700 flex items-center gap-1 font-normal text-[11px]"
                            title="Copy response"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedId === message.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        {message.sources.standard && (
                          <div className="text-slate-600">
                            <span className="font-semibold text-slate-800">IS Standard:</span> {message.sources.standard}
                          </div>
                        )}
                        {message.sources.scheme && (
                          <div className="text-slate-600">
                            <span className="font-semibold text-slate-800">Conformity Scheme:</span> {message.sources.scheme}
                          </div>
                        )}
                        {message.sources.portal && (
                          <div className="text-slate-600 flex items-center gap-1">
                            <span className="font-semibold text-slate-800">Portal / Link:</span> {message.sources.portal}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                          <span>Verify with official gazette at bis.gov.in</span>
                          <span>{message.timestamp}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#ea580c] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm font-semibold text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading typing indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-[#0f2b48] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-300 animate-spin" />
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Synthesizing BIS standards knowledge...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 bg-white border border-slate-300 rounded-xl focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-orange-100 transition-all p-2 flex items-center gap-2">
              <textarea
                ref={inputRef}
                id="chat-input-field"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening to your voice..." : "Ask in English or regional Indian language (e.g. 'What standard applies to LED bulbs?')..."}
                className="flex-1 bg-transparent resize-none text-sm text-slate-800 focus:outline-none max-h-32 min-h-[24px]"
              />

              {/* Voice button */}
              <button
                type="button"
                id="mic-voice-btn"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isListening ? "Stop listening" : "Speak question (Speech-to-Text)"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              id="send-message-btn"
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white disabled:opacity-40 disabled:hover:bg-[#ea580c] transition-all shadow-md shrink-0 flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
            <span>Press Enter to send · Shift + Enter for new line</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Grounded in Gazette Standards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
