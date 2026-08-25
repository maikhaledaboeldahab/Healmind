import React from "react";
import { Link } from "react-router-dom";
import style from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className="py-5" style={{ backgroundColor: "#214137" }}>
      <div className="container">
        <div className="row g-4 mb-5">

          {/* Brand */}
          <div className="col-lg-5 col-md-12">
            <h3
              className="fw-bold text-white mb-3"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              🌿 HealMind
            </h3>

            <p
              className="mb-0"
              style={{
                color: "rgba(255,255,255,0.5)",
                lineHeight: "1.7",
                fontSize: "0.9rem",
              }}
            >
              A safe space for mental wellness — connecting you with tools,
              insights, and professionals to support your journey.
            </p>
          </div>

          {/* Platform */}
          <div className="col-lg-2 col-md-4 col-6">
            <h6
              className="text-uppercase mb-3"
              style={{
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "1px",
              }}
            >
              Platform
            </h6>

            <ul className="list-unstyled">
              <li><Link to="/chatbot" className={style.footerLink}>Chat Bot</Link></li>
              <li><Link to="/tests" className={style.footerLink}>Tests</Link></li>
              <li><Link to="/articles" className={style.footerLink}>Articles</Link></li>
              <li><Link to="/therapists" className={style.footerLink}>Therapists</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-lg-2 col-md-4 col-6">
            <h6
              className="text-uppercase mb-3"
              style={{
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "1px",
              }}
            >
              Company
            </h6>

            <ul className="list-unstyled">
              <li><Link to="/about" className={style.footerLink}>About</Link></li>
              <li><Link to="/blog" className={style.footerLink}>Blog</Link></li>
              <li><Link to="/careers" className={style.footerLink}>Careers</Link></li>
              <li><Link to="/press" className={style.footerLink}>Press</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-lg-3 col-md-4 col-12">
            <h6
              className="text-uppercase mb-3"
              style={{
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "1px",
              }}
            >
              Legal
            </h6>

            <ul className="list-unstyled">
              <li><Link to="/privacy" className={style.footerLink}>Privacy</Link></li>
              <li><Link to="/terms" className={style.footerLink}>Terms</Link></li>
              <li><Link to="/cookies" className={style.footerLink}>Cookies</Link></li>
              <li><Link to="/contact" className={style.footerLink}>Contact</Link></li>
            </ul>
          </div>

        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.08)" }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <span
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.85rem",
            }}
          >
            © 2025 HealMind. All rights reserved.
          </span>

          <span
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.85rem",
            }}
          >
            Made with 💚 for better mental health
          </span>
        </div>
      </div>
    </footer>
  );
}