import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { sendMessageToRAG } from '../../../../shared/services/rag/ragService';
import styles from './AIAssistant.module.css';

const SUGGESTED_PROMPTS = [
  'How can I manage stress?',
  'How can I improve sleep?',
  'Anxiety coping techniques',
];

const INITIAL_MESSAGE = {
  id: 'welcome',
  from: 'assistant',
  text: "Hi, I'm your HealMind AI Assistant. I'm here to offer general wellness guidance — how can I support you today?",
};

export default function AIAssistant() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();

    if (!trimmed || isLoading) return;

    const userMessage = {
      id: Date.now(),
      from: 'user',
      text: trimmed,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setDraft('');
    setIsLoading(true);

    try {
      const chatHistory = updatedMessages
        .filter((message) => message.id !== 'welcome')
        .map((message) => ({
          role: message.from === 'user' ? 'user' : 'assistant',
          content: message.text,
        }));

      const data = await sendMessageToRAG(trimmed, chatHistory);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'assistant',
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error('RAG request failed:', error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'assistant',
          text: 'Sorry, I could not connect to the AI Assistant right now. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.iconWrap}>
          <FontAwesomeIcon icon={faRobot} />
        </span>

        <div>
          <h1>AI Mental Health Assistant</h1>
          <p className={styles.subtext}>
            General guidance, available anytime.
          </p>
        </div>
      </header>

      <div className={styles.thread}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.from === 'user'
                ? styles.bubbleUser
                : styles.bubbleAssistant
            }
          >
            {message.text}
          </div>
        ))}

        {isLoading && (
          <div className={styles.bubbleAssistant}>
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className={styles.prompts}>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className={styles.composer}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(draft);
        }}
      >
        <input
          type="text"
          placeholder="Ask the AI Assistant anything..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={isLoading}
        />

        <button
          type="submit"
          aria-label="Send"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}