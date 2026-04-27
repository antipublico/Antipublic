import React, { useEffect, useRef, useState } from "react";
import "./CreditCard.css";

type CreditCardProps = {
  ownerName?: string;
  number?: string;
  validThru?: string;
  bankName?: string;
  variant?: "default" | "inverted" | "blue";
  animationOffset?: number;
  signature?: "default" | "miguel" | "max" | "none";
  backUrl?: string;
  networkLogo?: string;
  footerText?: string;
};

const CreditCard = ({
  ownerName = "Mateo",
  number = "4532 1234 5678 9012",
  validThru = "06/05",
  bankName = "ANTIPUBLIC",
  variant = "default",
  animationOffset = 0,
  signature = "default",
  backUrl = "https://www.fakecrime/antipublic.",
  networkLogo,
  footerText = "CEO",
}: CreditCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq ? mq.matches : window.innerWidth <= 768);
    update();
    if (mq?.addEventListener) mq.addEventListener("change", update);
    else window.addEventListener("resize", update);
    return () => {
      if (mq?.removeEventListener) mq.removeEventListener("change", update);
      else window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (isHovering) return;
    let animationId: number | undefined;

    const targetFPS = isMobile ? 18 : 36;
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
      const speed = 1.55;
      const strength = isMobile ? 1.05 : 0.85;
      const tiltX =
        (Math.sin(elapsed * 0.3 * speed + animationOffset) * 8.5 +
          Math.sin(elapsed * 0.7 * speed + animationOffset * 0.5) * 4.2) *
        strength;
      const tiltY =
        (Math.cos(elapsed * 0.4 * speed + animationOffset * 0.8) * 9.2 +
          Math.cos(elapsed * 0.8 * speed + animationOffset * 0.3) * 4.5) *
        strength;
      const offsetX = Math.sin(elapsed * 0.2 * speed + animationOffset * 1.5) * 3.8 * strength;
      const offsetY = Math.cos(elapsed * 0.25 * speed + animationOffset * 1.2) * 2.8 * strength;

      setTilt({ x: tiltX, y: tiltY });

      if (cardRef.current) {
        cardRef.current.style.setProperty("--tilt-x", tiltX.toFixed(2));
        cardRef.current.style.setProperty("--tilt-y", tiltY.toFixed(2));
        cardRef.current.style.setProperty("--tilt-x-deg", `${tiltX.toFixed(2)}deg`);
        cardRef.current.style.setProperty("--tilt-y-deg", `${tiltY.toFixed(2)}deg`);

        const lightX = 50 + offsetX * 6;
        const lightY = 50 + offsetY * 6;
        cardRef.current.style.setProperty("--mx", `${lightX.toFixed(1)}%`);
        cardRef.current.style.setProperty("--my", `${lightY.toFixed(1)}%`);
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

  const updateFromPoint = (point: { clientX: number; clientY: number }) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xNorm = (point.clientX - rect.left) / rect.width;
    const yNorm = (point.clientY - rect.top) / rect.height;
    requestAnimationFrame(() => {
      if (!cardRef.current) return;

      cardRef.current.style.setProperty("--mx", `${(xNorm * 100).toFixed(1)}%`);
      cardRef.current.style.setProperty("--my", `${(yNorm * 100).toFixed(1)}%`);

      const max = isMobile ? 15 : 10;
      const tiltX = (0.5 - yNorm) * max;
      const tiltY = (xNorm - 0.5) * max;
      setTilt({ x: tiltX, y: tiltY });
      cardRef.current.style.setProperty("--tilt-x", tiltX.toFixed(2));
      cardRef.current.style.setProperty("--tilt-y", tiltY.toFixed(2));
      cardRef.current.style.setProperty("--tilt-x-deg", `${tiltX.toFixed(2)}deg`);
      cardRef.current.style.setProperty("--tilt-y-deg", `${tiltY.toFixed(2)}deg`);
    });
  };

  const cvv = useRef(Math.floor(Math.random() * 900) + 100).current;

  const getSignaturePath = () => {
    if (signature === "max") {
      return `
        <path d="M3853 5973 c-107 -81 -122 -94 -292 -258 -194 -186 -273 -264 -397 -396 -156 -164 -174 -185 -383 -424 -14 -17 -55 -64 -91 -105 -87 -99 -310 -373 -391 -480 -35 -47 -66 -87 -69 -90 -3 -3 -70 -92 -150 -197 -129 -173 -174 -224 -156 -178 3 9 19 63 36 121 17 58 35 115 40 127 40 96 175 475 204 572 20 66 41 134 46 151 23 70 12 133 -21 134 -17 0 -64 -49 -119 -123 -33 -45 -65 -87 -70 -93 -36 -45 -263 -396 -329 -510 -82 -140 -447 -861 -440 -868 2 -2 15 -6 27 -8 20 -2 27 5 46 52 63 152 340 692 440 855 88 146 79 132 175 275 156 233 246 355 249 337 6 -33 -66 -258 -178 -557 -94 -249 -160 -469 -160 -531 0 -23 4 -29 23 -29 12 0 29 6 37 13 29 24 190 221 190 233 0 4 7 14 15 23 8 9 61 77 117 151 127 169 262 339 397 500 95 113 184 214 440 502 105 118 514 526 631 629 143 126 211 182 215 178 2 -3 -32 -61 -75 -129 -43 -69 -94 -150 -113 -180 -42 -68 -169 -267 -302 -474 -55 -86 -107 -167 -115 -180 -24 -38 -188 -293 -245 -381 -85 -131 -118 -184 -200 -315 -43 -69 -92 -147 -109 -175 -17 -27 -35 -57 -41 -67 -5 -10 -39 -66 -75 -125 -71 -120 -184 -314 -328 -563 -52 -91 -103 -181 -115 -200 -73 -128 -197 -354 -197 -360 0 -9 -50 -39 -145 -89 -33 -18 -76 -41 -95 -53 -19 -11 -64 -36 -100 -56 -36 -19 -92 -51 -125 -70 -33 -19 -73 -42 -90 -52 -78 -44 -190 -116 -193 -122 -2 -5 -8 -8 -13 -8 -4 0 -49 -28 -100 -62 -50 -35 -100 -70 -112 -78 -36 -24 -230 -171 -263 -199 -55 -46 -72 -59 -98 -76 -20 -13 -26 -26 -26 -51 l0 -35 108 89 c130 107 311 242 412 307 41 27 107 70 147 97 39 26 74 48 77 48 3 0 37 20 76 45 39 25 72 45 74 45 2 0 34 18 71 41 37 22 74 43 83 46 10 4 32 18 50 31 18 14 35 23 37 20 7 -7 -32 -40 -125 -103 -47 -32 -104 -73 -127 -92 -23 -18 -44 -33 -47 -33 -3 0 -46 -30 -95 -67 -49 -38 -99 -75 -111 -83 -30 -20 -160 -116 -186 -138 -12 -9 -28 -21 -37 -27 -8 -5 -61 -44 -118 -85 -56 -41 -125 -91 -153 -110 -28 -19 -57 -40 -64 -48 -8 -7 -27 -19 -43 -27 -22 -12 -29 -23 -29 -45 0 -28 14 -41 22 -22 2 5 41 35 88 67 88 61 197 138 215 152 19 15 161 120 228 169 38 27 74 54 80 59 7 6 35 26 62 45 28 19 57 40 65 47 14 11 171 126 348 255 126 91 165 126 156 140 -4 7 -3 8 4 4 17 -10 15 -24 -7 -54 -17 -25 -80 -137 -175 -314 -20 -38 -52 -98 -72 -135 -20 -38 -49 -90 -64 -118 -15 -27 -67 -124 -115 -215 -48 -91 -95 -178 -105 -195 -17 -29 -69 -129 -205 -390 -37 -71 -80 -153 -96 -181 -37 -68 -309 -611 -309 -618 0 -3 -13 -34 -28 -68 -52 -114 -66 -158 -54 -170 6 -6 17 -8 24 -6 11 5 70 97 151 233 7 11 14 22 17 25 3 3 47 73 98 155 130 210 153 245 358 555 155 234 228 341 341 497 101 141 408 537 444 573 8 8 33 38 54 65 22 28 54 66 71 85 129 146 226 254 273 305 31 33 99 107 151 165 52 57 134 145 181 195 48 49 102 106 120 126 19 20 61 48 94 64 33 15 71 33 85 40 14 7 88 41 165 75 77 34 163 72 190 85 28 13 84 38 125 55 94 41 148 64 228 101 35 16 67 29 72 29 4 0 25 9 47 20 21 10 92 40 158 65 66 26 129 50 140 55 41 17 81 30 100 34 11 2 28 7 38 11 13 5 16 3 11 -8 -3 -8 -1 -18 4 -21 5 -3 7 -17 4 -31 -2 -14 0 -25 6 -25 6 0 12 -12 14 -27 2 -17 10 -29 21 -31 19 -4 49 26 43 43 -2 6 1 18 5 27 6 10 5 19 -1 23 -18 11 -10 23 20 28 62 12 119 39 145 67 30 33 16 55 -37 56 -48 1 -218 -37 -250 -56 -10 -5 -23 -10 -29 -10 -24 0 -265 -92 -407 -156 -29 -13 -55 -24 -58 -24 -3 0 -58 -23 -123 -51 -64 -28 -136 -60 -161 -71 -25 -10 -63 -28 -85 -38 -22 -10 -61 -28 -87 -39 -90 -39 -143 -64 -245 -112 -56 -27 -105 -49 -109 -49 -4 0 6 12 22 26 16 15 110 106 209 203 99 97 220 212 269 256 154 138 188 169 306 276 63 57 167 150 230 205 208 183 216 191 202 205 -10 11 -19 10 -47 -5 -19 -11 -35 -22 -35 -26 0 -4 -17 -19 -37 -33 -21 -14 -49 -36 -63 -49 -14 -12 -65 -54 -113 -93 -102 -81 -264 -210 -289 -230 -153 -125 -734 -560 -800 -600 -17 -10 -420 -300 -468 -337 -48 -37 -206 -151 -270 -196 -36 -25 -80 -59 -97 -76 -39 -35 -53 -29 -26 11 11 15 55 91 98 168 43 77 95 168 116 202 22 34 39 64 39 66 0 4 29 54 154 269 31 54 80 140 110 190 72 125 191 322 316 524 15 25 167 262 277 433 34 53 85 132 113 176 28 44 104 163 170 265 322 499 488 768 495 801 7 32 -7 59 -31 59 -7 0 -53 -30 -101 -67z"/>
      `;
    }
    if (signature === "miguel" || variant === "inverted") {
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
      <path d="M2319 808 c-30 -33 -31 -47 -7 -96 13 -25 41 -35 84 -30 45 5 42 28 -5 28 -29 0 -43 5 -50 19 -11 20 2 31 39 31 9 0 23 7 30 15 11 13 9 20 -10 40 -31 33 -45 31 -81 -7z"/>
      <path d="M554 815 c-26 -17 -48 -69 -40 -90 13 -36 99 -5 127 47 8 15 7 24 -7 39 -20 23 -52 24 -80 4z"/>
      <path d="M909 801 c-20 -16 -22 -22 -12 -44 19 -40 55 -59 98 -51 33 6 36 9 33 37 -5 54 -79 90 -119 58z"/>
      <path d="M2534 784 c-13 -19 -15 -32 -8 -52 26 -75 144 -61 144 17 0 39 -28 61 -78 61 -34 0 -45 -5 -58 -26z"/>
      <path d="M421 678 c0 -13 13 -43 28 -68 32 -53 97 -96 216 -141 100 -39 179 -37 271 6 110 51 251 215 186 215 -13 0 -22 -12 -31 -39 -16 -56 -102 -131 -182 -161 -113 -43 -225 -24 -365 62 -51 30 -70 58 -89 126 -4 12 -13 22 -21 22 -8 0 -14 -9 -13 -22z"/>
      <path d="M275 619 c-38 -21 -74 -40 -80 -42 -20 -8 5 -19 28 -13 28 7 137 77 137 88 0 13 -11 9 -85 -33z"/>
      <path d="M620 652 c0 -13 43 -50 70 -60 26 -10 80 9 80 28 0 14 67 -28 74 -47 5 -13 13 -8 42 21 37 38 39 60 4 38 -28 -17 -61 -14 -90 8 -32 25 -37 25 -45 0 -11 -33 -50 -36 -89 -6 -37 27 -46 31 -46 18z"/>
    `;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const max = 10;
    const tiltX = (0.5 - y) * max;
    const tiltY = (x - 0.5) * max;
    setTilt({ x: tiltX, y: tiltY });

    updateFromPoint(e);
    cardRef.current.style.setProperty("--tilt-x", tiltX.toFixed(2));
    cardRef.current.style.setProperty("--tilt-y", tiltY.toFixed(2));
    cardRef.current.style.setProperty("--tilt-x-deg", `${tiltX.toFixed(2)}deg`);
    cardRef.current.style.setProperty("--tilt-y-deg", `${tiltY.toFixed(2)}deg`);
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false);
      setTilt({ x: 0, y: 0 });
      if (cardRef.current) {
        cardRef.current.style.setProperty("--mx", `50%`);
        cardRef.current.style.setProperty("--my", `50%`);
        cardRef.current.style.setProperty("--tilt-x", "0");
        cardRef.current.style.setProperty("--tilt-y", "0");
        cardRef.current.style.setProperty("--tilt-x-deg", "0deg");
        cardRef.current.style.setProperty("--tilt-y-deg", "0deg");
      }
    }
  };

  const handleTouchStart = () => {
    if (isMobile) setIsHovering(true);
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      window.setTimeout(() => setIsHovering(false), 100);
    }
  };

  const leanY = isHovering ? 0 : -2.5;
  const baseTilt = `rotateX(${tilt.x}deg) rotateY(${(tilt.y + leanY).toFixed(2)}deg)`;
  const flip = isFlipped ? " rotateY(180deg)" : "";
  const transform3D = `perspective(1400px) ${baseTilt}${flip}`;

  return (
    <div className="card-container" onClick={(e) => e.stopPropagation()}>
      <div
        ref={cardRef}
        className={`credit-card ${variant === "inverted" ? "inverted" : ""} ${variant === "blue" ? "blue" : ""} ${isHovering ? "hovering" : ""}`}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`card-outer ${!isHovering ? "idle" : ""}`}>
          <div className={`card-3d ${isFlipped ? "flipped" : ""}`} style={{ transform: transform3D }}>
            <div className="card-light" />

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
                {number.split(" ").map((grp, i) => (
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
                <div className="network-logo">{networkLogo || (variant === "inverted" ? "NUKE" : "FLEX")}</div>
              </div>
            </div>

            <div className="card-face back">
              <div className="magnetic-stripe" />

              <div className="site-url">{backUrl}</div>

              {signature !== "none" && (
                <div className="signature-section">
                  <div className="signature-panel">
                    <span className="signature-text">Authorized Signature</span>
                    <div className="signature-line">
                      <svg
                        className="signature-svg"
                        version="1.0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="300.000000pt"
                        height={signature === "max" ? "633.000000pt" : signature === "miguel" || variant === "inverted" ? "150.000000pt" : "178.000000pt"}
                        viewBox={signature === "max" ? "0 0 600.000000 633.000000" : signature === "miguel" || variant === "inverted" ? "0 0 300.000000 150.000000" : "0 0 300.000000 178.000000"}
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform={
                            signature === "max"
                              ? "translate(0.000000,633.000000) scale(0.100000,-0.100000)"
                              : signature === "miguel" || variant === "inverted"
                              ? "translate(0.000000,150.000000) scale(0.050000,-0.050000)"
                              : "translate(0.000000,178.000000) scale(0.100000,-0.100000)"
                          }
                          fill="#000000"
                          stroke="none"
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
              )}

              <div className="founder-text">{footerText}</div>

              <div className="security-features">
                <div
                  className="hologram"
                  style={{
                    WebkitMaskImage: "url(/presage.svg)",
                    maskImage: "url(/presage.svg)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              </div>

              <div className="legal-text">
                <div className="customer-care">
                  If found, call {networkLogo || (variant === "inverted" ? "Nuke" : "Flex")} Customer Care: 1-800-
                  {networkLogo || (variant === "inverted" ? "NUKE" : "FLEX")}
                </div>
                <div className="terms">
                  This card remains the property of {networkLogo || (variant === "inverted" ? "NUKE" : "FLEX")}. Terms apply.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default React.memo(CreditCard);

