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
      url: "https://www.instagram.com/ayum_health/",
      color: "var(--orange-600)",
      icon: "pi pi-instagram",
    },
    {
      name: lang == "en" ? English.facebook : Hindi.facebook,
      url: "https://www.instagram.com/ayum_health/",
      color: "var(--blue-600)",
      icon: "pi pi-facebook",
    },
    {
      name: lang == "en" ? English.twitter : Hindi.twitter,
      url: "https://twitter.com/ayum_health",
      color: "var(--black-600)",
      icon: "pi pi-twitter",
    },
    {
      name: lang == "en" ? English.linkedin : Hindi.linkedin,
      url: "https://www.linkedin.com/in/ayum-in-263828257/",
      color: "var(--blue-800)",
      icon: "pi pi-linkedin",
    },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <div className="footer-links">
            <a href="/termsconditions">Terms & Conditions</a>
            <a href="/PrivacyPolicy">Privacy Policy</a>
            <a href="/refundpolicy">Refund Policy</a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Connect With Us</h3>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                style={{ color: social.color }}
              >
                <i className={social.icon}></i>
                <span className="social-name">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2024 Ayum Healthcare Private Ltd. All rights reserved.
          </p>
          <button className="version-btn" onClick={() => setadminmode(true)}>
            Version 0.0
          </button>
        </div>
      </div>

      <style jsx>{`
        .footer-container {
          background-color: var(--surface-50);
          padding: 1.5rem 1rem;
          margin-top: 2rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-section {
          margin-bottom: 1.5rem;
        }

        .footer-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-900);
          margin-bottom: 1rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links a {
          color: var(--text-700);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--primary-color);
        }

        .social-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .social-link:hover {
          background-color: var(--surface-100);
        }

        .social-name {
          font-weight: 500;
        }

        .footer-bottom {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--surface-200);
          text-align: center;
        }

        .copyright {
          font-size: 0.8rem;
          color: var(--text-500);
          margin-bottom: 0.5rem;
        }

        .version-btn {
          background: none;
          border: none;
          color: var(--text-500);
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .version-btn:hover {
          background-color: var(--surface-100);
        }

        @media (min-width: 768px) {
          .footer-content {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }

          .footer-bottom {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
