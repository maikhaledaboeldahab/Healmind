/**
 * HealMind AI Mental Health Assistant & RAG Controller
 */

// Comprehensive knowledge base for mental health, wellness, coping strategies, and HealMind navigation
const KNOWLEDGE_TOPICS = [
  {
    keywords: ['stress', 'burnout', 'overwhelm', 'exhaust', 'workload', 'pressure', 'tired'],
    response: `### 🌿 Managing Stress & Burnout

When stress feels overwhelming, here are evidence-based strategies you can use right away:

1. **The 5-4-3-2-1 Grounding Technique:**
   - **5** things you can see around you
   - **4** things you can physically touch
   - **3** things you can hear
   - **2** things you can smell
   - **1** thing you can taste or are grateful for

2. **Box Breathing (4x4):**
   - Inhale deeply through your nose for **4 seconds**
   - Hold your breath for **4 seconds**
   - Exhale slowly through your mouth for **4 seconds**
   - Hold empty for **4 seconds**. Repeat 4 times.

3. **Cognitive Offloading:**
   - Write down all your racing thoughts into a "brain dump" list.
   - Pick just **one single micro-task** to complete first.

💡 *Tip: If chronic stress is impacting your daily life, you can explore specialized counselors on our [Doctors Directory](/doctors).*`
  },
  {
    keywords: ['sleep', 'insomnia', 'night', 'wake up', 'can\'t sleep', 'bed', 'restless', 'nightmare'],
    response: `### 🌙 Sleep Hygiene & Restful Sleep

Improving sleep quality is one of the fastest ways to restore mental and emotional balance:

1. **The 20-Minute Rule:**
   - If you can't fall asleep after 20 minutes, get out of bed and do a low-stimulation activity (reading a book under dim light) until you feel drowsy. Keep the bed associated only with sleep.

2. **Circadian Reset:**
   - Get 10–15 minutes of natural morning sunlight within an hour of waking up.
   - Avoid screens (blue light) at least 45 minutes before bedtime.

3. **Progressive Muscle Relaxation (PMR):**
   - Starting from your toes, tense each muscle group for 5 seconds, then release completely with a deep exhale, working your way up to your forehead.

4. **Temperature & Environment:**
   - Keep your bedroom cool (around 18-20°C / 65-68°F) and completely dark.`
  },
  {
    keywords: ['anxiety', 'anxious', 'panic', 'nervous', 'worry', 'heart racing', 'breathless', 'fear', 'dread'],
    response: `### 🛡️ Coping with Anxiety & Panic

If you are experiencing acute anxiety or racing thoughts, let's take a moment together:

1. **4-7-8 Calming Breath (Vagus Nerve Reset):**
   - Inhale quietly through your nose for **4 seconds**
   - Hold your breath gently for **7 seconds**
   - Exhale completely through your mouth with a soft whoosh for **8 seconds**
   - *This signals your nervous system to shift from fight-or-flight into rest-and-digest.*

2. **Decatastrophizing:**
   - Ask yourself: *"Is this thought a fact or a feeling?"*
   - *"What is the most likely outcome rather than the worst-case scenario?"*
   - *"If the worst did happen, what is one step I could take to handle it?"*

3. **Physical Anchoring:**
   - Place both feet firmly flat on the floor. Feel the support beneath you. Place one hand on your chest and one on your belly.

🤝 *You don't have to navigate anxiety alone. Our licensed therapists specialize in Cognitive Behavioral Therapy (CBT). You can book a session anytime on HealMind.*`
  },
  {
    keywords: ['depression', 'sad', 'empty', 'hopeless', 'lonely', 'unmotivated', 'cry', 'dark', 'low', 'down'],
    response: `### 💙 Navigating Low Mood & Depression

When going through difficult times, even small steps are meaningful victories:

1. **Behavioral Activation (Micro-Steps):**
   - When motivation is low, action precedes motivation. Choose an extremely small, low-effort goal: drinking a glass of water, opening a window for fresh air, or stepping outside for 3 minutes.

2. **Self-Compassion:**
   - Speak to yourself as you would to a close friend experiencing pain. Give yourself permission to rest without self-criticism.

3. **Connection:**
   - Reach out to one trusted friend, family member, or share thoughts in our supportive [HealMind Community](/community).

4. **Professional Support:**
   - Therapy can provide a safe space and structured tools for recovery. Browse our certified psychologists and book a confidential consultation on [Find Doctors](/doctors).`
  },
  {
    keywords: ['mindful', 'meditat', 'breathe', 'breathing', 'present', 'calm', 'peace'],
    response: `### 🧘 Quick Mindfulness & Centering Exercise

Let's practice a 1-minute mindfulness pause:

1. **Sit comfortably** with your spine relaxed and eyes softly closed or looking downward.
2. **Observe your breath** naturally without trying to change its rhythm. Notice the sensation of cool air entering your nostrils and warm air leaving.
3. **When thoughts wander** (and they will!), simply acknowledge them like passing clouds in the sky: *"There is a thought,"* and gently guide your attention back to your breath.
4. Take one deep, nourishing breath in... and let go of any tension as you exhale.`
  },
  {
    keywords: ['doctor', 'therapist', 'specialist', 'psychiatrist', 'psychologist', 'book', 'appointment', 'session', 'consultation'],
    response: `### 🩺 Connecting with HealMind Specialists

You can easily find and connect with certified mental health professionals on HealMind:

1. **Browse Specialists:** Visit our **[Doctors Directory](/doctors)** to filter by specialization (CBT, Trauma, Anxiety, Relationship, Family Therapy, etc.) and view verified reviews and pricing.
2. **Book an Appointment:** Select a doctor, choose your preferred available slot, and confirm your booking.
3. **Consultation Options:** We offer secure HD video sessions and live text chats.

Need help with booking or insurance? You can also create a support ticket in [Support Tickets](/tickets).`
  },
  {
    keywords: ['suicide', 'kill myself', 'end my life', 'hurt myself', 'die', 'self-harm', 'emergency', 'crisis'],
    response: `### 🚨 Urgent Crisis Support & Immediate Help

**If you or someone you know is in immediate danger or having thoughts of self-harm, please reach out for help immediately. You are not alone, and support is available 24/7:**

- **United States & Canada:**
  - Call or text **988** (988 Suicide & Crisis Lifeline)
  - Text **HOME** to **741741** (Crisis Text Line)
- **United Kingdom:**
  - Call **111** (NHS Mental Health) or call **116 123** (Samaritans)
- **Egypt & Middle East:**
  - Egypt Mental Health Helpline: **16328** or **08008880700**
  - Emergency Ambulance: **123** / Police: **122**
- **International:**
  - Find your local emergency resource: [Befrienders Worldwide](https://www.befrienders.org/) or [Find A Helpline](https://findahelpline.com/)

*Please reach out to an emergency room, crisis hotline, or a trusted person right now. People care about you and want to help.*`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'who are you', 'help'],
    response: `Hello! I am your **HealMind AI Assistant**, designed to provide evidence-based mental health information, emotional wellness techniques, and guidance on navigating the HealMind platform.

How are you feeling today? You can ask me about:
- 🌿 Managing stress and preventing burnout
- 🛡️ Coping techniques for anxiety and panic
- 🌙 Improving sleep quality and nighttime routines
- 🧘 Guided breathing and mindfulness exercises
- 🩺 How to find and book appointments with our licensed doctors`
  }
];

