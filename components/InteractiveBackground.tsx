import React from 'react';

const InteractiveBackground: React.FC = () => {
  // Generate random 3D shapes and Information Symbols
  const elements = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    // Mix of 3D cubes and Text Symbols
    type: i % 2 === 0 ? 'cube' : 'symbol',
    symbol: ['{ }', '01', '⌘', '∑', '⚡', '◉', '//', '⨝'][Math.floor(Math.random() * 8)],
    left: `${Math.floor(Math.random() * 90) + 5}%`,
    top: `${Math.floor(Math.random() * 90) + 5}%`,
    size: Math.floor(Math.random() * 40) + 30, // Size in px
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20,
    color: ['#38bdf8', '#818cf8', '#c084fc', '#2dd4bf'][Math.floor(Math.random() * 4)], // Cyan, Indigo, Purple, Teal
    depth: Math.random() * 200 - 100, // Z-axis variance
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#020617] perspective-[800px] pointer-events-none">
      
      {/* 1. Cinematic Atmosphere */}
      <div className="film-grain"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '12s'}}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '15s'}}></div>

      {/* 2. Floating 3D Elements */}
      {elements.map((el) => {
        // Dynamic CSS variables for size and color
        const style = {
          '--s': `${el.size}px`,
          '--c': el.color,
          left: el.left,
          top: el.top,
          animationDuration: `${el.duration}s`,
          animationDelay: `${el.delay}s`,
        } as React.CSSProperties;

        if (el.type === 'symbol') {
          return (
            <div 
              key={el.id} 
              className="floating-symbol"
              style={style}
            >
              {el.symbol}
            </div>
          );
        }

        return (
          <div key={el.id} className="cube-3d" style={style}>
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        );
      })}

      <style>{`
        /* --- 3D Cube Styles --- */
        .cube-3d {
          position: absolute;
          width: var(--s);
          height: var(--s);
          transform-style: preserve-3d;
          animation: float-rotate infinite linear;
        }

        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid var(--c);
          background: rgba(255, 255, 255, 0.02);
          box-shadow: 0 0 15px var(--c); /* Neon Glow */
          opacity: 0.6;
          backface-visibility: visible;
        }

        /* Construct the Cube */
        .front  { transform: rotateY(0deg) translateZ(calc(var(--s) / 2)); }
        .back   { transform: rotateY(180deg) translateZ(calc(var(--s) / 2)); }
        .right  { transform: rotateY(90deg) translateZ(calc(var(--s) / 2)); }
        .left   { transform: rotateY(-90deg) translateZ(calc(var(--s) / 2)); }
        .top    { transform: rotateX(90deg) translateZ(calc(var(--s) / 2)); }
        .bottom { transform: rotateX(-90deg) translateZ(calc(var(--s) / 2)); }

        /* --- Symbol Styles --- */
        .floating-symbol {
          position: absolute;
          font-family: 'Space Grotesk', monospace;
          font-weight: bold;
          font-size: var(--s);
          color: var(--c);
          text-shadow: 0 0 20px var(--c);
          opacity: 0.8;
          animation: float-bob infinite ease-in-out alternate;
        }

        /* --- Animations --- */
        @keyframes float-rotate {
          0% { transform: translate3d(0, 0, 0) rotate3d(1, 1, 1, 0deg); }
          50% { transform: translate3d(20px, -40px, 50px) rotate3d(1, 1, 1, 180deg); }
          100% { transform: translate3d(0, 0, 0) rotate3d(1, 1, 1, 360deg); }
        }

        @keyframes float-bob {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          100% { transform: translateY(-30px) scale(1.1); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default InteractiveBackground;