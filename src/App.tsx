import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { FaWhatsapp, FaRocket, FaBullhorn, FaLaptopCode, FaShoppingCart, FaCogs } from 'react-icons/fa';
import { LuBrainCircuit } from "react-icons/lu";
import { MdFace2 } from "react-icons/md";
import Header from './componets/Header';
import Footer from './componets/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DataDeletion from './pages/DataDeletion';

import { ChatContainer, type ChatMessage } from '@neos-lab/chat-components';
import '@neos-lab/chat-components/styles/variables.css';
import '@neos-lab/chat-components/styles/components.css';
import './chat-theme.css';
import './App.css';
import { getOrCreateDeviceId, getSessionId, setSessionId as saveSessionIdToCookie } from './utils/cookies';

function Chat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const iaApiUrl = import.meta.env.VITE_IA_API_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
  const initialContext = import.meta.env.VITE_OLLAMA_CONTEXT;
  const [sessionId, setSessionIdLocal] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const deviceId = getOrCreateDeviceId();
  const savedSessionId = getSessionId();

  const handleSetSessionId = useCallback((newSessionId: string) => {
    setSessionIdLocal(newSessionId);
    saveSessionIdToCookie(newSessionId);
  }, []);

  useEffect(() => {
    console.log('[Chat] Frontend - savedSessionId:', savedSessionId, 'apiUrl:', apiUrl, 'iaApiUrl:', iaApiUrl);
    if (savedSessionId && apiUrl) {
      setSessionIdLocal(savedSessionId);
      loadMessages(savedSessionId);
    }
  }, [savedSessionId, apiUrl]);

  useEffect(() => {
    if (initialContext && chatMessages.length === 0) {
      const systemMsg: ChatMessage = {
        id: 'system-init',
        type: 'text',
        content: initialContext,
        direction: 'inbound',
        timestamp: new Date(),
      };
      setChatMessages([systemMsg]);
    }
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadMessages = async (sessionIdToLoad: string) => {
    console.log('[Chat] loadMessages called with:', sessionIdToLoad, 'apiUrl:', apiUrl);
    if (!apiUrl) {
      console.error('[Chat] API URL not configured!');
      return;
    }
    try {
      console.log('[Chat] Fetching from:', `${apiUrl}/api/ia/messages?session_id=${encodeURIComponent(sessionIdToLoad)}`);
      const response = await fetch(`${apiUrl}/api/ia/messages?session_id=${encodeURIComponent(sessionIdToLoad)}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.messages && data.data.messages.length > 0) {
          const loadedMessages: ChatMessage[] = data.data.messages.map((msg: any) => ({
            id: msg.id,
            type: msg.message_type,
            content: msg.content,
            direction: msg.direction === 'outbound' ? 'outbound' : 'inbound',
            timestamp: new Date(msg.timestamp),
            status: msg.status,
          }));
          setChatMessages(loadedMessages);
          if (data.data.session_id && !sessionId) {
            handleSetSessionId(data.data.session_id);
          }
        }
      }
    } catch (error) {
      console.error('[Chat] Error loading messages:', error);
    }
  };

  const saveUserMessage = async (content: string, currentSessionId: string, convId?: string) => {
    console.log('[Chat] saveUserMessage called:', { content: content.substring(0, 50), currentSessionId, apiUrl });
    if (!apiUrl) {
      console.error('[Chat] API URL not configured for saveUserMessage!');
      return;
    }
    try {
      console.log('[Chat] Saving user message to:', `${apiUrl}/api/ia/save-message`);
      await fetch(`${apiUrl}/api/ia/save-message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId,
        },
        body: JSON.stringify({
          message: content,
          direction: 'outbound',
          session_id: currentSessionId,
          conversation_id: convId,
        }),
      });
    } catch (error) {
      console.error('[Chat] Error saving user message:', error);
    }
  };

  const saveAiMessage = async (content: string, currentSessionId: string, convId?: string) => {
    console.log('[Chat] saveAiMessage called:', { content: content.substring(0, 50), currentSessionId, apiUrl });
    if (!apiUrl) {
      console.error('[Chat] API URL not configured for saveAiMessage!');
      return;
    }
    try {
      console.log('[Chat] Saving AI message to:', `${apiUrl}/api/ia/save-message`);
      await fetch(`${apiUrl}/api/ia/save-message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId,
        },
        body: JSON.stringify({
          message: content,
          direction: 'inbound',
          session_id: currentSessionId,
          conversation_id: convId,
        }),
      });
    } catch (error) {
      console.error('[Chat] Error saving AI message:', error);
    }
  };

  const handleSendMessage = useCallback(async (userText: string, _attachments?: File[]) => {
    if (userText.trim() === '') return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'text',
      content: userText,
      direction: 'outbound',
      timestamp: new Date(),
      status: 'sending',
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let currentSessionId = sessionId;

    try {
      const response = await fetch(`${iaApiUrl}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId,
          system_prompt: initialContext || undefined,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No response body');

      saveUserMessage(userText, currentSessionId || '', undefined);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim() || !line.startsWith('data: ')) continue;
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.content !== undefined) {
                assistantContent += data.content;
                setChatMessages(prev => {
                  const streamingIdx = prev.findIndex(m => m.isStreaming === true);
                  
                  if (streamingIdx >= 0) {
                    const newMsgs = [...prev];
                    newMsgs[streamingIdx] = { 
                      ...newMsgs[streamingIdx], 
                      content: assistantContent, 
                      status: 'delivered'
                    };
                    return newMsgs;
                  } else {
                    const aiMessage: ChatMessage = {
                      id: `ai-${Date.now()}`,
                      type: 'text',
                      content: assistantContent,
                      direction: 'inbound',
                      timestamp: new Date(),
                      status: 'delivered',
                      isStreaming: true,
                    };
                    return [...prev, aiMessage];
                  }
                });
              }
              if (data.session_id && !currentSessionId) {
                currentSessionId = data.session_id;
                handleSetSessionId(data.session_id);
              }
            } catch {}
          }
        }
      }

      if (assistantContent) {
        saveAiMessage(assistantContent, currentSessionId || '', undefined);
      }
    } catch (error) {
      console.error('[Chat] Error:', error);
      setChatMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        type: 'text',
        content: 'Error de conexión. Intenta de nuevo.',
        direction: 'inbound',
        timestamp: new Date(),
        status: 'failed',
      }]);
    } finally {
      setChatMessages(prev => prev.map(m => 
        m.direction === 'inbound' ? { ...m, isStreaming: false } : m
      ));
      setIsLoading(false);
    }
  }, [iaApiUrl, sessionId, initialContext, apiUrl, deviceId]);

  return (
    <div className="chat__container">
      <div className='chat__container--header'>
        <h2>Neos Lab</h2>
        <p className="tagline">Agencia de Publicidad y Marketing Digital</p>
      </div>

      <div className="services-banner">
        <h3>Nuestros Servicios</h3>
        <div className="services-list">
          <span className="service-tag"><FaWhatsapp /> WhatsApp Business API</span>
          <span className="service-tag"><FaRocket /> CRM Personalizado</span>
          <span className="service-tag"><FaBullhorn /> Marketing Digital</span>
          <span className="service-tag"><FaLaptopCode /> Desarrollo Web</span>
          <span className="service-tag"><FaShoppingCart /> E-commerce</span>
          <span className="service-tag"><FaCogs /> Meta Tech Provider</span>
        </div>
      </div>

      <h1>Asistente Virtual</h1>

      <div className="chat__container--conversation">
        <ChatContainer
          messages={chatMessages}
          isLoading={isLoading}
          config={{
            enableStreaming: true,
            enableMarkdown: true,
            showTimestamps: true,
            placeholder: '¿En qué podemos ayudarte hoy?',
          }}
          onSendMessage={handleSendMessage}
          inboundAvatar={<LuBrainCircuit />}
          outboundAvatar={<MdFace2 />}
          typingAvatar={<LuBrainCircuit />}
        />
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Header /><Chat /><Footer /></>} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos" element={<TermsOfService />} />
        <Route path="/eliminacion-datos" element={<DataDeletion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
