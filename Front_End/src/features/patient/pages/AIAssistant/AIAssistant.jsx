import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faPaperPlane,
  faRotateRight,
  faLightbulb,
  faHeart,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { sendMessageToRAG } from '../../../../shared/services/rag/ragService';
import styles from './AIAssistant.module.css';

const SUGGESTED_PROMPTS = [
  'How can I manage stress and burnout?',
  'How can I improve sleep quality?',
  'Anxiety coping techniques',
  'Guided mindfulness exercise',
  'How to find and book a doctor on HealMind?',
];

const INITIAL_MESSAGE = {
  id: 'welcome',
  from: 'assistant',
  text: "Hello! I'm your **HealMind AI Assistant**. I'm here 24/7 to provide mental health information, emotional wellness techniques, and guidance. How are you feeling today?",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

// Simple safe markdown renderer for headings, lists, bold, italics, and links
function renderFormattedMessage(content) {
  if (!content) return null;

  const lines = content.split('\n');
  return lines.map((line, idx) => {
    // Heading 3: ### Title
    if (line.startsWith('### ')) {
      return (
        <h3 key={idx} className={styles.msgHeading}>
          {line.replace('### ', '')}
        </h3>
      );
    }
    // Heading 2: ## Title
    if (line.startsWith('## ')) {
      return (
        <h2 key={idx} className={styles.msgHeading}>
          {line.replace('## ', '')}
        </h2>
      );
    }

    // Process inline formatting (bold, italic, links)
    const formattedLine = parseInline(line);

    // List items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return (
        <div key={idx} className={styles.msgListItem}>
          <span className={styles.bullet}>•</span>
          <span>{parseInline(line.trim().replace(/^[-*]\s+/, ''))}</span>
        </div>
      );
    }

    // Numbered list item: 1. 2. etc.
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      return (
        <div key={idx} className={styles.msgNumberedItem}>
          <span className={styles.listNum}>{numMatch[1]}.</span>
          <span>{parseInline(numMatch[2])}</span>
        </div>
      );
    }

    // Empty line / paragraph break
    if (!line.trim()) {
      return <div key={idx} className={styles.msgSpacer} />;
    }

    return (
      <p key={idx} className={styles.msgParagraph}>
        {formattedLine}
      </p>
    );
  });
}

function parseInline(text) {
  // Regex to parse **bold**, *italic*, and [link text](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const isInternal = linkMatch[2].startsWith('/');
      return isInternal ? (
        <Link key={i} to={linkMatch[2]} className={styles.msgLink}>
          {linkMatch[1]}
        </Link>
      ) : (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.msgLink}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleClearChat = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const sendMessage = async (text) => {
    const trimmed = text.trim();

    if (!trimmed || isLoading) return;

    const userMessage = {
      id: Date.now(),
      from: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

      const responseText =
        data?.response ||
        data?.reply ||
        data?.message ||
        "I'm here to support you. You can ask about managing stress, sleep hygiene, or connecting with doctors on HealMind.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'assistant',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error('RAG request failed:', error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'assistant',
          text: "I'm temporarily having trouble connecting to the network. Please take a deep breath, and feel free to try again or browse our verified therapists on the [Find Doctors](/doctors) page.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrap}>
            <FontAwesomeIcon icon={faRobot} />
          </div>

          <div>
            <div className={styles.titleRow}>
              <h1>HealMind AI Assistant</h1>
              <span className={styles.statusBadge}>
                <FontAwesomeIcon icon={faCircle} className={styles.statusDot} />
                Online
              </span>
            </div>
            <p className={styles.subtext}>
              Instant, confidential mental wellness guidance 24/7
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClearChat}
          title="Reset Conversation"
          aria-label="Reset Conversation"
        >
          <FontAwesomeIcon icon={faRotateRight} />
          <span>New Chat</span>
        </button>
      </header>

      <div className={styles.thread}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.from === 'user' ? styles.bubbleUserWrapper : styles.bubbleAssistantWrapper
            }
          >
            {message.from === 'assistant' && (
              <div className={styles.assistantAvatar}>
                <FontAwesomeIcon icon={faRobot} />
              </div>
            )}

            <div
              className={
                message.from === 'user' ? styles.bubbleUser : styles.bubbleAssistant
              }
            >
              <div className={styles.messageContent}>
                {message.from === 'assistant'
                  ? renderFormattedMessage(message.text)
                  : message.text}
              </div>
              <span className={styles.timestamp}>{message.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={styles.bubbleAssistantWrapper}>
            <div className={styles.assistantAvatar}>
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className={`${styles.bubbleAssistant} ${styles.loadingBubble}`}>
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
              <span className={styles.typingDot} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className={styles.promptsSection}>
        <div className={styles.promptsHeader}>
          <FontAwesomeIcon icon={faLightbulb} className={styles.sparkleIcon} />
          <span>Suggested Topics:</span>
        </div>
        <div className={styles.prompts}>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <form
        className={styles.composer}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(draft);
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your question or how you feel..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={isLoading}
        />

        <button
          type="submit"
          aria-label="Send"
          disabled={isLoading || !draft.trim()}
          className={draft.trim() ? styles.sendActive : ''}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>

      <footer className={styles.footerDisclaimer}>
        <FontAwesomeIcon icon={faHeart} className={styles.disclaimerIcon} />
        <span>
          HealMind AI provides educational wellness guidance. It does not replace medical diagnosis.
          In a crisis, call <strong>988</strong> or your local emergency service.
        </span>
      </footer>
    </div>
  );
}
