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

function Chat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const iaApiUrl = import.meta.env.VITE_IA_API_URL;
  const initialContext = import.meta.env.VITE_OLLAMA_CONTEXT;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialContext) {
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
                  const newMsgs = [...prev];
                  // Buscar si ya existe un mensaje inbound (IA)
                  const aiIdx = newMsgs.findIndex(m => m.direction === 'inbound' && m.id.startsWith('ai-'));
                  
                  if (aiIdx >= 0) {
                    // Actualizar mensaje existente
                    newMsgs[aiIdx] = { ...newMsgs[aiIdx], content: assistantContent, status: 'delivered' };
                  } else {
                    // Crear nuevo mensaje AI
                    const aiMessage: ChatMessage = {
                      id: `ai-${Date.now()}`,
                      type: 'text',
                      content: assistantContent,
                      direction: 'inbound',
                      timestamp: new Date(),
                      status: 'delivered',
                    };
                    newMsgs.push(aiMessage);
                  }
                  return newMsgs;
                });
              }
              if (data.session_id && !currentSessionId) {
                currentSessionId = data.session_id;
                setSessionId(data.session_id);
              }
            } catch {}
          }
        }
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
      setIsLoading(false);
    }
  }, [iaApiUrl, sessionId, initialContext]);

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
