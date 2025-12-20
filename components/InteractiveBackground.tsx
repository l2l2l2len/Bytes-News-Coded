
import React from 'react';

const InteractiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#fff1f2] h-[100dvh]">
      
      {/* 1. Soft Light Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff1f2] via-[#ffe4e6] to-[#fce7f3] opacity-80"></div>

      {/* 2. 3D Perspective Grid (The Floor) - Soft Pink Lines */}
      <div className="absolute inset-0 perspective-container opacity-60">
        <div className="grid-plane"></div>
      </div>

      {/* 3. Floating 3D Glass Tiles - Crystal Clear */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-container-tiles">
         
         {/* Large Center-Left Tile */}
         <div className="tile-3d tile-1">
            <div className="tile-face"></div>
         </div>
         
         {/* Small Top-Right Tile */}
         <div className="tile-3d tile-2">
            <div className="tile-face"></div>
         </div>
         
         {/* Bottom-Center Tile */}
         <div className="tile-3d tile-3">
             <div className="tile-face"></div>
         </div>

         {/* Floating Particle Tile */}
         <div className="tile-3d tile-4">
             <div className="tile-face"></div>
         </div>
      </div>

      {/* 4. Glowing Aura Orbs (Pastel / Peach / Rose) */}
      <div className="absolute top-[10%] left-[20%] w-[60vw] h-[60vw] bg-rose-300/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-pink-300/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow delay-1000"></div>
      <div className="absolute top-[40%] right-[30%] w-[40vw] h-[40vw] bg-orange-100/40 rounded-full blur-[90px] mix-blend-overlay animate-pulse-slow delay-500"></div>

      {/* 5. Grain/Noise Overlay - Subtle texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light"></div>

      <style>{`
        .perspective-container {
            perspective: 1000px;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .perspective-container-tiles {
            perspective: 1200px;
        }

        .grid-plane {
            position: absolute;
            width: 300%;
            height: 300%;
            left: -100%;
            top: -100%;
            background-image: 
                linear-gradient(to right, rgba(244, 63, 94, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(244, 63, 94, 0.15) 1px, transparent 1px);
            background-size: 80px 80px;
            transform: rotateX(75deg);
            animation: grid-scroll 4s linear infinite;
            mask-image: linear-gradient(to bottom, transparent 0%, black 40%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 40%);
        }

        .tile-3d {
            position: absolute;
            transform-style: preserve-3d;
        }

        .tile-face {
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(4px);
            box-shadow: 
                0 4px 15px rgba(244, 63, 94, 0.1),
                inset 0 0 20px rgba(255, 255, 255, 0.5);
            transition: all 0.5s ease;
        }

        /* Default Desktop Positions */
        .tile-1 { 
            top: 25%; left: 15%; width: 140px; height: 140px; 
            animation: float-1 12s ease-in-out infinite; 
        }
        .tile-2 { 
            top: 15%; right: 20%; width: 90px; height: 90px; 
            animation: float-2 15s ease-in-out infinite; 
        }
        .tile-3 { 
            bottom: 25%; left: 40%; width: 180px; height: 180px; 
            animation: float-3 18s ease-in-out infinite; 
        }
        .tile-4 { 
            top: 60%; right: 10%; width: 60px; height: 60px; 
            animation: float-4 10s ease-in-out infinite; 
        }

        /* Mobile Optimization: Adjust positions to stay in view */
        @media (max-width: 768px) {
            .tile-1 {
                top: 20%; left: 5%; width: 100px; height: 100px;
            }
            .tile-2 {
                top: 10%; right: 5%; width: 70px; height: 70px;
            }
            .tile-3 {
                bottom: 30%; left: 50%; transform: translateX(-50%); width: 140px; height: 140px;
            }
            .tile-4 {
                top: 55%; right: 5%; width: 50px; height: 50px;
            }
        }

        @keyframes grid-scroll {
            0% { transform: rotateX(75deg) translateY(0); }
            100% { transform: rotateX(75deg) translateY(80px); }
        }

        @keyframes float-1 {
            0%, 100% { transform: translateZ(0) rotateX(15deg) rotateY(15deg); }
            50% { transform: translateZ(40px) rotateX(25deg) rotateY(25deg) translateY(-20px); }
        }
        @keyframes float-2 {
            0%, 100% { transform: translateZ(0) rotateX(-10deg) rotateY(-10deg); }
            50% { transform: translateZ(60px) rotateX(0deg) rotateY(-20deg) translateY(30px); }
        }
        @keyframes float-3 {
            0%, 100% { transform: translateZ(0) rotateX(5deg) rotateY(-5deg); }
            50% { transform: translateZ(20px) rotateX(15deg) rotateY(5deg) translateY(-15px); }
        }
        @keyframes float-4 {
            0%, 100% { transform: translateZ(0) rotateX(20deg) rotateY(10deg); }
            50% { transform: translateZ(50px) rotateX(40deg) rotateY(30deg) translateY(10px); }
        }

        @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }

        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default InteractiveBackground;
