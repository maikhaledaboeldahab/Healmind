import { useState, useRef, useEffect } from "react";
import styles from "./ChatBot.module.css";

const suggestedPrompts = [
  "Draft a 4-step grounding exercise for panic anxiety",
  "Summarize key CBT coping strategies for work-related burnout",
  "Draft a clinical session summary template for intake appointments",
  "Explain difference between Generalized Anxiety and Panic Disorder",
];

const mockResponses = {
  "Draft a 4-step grounding exercise for panic anxiety": `🌿 **4-Step Grounding Exercise for Panic & Anxiety (The 5-4-3-2-1 Technique):**

1. **Sight (5 items):** Acknowledge 5 things you can see around you (e.g., your desk, a pen, the clock).
2. **Touch (4 items):** Notice 4 things you can physically feel (e.g., feet on the floor, texture of your sleeves).
3. **Sound (3 items):** Listen for 3 distinct sounds (e.g., ambient hum of the AC, distant traffic).
4. **Breath (Box Breathing):** Inhale for 4 seconds, hold for 4, exhale for 4, and pause for 4 seconds. Repeat 3 cycles.`,

  "Summarize key CBT coping strategies for work-related burnout": `💡 **Key CBT Coping Strategies for Work-Related Burnout:**

1. **Cognitive Reframing:** Identify all-or-nothing cognitive distortions (e.g., "If I don't finish everything today, I failed") and replace them with balanced thoughts.
2. **Boundary Scheduling:** Establish hard cutoff hours for checking work communications.
3. **Behavioral Activation:** Schedule non-work restorative activities that provide mastery and pleasure.
4. **Micro-Recovery Breaks:** Integrate 5-minute cognitive rest intervals between clinical/work sessions.`,

  "Draft a clinical session summary template for intake appointments": `📋 **Clinical Intake Session Summary Template:**

- **Patient Name:** [Patient Name]
- **Date & Time:** [Date] | [Time]
- **Chief Complaint / Presenting Concerns:** [Brief description]
- **Behavioral Observations & Mood:** [Affect, eye contact, alertness]
- **Clinical Impression / Provisional Diagnosis:** [Diagnostic impression]
- **Treatment Plan & Next Steps:** [Goal setting, frequency of CBT sessions]
- **Homework / Client Takeaway:** [Grounding exercise / Journaling]`,

  "Explain difference between Generalized Anxiety and Panic Disorder": `🧠 **GAD vs. Panic Disorder Clinical Comparison:**

- **Generalized Anxiety Disorder (GAD):** Chronic, excessive, uncontrollable worry about multiple everyday domains (health, finances, family) lasting $\\ge 6$ months. Accompanied by muscle tension, restlessness, and fatigue.
- **Panic Disorder:** Recurrent, unexpected panic attacks characterized by abrupt surges of intense fear reaching a peak within minutes, accompanied by fear of future attacks (anticipatory anxiety) or catastrophic misinterpretations of bodily sensations.`
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello Dr. Farah! I am your clinical AI assistant at HealMind. How can I assist you with clinical research, session preparation, or patient care guidelines today?",
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = mockResponses[query];
      if (!botReply) {
        botReply = `Thank you for your clinical query: "${query}".\n\nBased on evidence-based mental health clinical guidelines, continuing structured CBT interventions with mood monitoring and regular behavioral experiments yields the highest efficacy. Let me know if you would like a customized protocol or patient worksheet.`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Chat cleared. How else can I assist you today, Doctor?",
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className={styles.chatbotContainer}>
      {/* Header */}
      <div className={`${styles.header} d-flex justify-content-between align-items-center`}>
        <div className="d-flex align-items-center gap-3">
          <div className={styles.botAvatar}>
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h4 className={styles.title}>HealMind Clinical AI Assistant</h4>
            <p className={styles.subtitle}>24/7 Clinical Support & Case Preparation</p>
          </div>
        </div>

        <button className={styles.clearBtn} onClick={handleClearChat} title="Clear conversation">
          <i className="fa-solid fa-trash-can me-1"></i> Clear Chat
        </button>
      </div>

      {/* Chat Body */}
      <div className={styles.chatBody}>
        {/* Suggested Prompts on top if only 1 message */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-muted small fw-bold mb-2">SUGGESTED CLINICAL PROMPTS</p>
            <div className="row g-2">
              {suggestedPrompts.map((prompt, idx) => (
                <div className="col-12 col-md-6" key={idx}>
                  <button
                    className={`${styles.promptCard} w-100 d-flex align-items-center gap-2`}
                    onClick={() => handleSendMessage(prompt)}
                  >
                    <i className="fa-regular fa-lightbulb" style={{ color: "var(--color-primary)" }}></i>
                    <span>{prompt}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageRow} ${msg.sender === "user" ? styles.userRow : styles.botRow}`}
          >
            {msg.sender === "bot" && (
              <div className={styles.botAvatar} style={{ width: "32px", height: "32px", fontSize: "0.9rem" }}>
                <i className="fa-solid fa-robot"></i>
              </div>
            )}
            <div className={`${styles.bubble} ${msg.sender === "user" ? styles.userBubble : styles.botBubble}`}>
              <div>{msg.text}</div>
              <div
                className="text-end mt-1"
                style={{
                  fontSize: "0.65rem",
                  opacity: 0.75,
                }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.messageRow} ${styles.botRow}`}>
            <div className={styles.botAvatar} style={{ width: "32px", height: "32px", fontSize: "0.9rem" }}>
              <i className="fa-solid fa-robot"></i>
            </div>
            <div className={`${styles.bubble} ${styles.botBubble} d-flex align-items-center gap-2`}>
              <span className="spinner-grow spinner-grow-sm" role="status"></span>
              <span style={{ fontSize: "0.8rem" }}>AI Assistant is generating clinical response...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input Bar */}
      <div className={`${styles.inputBar} d-flex align-items-center gap-2`}>
        <input
          type="text"
          className={styles.textInput}
          placeholder="Ask a clinical question, research topic, or therapy technique..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          className={styles.sendBtn}
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim()}
          aria-label="Send query"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatBot;