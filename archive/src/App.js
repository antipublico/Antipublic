import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import PlasmaShader from './PlasmaShader';
import AsciiRain from './AsciiRain';
import CreditCard from './card/CreditCard';
import './App.css';

const Presage = ({ className, style }) => (
  <svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 570.63" className={className} style={style}>
    <path d="M414.59,217.96L485.41,0l-185.41,134.71L114.59,0l70.82,217.96L0,352.67h229.18s70.82,217.96,70.82,217.96l70.82-217.96h229.18s-185.41-134.71-185.41-134.71ZM368.98,254.31c-3.02,2.91-7.22,4.69-12.61,5.34l-90.73,13.12c2.67,9.87,7.49,17.46,14.48,22.74,8.83,6.68,20.03,10,33.6,10,9.04,0,17.39-1.34,25.04-4.04,7.64-2.68,13.83-5.65,18.58-8.89,2.8,1.74,5.11,4.05,6.94,6.95,1.83,2.91,2.75,6.09,2.75,9.53,0,5.39-2.47,10.07-7.43,14.05-4.96,3.98-11.58,7.06-19.86,9.2-8.3,2.16-17.83,3.23-28.59,3.23-16.59,0-31.3-3.06-44.11-9.2-12.82-6.14-22.78-15.35-29.88-27.63-7.11-12.27-10.66-27.46-10.66-45.55,0-13.13,1.99-24.66,5.97-34.56,3.98-9.91,9.48-18.21,16.49-24.89,6.99-6.67,15.07-11.67,24.23-15.03,9.15-3.33,18.9-5.01,29.24-5.01,14,0,26.33,2.92,36.99,8.73,10.66,5.81,19.01,13.79,25.04,23.91,6.02,10.12,9.04,21.64,9.04,34.56,0,6.03-1.51,10.5-4.52,13.41Z"/>
    <path d="M302.42,203.42c-11.2,0-20.52,3.88-27.95,11.63-6.91,7.22-10.7,17.33-11.36,30.34l73.89-10.94c-.66-8.4-3.88-15.67-9.7-21.81-5.81-6.14-14.11-9.22-24.87-9.22Z"/>
  </svg>
);

