import React, { useEffect, useRef, useState } from "react";
import Threads from "./components/Threads";
import CreditCard from "./components/CreditCard";
// @ts-ignore
import AsciiRain from "./components/AsciiRain.js";

declare const process: {
  env: {
    NODE_ENV: string;
  };
};

function PageContent() {
  return (
    <div className="page" data-fold-content={true}>
      <header className="hero">
        <h1>
          <span>antipublic.org</span>
        </h1>
      </header>

      <article className="article">
        <div className="articleMainText">
          <p>
            Antipublic.org es un proyecto independiente creado en 2025 por <span className="highlighted-black">@Presage y @Delusional.</span> Incorporando en 2026 a <span className="highlighted-blue">@Lancelot</span> y tomando fuerte inspiración en @Prynts
          </p>
          <p>
            Nacio como una idea simple: crear espacios en internet para artistas independientes sin
            pedir nada a cambio. Creemos que cada artista merece una identidad propia y un lugar
            donde su obra pueda existir libremente.
          </p>
          <p>
            <span className="highlighted-black">Antipublic se mueve entre distintas disciplinas, pero su nucleo siempre ha sido la estetica visual.</span> Nos interesa el diseño, la tipografía, las interfaces y la manera en que
            la identidad de un proyecto puede construirse a traves de la imagen y la presencia
            digital.
          </p>
          <p>
            Amamos la musica, el arte y la cultura de internet. Para nosotros crear significa
            colaborar: experimentar con otros artistas, construir cosas juntos y permitir que nuevas
            ideas aparezcan en el proceso.
          </p>
          <p>
            Hasta ahora hemos trabajado en proyectos como www.antipublic.org, <span className="highlighted-black redacted">www.anti-public.com</span>, <span className="highlighted-black redacted">2005.cat</span> y <span className="highlighted-blue redacted">Koikoi.com</span>, siempre con la misma filosofia: apoyar a artistas independientes y
            ayudar a que sus proyectos tengan una presencia visual propia.
          </p>
          <p>
            Antipublic busca convertirse en una identidad creativa reconocible y en constante
            evolucion. Proximamente tambien funcionara como una biblioteca digital con contenido
            audiovisual, material grafico y documentacion enfocada en el uso creativo de herramientas
            digitales.
          </p>
          <p>
            Cualquier persona que quiera contribuir o formar parte de Antipublic es bienvenida.
          </p>
          <p>
            <span className="highlighted-black">El conocimiento es poder, y cada aporte ayuda a que una idea simple pueda crecer y transformarse en algo real.</span>
          </p>
          <p>
            Antipublic existe gracias a la colaboracion, la experimentacion y el deseo de construir
            arte en conjunto.
          </p>
          <p>
            Hecho con amor ❤︎⁠ desde Santa fe y Santiago
          </p>
        </div>
        <div className="antiEndBlock">
          <a
            className="antiEndVisual"
            href="archive/index.html"
            aria-label="Open Archive"
          >
            <img className="antiSlide antiSlideA" src="/anti1.png" alt="Anti gallery frame 1" />
            <img className="antiSlide antiSlideB" src="/anti2.png" alt="Anti gallery frame 2" />
          </a>
          <p className="antiEndSubtitle">Antipublic placeholder, 2025</p>
        </div>
        <div className="antiEndSpacer" aria-hidden="true" />
      </article>
    </div>
  );
}

