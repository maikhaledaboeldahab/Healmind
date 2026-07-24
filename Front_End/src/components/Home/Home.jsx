import React from "react";
import styles from "./Home.module.css";
import heroIllustration from "../../assets/hero.png";
import chatbotImg from "../../assets/Chat bot-bro.png";
import therapistImg from "../../assets/Mental health-bro.png";


const articles = [
  {
    id: 1,
    tag: "Anxiety",
    title: "Understanding Anxiety: When Worry Becomes Too Much",
    excerpt:
      "Anxiety is a natural response to stress, but when it starts interfering with daily life, it's time to seek support. Learn how to recognize the signs.",
    readTime: "4 min read",
    emoji: "🌿",
  },
  {
    id: 2,
    tag: "Self-Care",
    title: "5 Daily Habits That Quietly Protect Your Mental Health",
    excerpt:
      "Small, consistent actions — from morning routines to mindful breathing — can build remarkable resilience over time.",
    readTime: "5 min read",
    emoji: "🧘",
  },
  {
    id: 3,
    tag: "Depression",
    title: "The Difference Between Sadness and Depression",
    excerpt:
      "Not all low moods are depression. Understanding the distinction helps you seek the right kind of help at the right time.",
    readTime: "6 min read",
    emoji: "💙",
  },
  {
    id: 4,
    tag: "Sleep",
    title: "How Poor Sleep and Mental Health Feed Each Other",
    excerpt:
      "The relationship between sleep and emotional wellbeing is bidirectional — and breaking the cycle starts with simple changes.",
    readTime: "4 min read",
    emoji: "🌙",
  },
];

// ── stats ──
const stats = [
  { number: "1 in 4", label: "people experience a mental health condition each year" },
  { number: "70%",    label: "of adults say stress impacts their physical health" },
  { number: "80%",    label: "of people who seek help report significant improvement" },
];

