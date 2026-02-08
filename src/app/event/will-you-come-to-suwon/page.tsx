'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

function createHeart() {
  // 원근 레이어: 0=먼 배경, 1=중간, 2=가까운 전경
  const layer = Math.floor(Math.random() * 3);
  const sizeByLayer = [
    14 + Math.random() * 14,
    24 + Math.random() * 22,
    42 + Math.random() * 32,
  ];
  const opacityByLayer = [
    0.1 + Math.random() * 0.1,
    0.2 + Math.random() * 0.15,
    0.3 + Math.random() * 0.2,
  ];
  const blurByLayer = [2 + Math.random() * 1.5, 0.5 + Math.random() * 0.5, 0];
  const speedByLayer = [
    10 + Math.random() * 8,
    7 + Math.random() * 6,
    5 + Math.random() * 5,
  ];

  return {
    id: Math.random(),
    x: Math.random() * 100,
    size: sizeByLayer[layer],
    opacity: opacityByLayer[layer],
    duration: speedByLayer[layer],
    delay: Math.random() * 12,
    blur: blurByLayer[layer],
    sway: -30 + Math.random() * 60,
    spin: Math.random() > 0.2,
    spinDuration: 2 + Math.random() * 4,
    spinDirection: Math.random() > 0.5 ? 1 : -1,
  };
}

const initialHearts = Array.from({ length: 50 }, (_, i) => {
  const heart = createHeart();
  // 처음 20개는 딜레이 없이 즉시 + 빠른 속도
  if (i < 20) {
    heart.delay = 0;
    heart.duration = 3 + Math.random() * 3;
  }
  return heart;
});

