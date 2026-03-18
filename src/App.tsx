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

interface ChatResponse {
  message: string;
  session_id: string;
  model: string;
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

  useEffect(() => {
    fetch(`${iaApiUrl}/api/models`)
      .then(response => response.json())
      .then(data => {
        setModels(data.models || []);
        if (data.models && data.models.length > 0) {
          setSelectedModel(data.models[0].name);
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
    setConversation((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setText('');

    const assistantMessage: Message = { role: "assistant", content: "" };
    setConversation((prev) => [...prev, assistantMessage]);

    let currentSessionId = sessionId;

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

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event:')) continue;
          if (!line.startsWith('data:')) continue;

          const dataStr = line.slice(6).trim();
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);

            if (data.content !== undefined) {
              setConversation((prev) => prev.map((msg, i) =>
                i === prev.length - 1 ? { ...msg, content: msg.content + data.content } : msg
              ));
            }

            if (data.session_id && !currentSessionId) {
              currentSessionId = data.session_id;
              setSessionId(data.session_id);
            }
          } catch (e) {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      console.error('Error sending text to API:', error);
      setConversation((prev) => prev.map((msg, i) =>
        i === prev.length - 1 ? { ...msg, content: 'Error retrieving response. Please try again.' } : msg
      ));
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
                  {msg.content === "..." ? (
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
            onKeyPress={handleKeyPress}
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