export default function Home() {
  return (
    <main className={styles.main}>

    
      <section className={styles.hero}>
        <div className="container">
          <div className={`row align-items-center ${styles.heroRow}`}>
            <div className={`col-lg-6 ${styles.heroText}`}>
              <span className={styles.eyebrow}>Mental Wellness Platform</span>
              <h1 className={styles.heroTitle}>
                Life is too short<br />
                to spend it at war<br />
                <span className={styles.heroAccent}>with yourself.</span>
              </h1>
              <p className={styles.heroSub}>
                HealMind is your safe space — a place to understand yourself,
                connect with professionals, and grow at your own pace.
              </p>
              <div className={styles.heroBtns}>
                <a href="/register" className={`btn ${styles.btnPrimary}`}>
                  Apply Now →
                </a>
                <a href="#chatbot" className={`btn ${styles.btnOutlineHero}`}>
                  Try the Chat Bot
                </a>
              </div>
            </div>
            <div className={`col-lg-6 ${styles.heroImage}`}>
              <div className={styles.heroImgWrapper}>
                
                <img src={heroIllustration} alt="Mind & Heart illustration" />
                <div className={styles.floatCard1}>
                  <span>🌱</span> Growth starts within
                </div>
                <div className={styles.floatCard2}>
                  <span>💚</span> You are not alone
                </div>
              </div>
            </div>
          </div>
        </div>
       
      </section>

      <section className={styles.statsSection}>
        <div className="container">
          <div className="row justify-content-center g-4">
            {stats.map((s, i) => (
              <div className="col-md-4" key={i}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{s.number}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.chatbotSection} id="chatbot">
       
        <div className="container">
          <div className="row align-items-center g-5">
            <div className={`col-lg-5 ${styles.chatbotImgCol}`}>
              <img
                src={chatbotImg}
                alt="HealMind Chat Bot"
                className={styles.sectionIllustration}
              />
            </div>
            <div className="col-lg-7">
              <span className={styles.sectionTag}>Always Available</span>
              <h2 className={styles.sectionTitle}>Chat Bot</h2>
              <p className={styles.sectionText}>
                Your mental health companion, available anytime to provide
                support, guidance, and resources tailored just for you.
                Whether it's 3 AM or a busy afternoon — we're here.
              </p>
              <ul className={styles.featureList}>
                <li>✦ Empathetic, judgment-free conversations</li>
                <li>✦ Personalized coping strategies</li>
                <li>✦ Crisis resource suggestions when needed</li>
              </ul>
              <a href="/chat" className={`btn ${styles.btnPrimary}`}>
                Try Now
              </a>
            </div>
          </div>
        </div>
  
      </section>

      <section className={styles.testsSection} id="tests">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className={styles.sectionTag}>Know Yourself</span>
              <h2 className={styles.sectionTitle}>Psychological Tests</h2>
              <p className={styles.sectionText}>
                Discover your mental well-being. Take a quick, science-backed
                test to learn more about yourself — from anxiety levels to
                emotional resilience and beyond.
              </p>
              <div className={styles.testCards}>
                {["Anxiety Assessment", "Depression Screening", "Stress Index", "Emotional Intelligence"].map((t, i) => (
                  <div className={styles.testPill} key={i}>
                    <span className={styles.testPillDot} />
                    {t}
                  </div>
                ))}
              </div>
              <a href="/tests" className={`btn ${styles.btnPrimary} mt-4`}>
                Test Yourself →
              </a>
            </div>
            <div className="col-lg-5">
              <div className={styles.testIllustration}>
                <div className={styles.checklistCard}>
                  <div className={styles.checklistHeader}>Your Wellness Check</div>
                  {["How are you sleeping?", "How is your stress today?", "Are you feeling connected?"].map((q, i) => (
                    <div className={styles.checklistItem} key={i}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>{q}</span>
                    </div>
                  ))}
                  <div className={styles.checklistCTA}>View Full Test →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.articlesSection} id="articles">
        
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Learn &amp; Grow</span>
            <h2 className={styles.sectionTitle}>Mental Health Insights</h2>
            <p className={styles.sectionSubtitle}>
              Thoughtful articles to help you understand yourself and the world around you.
            </p>
          </div>
          <div className="row g-4">
            {articles.map((a) => (
              <div className="col-md-6 col-lg-3" key={a.id}>
                <div className={styles.articleCard}>
                  <div className={styles.articleEmoji}>{a.emoji}</div>
                  <span className={styles.articleTag}>{a.tag}</span>
                  <h3 className={styles.articleTitle}>{a.title}</h3>
                  <p className={styles.articleExcerpt}>{a.excerpt}</p>
                  <div className={styles.articleFooter}>
                    <span className={styles.readTime}>⏱ {a.readTime}</span>
                    <a href={`/articles/${a.id}`} className={styles.readMore}>Read →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <a href="/articles" className={`btn ${styles.btnOutlineDark}`}>
              View All Articles
            </a>
          </div>
        </div>
      
      </section>
      <section className={styles.therapistsSection} id="therapists">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className={`col-lg-5 ${styles.therapistImgCol}`}>
              <img
                src={therapistImg}
                alt="Connect with therapists"
                className={styles.sectionIllustration}
              />
            </div>
            <div className="col-lg-7">
              <span className={styles.sectionTag}>Professional Support</span>
              <h2 className={styles.sectionTitle}>Therapists</h2>
              <p className={styles.sectionText}>
                You are not alone. We're here to connect you with trusted
                therapists who can guide and support you every step of the way.
              </p>
              <a href="/therapists" className={`btn ${styles.btnPrimary}`}>
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA BANNER ═══════════════════ */}
      <section className={styles.ctaBanner}>
        <div className="container text-center">
          <h2 className={styles.ctaTitle}>Your healing journey starts today.</h2>
          <p className={styles.ctaText}>
            Join thousands of people who chose to invest in their mental wellbeing.
          </p>
          <a href="/register" className={`btn ${styles.btnLight}`}>
            Get Started — It's Free
          </a>
        </div>
      </section>

    </main>
  );
}