export default function WillYouComeToSuwonPage() {
  const [answered, setAnswered] = useState(false);
  const [noExploded, setNoExploded] = useState(false);
  const [growing, setGrowing] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const noPositionRef = useRef({ x: 0, y: 0 });
  const isEscapingRef = useRef(false);

  const fireConfetti = useCallback(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 270,
        spread: 180,
        origin: { x: Math.random(), y: -0.1 },
        startVelocity: 25,
        gravity: 0.8,
        ticks: 300,
      });

      confetti({
        particleCount: 5,
        angle: 90,
        spread: 150,
        origin: { x: Math.random(), y: 1.1 },
        startVelocity: 55,
        gravity: 0.9,
        ticks: 300,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleYes = () => {
    setAnswered(true);
    fireConfetti();
  };

  const escapeToFarthestPoint = (
    cursorX: number,
    cursorY: number,
    btnWidth: number,
    btnHeight: number,
  ) => {
    const padding = 20;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    let best = { x: 0, y: 0, dist: 0 };
    for (let i = 0; i < 15; i++) {
      const cx = padding + Math.random() * maxX;
      const cy = padding + Math.random() * maxY;
      const dist = Math.hypot(cx - cursorX, cy - cursorY);
      if (dist > best.dist) {
        best = { x: cx, y: cy, dist };
      }
    }
    return { x: best.x, y: best.y };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (noExploded || answered || isEscapingRef.current) return;
      const button = noButtonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = btnCenterX - e.clientX;
      const dy = btnCenterY - e.clientY;
      const distance = Math.hypot(dx, dy);

      if (distance < 150) {
        isEscapingRef.current = true;
        if (!growing) setGrowing(true);

        const padding = 20;
        const maxX = window.innerWidth - rect.width - padding;
        const maxY = window.innerHeight - rect.height - padding;

        const escapeStrength = 200;
        const norm = Math.hypot(dx, dy) || 1;
        let newX = rect.left + (dx / norm) * escapeStrength;
        let newY = rect.top + (dy / norm) * escapeStrength;

        newX = Math.max(padding, Math.min(newX, maxX));
        newY = Math.max(padding, Math.min(newY, maxY));

        const movedDist = Math.hypot(newX - rect.left, newY - rect.top);
        if (movedDist < 30) {
          const far = escapeToFarthestPoint(
            e.clientX,
            e.clientY,
            rect.width,
            rect.height,
          );
          newX = far.x;
          newY = far.y;
        }

        noPositionRef.current = { x: newX, y: newY };

        button.style.position = 'fixed';
        button.style.left = `${newX}px`;
        button.style.top = `${newY}px`;
        button.style.zIndex = '50';
        button.style.transition = 'left 0.25s ease-out, top 0.25s ease-out';

        setTimeout(() => {
          isEscapingRef.current = false;
        }, 100);
      }
    },
    [noExploded, answered, growing],
  );

  const [explodePosition, setExplodePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const explodeNoButton = () => {
    const button = noButtonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      setExplodePosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setNoExploded(true);
    if (!growing) setGrowing(true);
  };

  const handleNoClick = () => {
    explodeNoButton();
  };

  const handleNoTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    explodeNoButton();
  };

  const renderExplosionParticles = () => {
    if (!noExploded || !explodePosition) return null;
    const particles = Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * 360;
      const dist = 60 + Math.random() * 80;
      const tx = Math.cos((angle * Math.PI) / 180) * dist;
      const ty = Math.sin((angle * Math.PI) / 180) * dist;
      const size = 5 + Math.random() * 10;
      const colors = [
        'bg-pink-300',
        'bg-pink-400',
        'bg-rose-300',
        'bg-rose-400',
        'bg-pink-200',
      ];
      const color = colors[i % colors.length];
      const delay = Math.random() * 0.1;

      return (
        <span
          key={i}
          className={`absolute rounded-full ${color}`}
          style={
            {
              width: size,
              height: size,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animation: `explode-particle 0.7s ${delay}s ease-out forwards`,
            } as React.CSSProperties
          }
        />
      );
    });
    return (
      <div
        className="pointer-events-none fixed"
        style={{
          left: explodePosition.x,
          top: explodePosition.y,
          zIndex: 100,
        }}
      >
        {particles}
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        @keyframes flip-y {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        @keyframes float-up {
          0% {
            transform: translateY(110vh) translateX(0) scale(0.5);
            opacity: 0;
          }
          5% {
            opacity: var(--heart-opacity);
          }
          95% {
            opacity: var(--heart-opacity);
          }
          100% {
            transform: translateY(-110vh) translateX(var(--sway)) scale(1);
            opacity: 0;
          }
        }
        @keyframes grow-button {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(8);
          }
        }
        @keyframes shrink-button {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.5);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            rotate: 0deg;
          }
          25% {
            rotate: -4deg;
          }
          75% {
            rotate: 4deg;
          }
        }
        @keyframes explode-particle {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }
      `}</style>

      {renderExplosionParticles()}

      <div
        className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 sm:gap-12 sm:px-6"
        style={{
          background: 'linear-gradient(to bottom, #fff1f2, #ffe4e6, #fecdd3)',
        }}
        onMouseMove={handleMouseMove}
      >
        {/* 하트 배경 */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ perspective: '800px' }}
        >
          {initialHearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute"
              style={
                {
                  left: `${heart.x}%`,
                  bottom: '-5%',
                  width: heart.size,
                  height: heart.size,
                  opacity: 0,
                  filter: heart.blur > 0 ? `blur(${heart.blur}px)` : undefined,
                  '--heart-opacity': heart.opacity,
                  '--sway': `${heart.sway}px`,
                  animation: `float-up ${heart.duration}s ${heart.delay}s ease-in-out infinite`,
                } as React.CSSProperties
              }
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: '100%',
                  height: '100%',
                  fill: `rgba(244, 114, 182, ${heart.opacity + 0.2})`,
                  animation: heart.spin
                    ? `flip-y ${heart.spinDuration}s linear infinite`
                    : undefined,
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          ))}
        </div>
        {!answered ? (
          <>
            <Image
              src="/event/will-you-come-to-suwon/cat_love.gif"
              alt="cat love"
              width={150}
              height={150}
              priority
              unoptimized
              className="h-auto w-52 sm:w-72"
            />

            <h1 className="text-center text-3xl font-extrabold leading-snug text-pink-900 sm:text-6xl">
              이번주에 수원에서 놀까?!
            </h1>

            <div className="flex items-center gap-6 sm:gap-8">
              <button
                onClick={handleYes}
                className="rounded-xl bg-pink-400 px-10 py-4 text-xl font-bold text-white hover:bg-pink-500 sm:px-14 sm:py-5 sm:text-2xl"
                style={
                  growing
                    ? {
                        zIndex: 60,
                        position: 'relative',
                        animation:
                          'grow-button 25s ease-in forwards, wiggle 0.25s ease-in-out 5s infinite',
                      }
                    : undefined
                }
              >
                좋아!
              </button>

              {!noExploded && (
                <button
                  ref={noButtonRef}
                  onClick={handleNoClick}
                  onTouchStart={handleNoTouch}
                  className="rounded-xl border border-pink-300 bg-white px-10 py-4 text-xl font-bold text-pink-500 sm:px-14 sm:py-5 sm:text-2xl"
                  style={
                    growing
                      ? {
                          animation: 'shrink-button 25s ease-in forwards',
                        }
                      : undefined
                  }
                >
                  싫어!
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <h2 className="text-center text-3xl font-extrabold text-pink-900 sm:text-5xl">
              히히 나도 좋아!
            </h2>
            <Image
              src="/event/will-you-come-to-suwon/happy_chu.gif"
              alt="happy chu"
              width={200}
              height={200}
              unoptimized
              className="h-auto w-52 sm:w-72"
            />
          </div>
        )}
      </div>
    </>
  );
}
