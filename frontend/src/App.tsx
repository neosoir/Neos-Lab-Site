import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import reactLogo from './assets/react.svg';
import ollamaLogo from './assets/docker.svg';
import viteLogo from '/vite.svg';
import { FaLocationArrow } from 'react-icons/fa';
import { LuBrainCircuit } from "react-icons/lu";
import { MdFace2 } from "react-icons/md";
import Header from './componets/Header';
import Footer from './componets/Footer';

import './App.css';

interface Message {
  role: string;
  content: string;
}

interface Model {
  model: string;
  name: string;
}

function App() {
  const [text, setText] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const apiUrl = import.meta.env.VITE_OLLAMA_API_URL;
  const initialContext = import.meta.env.VITE_OLLAMA_CONTEXT;
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const options = import.meta.env.VITE_OLLAMA_USE_OPTIONS === 'true' ? {
    num_predict: 100, // Limita la respuesta a 100 tokens
    temperature: 0.7, // Controla la creatividad de la respuesta
    top_p: 0.9, // Equilibra coherencia y diversidad
    repeat_penalty: 1.1, // Evita repeticiones
    stop: ["\n"], // Puede detener la generación al final de la oración
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
      const decoder = new TextDecoder();
      let done = false;
      let assistantContent = "";

      while (!done) {
        const { value, done: doneReading } = await reader?.read()!;
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
    <>
      <Header />
      <div className="chat__container">
        <div className='chat__container--header'>
          <a className="link" href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a className="link" href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <a className="link" href="https://ollama.com" target="_blank" rel="noopener noreferrer">
            <img src={ollamaLogo} className="logo" alt="Ollama logo" />
          </a>
        </div>

        <h1>Neo Chat</h1>

        <div className="chat__container--conversation">

          {/* Conversation messages */}
          <div className='conversation__messages'>
            {conversation.map((msg, index) => (
              <div key={index} className="message">
                {msg.role === "user" && (
                  <p className="question">
                    <MdFace2 />
                    <p>{msg.content}</p>
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

          {/* Conversation Input */}
          <div className="conversation__input">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Haz una pregunta..."
              disabled={isLoading ? true : false}
            ></textarea>
            <button
              onClick={handleSend}
              className={isLoading ? 'pulsing' : ''}
              disabled={isLoading ? true : false}
            >
              <FaLocationArrow />
            </button>
          </div>

          {/* Select Model */}
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

      <Footer />
    </>
  );
}

export default App;
