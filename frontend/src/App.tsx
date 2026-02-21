import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import { FaLocationArrow } from 'react-icons/fa';
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
  model: string;
  name: string;
}

function Chat() {
  const [text, setText] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const apiUrl = import.meta.env.VITE_OLLAMA_API_URL;
  const initialContext = import.meta.env.VITE_OLLAMA_CONTEXT;
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const options = import.meta.env.VITE_OLLAMA_USE_OPTIONS === 'true' ? {
    num_predict: 100,
    temperature: 0.7,
    top_p: 0.9,
    repeat_penalty: 1.1,
    stop: ["\n"],
  } : {};
  
  const cleanMessage = (message: string) => {
    return message.replace(/<think>/g, '<div class="think">').replace(/<\/think>/g, '</div>');
  };
  
  useEffect(() => {
    fetch(`${apiUrl}/api/tags`)
      .then(response => response.json())
      .then(data => setModels(data.models));
  }, []);

  useEffect(() => {
    if (initialContext) {
      const initialMessage: Message = { role: "system", content: initialContext };
      setConversation([initialMessage]);
    }
  }, [initialContext]);

  const handleSend = async () => {
    if (text.trim() === '') return;
    if (selectedModel === '') {
      alert('Por favor, selecciona un modelo antes de enviar un mensaje.');
      return;
    }

    const newMessage: Message = { role: "user", content: text };
    setConversation((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setText('');

    const assistantMessage: Message = { role: "assistant", content: "..." };
    setConversation((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...conversation, newMessage],
          stream: true,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to create reader');
      }
      const decoder = new TextDecoder();
      let done = false;
      let assistantContent = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });

        const jsonChunks = chunk.split('\n').filter(line => line.trim() !== '');
        jsonChunks.forEach(jsonChunk => {
          const parsedChunk = JSON.parse(jsonChunk);
          if (parsedChunk.message && parsedChunk.message.content) {
            assistantContent += parsedChunk.message.content;
            setConversation((prev) => prev.map((msg, i) =>
              i === prev.length - 1 ? { ...msg, content: assistantContent } : msg
            ));
          }
        });
      }
    } catch (error) {
      console.error('Error sending text to API:', error);
      setConversation((prev) => prev.map((msg, i) =>
        i === prev.length - 1 ? { ...msg, content: 'Error retrieving response' } : msg
      ));
    }
    setIsLoading(false);
  };

  return (
    <div className="chat__container">
      <div className='chat__container--header'>
        <h2>Neos Lab</h2>
        <p className="tagline">Agencia de Publicidad y Marketing Digital</p>
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
            </div>
          ))}
        </div>

        <div className="conversation__input">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
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
            <option key='' value=''>Selecciona el modelo</option>
            {models.map(model => (
              <option key={model.model} value={model.model}>
                {model.name}
              </option>
            ))}
          </select>
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
