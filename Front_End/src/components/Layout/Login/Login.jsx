import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '', remember: false })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Login data:', formData)
    navigate('/home')
  }

  return (
    <>
      <style>{`
        :root {
          --gd: #16342c;
          --gm: #2d4b42;
          --ga: #4a654e;
          --light-bg: #f8faf8;
          --input-bg: #eceeec;
          --text-muted: #414845;
          --border-color: #c1c8c4;
        }
        .organic-shape {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .soft-shadow {
          box-shadow: 0px 10px 30px rgba(45, 75, 66, 0.15);
        }
        .btn-healmind {
          background-color: var(--gd);
          color: white;
          border-radius: 50px;
          padding: 14px 24px;
          font-weight: 700;
          border: none;
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .btn-healmind:hover {
          background-color: var(--gm);
          color: white;
        }
        .btn-healmind:active {
          transform: scale(0.97);
        }
        .form-control-healmind {
          background-color: var(--input-bg);
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 14px 14px 14px 48px;
          font-size: 15px;
          transition: all 0.2s ease;
        }
        .form-control-healmind:focus {
          background-color: white;
          border-color: var(--gd);
          box-shadow: 0 0 0 4px rgba(22, 52, 44, 0.08);
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #727975;
          font-size: 20px;
          pointer-events: none;
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .left-panel {
          background-color: var(--gd);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .left-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0; left: 0;
          transform: scale(1.05);
        }
        .left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(22,52,44,0.4), rgba(0,0,0,0.2));
        }
        .left-content {
          position: relative;
          z-index: 2;
          color: white;
          padding: 48px 40px;
        }
        .social-btn {
          border: 1px solid rgba(193,200,196,0.4);
          border-radius: 50%;
          padding: 12px;
          background: transparent;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .social-btn:hover {
          background: var(--input-bg);
        }
        .divider-text {
          background: white;
          padding: 0 12px;
          color: #727975;
          font-size: 13px;
          position: relative;
          z-index: 1;
        }
        .link-green {
          color: var(--gd);
          font-weight: 700;
          text-decoration: none;
        }
        .link-green:hover {
          text-decoration: underline;
          color: var(--gm);
        }
        .healmind-title {
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
        }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div className="container-fluid p-0" style={{ minHeight: '100vh' }}>
        <div className="row g-0" style={{ minHeight: '100vh' }}>

          {/* ===== Left Panel ===== */}
          <div className="col-md-6 col-lg-7 d-none d-md-flex left-panel align-items-center">
            {/* ← ضعي الصورة هنا */}
            <img src="YOUR_IMAGE_HERE" alt="Serene forest" />
            <div className="left-overlay"></div>
            <div className="left-content">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span style={{
                  fontFamily: 'Material Symbols Outlined',
                  fontSize: 40,
                  color: '#adcec2',
                  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                }}>spa</span>
                <h1 className="healmind-title fs-3 mb-0">HealMind</h1>
              </div>
              <h2 className="healmind-title mb-4" style={{ fontSize: '2.6rem', lineHeight: 1.2 }}>
                Your journey to mental clarity begins here.
              </h2>
              <p className="text-white-50" style={{ fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480 }}>
                Reconnect with yourself through a grounded, professional approach to mental well-being.
                We provide the space for you to breathe and grow.
              </p>
            </div>
          </div>

          {/* ===== Right Panel: Form ===== */}
          <div className="col-12 col-md-6 col-lg-5 d-flex flex-column align-items-center justify-content-center bg-white p-4 p-lg-5">

            {/* Mobile Logo */}
            <div className="d-flex d-md-none flex-column align-items-center mb-4">
              <span style={{
                fontFamily: 'Material Symbols Outlined',
                fontSize: 36,
                color: '#16342c',
                fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
              }}>spa</span>
              <span className="healmind-title fs-4" style={{ color: '#16342c' }}>HealMind</span>
            </div>

            <div className="w-100" style={{ maxWidth: 420 }}>

              {/* Heading */}
              <div className="mb-4">
                <h2 className="healmind-title fw-bold mb-2" style={{ color: '#16342c', fontSize: '1.9rem' }}>
                  Welcome Back
                </h2>
                <p style={{ color: '#414845' }}>
                  We've missed you. Take a deep breath and enter your sanctuary.
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold small" style={{ color: '#414845' }}>
                    Email Address
                  </label>
                  <div className="position-relative">
                    <span className="input-icon">alternate_email</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control form-control-healmind"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label htmlFor="password" className="form-label fw-semibold small mb-0" style={{ color: '#414845' }}>
                      Password
                    </label>
                    <a href="#" className="link-green small">Forgot Password?</a>
                  </div>
                  <div className="position-relative">
                    <span className="input-icon">lock_open</span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control form-control-healmind"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    style={{ accentColor: '#16342c' }}
                  />
                  <label className="form-check-label small" htmlFor="remember" style={{ color: '#414845' }}>
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-healmind w-100 soft-shadow d-flex align-items-center justify-content-center gap-2">
                  <span>Enter Sanctuary</span>
                  <span style={{
                    fontFamily: 'Material Symbols Outlined',
                    fontSize: 20,
                    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                  }}>arrow_forward</span>
                </button>
              </form>

              {/* Divider */}
              <div className="position-relative text-center my-4">
                <hr style={{ borderColor: 'rgba(193,200,196,0.3)' }} />
                <span className="divider-text position-absolute top-50 start-50 translate-middle">
                  or join with
                </span>
              </div>

              {/* Social Buttons */}
              <div className="d-flex justify-content-center gap-3 mb-4">
                <button type="button" className="social-btn" aria-label="Sign in with Google">
                  {/* ← ضعي أيقونة Google هنا */}
                  <img src="YOUR_GOOGLE_ICON_HERE" alt="Google" style={{ width: 24, height: 24 }} />
                </button>
                <button type="button" className="social-btn" aria-label="Sign in with Apple">
                  <span style={{
                    fontFamily: 'Material Symbols Outlined',
                    fontSize: 24,
                    color: '#c1c8c4',
                    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                  }}>ios</span>
                </button>
              </div>

              {/* Register Link */}
              <p className="text-center small" style={{ color: '#414845' }}>
                New to HealMind?{' '}
                <Link to="/register" className="link-green">Create an account</Link>
              </p>

              {/* Footer */}
              <p className="text-center mt-4" style={{ fontSize: 11, color: '#c1c8c4', letterSpacing: '0.2em', fontWeight: 700 }}>
                © 2024 HEALMIND MENTAL WELLNESS
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}