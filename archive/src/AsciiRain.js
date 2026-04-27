import React, { useEffect, useRef } from 'react';
import './AsciiRain.css';

const AsciiRain = ({
  opacity = 0.3,
  speed = 1,
  density = 0.8,
  performanceMode = false
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, columns, streams, fontSize;

    const chars = [
      'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ',
      'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と',
      'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ',
      'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り',
      'る', 'れ', 'ろ', 'わ', 'を', 'ん',
      'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
      'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
      'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
      'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
      'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '<', '>', '[', ']', '{', '}', '(', ')', '+', '-', '=', '*', '/', '\\', '|', '_', '~', '`'
    ];
    
    const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];
    
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      fontSize = window.innerWidth < 768 ? 18 : 18;
      columns = Math.floor(width / fontSize);
      const rows = Math.floor(height / fontSize);
      const isMobileDeviceLocal = window.innerWidth <= 768;
      const numStreams = Math.floor(columns * density * (isMobileDeviceLocal ? 0.65 : 1));
      streams = [];
      
      for (let i = 0; i < numStreams; i++) {
        const columnIndex = Math.floor(Math.random() * columns);
        const streamLength = 12 + Math.floor(Math.random() * 8);
        const streamChars = [];
        
        for (let j = 0; j < streamLength; j++) {
          streamChars.push(getRandomChar());
        }
        const isMobileDevice = window.innerWidth <= 768;
        let startY;
        if (isMobileDevice && Math.random() < 0.6) {
          startY = -streamLength + Math.random() * rows * 0.5;
        } else {
          startY = -streamLength - Math.random() * rows;
        }
        
        streams.push({
          x: columnIndex,
          y: startY,
          chars: streamChars,
          speed: 0.5 + Math.random() * 1.0 * speed,
          opacity: 0.4 + Math.random() * 0.4,
          lastCharChange: 0,
          trailDelay: 1 + Math.floor(Math.random() * 3)
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.font = `${fontSize}px system-ui, 'Noto Sans CJK JP', 'Yu Gothic', 'Meiryo', 'Hiragino Sans', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const isMobileDeviceLocal = window.innerWidth <= 768;

      streams.forEach(stream => {
        const streamX = stream.x * fontSize;
        
        stream.chars.forEach((char, index) => {
          const charY = (stream.y + index) * fontSize;
          
          if (charY < -fontSize || charY > height + fontSize) return;
          
          const positionInStream = index / (stream.chars.length - 1);
          const fadeMultiplier = Math.pow(1 - positionInStream, 1.5);
          const finalOpacity = stream.opacity * opacity * fadeMultiplier;
          if (isMobileDeviceLocal) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(0, 0, 0, ${finalOpacity})`;
          } else {
            if (index === 0) {
              ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
              ctx.shadowBlur = 3;
              ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, finalOpacity * 1.4)})`;
            } else if (index < 3) {
              ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
              ctx.shadowBlur = 1;
              ctx.fillStyle = `rgba(0, 0, 0, ${finalOpacity})`;
            } else {
              ctx.shadowBlur = 0;
              ctx.fillStyle = `rgba(0, 0, 0, ${finalOpacity})`;
            }
          }
          
          ctx.fillText(char, streamX, charY);

          if (!isMobileDeviceLocal) {
            const trailY = charY - stream.trailDelay * fontSize;
            if (trailY >= -fontSize && trailY <= height + fontSize) {
              ctx.shadowBlur = 0;
              ctx.fillStyle = `rgba(0, 0, 0, ${finalOpacity * 0.35})`;
              ctx.fillText(char, streamX, trailY);
            }
          }
        });
        
        ctx.shadowBlur = 0;
        
        stream.y += stream.speed;
        stream.lastCharChange++;
        const changeFreq = window.innerWidth <= 768 ? 90 + Math.random() * 120 : 30 + Math.random() * 60;
        if (stream.lastCharChange > changeFreq) {
          const randomIndex = Math.floor(Math.random() * stream.chars.length);
          stream.chars[randomIndex] = getRandomChar();
          stream.lastCharChange = 0;
        }
        
        const rows = Math.floor(height / fontSize);
        if (stream.y > rows + stream.chars.length) {
          const isMobileDevice = window.innerWidth <= 768;
          if (isMobileDevice && Math.random() < 0.4) {
            stream.y = -stream.chars.length + Math.random() * rows * 0.3;
          } else {
            stream.y = -stream.chars.length - Math.random() * rows * 0.5;
          }
          stream.x = Math.floor(Math.random() * columns);
          stream.speed = 0.5 + Math.random() * 1.0 * speed;
          stream.opacity = 0.4 + Math.random() * 0.4;
          
          for (let i = 0; i < stream.chars.length; i++) {
            if (Math.random() < 0.4) {
              stream.chars[i] = getRandomChar();
            }
          }
        }
      });
    };

    const isMobileDevice = window.innerWidth <= 768;
    const targetFPS = isMobileDevice ? 14.0 : (performanceMode ? 12.0 : 24.99);
    const frameDuration = 1000 / targetFPS;
    let lastFrameTime = 0;

    const animate = (currentTime) => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (currentTime - lastFrameTime < frameDuration) return;
      lastFrameTime = currentTime;
      
      draw();
    };

    resize();
    animate(performance.now());
    const handleResize = () => {
      resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [opacity, speed, density, performanceMode]);

  return (
    <canvas
      ref={canvasRef}
      className="ascii-rain-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -5,
        background: 'transparent'
      }}
    />
  );
};

export default React.memo(AsciiRain);