/**
 * Generate intelligent fallback response when external RAG is unavailable
 */
function generateAssistantResponse(query, chatHistory = []) {
  const q = (query || '').toLowerCase().trim();

  // Check crisis keywords first
  const crisisItem = KNOWLEDGE_TOPICS.find((item) =>
    item.keywords.some((kw) => ['suicide', 'kill myself', 'end my life', 'hurt myself', 'self-harm'].includes(kw) && q.includes(kw))
  );
  if (crisisItem) return crisisItem.response;

  // Match topic keywords
  let bestMatch = null;
  let maxScore = 0;

  for (const topic of KNOWLEDGE_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && maxScore > 0) {
    return bestMatch.response;
  }

  // Conversational response
  return `Thank you for sharing that. Mental well-being is a journey, and taking time to reflect on how you feel is an important step.

Here are a few supportive practices you can explore:
1. **Name the Emotion:** Simply identifying what you are feeling (e.g., *"I feel overwhelmed"* or *"I feel disconnected"*) helps engage the cognitive brain and reduces emotional intensity.
2. **Grounding Moment:** Take 3 slow, deep belly breaths. Notice the sensation of relaxation on each exhale.
3. **One Gentle Action:** What is one kind thing you can do for yourself in the next 15 minutes?

If you'd like specific techniques, feel free to ask about **managing stress**, **coping with anxiety**, **improving sleep**, or **booking a consultation with a specialist on HealMind**.`;
}

/**
 * POST /api/rag/chat
 * Handles AI chat queries with external RAG forward & built-in clinical fallback
 */
const handleAIChat = async (req, res) => {
  try {
    const { message, chat_history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
      });
    }

    const trimmed = message.trim();
    const ragServiceUrl = process.env.RAG_SERVICE_URL || 'https://mindful-rag-latest.onrender.com';

    // Attempt to call external RAG service with a 6-second timeout
    let externalSuccess = false;
    let externalResponse = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const upstreamRes = await fetch(`${ragServiceUrl.replace(/\/+$/, '')}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          chat_history,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (upstreamRes.ok) {
        const data = await upstreamRes.json();
        const text = data.response || data.reply || data.message || data.text;
        if (text) {
          externalResponse = text;
          externalSuccess = true;
        }
      }
    } catch (err) {
      // External service down / timeout / sleeping: fallback gracefully
      externalSuccess = false;
    }

    if (externalSuccess && externalResponse) {
      return res.status(200).json({
        success: true,
        response: externalResponse,
        source: 'rag-service',
      });
    }

    // Fallback to intelligent mental health assistant
    const fallbackResponse = generateAssistantResponse(trimmed, chat_history);

    return res.status(200).json({
      success: true,
      response: fallbackResponse,
      source: 'healmind-ai-core',
    });
  } catch (error) {
    console.error('RAG Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat request.',
      response: 'I am here with you. Please take a deep breath. You can also explore our licensed specialists on the Doctors page.',
    });
  }
};

module.exports = {
  handleAIChat,
};
