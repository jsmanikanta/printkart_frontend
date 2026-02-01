import React from "react";

function VideoHelpSection() {
  const mediaItems = [
    {
      src: "../public/images/prices.jpeg",
      type: "image",
      title: "Price List",
      about: "Detailed print & binding prices",
    },
    {
      src: "../public/images/Login.mp4", 
      type: "video",
      title: "Account Setup & Login", 
      about: "How to Create a New Account, Login & Reset Password – Step by Step Guide.", 
    }, 
    {
      src: "../public/images/orderprints.mp4",
      type: "video",
      title: "Ordering Prints",
      about: "How to Order Printouts & Upload Files Without Any Difficulty ",
    },
    {
      src: "../public/images/Payment.mp4", 
      type: "video",
      title: "How to pay", 
      about: "How to Pay Using QR Scanner or UPI ID. "
    }
  ];

  return (
    <div>
      <style>{`
        .help-media-section-list {
          padding-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          align-items: center;
          width: 100%;
          margin-bottom: 32px;
        }
        .help-media-block {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .help-media {
          width: 100%;
          max-width: 420px;
          aspect-ratio: 16 / 9;
          border-radius: 14px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          object-fit: cover;
          height: 500px;
          border: none;
        }
        .help-video {
          background: #000;
        }
        .help-media-about {
          margin-top: 10px;
          font-size: 1rem;
          color: #2573a3;
          max-width: 420px;
          text-align: center;
          line-height: 1.5;
        }
        .help-media-about strong {
          display: block;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }
        @media (max-width: 600px) {
          .help-media, .help-media-block { 
            max-width: 75vw; 
          }
          .help-media { 
            height: 40vw; 
          }
          .help-media-about { 
            font-size: 0.99rem; 
            padding: 0 5px; 
          }
        }
        @media (max-width: 480px) {
          .help-media-section-list {
            gap: 24px;
          }
        }
      `}</style>

      <section className="help-media-section-list">
        {mediaItems.map((item, idx) => (
          <div className="help-media-block" key={item.src || idx}>
            {item.type === "video" ? (
              <video
                className="help-media help-video"
                controls
                poster={item.poster || "../public/images/video-poster.jpg"}
                preload="metadata"
              >
                <source src={item.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={item.src}
                alt={item.title}
                className="help-media"
                loading="lazy"
              />
            )}
            <div className="help-media-about">
              <strong>{item.title}</strong>
              <div>{item.about}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default VideoHelpSection;