const CONSOLE_ASCII_LOGO = `              _   _             _     _ _      
             | | (_)           | |   | (_)     
   __ _ _ __ | |_ _ _ __  _   _| |__ | |_  ___ 
  / _\` | '_ \\| __| | '_ \\| | | | '_ \\| | |/ __|
 | (_| | | | | |_| | |_) | |_| | |_) | | | (__ 
  \\__,_|_| |_|\\__|_| .__/ \\__,_|_.__/|_|_|\\___|
                   | |                         
                   |_|                         `;

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState(0);
  const [fps, setFps] = useState('24.99');
  const lastPosRef = useRef({ x: 0, y: 0, time: performance.now() });
  const [currentTrack, setCurrentTrack] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [showEntranceScreen, setShowEntranceScreen] = useState(true);
  const [entranceScreenFading, setEntranceScreenFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bootLines, setBootLines] = useState([]);
  const [bootFading, setBootFading] = useState(false);
  const [entranceFadeIn, setEntranceFadeIn] = useState(false);
  const [plasmaReady, setPlasmaReady] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [homicideInverted, setHomicideInverted] = useState(false);
  const [homicideFading, setHomicideFading] = useState(false);
  const [dialogueText, setDialogueText] = useState([]);
  const horizontalLineRef = useRef(null);
  const verticalLineRef = useRef(null);
  const xLabelRef = useRef(null);
  const textLabelRef = useRef(null);
  const vLabelRef = useRef(null);
  const zLabelRef = useRef(null);
  const audioRef = useRef(null);

  const bootSequence = useMemo(() => {
    const seq = [];
    seq.push('antipublic placeholder v12');
    seq.push('mount: antipublic.html');
    seq.push('env: Windows pwsh 5.1.19041');
    seq.push('Initializing audio subsystem...');
    seq.push('Initializing smoke renderer...');
    seq.push('scanning workspace...');

    const rawFiles = [
      'src/App.js','src/PlasmaShader.js','src/AsciiRain.js','public/index.html',
      'public/final.svg','public/presage.svg','package.json','node_modules/react/index.js',
      'build/sw.js'
    ];

    const sanitize = (p) => {
      return p
        .replace(/PlasmaShader\.js/gi, 'shader.js')
        .replace(/PlasmaWrapper\.js/gi, 'shader-wrapper.js')
        .replace(/plasma/gi, 'shader')
        .replace(/asciirain/gi, 'ascii')
        .replace(/react/gi, 'redacted')
        .replace(/node_modules/gi, 'redacted');
    };

    rawFiles.forEach((f)=> seq.push(`reading ./${sanitize(f)} ... ok`));

    seq.push('enumerating assets... 8 items');
    for (let i=0;i<8;i++) {
      const blk = (i+1).toString().padStart(2,'0');
      const total = '08';
      seq.push(`streaming block ${blk}/${total} ... ok`);
    }
    seq.push('checksum: verified');
    seq.push('Starting crosshair tracking...');
    seq.push('preparing runtime...');
    seq.push('All systems ready.');
    seq.push('WELCOME TO ANTIPUBLIC');
    return seq;
  }, []);

  useEffect(() => {
    console.clear();
    console.log('%c%s', 'color: white; font: 12px "Courier New", monospace; line-height: 12px; background: transparent;', CONSOLE_ASCII_LOGO);
  }, []);
  
  useEffect(() => {
    // Load dialogue.txt
    fetch('/dialogue.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n').filter(line => line.trim());
        setDialogueText(lines);
      })
      .catch(() => {});
  }, []);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        document.body.classList.add('mobile-optimized');
      } else {
        document.body.classList.remove('mobile-optimized');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    let currentLine = 0;
    let cancelled = false;

    const playNext = () => {
      if (cancelled) return;
      if (currentLine < bootSequence.length) {
        const nextLine = bootSequence[currentLine];
        setBootLines(prev => {
          if (prev.length && prev[prev.length - 1] === nextLine) return prev;
          return [...prev, nextLine];
        });
        currentLine++;
        const fast = Math.random() < 0.9;
        const delay = fast ? (20 + Math.random()*40) : (100 + Math.random()*160);
        setTimeout(playNext, delay);
      } else {
        setTimeout(() => {
          setBootFading(true);
          setTimeout(() => {
            setIsLoading(false);
            setBootFading(false);
            setTimeout(() => setEntranceFadeIn(true), 50);
          }, 300);
        }, 900);
      }
    };

    playNext();

    return () => { 
      cancelled = true;
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('mobile-optimized');
    };
  }, [bootSequence]);
  

  useEffect(() => {
    if (isMobile) return;
    
    let animationId = null;

    const handleMouseMove = (e) => {
      const newMouseX = e.clientX;
      const newMouseY = e.clientY;

      if (animationId) return;

      animationId = requestAnimationFrame(() => {
        if (horizontalLineRef.current) {
          horizontalLineRef.current.style.transform = `translateY(${newMouseY}px)`;
        }
        if (verticalLineRef.current) {
          verticalLineRef.current.style.transform = `translateX(${newMouseX}px)`;
        }
        const margin = 5;
        if (xLabelRef.current) {
          const rect = xLabelRef.current.getBoundingClientRect();
          xLabelRef.current.style.transform = `translate(${newMouseX - rect.width - margin}px, ${newMouseY - rect.height + margin - 6}px)`;
        }
        if (textLabelRef.current) {
          const rect = textLabelRef.current.getBoundingClientRect();
          textLabelRef.current.style.transform = `translate(${newMouseX + margin}px, ${newMouseY - rect.height + margin - 7}px)`;
        }
        if (vLabelRef.current) {
          const rect = vLabelRef.current.getBoundingClientRect();
          vLabelRef.current.style.transform = `translate(${newMouseX - rect.width - margin}px, ${newMouseY + margin}px)`;
        }
        if (zLabelRef.current) {
          zLabelRef.current.style.transform = `translate(${newMouseX + margin}px, ${newMouseY + margin}px)`;
        }

        const x = newMouseX.toString().padStart(4, '0');
        const z = newMouseY.toString().padStart(3, '0');
        const now = performance.now();
        const deltaTime = now - lastPosRef.current.time;
        if (deltaTime > 0) {
          const deltaX = newMouseX - lastPosRef.current.x;
          const deltaY = newMouseY - lastPosRef.current.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const vel = Math.round((distance / deltaTime) * 100);
          setVelocity(vel);
        }
        lastPosRef.current = { x: newMouseX, y: newMouseY, time: now };
        
        setMousePos({ x, y: z });
        
        animationId = null;
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMobile, performanceMode]);
  const tracks = useMemo(() => [
    { name: '2010 justin bieber', file: '/audio1.mp3', url: 'https://on.soundcloud.com/vkjmZgvCUv8xQBwsNc' },
    { name: 'true perspective', file: '/audio2.mp3', url: 'https://on.soundcloud.com/1aAW1x4kiAmJk6eGae' },
    { name: 'tropical remix', file: '/audio3.mp3', url: 'https://on.soundcloud.com/CcK9coMHecTVRTgh1L' },
    { name: 'tragic freestyle', file: '/audio4.mp3', startOffset: 0.90, url: 'https://on.soundcloud.com/1YI4WzXwH5YhV5Cfn3' },
    { name: 'jumanji', file: '/audio5.mp3', url: 'https://on.soundcloud.com/ViHTwTv2GCXECjQpho' },
    { name: 'top boy', file: '/audio6.mp3', url: 'https://on.soundcloud.com/emJdd0XhNOyU9xDf0S' },
    { name: 'sospechoso24', file: '/audio7.mp3', url: 'https://on.soundcloud.com/9q4lgTGfe8SDv9EC6E' },
    { name: 'wflytd', file: '/audio8.mp3', url: 'https://on.soundcloud.com/n0BcPp8SnH6lxO7kEC' },
    { name: 'trauma', file: '/audio9.mp3', url: 'https://on.soundcloud.com/F2rsEoQYHVZRfimQVn' },
    { name: 'no preguntes', file: '/audio10.mp3', url: 'https://on.soundcloud.com/K0m4KPNJnB2bY9TtBf' },
    { name: 'interlude', file: '/audio11.mp3', url: 'https://on.soundcloud.com/IKO5ZyhJZilkWJLz7W' },
    { name: 'homicide', file: '/audio12.mp3', url: 'https://on.soundcloud.com/SV5Hi99U8zFfwoPjYk' }
  ], []);

  useEffect(() => {
    const audio = audioRef.current;
    
    const shuffleTracks = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    const shuffledTracks = shuffleTracks(tracks);
    let currentTrackIndex = 0;
    let isChangingTrack = false;
    let currentMetadataHandler = null;
    
    setCurrentTrack(shuffledTracks[currentTrackIndex].name);
    
    if (audio) {
      audio.volume = 0.35;
      const applyStartOffsetIfAny = () => {
        const el = audio;
        if (!el) return;
        
        // Remove any existing metadata listener
        if (currentMetadataHandler) {
          el.removeEventListener('loadedmetadata', currentMetadataHandler);
          currentMetadataHandler = null;
        }
        
        const offset = (shuffledTracks[currentTrackIndex].startOffset || 0);
        
        const setTime = () => {
          try { 
            el.currentTime = offset; 
          } catch (e) {}
        };
        
        if (offset > 0) {
          if (el.readyState >= 1) {
            setTime();
          } else {
            currentMetadataHandler = () => {
              setTime();
              currentMetadataHandler = null;
            };
            el.addEventListener('loadedmetadata', currentMetadataHandler, { once: true });
          }
        } else {
          // Reset to 0 for tracks without offset
          setTime();
        }
      };
      
      const fadeOut = (callback) => {
        if (isChangingTrack) return;
        isChangingTrack = true;
        const fadeOutInterval = setInterval(() => {
          if (audio.volume > 0.05) {
            audio.volume = Math.max(0, audio.volume - 0.05);
          } else {
            clearInterval(fadeOutInterval);
            audio.pause();
            callback();
          }
        }, 50);
      };
      
      const fadeIn = () => {
        audio.volume = 0;
        audio.play().catch(() => {});
        const fadeInInterval = setInterval(() => {
          if (audio.volume < 0.3) {
            audio.volume = Math.min(0.35, audio.volume + 0.05);
          } else {
            audio.volume = 0.35;
            clearInterval(fadeInInterval);
            isChangingTrack = false;
          }
        }, 50);
      };
      
      const handleError = () => {
      };
      
      const handleCanPlay = () => {
        setCurrentTrack(shuffledTracks[currentTrackIndex].name);
        if (shuffledTracks[currentTrackIndex].name === 'homicide') {
          setHomicideInverted(true);
          setHomicideFading(false);
        }
      };
      
      const handleTrackEnd = () => {
        if (shuffledTracks[currentTrackIndex].name === 'homicide') {
          setHomicideFading(true);
          setTimeout(() => {
            setHomicideInverted(false);
            setHomicideFading(false);
          }, 1000);
        }
        
        fadeOut(() => {
          if (currentTrackIndex >= shuffledTracks.length - 1) {
            const newShuffle = shuffleTracks(tracks);
            shuffledTracks.splice(0, shuffledTracks.length, ...newShuffle);
            currentTrackIndex = 0;
          } else {
            currentTrackIndex = currentTrackIndex + 1;
          }
          
          setCurrentTrack(shuffledTracks[currentTrackIndex].name);
          audio.src = shuffledTracks[currentTrackIndex].file;
          applyStartOffsetIfAny();
          if (shuffledTracks[currentTrackIndex].name === 'homicide') {
            setHomicideInverted(true);
            setHomicideFading(false);
          }
          fadeIn();
        });
      };
      
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('ended', handleTrackEnd);
      
      const updateProgress = () => {
        if (audio && audio.duration) {
          const progress = (audio.currentTime / audio.duration) * 100;
          setSongProgress(progress);
        }
      };
      
      audio.addEventListener('timeupdate', updateProgress);
      
      audio.src = shuffledTracks[currentTrackIndex].file;
      applyStartOffsetIfAny();
      
      return () => {
        if (audio) {
          audio.removeEventListener('error', handleError);
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('ended', handleTrackEnd);
          audio.removeEventListener('timeupdate', updateProgress);
        }
      };
    }
  }, [tracks]);

  useEffect(() => {
    const updateFPS = () => {
      const randomFPS = (Math.random() * 0.19 + 24.80).toFixed(2);
      setFps(randomFPS);
    };

    const interval = setInterval(updateFPS, Math.random() * 120 + 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const originalTitle = 'Antipublic';
    const fpsTitle = '24.99fps';
    const typingSpeedMsBase = 110;
    const typingJitterMs = 40;
    let typingTimeouts = [];
    let cancelled = false;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const invisibleChar = ' ';

    const clearTyping = () => {
      typingTimeouts.forEach((id) => clearTimeout(id));
      typingTimeouts = [];
    };

    const typeText = (text) => new Promise((resolve) => {
      clearTyping();
      document.title = '';
      let cumulative = 0;
      for (let i = 0; i <= text.length; i++) {
        const perCharDelay = typingSpeedMsBase + Math.random() * typingJitterMs;
        const id = setTimeout(() => {
          document.title = text.slice(0, i);
          if (i === text.length) resolve();
        }, cumulative);
        cumulative += perCharDelay;
        typingTimeouts.push(id);
      }
    });

    const runCycle = async () => {
      while (!cancelled) {
        if (document.hidden) {
          await sleep(500);
          continue;
        }
        document.title = fpsTitle;
        await sleep(380);
        if (cancelled) break;
        document.title = invisibleChar;
        await sleep(240);
        if (cancelled) break;
        document.title = fpsTitle;
        await sleep(360);
        if (cancelled) break;
        document.title = invisibleChar;
        await sleep(240);
        if (cancelled) break;
        document.title = fpsTitle;
        await sleep(900);
        if (cancelled) break;

        await typeText(originalTitle);
        if (cancelled) break;

        await sleep(2600);
      }
    };

    runCycle();

    return () => {
      cancelled = true;
      clearTyping();
      document.title = originalTitle;
    };
  }, []);

  useEffect(() => {
    const isMain = !isLoading && !showEntranceScreen && !showCard;
    const root = document.documentElement;
    const onDown = (e) => { 
      if (!isMain) return; 
      if (e && e.target && typeof e.target.closest === 'function') {
        if (e.target.closest('.no-invert')) return;
      }
      root.classList.add('invert-hold'); 
    };
    const onUp = () => root.classList.remove('invert-hold');

    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onUp);

    document.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('touchend', onUp, { passive: true });
    document.addEventListener('touchcancel', onUp, { passive: true });

    if (!isMain) {
      root.classList.remove('invert-hold');
    }

    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onUp);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('touchend', onUp);
      document.removeEventListener('touchcancel', onUp);
      root.classList.remove('invert-hold');
    };
  }, [isLoading, showEntranceScreen, showCard]);

  useEffect(() => {
    const preventZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const preventKeyboardShortcuts = (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
      if (e.key === 'F11') {
        e.preventDefault();
      }
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('wheel', preventZoom, { passive: false });
    document.addEventListener('keydown', preventKeyboardShortcuts);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('wheel', preventZoom);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, [isLoading, showEntranceScreen, showCard]);


  const handleEntranceClick = useCallback((e) => {
    setEntranceScreenFading(true);
    const clickX = (e && typeof e.clientX === 'number') ? e.clientX : Math.floor(window.innerWidth / 2);
    const clickY = (e && typeof e.clientY === 'number') ? e.clientY : Math.floor(window.innerHeight / 2);

    if (horizontalLineRef.current) {
      horizontalLineRef.current.style.transform = `translateY(${clickY}px)`;
    }
    if (verticalLineRef.current) {
      verticalLineRef.current.style.transform = `translateX(${clickX}px)`;
    }
    const margin = 5;
    if (xLabelRef.current) {
      const rect = xLabelRef.current.getBoundingClientRect();
      xLabelRef.current.style.transform = `translate(${clickX - rect.width - margin}px, ${clickY - rect.height + margin - 6}px)`;
    }
    if (textLabelRef.current) {
      const rect = textLabelRef.current.getBoundingClientRect();
      textLabelRef.current.style.transform = `translate(${clickX + margin}px, ${clickY - rect.height + margin - 7}px)`;
    }
    if (vLabelRef.current) {
      const rect = vLabelRef.current.getBoundingClientRect();
      vLabelRef.current.style.transform = `translate(${clickX - rect.width - margin}px, ${clickY + margin}px)`;
    }
    if (zLabelRef.current) {
      zLabelRef.current.style.transform = `translate(${clickX + margin}px, ${clickY + margin}px)`;
    }

    setMousePos({ x: clickX.toString().padStart(4, '0'), y: clickY.toString().padStart(3, '0') });
    setVelocity(0);
    lastPosRef.current = { x: clickX, y: clickY, time: performance.now() };

    if (audioRef.current) {
      const el = audioRef.current;
      el.volume = 0.35;
      // Try to play immediately on user gesture
      const tryPlay = () => {
        el.play().catch(() => {
          try {
            el.load();
            el.play().catch(() => {});
          } catch {}
        });
      };
      if (el.readyState >= 2) {
        tryPlay();
      } else {
        el.addEventListener('canplay', tryPlay, { once: true });
        tryPlay();
      }
    }
    
    setTimeout(() => {
      setPlasmaReady(true);
    }, 50);
    
    setTimeout(() => {
      setShowEntranceScreen(false);
      setEntranceScreenFading(false);
    }, 500);
  }, []);



  return (
    <>
      <div className={`homicide-invert-overlay ${homicideInverted && !homicideFading ? 'active' : ''} ${homicideFading ? 'fading' : ''}`}></div>
      {isLoading && (
        <div className={`boot-screen ${bootFading ? 'fade-out' : ''}`}>
          <div className="boot-logo">
            <Presage className="boot-logo-svg" />
          </div>
          <div className="boot-content">
            <pre className="boot-ascii-header">{CONSOLE_ASCII_LOGO}</pre>
            {bootLines.map((line, index) => (
              <div key={index} className="boot-line">
                <span className="boot-prompt">$</span> {line}
                {index === bootLines.length - 1 && <span className="boot-cursor">_</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showEntranceScreen && !isLoading && (
        <div className={`entrance-screen ${entranceScreenFading ? 'fade-out' : ''}`} onClick={handleEntranceClick}>
          <div className={`entrance-text ${entranceFadeIn ? 'fade-in' : ''}`}>
            {isMobile ? 'tap to enter' : 'click to enter'}
          </div>
          <div className={`entrance-subtext ${entranceFadeIn ? 'fade-in' : ''}`}>(volume warning)</div>
        </div>
      )}
      
      <audio ref={audioRef} loop={false} preload="none" />
      
      {!isLoading && (
        <div className="App visible">
        <div className="progress-bar-container">
          <div className={`progress-bar ${performanceMode ? 'performance-mode' : ''}`} style={{ width: `${songProgress}%` }}></div>
        </div>
      
      <div className="plasma-background">
        {!isMobile && (
          <div className={`effect-layer ${showCard ? 'hidden' : ''}`}>
            {plasmaReady && !showCard && (
              <PlasmaShader 
                color="#000000"
                speed={performanceMode ? 0.5 : 0.8}
                direction="forward"
                scale={1.5}
                opacity={performanceMode ? 0.15 : 0.25}
                mouseInteractive={false}
                paused={!plasmaReady}
                performanceMode={performanceMode}
              />
            )}
          </div>
        )}
        {isMobile && !showCard && (
          <div className="effect-layer ascii-layer">
            <AsciiRain 
              opacity={0.45} 
              speed={1.2} 
              density={0.25}
              performanceMode={false}
            />
          </div>
        )}
      </div>

      <div className="top-text">
        audio: 
        <a 
          href={tracks.find(t => t.name === currentTrack)?.url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="song-link no-invert"
          onClick={(e) => e.stopPropagation()}
        >
          {currentTrack}
        </a>
        .mp3
      </div>
      
      <div className="console-text">
        <span>antipublic.org</span>
        <span>made by presage005</span>
        <span>made by delusional</span>
      </div>
      
      <div className="cursor-coords">
        <span>owner@antipublic.org</span>
        <span>30/10/2025 2:41 AM</span>
        <span>{fps}fps</span>
      </div>

      <div className="bg-center">
        <Presage 
          className={`bg-svg ${performanceMode ? 'performance-mode' : ''} ${homicideInverted ? 'homicide-hidden' : ''}`}
        />
        <img 
          src="/dani.jpg" 
          alt="" 
          className={`bg-image ${performanceMode ? 'performance-mode' : ''} ${homicideInverted && !homicideFading ? 'homicide-visible' : ''} ${homicideFading ? 'homicide-fading-out' : ''}`}
        />
      </div>
      
      <div className="svg-container">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" preserveAspectRatio="xMidYMid meet" viewBox="1.93 1.98 447.07 75.18" className={`main-svg ${performanceMode ? 'performance-mode' : ''}`}>
          <g transform="translate(0.000000,267.000000) scale(0.050000,-0.050000)" fill="#000000" stroke="none">
            <path d="M4053 5255 c-19 -69 -15 -151 7 -158 14 -5 120 -649 120 -730 0 -4 -81 -7 -179 -7 l-179 0 -154 131 c-277 236 -415 267 -533 122 -51 -64 -44 -73 62 -73 68 0 133 -18 218 -61 221 -110 211 -119 -143 -119 -293 0 -312 2 -312 38 0 30 -103 252 -130 278 -19 20 -153 -77 -260 -188 l-123 -128 -258 0 -257 0 69 58 c61 51 69 68 67 149 -4 220 -143 180 -270 -78 -88 -178 -204 -195 -226 -33 -27 208 -162 254 -247 85 -94 -187 -36 -321 150 -345 42 -6 41 -11 -37 -101 -138 -161 -230 -203 -422 -189 -177 12 -183 -6 -17 -54 275 -81 469 16 555 278 37 115 137 96 154 -28 37 -280 392 -391 392 -123 0 60 -15 97 -61 149 l-60 69 259 6 c237 6 263 11 307 53 l49 45 108 -50 108 -51 725 0 725 0 0 115 c0 63 -20 248 -44 411 -30 203 -37 301 -23 310 65 42 51 165 -22 195 -39 16 -71 38 -71 49 0 38 -35 19 -47 -25z m-2068 -714 c14 -51 -30 -110 -105 -141 -85 -35 -88 -21 -20 86 62 99 109 119 125 55z m868 -114 c17 -69 -3 -79 -84 -41 -93 45 -109 90 -48 139 54 44 106 5 132 -98z m-1401 58 c22 -15 68 -92 68 -115 0 -27 -127 2 -147 33 -33 53 28 116 79 82z m488 -363 c90 -72 105 -142 30 -142 -110 0 -210 98 -210 205 0 33 106 -4 180 -63z"/>
            <path d="M5390 5241 c-30 -59 -29 -60 29 -90 79 -41 91 -39 118 20 30 67 32 63 -36 98 -77 40 -75 41 -111 -28z"/>
            <path d="M7262 5165 c-45 -69 -46 -73 -12 -130 24 -42 42 -148 60 -372 41 -504 -13 -466 667 -459 530 6 541 7 588 52 l49 45 108 -50 c59 -28 142 -51 183 -51 l75 0 0 118 c0 103 -72 300 -131 359 -19 20 -193 -106 -243 -176 -124 -172 -282 -195 -372 -52 -67 105 -245 288 -367 376 -134 96 -116 116 203 222 137 45 140 48 146 120 8 89 7 89 -200 8 -305 -119 -438 -323 -300 -460 33 -33 84 -63 113 -66 75 -8 288 -171 333 -254 18 -33 -4 -35 -351 -35 -445 0 -411 -29 -433 370 -28 491 -43 546 -116 435z m1611 -738 c17 -69 -3 -79 -84 -41 -93 45 -109 90 -48 139 54 44 106 5 132 -98z"/>
            <path d="M4432 5163 c-33 -62 -33 -84 -3 -370 17 -166 34 -375 36 -463 l5 -160 45 84 c30 56 45 119 45 186 0 122 -56 645 -78 730 l-15 60 -35 -67z"/>
            <path d="M5192 5164 c-28 -55 -27 -58 27 -90 76 -45 90 -43 118 17 30 67 32 63 -36 98 -77 40 -75 40 -109 -25z"/>
            <path d="M6903 5169 c-30 -67 -32 -63 36 -98 77 -40 75 -41 111 28 30 59 29 60 -29 90 -79 41 -91 39 -118 -20z"/>
            <path d="M5461 4921 c-12 -21 -21 -61 -21 -88 0 -37 -22 -62 -87 -100 -118 -69 -237 -204 -229 -259 10 -71 207 -95 304 -38 l71 42 20 -74 c11 -41 38 -103 60 -139 l40 -65 794 0 793 0 -12 215 c-26 445 -225 658 -342 365 -84 -210 -24 -328 161 -316 93 6 97 4 103 -49 l7 -55 -241 0 -240 0 -156 131 c-267 225 -413 264 -521 139 -65 -75 -57 -90 51 -90 98 0 241 -58 344 -140 l50 -39 -385 -1 -386 0 -20 53 c-11 28 -40 163 -64 300 -45 251 -57 278 -94 208z m1548 -220 c43 -47 26 -81 -41 -81 -52 0 -80 40 -61 90 16 41 60 38 102 -9z m-1529 -93 c0 -60 -74 -99 -150 -80 -62 16 -44 52 59 114 68 42 91 34 91 -34z"/>
            <path d="M648 4644 c-18 -47 -14 -67 26 -125 199 -291 -82 -641 -494 -613 -203 14 -187 -18 46 -89 440 -134 793 431 515 822 -54 75 -67 76 -93 5z"/>
            <path d="M3292 4017 c-20 -33 -33 -63 -29 -66 4 -3 36 -21 71 -39 l65 -32 32 62 c18 34 29 64 25 67 -73 64 -130 66 -164 8z"/>
          </g>
        </svg>
      </div>

      {!isMobile && (
        <div className="controls-area no-invert">
          <div className="performance-toggle" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPerformanceMode(!performanceMode); }}>
            <span>[{performanceMode ? 'performance: ON' : 'performance: OFF'}]</span>
          </div>
        </div>
      )}
      
      {!isMobile && (
        <div 
          className="show-cards-controls no-invert" 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            setShowCard(!showCard); 
          }}
          style={{
            position: 'fixed',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            pointerEvents: 'auto',
            cursor: 'pointer',
            padding: 0,
            margin: 0,
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: 'black',
            filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))',
            opacity: 0.8
          }}
        >
          [{showCard ? 'hide cards' : 'show cards'}]
        </div>
      )}
      
      {isMobile && (
        <div 
          className="mobile-controls no-invert"
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            setShowCard(!showCard); 
          }}
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            pointerEvents: 'auto',
            cursor: 'pointer',
            padding: 0,
            margin: 0,
            fontFamily: 'Courier New, monospace',
            fontSize: '9px',
            color: 'black',
            filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))',
            opacity: 0.8,
            textAlign: 'center'
          }}
        >
          {showCard ? 'hide cards' : 'show cards'}
        </div>
      )}

        </div>
      )}
      
      {!isLoading && (
        <div className="browsing-indicator">
          <span>[browsing index.html]</span>
        </div>
      )}
      
      {!isLoading && !showEntranceScreen && !showCard && dialogueText.length > 0 && (
        <div className="dialogue-scroll-container">
          <div className="dialogue-scroll">
            {dialogueText.map((line, index) => (
              <div key={index} className="dialogue-line">{line}</div>
            ))}
            {dialogueText.map((line, index) => (
              <div key={`dup-${index}`} className="dialogue-line">{line}</div>
            ))}
          </div>
        </div>
      )}
      
      {showCard && (
        <div className={`card-overlay ${isExiting ? 'exiting' : ''}`}>
          <div className="cards-container">
            <div className="overlay-card overlay-back">
              <CreditCard 
                number="4758 9621 3047 8159" 
                ownerName="Mateo" 
                animationOffset={0} 
                signature="default"
                backUrl="https://www.fakecrime/antipublic."
              />
            </div>
            <div className="overlay-card overlay-front">
              <CreditCard 
                number="4758 9621 6283 4907" 
                ownerName="Miguel" 
                validThru="01/09" 
                variant="inverted" 
                animationOffset={1.5}
                signature="miguel"
                backUrl="https://www.fakecrime/antipublic."
              />
            </div>
          </div>
          <div className="instructions">{isMobile ? 'Tap to flip' : 'Click to flip • Move mouse to tilt'}</div>
          <div className="show-cards-controls no-invert">
            <div className="show-cards-toggle" onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setShowCard(false);
                setIsExiting(false);
              }, 320);
            }}>
              <span>[hide cards]</span>
            </div>
          </div>
        </div>
      )}

      {showCard && (
        <div className="ascii-rain-overlay">
          <AsciiRain 
            opacity={0.6} 
            speed={1.0} 
            density={0.3}
            performanceMode={false}
          />
        </div>
      )}

      <div className={`crosshair-cursor ${isMobile || isLoading || (showEntranceScreen && !entranceScreenFading) ? 'hidden' : ''}`}>
        <div className="crosshair-line crosshair-horizontal" ref={horizontalLineRef}></div>
        <div className="crosshair-line crosshair-vertical" ref={verticalLineRef}></div>
          
          <div 
            ref={xLabelRef}
            className="crosshair-label coords"
            style={{ transform: 'translate(-40px, -15px)' }}
          >
            {mousePos.x}
          </div>
          
          <div 
            ref={textLabelRef}
            className="crosshair-label hint"
            style={{ transform: 'translate(12px, -5px)' }}
          >
            click and hold
          </div>
          
          <div 
            ref={vLabelRef}
            className="crosshair-label coords"
            style={{ transform: 'translate(-20px, 5px)' }}
          >
            {velocity.toString().padStart(3, '0')}
          </div>
          
          <div 
            ref={zLabelRef}
            className="crosshair-label coords"
            style={{ transform: 'translate(10px, 5px)' }}
          >
            {mousePos.y}
          </div>
      </div>
    </>
  );
};


export default App;
