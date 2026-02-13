import React, { useState } from "react";
import "./styles/faq.css";
import { useNavigate } from "react-router-dom";

export default function FAQ() {
  const faqs = [
    {
      question: "What is MyBookHub ?",
      answer: [
        "MyBookHub is an online marketplace where students can buy and sell used books with each other easily and securely. You can list your old textbooks or find books you need at a lower cost than buying new.  ",
      ],
    },
    {
      question: "How do I create an account ?",
      answer: [
        "To use MyBookHub, first Create a account with your email, phone number,. Once registered, you can post books for sale or browse books to buy.",
      ],
    },
    {
      question: "How do I sell my book on MyBookHub ?",
      answer: [
        "Log in to your account.",
        "Go to the Sell Book section. ",
        "Enter book details. ",
        "Upload clear photos of your book. ",
        "Click List Book For Sale.",
      ],
    },
    {
      question: "Forgot Password? How can I reset it?",
      answer: [
        "If you forgot your password, don’t worry. Just follow these steps:",
        "Go to the Login page",
        "Click on Forgot Password",
        "Enter your registered email address or phone number",
        "Create a new password and log in again.",
        "If you face any issues while resetting your password, please contact our support team.",
      ],
    },
    {
      question: "Is MyBookHub safe to use?",
      answer: [
        "Yes! But for safety, always:",
        "Meet in public places",
        "Confirm the book condition before paying",
        "Never share sensitive personal data with strangers",
        "",
      ],
    },
    {
      question: "Can I receive payment directly on the site?",
      answer: [
        "Currently the platform connects buyers and sellers — payments happen offline (like cash during exchange).",
        "In future, online payment options might be added.",
      ],
    },
    {
      question: "How can I get help if I have an issue?",
      answer: [
        "Visit the Help or Support page, or contact us at your registered email/phone.",
        "We respond to user questions quickly and help solve problems with listings, accounts, or transactions.",
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();
  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <div className="faq-page">
      <div className="faq-card">
        <div className="faq-header">
          <div className="faq-header-top">
            <span className="back-arrow" onClick={() => navigate(-1)}>
              ←
            </span>

            <h1 className="faq-title">Frequently Asked Questions</h1>
          </div>
        </div>

        <br />

        <div className="faq-list">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={idx}>
                <button
                  className="faq-question"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">{isOpen ? "–" : "+"}</span>
                </button>

                <div className="faq-answer-wrap">
                  <div className="faq-answer">
                    <p className="faq-text">{item.answer[0]}</p>

                    <ul className="faq-steps">
                      {item.answer
                        .slice(1)
                        .filter((x) => x && x.trim().length > 0)
                        .map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq-footer">
          <p>Still need help? Contact support.</p>
        </div>
      </div>
    </div>
  );
}
