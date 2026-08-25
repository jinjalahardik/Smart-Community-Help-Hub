import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getBotResponse } from './knowledgeBase';

const ChatContext = createContext(null);

const WELCOME_SESSION_KEY = 'sch_chat_welcome_shown';
const WELCOME_DELAY_MS = 5000;
const TYPING_DELAY_MS = 900;

function makeMessage(sender, text) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sender, // 'bot' | 'user'
    text,
    createdAt: new Date().toISOString(),
  };
}

const INITIAL_MESSAGE = makeMessage(
  'bot',
  "👋 Hi! I'm your **Smart Community AI Assistant**. Ask me about donations, emergency requests, volunteering, NGOs or hospitals — or tap a suggestion below to get started."
);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Show the welcome popup once per browser session, 5s after first load,
  // unless the user has already dismissed it or opened the chat.
  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(WELCOME_SESSION_KEY) === '1';
    } catch {
      // sessionStorage unavailable (privacy mode) - just skip the popup logic
      alreadyShown = true;
    }
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setShowWelcomePopup(true);
    }, WELCOME_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const markWelcomeSeen = useCallback(() => {
    setShowWelcomePopup(false);
    try {
      sessionStorage.setItem(WELCOME_SESSION_KEY, '1');
    } catch {
      // ignore write failures
    }
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    markWelcomeSeen();
  }, [markWelcomeSeen]);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => {
    setIsOpen((open) => {
      if (!open) markWelcomeSeen();
      return !open;
    });
  }, [markWelcomeSeen]);

  const dismissWelcomePopup = useCallback(() => markWelcomeSeen(), [markWelcomeSeen]);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, makeMessage('user', trimmed)]);
    setIsTyping(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      const reply = getBotResponse(trimmed);
      setMessages((prev) => [...prev, makeMessage('bot', reply)]);
      setIsTyping(false);
    }, TYPING_DELAY_MS);
  }, []);

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), []);

  const value = {
    isOpen,
    messages,
    isTyping,
    showWelcomePopup,
    openChat,
    closeChat,
    toggleChat,
    dismissWelcomePopup,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
