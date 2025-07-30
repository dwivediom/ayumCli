import React, { useContext } from "react";
import { AccountContext } from "../context/AccountProvider";
import English from "../public/locales/en/index";
import Hindi from "../public/locales/hi/index";
import { useRouter } from "next/router";

const Footer = () => {
  const { lang, setadminmode } = useContext(AccountContext);

  const socialLinks = [
    {
      name: lang == "en" ? English.instagram : Hindi.instagram,
      url: "https://www.instagram.com/ayum_healthcare/",
      color: "#E4405F",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: lang == "en" ? English.facebook : Hindi.facebook,
      url: "https://www.instagram.com/ayum_healthcare/",
      color: "#1877F2",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: lang == "en" ? English.twitter : Hindi.twitter,
      url: "https://twitter.com/ayum_health",
      color: "#000000",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: lang == "en" ? English.linkedin : Hindi.linkedin,
      url: "https://www.linkedin.com/in/ayum-in-263828257/",
      color: "#0A66C2",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { name: "Terms & Conditions", href: "/termsconditions", icon: "📋" },
    { name: "Privacy Policy", href: "/PrivacyPolicy", icon: "🔒" },
    { name: "Refund Policy", href: "/refundpolicy", icon: "💰" },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">
            <span className="title-icon">🔗</span>
            Quick Links
          </h3>
          <div className="footer-links">
            {quickLinks.map((link, index) => (
              <a key={index} href={link.href} className="footer-link">
                <span className="link-icon">{link.icon}</span>
                <span className="link-text">{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">
            <span className="title-icon">🤝</span>
            Connect With Us
          </h3>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                style={{ "--social-color": social.color }}
              >
                <div className="social-icon">{social.icon}</div>
                <span className="social-name">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright-section">
            <p className="copyright">
              © 2025 Ayum Healthcare Private Ltd. All rights reserved.
            </p>
            <div className="footer-badges">
              <span className="badge">Ayum Healthcare</span>
              <span className="badge">💚 Trusted</span>
              <span className="badge">🔬 Quality</span>
            </div>
          </div>
          {/* <button className="version-btn" onClick={() => setadminmode(true)}>
            <span className="version-icon">⚙️</span>
            Version 0.0
          </button> */}
        </div>
      </div>

      <style jsx>{`
        .footer-container {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 3rem 1.5rem 2rem;
          margin-top: 3rem;
          border-top: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .footer-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            #3b82f6,
            #8b5cf6,
            #06b6d4,
            #10b981
          );
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .footer-section {
          margin-bottom: 2.5rem;
        }

        .footer-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: relative;
        }

        .title-icon {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .footer-title::after {
          content: "";
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 3rem;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .footer-link:hover {
          color: #1e293b;
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .link-icon {
          font-size: 1.2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .link-text {
          font-weight: 600;
        }

        .social-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          padding: 1rem;
          border-radius: 16px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--social-color);
          position: relative;
          overflow: hidden;
        }

        .social-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s ease;
        }

        .social-link:hover::before {
          left: 100%;
        }

        .social-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.9);
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .social-link:hover .social-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .social-name {
          font-weight: 600;
        }

        .footer-bottom {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        .copyright-section {
          text-align: center;
        }

        .copyright {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .footer-badges {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .badge {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }

        .badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .version-btn {
          background: linear-gradient(135deg, #64748b, #475569);
          border: none;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
        }

        .version-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 116, 139, 0.4);
          background: linear-gradient(135deg, #475569, #334155);
        }

        .version-icon {
          font-size: 1rem;
        }

        @media (min-width: 768px) {
          .footer-content {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 3rem;
          }

          .footer-bottom {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .copyright-section {
            text-align: left;
          }

          .social-links {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-container {
            padding: 4rem 2rem 2.5rem;
          }

          .social-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .social-links {
            grid-template-columns: 1fr;
          }

          .footer-badges {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
