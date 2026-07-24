import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    terms: false
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match!')
      return
    }
    if (!formData.terms) {
      alert('Please agree to the Terms of Service.')
      return
    }
    console.log('Register data:', formData)
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
          --input-bg: #f2f4f2;
          --text-muted-custom: #414845;
          --border-color: #c1c8c4;
        }
        .organic-shape {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .soft-shadow {
          box-shadow: 0px 10px 40px rgba(45, 75, 66, 0.12);
        }
        .btn-healmind {
          background-color: var(--gd);
          color: white;
          border-radius: 50px;
          padding: 15px 24px;
          font-weight: 700;
          border: none;
          font-size: 15px;
          transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
        }
        .btn-healmind:hover {
          background-color: var(--gm);
          color: white;
          box-shadow: 0 8px 24px rgba(22,52,44,0.25);
        }
        .btn-healmind:active {
          transform: scale(0.98);
        }
        .form-control-healmind {
          background-color: var(--input-bg);
          border: 2px solid transparent;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 15px;
          transition: all 0.2s ease;
        }
        .form-control-healmind:focus {
          background-color: white;
          border-color: var(--gd);
          box-shadow: 0 0 0 4px rgba(22, 52, 44, 0.07);
        }
        .right-panel {
          background-color: #2d4b42;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .right-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0; left: 0;
          transform: scale(1.05);
          opacity: 0.65;
          mix-blend-mode: overlay;
        }
        .right-content {
          position: relative;
          z-index: 2;
          color: white;
          padding: 80px 60px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .testimonial-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 32px;
          transition: transform 0.2s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
        }
        .avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #cceace;
          display: flex;
          align-items: center;
          justify-content: center;
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
        .decor-blob {
          position: absolute;
          bottom: -120px;
          right: -120px;
          width: 380px;
          height: 380px;
          background: #16342c;
          opacity: 0.3;
          filter: blur(60px);
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

      <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#f8faf8' }}>
        <div className="row g-0" style={{ minHeight: '100vh' }}>

          {/* ===== Left Panel: Form ===== */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-4 p-lg-5"
            style={{ backgroundColor: '#f8faf8' }}>
            <div className="w-100" style={{ maxWidth: 440 }}>

              {/* Branding */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span style={{
                    fontFamily: 'Material Symbols Outlined',
                    fontSize: 30,
                    color: '#16342c',
                    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                  }}>spa</span>
                  <span className="healmind-title fs-4" style={{ color: '#16342c' }}>HealMind</span>
                </div>
                <h1 className="healmind-title mb-2" style={{ fontSize: '2.4rem', color: '#191c1b', lineHeight: 1.2 }}>
                  Begin your path to peace.
                </h1>
                <p style={{ color: '#414845', fontSize: '1rem' }}>
                  We're glad you're here. Join our community and take the first step toward lasting mental wellness.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>

                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="full_name" className="form-label small fw-semibold" style={{ color: '#414845' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    className="form-control form-control-healmind"
                    placeholder="How should we call you?"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-semibold" style={{ color: '#414845' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control form-control-healmind"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label small fw-semibold" style={{ color: '#414845' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control form-control-healmind"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label htmlFor="confirm_password" className="form-label small fw-semibold" style={{ color: '#414845' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    className="form-control form-control-healmind"
                    placeholder="Repeat your password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                </div>

                {/* Terms */}
                <div className="form-check mb-4 mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    style={{ accentColor: '#16342c' }}
                  />
                  <label className="form-check-label small" htmlFor="terms" style={{ color: '#414845' }}>
                    I agree to the{' '}
                    <a href="#" className="link-green">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="link-green">Privacy Policy</a>.
                  </label>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-healmind w-100 soft-shadow">
                  Create Account
                </button>
              </form>

              {/* Sign In Link */}
              <p className="text-center mt-4 small" style={{ color: '#414845' }}>
                Already have an account?{' '}
                <Link to="/" className="link-green">Sign In</Link>
              </p>
            </div>
          </div>

          {/* ===== Right Panel: Visual ===== */}
          <div className="col-md-6 d-none d-md-block right-panel">
            {/* ← ضعي الصورة هنا */}
            <img src="YOUR_IMAGE_HERE" alt="Serene landscape" />

            <div className="right-content">
              <div style={{ maxWidth: 480 }}>

                {/* Decorative blob */}
                <div className="organic-shape mb-4" style={{
                  width: 100, height: 100,
                  backgroundColor: 'rgba(74,101,78,0.35)',
                  backdropFilter: 'blur(8px)'
                }}></div>

                <h2 className="healmind-title mb-4" style={{ fontSize: '2.6rem', lineHeight: 1.2 }}>
                  Your mental wellness journey starts here.
                </h2>
                <p className="mb-5" style={{ fontSize: '1.1rem', color: '#99baae', lineHeight: 1.7 }}>
                  Connect with licensed therapists, track your progress with daily reflections,
                  and join a supportive community dedicated to mental health.
                </p>

                {/* Testimonial */}
                <div className="testimonial-card soft-shadow">
                  <p className="fst-italic mb-4" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
                    "HealMind provided the safe space I didn't know I needed. The environment here
                    feels genuinely supportive and truly professional."
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar-circle">
                      <span style={{
                        fontFamily: 'Material Symbols Outlined',
                        color: '#16342c',
                        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                      }}>face</span>
                    </div>
                    <div>
                      <p className="healmind-title small fw-bold mb-0">Sarah Jenkins</p>
                      <p className="mb-0" style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Community Member
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="decor-blob organic-shape"></div>

            {/* Icons top right */}
            <div className="position-absolute top-0 end-0 p-4 d-flex gap-3">
              {['psychology', 'nature', 'self_improvement'].map(icon => (
                <span key={icon} style={{
                  fontFamily: 'Material Symbols Outlined',
                  fontSize: 22,
                  color: 'rgba(255,255,255,0.45)',
                  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                }}>{icon}</span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="py-4 border-top" style={{ backgroundColor: '#f8faf8', borderColor: 'rgba(193,200,196,0.2) !important' }}>
          <div className="container-fluid px-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <p className="small mb-0" style={{ color: '#414845' }}>© 2024 HealMind. All rights reserved.</p>
              <div className="d-flex gap-4">
                {['Privacy Policy', 'Terms of Service', 'Help Center'].map(item => (
                  <a key={item} href="#" className="small text-decoration-none" style={{ color: '#414845' }}
                    onMouseEnter={e => e.target.style.color = '#16342c'}
                    onMouseLeave={e => e.target.style.color = '#414845'}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}