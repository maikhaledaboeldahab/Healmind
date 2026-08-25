import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const features = [
  {
    icon: "🧠",
    title: "Understand Yourself",
    description:
      "Learn more about your mental wellbeing through simple, accessible guidance.",
  },
  {
    icon: "👩‍⚕️",
    title: "Professional Support",
    description:
      "Connect with qualified mental health professionals when you need support.",
  },
  {
    icon: "🤖",
    title: "AI Support",
    description:
      "Get immediate guidance and helpful resources through our AI assistant.",
  },
  {
    icon: "🤝",
    title: "A Supportive Community",
    description:
      "Share experiences, connect with others, and know that you are not alone.",
  },
];

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "Explore your mental wellbeing and better understand what you are experiencing.",
  },
  {
    number: "02",
    title: "Get Support",
    description:
      "Find the right professional support and resources for your journey.",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Stay connected with professionals, AI support, and a caring community.",
  },
];

const Home = () => {
  return (
    <div className={styles.page}>
      {/* ================= NAVBAR ================= */}
      <header className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>H</span>
          <span>HealMind</span>
        </Link>

        <nav className={styles.navLinks}>
          <a href="#home">Home</a>
          <a href="#why">Why HealMind</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>

        <div className={styles.navActions}>
          <Link to="/login" className={styles.loginButton}>
            Login
          </Link>

          <Link to="/register" className={styles.signupButton}>
            Sign Up
          </Link>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section id="home" className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot}></span>
              Your mental wellbeing matters
            </div>

            <h1>
              Your Mental Health,
              <span> Your Safe Space.</span>
            </h1>

            <p className={styles.heroText}>
              Understand your mental health, get professional support,
              connect with a caring community, and never feel alone in
              your journey.
            </p>

            <div className={styles.heroActions}>
              <Link to="/register" className={styles.primaryButton}>
                Start Your Journey
                <span>→</span>
              </Link>

              <a href="#how-it-works" className={styles.secondaryButton}>
                See How It Works
              </a>
            </div>

            <div className={styles.heroTrust}>
              <div className={styles.avatarStack}>
                <span>👩🏻</span>
                <span>👨🏽</span>
                <span>👩🏽</span>
                <span>+</span>
              </div>

              <p>
                A safe space for
                <strong> your mental wellbeing</strong>
              </p>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.blob}></div>

            <div className={styles.illustrationCard}>
              <div className={styles.illustrationTop}>
                <span className={styles.miniLabel}>HEALMIND</span>
                <span className={styles.heart}>♡</span>
              </div>

              <div className={styles.personIllustration}>
                <div className={styles.sun}></div>

                <div className={styles.person}>
                  <div className={styles.head}></div>
                  <div className={styles.body}></div>
                  <div className={styles.arm}></div>
                </div>

                <div className={styles.plant}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>

              <div className={styles.quoteCard}>
                <span>✦</span>
                <p>
                  "Taking care of your mind
                  <strong> is a form of self-care.</strong>"
                </p>
              </div>
            </div>

            <div className={styles.floatingCard}>
              <span>✦</span>
              <div>
                <strong>You are not alone.</strong>
                <small>We're here to support you.</small>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY HEALMIND ================= */}
        <section id="why" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>WHY HEALMIND?</span>

            <h2>
              Everything you need
              <br />
              <span>for a healthier mind.</span>
            </h2>

            <p>
              HealMind brings the essential pieces of mental health support
              together in one safe and welcoming space.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <article className={styles.featureCard} key={feature.title}>
                <div className={styles.featureIcon}>{feature.icon}</div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                {/* <span className={styles.featureArrow}>→</span> */}
              </article>
            ))}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how-it-works" className={styles.howSection}>
          <div className={styles.howHeader}>
            <div>
              <span className={styles.sectionTag}>HOW IT WORKS</span>

              <h2>
                Your journey starts
                <br />
                <span>with one step.</span>
              </h2>
            </div>

            <p>
              We make getting mental health support simple, accessible,
              and comfortable.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>{step.number}</span>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className={styles.stepArrow}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className={styles.aboutSection}>
          <div className={styles.aboutCard}>
            <div className={styles.aboutIcon}>♡</div>

            <div>
              <span className={styles.sectionTag}>A SPACE FOR YOU</span>

              <h2>
                You don't have to
                <br />
                <span>do it alone.</span>
              </h2>

              <p>
                Whether you are looking for professional support, trying
                to understand how you feel, or simply need someone to
                connect with — HealMind is here for you.
              </p>

              <Link to="/register" className={styles.primaryButton}>
                Start Your Journey
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>H</span>
            <span>HealMind</span>
          </Link>

          <p>
            A safe space for understanding,
            support, and connection.
          </p>
        </div>

        <div className={styles.footerLinks}>
          <div>
            <h4>Explore</h4>
            <a href="#home">Home</a>
            <a href="#why">Why HealMind</a>
            <a href="#how-it-works">How it works</a>
          </div>

          <div>
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2026 HealMind. All rights reserved.</span>
          <span>Your wellbeing matters.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;