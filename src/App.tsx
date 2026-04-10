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
import { getConversationId, setConversationId } from './utils/cookies';

function Chat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const iaApiUrl = import.meta.env.VITE_IA_API_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
  const initialContext = import.meta.env.VITE_OLLAMA_CONTEXT;
  const [conversationId, setConversationIdLocal] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const savedConversationId = getConversationId();

  const handleSetConversationId = useCallback((newConversationId: string) => {
    setConversationIdLocal(newConversationId);
    setConversationId(newConversationId);
  }, []);

  useEffect(() => {
    console.log('[Chat] Frontend - savedConversationId:', savedConversationId, 'apiUrl:', apiUrl, 'iaApiUrl:', iaApiUrl);
    if (savedConversationId && apiUrl) {
      setConversationIdLocal(savedConversationId);
      loadMessages(savedConversationId);
    }
  }, [savedConversationId, apiUrl]);

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

  const loadMessages = async (conversationIdToLoad: string) => {
    console.log('[Chat] loadMessages called with:', conversationIdToLoad, 'apiUrl:', apiUrl);
    if (!apiUrl) {
      console.error('[Chat] API URL not configured!');
      return;
    }
    try {
      console.log('[Chat] Fetching from:', `${apiUrl}/api/ia/messages/${encodeURIComponent(conversationIdToLoad)}`);
      const response = await fetch(`${apiUrl}/api/ia/messages/${encodeURIComponent(conversationIdToLoad)}`, {
        headers: {
          'Content-Type': 'application/json',
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
        }
      }
    } catch (error) {
      console.error('[Chat] Error loading messages:', error);
    }
  };

  const createOrGetConversation = async (): Promise<string | null> => {
    if (!apiUrl) {
      console.error('[Chat] API URL not configured!');
      return null;
    }
    
    if (conversationId) {
      return conversationId;
    }

    try {
      const response = await fetch(`${apiUrl}/api/ia/save-message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '',
          direction: 'system',
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.conversation_id) {
          handleSetConversationId(data.data.conversation_id);
          return data.data.conversation_id;
        }
      }
    } catch (error) {
      console.error('[Chat] Error creating conversation:', error);
    }
    
    return null;
  };

  const saveUserMessage = async (content: string, convId: string) => {
    if (!apiUrl) return;
    
    try {
      await fetch(`${apiUrl}/api/ia/save-message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          direction: 'outbound',
          conversation_id: convId,
        }),
      });
    } catch (error) {
      console.error('[Chat] Error saving user message:', error);
    }
  };

  const saveAiMessage = async (content: string, convId: string) => {
    if (!apiUrl) return;
    
    try {
      await fetch(`${apiUrl}/api/ia/save-message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          direction: 'inbound',
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

    const currentConversationId = await createOrGetConversation();
    if (!currentConversationId) {
      console.error('[Chat] Failed to get conversation ID');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${iaApiUrl}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          session_id: currentConversationId,
          system_prompt: initialContext || undefined,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No response body');

      saveUserMessage(userText, currentConversationId);

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
            } catch {}
          }
        }
      }

      if (assistantContent) {
        saveAiMessage(assistantContent, currentConversationId);
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
  }, [iaApiUrl, conversationId, initialContext, apiUrl, createOrGetConversation]);

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
