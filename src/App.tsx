import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { FaLocationArrow, FaWhatsapp, FaRocket, FaBullhorn, FaLaptopCode, FaShoppingCart, FaCogs } from 'react-icons/fa';
import { LuBrainCircuit } from "react-icons/lu";
import { MdFace2 } from "react-icons/md";
import Header from './componets/Header';
import Footer from './componets/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DataDeletion from './pages/DataDeletion';

import './App.css';

interface Message {
  role: string;
  content: string;
}

interface Model {
  name: string;
  size?: number;
  modified_at?: string;
}

function Chat() {
  const [text, setText] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const iaApiUrl = import.meta.env.VITE_IA_API_URL;
  const initialContext = import.meta.env.VITE_OLLAMA_CONTEXT;
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastAssistantIndex = useRef<number>(-1);

  useEffect(() => {
    Promise.all([
      fetch(`${iaApiUrl}/api/models`).then(r => r.json()),
      fetch(`${iaApiUrl}/api/health`).then(r => r.json())
    ])
      .then(([modelsData, healthData]) => {
        setModels(modelsData.models || []);
        const defaultModel = healthData.default_model;
        const availableModel = modelsData.models?.find((m: any) => m.name === defaultModel);
        
        if (defaultModel && availableModel) {
          setSelectedModel(defaultModel);
          console.log('[Frontend] Using default model:', defaultModel);
        } else if (modelsData.models && modelsData.models.length > 0) {
          setSelectedModel(modelsData.models[0].name);
        }
      })
      .catch(err => console.error('Error fetching models:', err));
  }, [iaApiUrl]);

  useEffect(() => {
    if (initialContext) {
      const initialMessage: Message = { role: "system", content: initialContext };
      setConversation([initialMessage]);
    }
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const cleanMessage = (message: string) => {
    return message.replace(/<think>/g, '<div class="think">').replace(/<\/think>/g, '</div>');
  };

  const handleSend = async () => {
    if (text.trim() === '') return;

    const newMessage: Message = { role: "user", content: text };
    const currentConvLength = conversation.length;
    setConversation((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setText('');

    const assistantMessage: Message = { role: "assistant", content: "" };
    setConversation((prev) => [...prev, assistantMessage]);
    lastAssistantIndex.current = currentConvLength + 1;

    let currentSessionId = sessionId;
    let assistantContent = "";

    console.log('[Frontend] Starting chat stream...', { iaApiUrl, text: text.slice(0, 30) });

    try {
      const response = await fetch(`${iaApiUrl}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
          system_prompt: initialContext || undefined,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('[Frontend] Response OK, status:', response.status, 'body:', response.body ? 'exists' : 'null');

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let chunkCount = 0;

      console.log('[Frontend] Starting stream read...');

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('[Frontend] Stream done, chunks received:', chunkCount);
          break;
        }

        if (value) {
          const decoded = decoder.decode(value, { stream: true });
          buffer += decoded;
          console.log('[Frontend] Received chunk:', value.length, 'bytes, buffer:', buffer.length);
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            
            console.log('[Frontend] Processing line:', line.slice(0, 100));
            
            // Skip event declarations
            if (line.startsWith('event:')) {
              console.log('[Frontend] Event type:', line.replace('event:', '').trim());
              continue;
            }
            if (!line.startsWith('data:')) continue;

            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              console.log('[Frontend] Parsed data:', JSON.stringify(data).slice(0, 100));

              if (data.content !== undefined) {
                chunkCount++;
                assistantContent += data.content;
                setConversation((prev) => {
                  const newConv = [...prev];
                  if (lastAssistantIndex.current >= 0 && lastAssistantIndex.current < newConv.length) {
                    newConv[lastAssistantIndex.current] = { 
                      ...newConv[lastAssistantIndex.current], 
                      content: assistantContent 
                    };
                  }
                  return newConv;
                });
              }

              // Check for done or error events
              if (data.done === true) {
                console.log('[Frontend] Stream DONE received');
              }

              if (data.error) {
                console.log('[Frontend] Stream ERROR:', data.error);
              }

              if (data.session_id && !currentSessionId) {
                currentSessionId = data.session_id;
                setSessionId(data.session_id);
              }
            } catch (e) {
              console.log('[Frontend] JSON parse error:', e, 'dataStr:', dataStr);
            }
          }
        }
      }
      
      console.log('[Frontend] Stream finished, total chunks:', chunkCount, 'total length:', assistantContent.length);
    } catch (error) {
      console.error('Error sending text to API:', error);
      setConversation((prev) => {
        const newConv = [...prev];
        if (lastAssistantIndex.current >= 0 && lastAssistantIndex.current < newConv.length) {
          newConv[lastAssistantIndex.current] = { 
            ...newConv[lastAssistantIndex.current], 
            content: 'Error retrieving response. Please try again.' 
          };
        }
        return newConv;
      });
    } finally {
      console.log('[Frontend] Setting isLoading to false');
      setIsLoading(false);
      console.log('[Frontend] isLoading after set:', isLoading);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        <div className='conversation__messages'>
          {conversation.map((msg, index) => (
            <div key={index} className="message">
              {msg.role === "user" && (
                <p className="question">
                  <MdFace2 />
                  <span>{msg.content}</span>
                </p>
              )}
              {msg.role === "assistant" && (
                <div className="answer">
                  <LuBrainCircuit />
                  {msg.content === "" && isLoading ? (
                    <span className="blinking">...</span>
                  ) : (
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {cleanMessage(msg.content)}
                    </ReactMarkdown>
                  )}
                </div>
              )}
              {msg.role === "system" && index === 0 && (
                <div className="system-message" style={{ display: 'none' }}>
                  {msg.content}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="conversation__input">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿En qué podemos ayudarte hoy?"
            disabled={isLoading}
          ></textarea>
          <button
            onClick={handleSend}
            className={isLoading ? 'pulsing' : ''}
            disabled={isLoading}
          >
            <FaLocationArrow />
          </button>
        </div>

        <div className='conversation__model'>
          <select
            onChange={(e) => setSelectedModel(e.target.value)}
            value={selectedModel}
          >
            {models.map(model => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
          {sessionId && (
            <span className="session-indicator" title="Sesión activa">
              Session: {sessionId.slice(0, 8)}...
            </span>
          )}
        </div>
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
