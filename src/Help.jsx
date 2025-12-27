import React from "react";

function VideoHelpSection() {
  const videos = [
    {
      src:"/images/prices.jpeg",
      title:"Price List",
      aboutL"Detailed print & binding prices",
    }
    {
      src: "/images/Login.mp4", 
      title: "Account Setup & Login", 
      about: "How to Create a New Account, Login & Reset Password – Step by Step Guide.", 
    }, 
    {
      src: "/images/orderprints.mp4",
      title: "Ordering Prints",
      about: "How to Order Printouts & Upload Files Without Any Difficulty ",
    },
    {
      src:"/images/Payment.mp4", 
      title:"How to pay", 
      about: "How to Pay Using QR Scanner or UPI ID. "
    }
  ];

  return (
    <div>
      <style>{`
        .help-video-section-list {
          padding-top:10px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          align-items: center;
          width: 100%;
          margin-bottom: 32px;
          padding-top:10px;
        }
        .help-video-block {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .help-video {
          width: 100%;
          max-width: 420px;
          aspect-ratio: 16 / 9;
          border-radius: 14px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          background: #000;
          object-fit: cover;
          height: 500px;
        }
        .help-video-about {
          margin-top: 10px;
          font-size: 1rem;
          color: #2573a3;
          max-width: 420px;
          text-align: center;
        }
        @media (max-width: 600px) {
          .help-video, .help-video-block { max-width: 75vw; }
          .help-video-about { font-size: 0.99rem; padding: 0 5px; }
        }
      `}</style>

      <section className="help-video-section-list">
        {videos.map((video, idx) => (
          <div className="help-video-block" key={video.src || idx}>
            <video
              className="help-video"
              controls
              poster={video.poster || "/images/video-poster.jpg"}
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="help-video-about">
              <strong>{video.title}</strong>
              <div>{video.about}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default VideoHelpSection;
