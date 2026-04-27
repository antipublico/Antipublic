import React, { useRef, useState, useEffect } from 'react';
import './CreditCard.css';

const CreditCard = ({
  ownerName = 'Mateo',
  number = '4532 1234 5678 9012',
  validThru = '06/05',
  bankName = 'ANTIPUBLIC',
  variant = 'default', // 'default' or 'inverted'
  animationOffset = 0,
  signature = 'default',
  backUrl = 'https://www.fakecrime/antipublic.',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq ? mq.matches : window.innerWidth <= 768);
    update();
    mq && mq.addEventListener ? mq.addEventListener('change', update) : window.addEventListener('resize', update);
    return () => {
      mq && mq.removeEventListener ? mq.removeEventListener('change', update) : window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!isMobile || isHovering) return;
    let animationId;

    // Cap FPS on mobile to reduce CPU/GPU (approx 14 FPS)
    const targetFPS = 14;
    const frameDuration = 1000 / targetFPS;
    let lastRender = 0;
    const startTime = performance.now();

    const animate = () => {
      const now = performance.now();
      if (now - lastRender < frameDuration) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastRender = now;

      const elapsed = (now - startTime) / 1000;
      const tiltX = Math.sin(elapsed * 0.3 + animationOffset) * 8.5 + Math.sin(elapsed * 0.7 + animationOffset * 0.5) * 4.2;
      const tiltY = Math.cos(elapsed * 0.4 + animationOffset * 0.8) * 9.2 + Math.cos(elapsed * 0.8 + animationOffset * 0.3) * 4.5;
      const offsetX = Math.sin(elapsed * 0.2 + animationOffset * 1.5) * 3.8;
      const offsetY = Math.cos(elapsed * 0.25 + animationOffset * 1.2) * 2.8;

      setTilt({ x: tiltX, y: tiltY });
      
      if (cardRef.current) {
        cardRef.current.style.setProperty('--tilt-x', tiltX.toFixed(2));
        cardRef.current.style.setProperty('--tilt-y', tiltY.toFixed(2));
        cardRef.current.style.setProperty('--tilt-x-deg', `${tiltX.toFixed(2)}deg`);
        cardRef.current.style.setProperty('--tilt-y-deg', `${tiltY.toFixed(2)}deg`);
        
        const lightX = 50 + offsetX * 6;
        const lightY = 50 + offsetY * 6;
        cardRef.current.style.setProperty('--mx', `${lightX.toFixed(1)}%`);
        cardRef.current.style.setProperty('--my', `${lightY.toFixed(1)}%`);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isMobile, isHovering, animationOffset]);

  const handleCardClick = () => {
    setIsFlipped((p) => !p);
    setTilt({ x: 0, y: 0 });
  };
  const updateFromPoint = (point) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xNorm = (point.clientX - rect.left) / rect.width;
    const yNorm = (point.clientY - rect.top) / rect.height;
    requestAnimationFrame(() => {
      if (!cardRef.current) return;
      
      cardRef.current.style.setProperty('--mx', `${(xNorm * 100).toFixed(1)}%`);
      cardRef.current.style.setProperty('--my', `${(yNorm * 100).toFixed(1)}%`);

      const max = isMobile ? 15 : 10;
      const tiltX = (0.5 - yNorm) * max;
      const tiltY = (xNorm - 0.5) * max;
      setTilt({ x: tiltX, y: tiltY });
      cardRef.current.style.setProperty('--tilt-x', tiltX.toFixed(2));
      cardRef.current.style.setProperty('--tilt-y', tiltY.toFixed(2));
      cardRef.current.style.setProperty('--tilt-x-deg', `${tiltX.toFixed(2)}deg`);
      cardRef.current.style.setProperty('--tilt-y-deg', `${tiltY.toFixed(2)}deg`);
    });
  };

  const cvv = useRef(Math.floor(Math.random() * 900) + 100).current;
  
  const getSignaturePath = () => {
    if (signature === 'miguel' || variant === 'inverted') {
      return `
        <path d="M4617 1745 c-27 -70 -115 -498 -116 -567 -1 -54 -223 -178 -317 -178 -45 0 -55 86 -13 121 45 37 61 5 19 -41 -20 -22 -27 -40 -16 -40 32 0 91 76 77 99 -25 40 -71 21 -266 -107 -288 -189 -341 -186 -256 18 16 38 21 74 12 79 -20 13 -55 -29 -57 -69 -1 -16 -8 -67 -15 -112 -22 -136 88 -120 316 44 55 39 101 68 104 64 3 -3 16 -26 29 -51 32 -61 74 -57 232 23 l135 68 -14 -174 c-21 -272 14 -292 40 -23 15 150 31 232 48 237 18 6 19 13 3 23 -32 19 47 465 107 606 10 22 7 35 -7 35 -13 0 -33 -25 -45 -55z"/>
        <path d="M2200 1603 c-120 -126 -310 -394 -429 -603 l-73 -130 16 220 c39 534 -39 640 -205 280 -103 -223 -152 -610 -84 -666 20 -16 24 14 19 144 -8 191 31 384 109 544 125 253 160 201 132 -194 -30 -424 -18 -442 127 -195 188 322 473 677 542 677 60 0 -45 -820 -153 -1198 -10 -34 -11 -62 -2 -62 42 0 188 713 213 1032 22 300 -33 339 -212 151z"/>
        <path d="M2991 1129 c-48 -36 -338 -149 -383 -149 -26 0 -30 13 -21 60 14 72 -21 81 -39 10 -31 -125 11 -134 237 -47 109 42 166 55 171 40 11 -34 40 -28 107 19 69 49 117 38 117 -27 0 -30 -21 -59 -60 -82 -182 -107 -351 -460 -261 -543 119 -107 322 163 354 471 l13 118 106 40 c59 22 129 46 157 53 l51 12 -31 -73 c-54 -130 7 -150 112 -37 l69 74 -79 -67 c-89 -75 -110 -58 -60 49 19 39 29 76 23 83 -14 13 -223 -46 -299 -86 -52 -27 -57 -25 -78 21 -12 28 -50 59 -83 71 -75 26 -76 26 -123 -10z m150 -411 c-69 -228 -257 -390 -278 -241 -10 72 104 283 211 392 l96 98 6 -55 c4 -30 -12 -118 -35 -194z"/>
      `;
    }
    return `
      <path d="M583 1267 c-28 -31 -135 -229 -167 -309 -31 -79 -34 -111 -8 -106 11 2 19 16 22 43 6 39 78 194 140 303 23 39 35 50 45 45 8 -5 46 -60 84 -123 38 -63 75 -115 82 -115 8 0 34 37 59 82 25 45 57 94 70 108 39 41 56 33 96 -47 20 -40 48 -97 63 -125 25 -51 51 -70 51 -37 0 16 -95 193 -133 247 -42 61 -96 14 -171 -148 l-32 -70 -45 77 c-24 42 -56 99 -71 127 -36 65 -58 78 -85 48z"/>
      <path d="M2118 928 c-3 -39 -6 -43 -30 -46 -36 -4 -38 -32 -3 -32 24 0 25 -3 25 -55 0 -70 21 -115 55 -115 15 0 31 10 41 25 21 32 9 53 -17 29 -15 -14 -21 -14 -34 -4 -27 22 -15 120 16 120 29 0 32 19 5 30 -22 8 -26 16 -26 50 0 28 -4 40 -14 40 -10 0 -16 -14 -18 -42z"/>
      <path d="M1285 924 c-69 -42 -70 -42 -63 -49 8 -8 142 58 141 70 -2 18 -18 14 -78 -21z"/>
      <path d="M1744 872 c-5 -4 -17 -18 -26 -30 l-16 -24 -11 21 c-16 30 -45 26 -74 -9 l-25 -30 -7 30 c-7 32 -19 45 -34 36 -8 -5 9 -108 24 -148 11 -27 34 -21 40 10 12 57 21 77 37 80 13 2 18 -9 25 -50 11 -68 34 -72 46 -8 10 53 33 83 42 58 4 -9 2 -40 -4 -69 -9 -50 -1 -83 15 -67 10 11 24 81 24 126 0 66 -23 97 -56 74z"/>
      <path d="M1901 846 c-28 -30 -12 -44 23 -21 30 20 46 13 46 -20 0 -22 -2 -23 -31 -12 -27 11 -33 10 -49 -10 -10 -13 -16 -32 -13 -43 13 -49 105 -82 117 -42 3 9 8 38 11 63 13 92 -50 143 -104 85z m59 -101 c9 -11 10 -19 3 -26 -14 -14 -53 6 -53 26 0 20 34 19 50 0z"/>
      <path d="M132 849 c9 -28 188 -76 188 -50 0 6 -9 11 -19 11 -18 0 -112 28 -155 45 -14 6 -18 5 -14 -6z"/>
      <path d="M2319 808 c-30 -33 -31 -47 -7 -96 13 -25 41 -35 84 -30 45 5 42 28 -5 28 -29 0 -43 5 -50 19 -11 20 2 31 39 31 9 0 23 7 30 15 11 13 9 20 -10 40 -31 33 -45 31 -81 -7z m48 -15 c-4 -3 -10 -3 -14 0 -3 4 0 7 7 7 7 0 10 -3 7 -7z"/>
      <path d="M554 815 c-26 -17 -48 -69 -40 -90 13 -36 99 -5 127 47 8 15 7 24 -7 39 -20 23 -52 24 -80 4z m66 -29 c0 -17 -47 -56 -67 -56 -15 0 -10 33 9 58 14 17 58 15 58 -2z m-93 -48 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z"/>
      <path d="M909 801 c-20 -16 -22 -22 -12 -44 19 -40 55 -59 98 -51 33 6 36 9 33 37 -5 54 -79 90 -119 58z m83 -23 c9 -7 19 -24 22 -38 3 -14 3 -19 0 -12 -4 10 -9 10 -19 2 -20 -17 -69 9 -73 38 -3 18 1 22 25 22 16 0 36 -6 45 -12z"/>
      <path d="M2534 784 c-13 -19 -15 -32 -8 -52 26 -75 144 -61 144 17 0 39 -28 61 -78 61 -34 0 -45 -5 -58 -26z m100 -26 c13 -21 1 -36 -33 -40 -27 -3 -47 21 -38 46 9 22 56 18 71 -6z"/>
      <path d="M1205 770 c-7 -11 128 -59 140 -49 5 6 5 13 -1 19 -13 13 -133 40 -139 30z"/>
      <path d="M421 678 c0 -13 13 -43 28 -68 32 -53 97 -96 216 -141 100 -39 179 -37 271 6 110 51 251 215 186 215 -13 0 -22 -12 -31 -39 -16 -56 -102 -131 -182 -161 -113 -43 -225 -24 -365 62 -51 30 -70 58 -89 126 -4 12 -13 22 -21 22 -8 0 -14 -9 -13 -22z"/>
      <path d="M275 619 c-38 -21 -74 -40 -80 -42 -20 -8 5 -19 28 -13 28 7 137 77 137 88 0 13 -11 9 -85 -33z"/>
      <path d="M620 652 c0 -13 43 -50 70 -60 26 -10 80 9 80 28 0 14 67 -28 74 -47 5 -13 13 -8 42 21 37 38 39 60 4 38 -28 -17 -61 -14 -90 8 -32 25 -37 25 -45 0 -11 -33 -50 -36 -89 -6 -37 27 -46 31 -46 18z m250 -66 c0 -3 -4 -8 -10 -11 -5 -3 -10 -1 -10 4 0 6 5 11 10 11 6 0 10 -2 10 -4z"/>
    `;
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1

    const max = 10;
    const tiltX = (0.5 - y) * max;
    const tiltY = (x - 0.5) * max;
    setTilt({ x: tiltX, y: tiltY });

    updateFromPoint(e);
    cardRef.current.style.setProperty('--tilt-x', tiltX.toFixed(2));
    cardRef.current.style.setProperty('--tilt-y', tiltY.toFixed(2));
    cardRef.current.style.setProperty('--tilt-x-deg', `${tiltX.toFixed(2)}deg`);
    cardRef.current.style.setProperty('--tilt-y-deg', `${tiltY.toFixed(2)}deg`);
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false);
      setTilt({ x: 0, y: 0 });
      if (cardRef.current) {
        cardRef.current.style.setProperty('--mx', `50%`);
        cardRef.current.style.setProperty('--my', `50%`);
        cardRef.current.style.setProperty('--tilt-x', '0');
        cardRef.current.style.setProperty('--tilt-y', '0');
        cardRef.current.style.setProperty('--tilt-x-deg', '0deg');
        cardRef.current.style.setProperty('--tilt-y-deg', '0deg');
      }
    }
  };

  const handleTouchStart = () => {
    if (isMobile) setIsHovering(true);
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      setTimeout(() => setIsHovering(false), 100);
    }
  };

  const leanY = isHovering ? 0 : -2.5;
  const baseTilt = `rotateX(${tilt.x}deg) rotateY(${(tilt.y + leanY).toFixed(2)}deg)`;
  const flip = isFlipped ? ' rotateY(180deg)' : '';
  const transform3D = `perspective(1400px) ${baseTilt}${flip}`;

  return (
    <div className="card-container" onClick={(e) => e.stopPropagation()}>
      <div
        ref={cardRef}
        className={`credit-card ${variant === 'inverted' ? 'inverted' : ''} ${isHovering ? 'hovering' : ''}`}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Outer animator for idle motion */}
        <div className={`card-outer ${!isHovering ? 'idle' : ''}`}>
          {/* 3D transform element (faces flip) */}
          <div className={`card-3d ${isFlipped ? 'flipped' : ''}`} style={{ transform: transform3D }}>
            {/* Lighting that sits on card and tilts with it */}
            <div className="card-light" />

          {/* Front Face */}
          <div className="card-face front">
            <div className="card-header">
              <div className="bank-name">{bankName}</div>
              <div className="card-type">PREMIUM</div>
            </div>

          <div className="chip">
            <svg className="chip-svg" viewBox="0 0 48 36" aria-hidden="true">
              <rect x="10" y="6" width="28" height="24" rx="3" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <rect x="21" y="13" width="6" height="10" rx="1.2" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
              <path d="M4 12 H18 C20 12 21 12.5 23 14 L25 14 C27 12.5 28 12 30 12 H44" stroke="#9a9a9a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path d="M4 24 H18 C20 24 21 23.5 23 22 L25 22 C27 23.5 28 24 30 24 H44" stroke="#9a9a9a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path d="M16 6 V30" stroke="rgba(200,200,200,0.18)" strokeWidth="0.8" />
              <path d="M32 6 V30" stroke="rgba(200,200,200,0.18)" strokeWidth="0.8" />
            </svg>
          </div>

          <div className="card-number">
            {number.split(' ').map((grp, i) => (
              <span key={i}>{grp}</span>
            ))}
          </div>

          <div className="card-info">
            <div className="info-section">
              <div className="label">VALID THRU</div>
              <div className="value">{validThru}</div>
            </div>
            <div className="info-section">
              <div className="label">CARD HOLDER</div>
              <div className="value">{ownerName}</div>
            </div>
          </div>

          <div className="card-footer">
            <div className="network-logo">{variant === 'inverted' ? 'NUKE' : 'FLEX'}</div>
          </div>
        </div>

        {/* Back Face */}
        <div className="card-face back">
          <div className="magnetic-stripe" />

          <div className="site-url">{backUrl}</div>

          <div className="signature-section">
            <div className="signature-panel">
              <span className="signature-text">Authorized Signature</span>
              <div className="signature-line">
                <svg className="signature-svg" version="1.0" xmlns="http://www.w3.org/2000/svg"
                  width="300.000000pt" height={signature === 'miguel' || variant === 'inverted' ? "150.000000pt" : "178.000000pt"} 
                  viewBox={signature === 'miguel' || variant === 'inverted' ? "0 0 300.000000 150.000000" : "0 0 300.000000 178.000000"}
                  preserveAspectRatio="xMidYMid meet">
                  <g transform={signature === 'miguel' || variant === 'inverted' ? "translate(0.000000,150.000000) scale(0.050000,-0.050000)" : "translate(0.000000,178.000000) scale(0.100000,-0.100000)"}
                    fill="#000000" stroke="none"
                    dangerouslySetInnerHTML={{ __html: getSignaturePath() }}
                  />
                </svg>
              </div>
            </div>
            <div className="cvv-section">
              <div className="cvv-label">CVV</div>
              <div className="cvv-number">{cvv}</div>
            </div>
          </div>

          {/* Holographic CEO text */}
          <div className="founder-text">CEO</div>

          <div className="security-features">
            <div
              className="hologram"
              style={{
                WebkitMaskImage: 'url(/presage.svg)',
                maskImage: 'url(/presage.svg)',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain'
              }}
            />
          </div>

          <div className="legal-text">
            <div className="customer-care">If found, call {variant === 'inverted' ? 'Nuke' : 'Flex'} Customer Care: 1-800-{variant === 'inverted' ? 'NUKE' : 'FLEX'}</div>
            <div className="terms">This card remains the property of {variant === 'inverted' ? 'NUKE' : 'FLEX'}. Terms apply.</div>
          </div>
        </div>
          </div>
        </div>
      </div>

      <div className="instructions">{isMobile ? 'Tap to flip' : 'Click to flip • Move mouse to tilt'}</div>
    </div>
  );
};

export default React.memo(CreditCard);
