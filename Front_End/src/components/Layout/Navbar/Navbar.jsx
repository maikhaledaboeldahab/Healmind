import { useState } from "react";
import { NavLink } from "react-router-dom";


const navLinks = [
  { label: "Home", to: "/home" },
  { label: "About Us", to: "/about" },
  { label: "Tests", to: "/tests" },
  { label: "Community", to: "/community" },
  { label: "Profile", to: "/profile" },
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom sticky-top px-4 py-2">
      <NavLink to="/home" className="navbar-brand fw-bold" style={{ color: "#1a3a2e" }}>
        HealMind
      </NavLink>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav me-auto mb-0">
          {navLinks.map(({ label, to }) => (
            <li className="nav-item" key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "fw-semibold text-decoration-underline" : "text-secondary"}`
                }
                style={({ isActive }) => ({ color: isActive ? "#1a3a2e" : "" })}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="d-flex align-items-center gap-2">
          {searchOpen && (
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              onBlur={() => setSearchOpen(false)}
              className="form-control form-control-sm rounded-pill"
              style={{ width: "160px" }}
            />
          )}
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="btn btn-link text-secondary p-1"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>

          <NavLink
            to="/"
            className="btn rounded-pill px-4 text-white"
            style={{ backgroundColor: "#1a3a2e", fontSize: "14px" }}
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </nav>
  );
}