export function App() {
  useEffect(() => {
    const ASCII = `              _   _             _     _ _      
             | | (_)           | |   | (_)     
   __ _ _ __ | |_ _ _ __  _   _| |__ | |_  ___ 
  / _\` | '_ \\| __| | '_ \\| | | | '_ \\| | |/ __|
 | (_| | | | | |_| | |_) | |_| | |_) | | | (__ 
  \\__,_|_| |_|\\__|_| .__/ \\__,_|_.__/|_|_|\\___|
                   | |                         
                   |_|                         `;

    const logAscii = () => {
      try {
        console.log(
          "%c%s",
          'color: white; font: 12px "Courier New", monospace; line-height: 12px; background: transparent;',
          ASCII,
        );
      } catch {}
    };

    const clearAndLog = () => {
      try {
        console.clear();
      } catch {}
      logAscii();
    };

    const timeouts: number[] = [];
    let intervalId: number | undefined;

    try {
      if (process.env.NODE_ENV === "production") {
        clearAndLog();
        intervalId = window.setInterval(clearAndLog, 1000);
      } else {
        clearAndLog();
        timeouts.push(window.setTimeout(clearAndLog, 100));
        timeouts.push(window.setTimeout(clearAndLog, 500));
        timeouts.push(window.setTimeout(clearAndLog, 1000));
        intervalId = window.setInterval(clearAndLog, 2000);
      }
    } catch {}

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    const preventDefault = (event: Event) => {
      event.preventDefault();
    };

    const preventZoomKeys = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const metaOrCtrl = event.ctrlKey || event.metaKey;
      if (metaOrCtrl && ["+", "=", "-", "_", "0"].includes(key)) {
        event.preventDefault();
      }
      if (metaOrCtrl && ["a", "c", "x", "p", "s", "u"].includes(key)) {
        event.preventDefault();
      }
    };

    const preventWheelZoom = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("selectstart", preventDefault);
    document.addEventListener("dragstart", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("gesturestart", preventDefault as EventListener);
    document.addEventListener("gesturechange", preventDefault as EventListener);
    document.addEventListener("gestureend", preventDefault as EventListener);
    window.addEventListener("keydown", preventZoomKeys);
    window.addEventListener("wheel", preventWheelZoom, { passive: false });

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("gesturestart", preventDefault as EventListener);
      document.removeEventListener("gesturechange", preventDefault as EventListener);
      document.removeEventListener("gestureend", preventDefault as EventListener);
      window.removeEventListener("keydown", preventZoomKeys);
      window.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

  const centerContentRef = useRef<HTMLDivElement | null>(null);
    const centerFoldRef = useRef<HTMLDivElement | null>(null);
    const topContentRef = useRef<HTMLDivElement | null>(null);
    const bottomContentRef = useRef<HTMLDivElement | null>(null);
    const threadsOverlayRef = useRef<HTMLDivElement | null>(null);
    const sideVignetteRef = useRef<HTMLDivElement | null>(null);
    const asciiRainLayerRef = useRef<HTMLDivElement | null>(null);
    const cornerMarkRef = useRef<HTMLDivElement | null>(null);
    const cornerWaveCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const mobileWaveCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const creditsDockRef = useRef<HTMLDivElement | null>(null);
    const scrollHintRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const waveTimeRef = useRef(0);
    const mousePosRef = useRef({ x: 0, y: 0 });
    const blackCardNumber = React.useMemo(() => {
      const randomGroup = () => Math.floor(1000 + Math.random() * 9000).toString();
      return `4532 1234 ${randomGroup()} ${randomGroup()}`;
    }, []);
    const blueCardNumber = React.useMemo(() => {
      return `4532 1234 5424 1244`;
    }, []);
    const [showScrollHint, setShowScrollHint] = useState(true);
    const galleryLockYRef = useRef<number | null>(null);

    useEffect(() => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      const centerContent = centerContentRef.current;
      const centerFold = centerFoldRef.current;
      const threadsOverlay = threadsOverlayRef.current;
      const sideVignette = sideVignetteRef.current;
      const asciiRainLayer = asciiRainLayerRef.current;
      const creditsDock = creditsDockRef.current;
      const foldContents = [topContentRef.current, centerContentRef.current, bottomContentRef.current].filter(
        Boolean,
      ) as HTMLDivElement[];

      if (!centerContent || !centerFold || foldContents.length === 0) return;

      const originalBodyHeight = document.body.style.height;
      let rafId: number | undefined;

      const updateBodyHeight = () => {
        const maxScroll = centerContent.clientHeight - centerFold.clientHeight;
        document.body.style.height = `${maxScroll + window.innerHeight}px`;
      };

      const tryStartAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (!analyserRef.current) {
          const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (AudioCtx) {
            const ctx = audioContextRef.current ?? new AudioCtx();
            audioContextRef.current = ctx;
            if (!sourceNodeRef.current) {
              const source = ctx.createMediaElementSource(audio);
              const analyser = ctx.createAnalyser();
              analyser.fftSize = 256;
              analyser.smoothingTimeConstant = 0.84;
              source.connect(analyser);
              analyser.connect(ctx.destination);
              sourceNodeRef.current = source;
              analyserRef.current = analyser;
              dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as any;
            }
          }
        }
        if (audioContextRef.current?.state === "suspended") {
          audioContextRef.current.resume().catch(() => {});
        }
        if (!audio.paused) return;
        try {
          if (audio.currentTime < 0.001) {
            audio.currentTime = 0.05;
          }
        } catch {}
        audio.volume = 0;
        audio.play().catch(() => {});
      };

      const onFirstUserIntent = () => {
        tryStartAudio();
      };
      const onMouseMove = (e: MouseEvent) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
      };

      window.addEventListener("touchstart", onFirstUserIntent, { passive: true });
      window.addEventListener("pointerdown", onFirstUserIntent, { passive: true });
      window.addEventListener("keydown", onFirstUserIntent);
      window.addEventListener("mousemove", onMouseMove);

      const tick = () => {
        const smoothstep = (e0: number, e1: number, x: number) => {
          const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
          return t * t * (3 - 2 * t);
        };
        let currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
        const antiVisual = centerContent.querySelector(".antiEndVisual") as HTMLElement | null;
        if (antiVisual) {
          const antiRect = antiVisual.getBoundingClientRect();
          if (galleryLockYRef.current === null) {
            const antiDocTop = antiRect.top + currentScroll;
            galleryLockYRef.current = Math.max(
              0,
              antiDocTop - (window.innerHeight * 0.5 - antiRect.height * 0.5),
            );
          }
          const lockScrollY = galleryLockYRef.current ?? 0;
          if (currentScroll > lockScrollY) {
            window.scrollTo(0, lockScrollY);
            currentScroll = lockScrollY;
          }

          const antiCenterY = antiRect.top + antiRect.height * 0.5;
          const distanceFromCenter = Math.abs(antiCenterY - window.innerHeight * 0.5);
          const fadeToGallery = 1 - smoothstep(30, 250, distanceFromCenter);
          const textOpacity = Math.max(0, 1 - fadeToGallery);

          foldContents.forEach((contentRoot) => {
            const articleMainText = contentRoot.querySelector(".articleMainText") as HTMLElement | null;
            if (articleMainText) articleMainText.style.opacity = String(textOpacity);
          });

          const centerHero = centerContentRef.current?.querySelector(".hero") as HTMLElement | null;
          if (centerHero) centerHero.style.opacity = String(textOpacity);
          const bottomHero = bottomContentRef.current?.querySelector(".hero") as HTMLElement | null;
          if (bottomHero) bottomHero.style.opacity = String(textOpacity);
          const topHero = topContentRef.current?.querySelector(".hero") as HTMLElement | null;
          if (topHero) topHero.style.opacity = String(textOpacity);
        }

        const y = -currentScroll;
        foldContents.forEach((el) => {
          el.style.transform = `translateY(${y}px)`;
        });
        if (showScrollHint && currentScroll > 8) {
          setShowScrollHint(false);
        }

        const mainTitle = centerContent.querySelector(".hero h1") as HTMLElement | null;
        const scrollHint = scrollHintRef.current;
        if (mainTitle && scrollHint) {
          const rect = mainTitle.getBoundingClientRect();
          const x = rect.right + 18;
          const yHint = rect.top + rect.height * 0.54;
          scrollHint.style.left = `${Math.min(window.innerWidth - 140, x)}px`;
          scrollHint.style.top = `${Math.max(12, yHint)}px`;
        }

        if (threadsOverlay) {
          const rampIn = smoothstep(8, 160, currentScroll);
          const v = Math.min(1, Math.max(0, rampIn));

          threadsOverlay.style.opacity = String(v);
          if (sideVignette) {
            sideVignette.style.opacity = String(v * 0.95);
          }
          if (asciiRainLayer) {
            asciiRainLayer.style.opacity = String(v * 0.7);
          }
          if (creditsDock) {
            const cardsOpacity = smoothstep(48, 220, currentScroll) * 0.98;
            creditsDock.style.opacity = String(cardsOpacity);
            creditsDock.style.pointerEvents = cardsOpacity > 0.08 ? "auto" : "none";
          }

          const audio = audioRef.current;
          if (audio) {
            const targetVolume = 0.14 * v;
            if (v > 0.001) {
              tryStartAudio();
            }
            const current = Number.isFinite(audio.volume) ? audio.volume : 0;
            const next = current + (targetVolume - current) * 0.16;
            audio.volume = Math.max(0, Math.min(1, next));
          }
        }

        if (cornerMarkRef.current) {
          const mainTitle = centerContent.querySelector(".hero h1") as HTMLElement | null;
          let cv = 0;
          if (mainTitle) {
            const rect = mainTitle.getBoundingClientRect();
            const titleStillVisible = rect.bottom > 0 && rect.top < window.innerHeight;
            if (!titleStillVisible) {
              const offTop = Math.max(0, -rect.bottom);
              cv = smoothstep(8, 72, offTop);
            }
          }
          cornerMarkRef.current.style.opacity = String(cv);
        }

        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        let activity = 0.08;
        if (analyser && dataArray) {
          analyser.getByteTimeDomainData(dataArray);
          let energy = 0;
          for (let i = 0; i < dataArray.length; i += 1) {
            const centered = (dataArray[i] - 128) / 128;
            energy += centered * centered;
          }
          activity = Math.min(1, Math.sqrt(energy / dataArray.length) * 6.5);
        }

        waveTimeRef.current += 0.085;
        const baseTime = waveTimeRef.current;
        const renderWave = (canvas: HTMLCanvasElement | null, width: number, height: number) => {
          if (!canvas) return;
          const dpr = window.devicePixelRatio || 1;
          if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
          }
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
          if (!ctx) return;

          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, width, height);

          const layers = [
            { alpha: 0.95, width: 1.15, freq: 3, scale: 1, speed: 1.4 },
            { alpha: 0.4, width: 0.7, freq: 2.3, scale: 0.7, speed: 1 },
            { alpha: 0.25, width: 0.7, freq: 3.7, scale: 0.6, speed: 1.2 },
            { alpha: 0.18, width: 0.65, freq: 1.9, scale: 0.5, speed: 0.9 },
          ];

          layers.forEach((layer, index) => {
            const amplitude = (1.2 + activity * 3.6) * layer.scale;
            const phase = baseTime * layer.speed + index * 0.8;
            ctx.beginPath();
            ctx.lineWidth = layer.width;
            ctx.strokeStyle = `rgba(17,17,17,${layer.alpha})`;

            for (let x = 0; x <= width; x += 1) {
              const normalized = x / width;
              const envelope = Math.sin(Math.PI * normalized) ** 1.6;
              const y =
                height * 0.5 +
                Math.sin(normalized * Math.PI * layer.freq + phase) * amplitude * envelope;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }

            ctx.stroke();
          });
        };

        renderWave(cornerWaveCanvasRef.current, 94, 16);
        renderWave(mobileWaveCanvasRef.current, 132, 22);

        const activeVisual = centerContent.querySelector(".antiEndVisual") as HTMLElement | null;
        if (activeVisual) {
            const hoveredVisual = centerContent.querySelector(".antiEndVisual:hover") as HTMLElement | null;
          if (hoveredVisual) {
            const rect = hoveredVisual.getBoundingClientRect();
            const xNorm = (mousePosRef.current.x - rect.left) / rect.width;
            const yNorm = (mousePosRef.current.y - rect.top) / rect.height;
            const strength = 5.75;
            const tiltX = (0.5 - yNorm) * strength;
            const tiltY = (xNorm - 0.5) * strength;
            hoveredVisual.style.transform =
              `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) ` +
              `rotateY(${tiltY.toFixed(2)}deg) scale(1.012)`;
          } else {
            const elapsed = performance.now() / 1000;
            const speed = 0.9;
            const idleTiltX =
              Math.sin(elapsed * 0.28 * speed + 0.65) * 3.2 +
              Math.sin(elapsed * 0.62 * speed + 0.35) * 1.6;
            const idleTiltY =
              Math.cos(elapsed * 0.34 * speed + 0.52) * 3.8 +
              Math.cos(elapsed * 0.72 * speed + 0.21) * 1.9;
            activeVisual.style.transform =
              `perspective(1400px) rotateX(${idleTiltX.toFixed(2)}deg) ` +
              `rotateY(${(idleTiltY - 1.1).toFixed(2)}deg)`;
          }
        }
      };

      const onResize = () => updateBodyHeight();
      const animate = () => {
        tick();
        rafId = window.requestAnimationFrame(animate);
      };

      window.addEventListener("resize", onResize);
      updateBodyHeight();
      animate();

      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("touchstart", onFirstUserIntent);
        window.removeEventListener("pointerdown", onFirstUserIntent);
        window.removeEventListener("keydown", onFirstUserIntent);
        window.removeEventListener("mousemove", onMouseMove);
        if (rafId) window.cancelAnimationFrame(rafId);
        document.body.style.height = originalBodyHeight;
      };
  }, [showScrollHint]);


  return (
    <div className="all">
      <audio ref={audioRef} src="/song1.mp3" preload="auto" loop />
      <div className="sideVignette" ref={sideVignetteRef} aria-hidden="true" />
      <div className="asciiRainLayer" ref={asciiRainLayerRef} aria-hidden="true">
        <AsciiRain opacity={0.22} speed={0.9} density={0.7} />
      </div>
      <div className="creditsDock" ref={creditsDockRef} aria-label="Credits cards">
        <div className="creditsDockInner">
          <CreditCard
            ownerName="Presage"
            number="4532 1234 5678 9012"
            bankName="ANTIPUBLIC"
            variant="default"
            animationOffset={0.0}
            backUrl="www.antipublic.org"
            footerText="founder"
          />
          <CreditCard
            ownerName="Delusional"
            number={blackCardNumber}
            bankName="ANTIPUBLIC"
            validThru="01/09"
            variant="inverted"
            animationOffset={1.8}
            signature="miguel"
            backUrl="www.antipublic.org"
          />
          <CreditCard
            ownerName="Lancelot"
            number={blueCardNumber}
            bankName="ANTIPUBLIC"
            validThru="09/05"
            variant="blue"
            animationOffset={3.6}
            signature="max"
            networkLogo="05OG"
            backUrl="www.antipublic.org"
            footerText="CEO"
          />
        </div>
      </div>
      <div className="cornerMark" ref={cornerMarkRef} aria-hidden="true">
        <canvas className="cornerMarkWaveCanvas" ref={cornerWaveCanvasRef} aria-hidden="true" />
        <span className="cornerMarkLabel">ANTIPUBLIC.ORG</span>
      </div>
      <div className="threadsOverlay" ref={threadsOverlayRef} aria-hidden="true">
        <div className="threadsFrame">
          {/* @ts-ignore - Threads component type issue */}
          <Threads color={[0, 0, 0] as any} amplitude={1} distance={0} enableMouseInteraction={true} />
        </div>
      </div>

      <div className="wrapper3d">
        <div className="fold foldTop" aria-hidden="true">
          <div className="foldAlign">
            <div data-fold-content="true" ref={topContentRef}>
              <PageContent />
            </div>
          </div>
        </div>

        <div className="fold" id="center-fold" ref={centerFoldRef}>
          <div className="foldAlign">
            <div data-fold-content="true" id="center-content" ref={centerContentRef}>
              <PageContent />
            </div>
          </div>
        </div>

        <div className="fold foldBottom" aria-hidden="true">
          <div className="foldAlign">
            <div data-fold-content="true" ref={bottomContentRef}>
              <PageContent />
            </div>
          </div>
        </div>
      </div>

      <div className={`scrollHint ${showScrollHint ? "visible" : "hidden"}`} ref={scrollHintRef}>
        <span className="scrollHintArrow" aria-hidden="true">
          ↓
        </span>
        <span>scroll down</span>
      </div>
      <div className="presageWatermark" aria-hidden="true">
        <img src="/watermark.svg" alt="Watermark" width="200" height="93" />
      </div>
      <div className="mobileTitle">antipublic.org</div>
      <div className="mobileLocation">SANTA FE/SANTIAGO</div>
      <div className="mobileYear">2026</div>
      <div className="mobileMessage">
        Visita este sitio en un navegador de computadora para más información
      </div>
      <canvas className="mobileWaveCanvas" ref={mobileWaveCanvasRef} aria-hidden="true" />
    </div>
  );
}
