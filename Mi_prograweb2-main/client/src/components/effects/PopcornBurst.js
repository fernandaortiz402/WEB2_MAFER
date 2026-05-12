import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Palomitas / partículas amarillas que salen desde un punto (p. ej. botón).
 * Duración 1.5s, no bloquea la UI (portal + pointer-events: none).
 */
const PopcornBurst = ({ anchorX, anchorY, onComplete }) => {
  const [mounted, setMounted] = useState(true);

  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.8;
        const dist = 60 + Math.random() * 100;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist + 120 + Math.random() * 80;
        const rot = (Math.random() - 0.5) * 720;
        const delay = Math.random() * 0.12;
        const useEmoji = Math.random() > 0.35;
        return { id: i, tx, ty, rot, delay, useEmoji };
      }),
    []
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(false);
      onComplete?.();
    }, 1500);
    return () => clearTimeout(t);
  }, [onComplete]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="popcorn-burst"
      style={{ left: anchorX, top: anchorY }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={`popcorn-burst__particle ${p.useEmoji ? '' : 'popcorn-burst__particle--dot'}`}
          style={{
            animationDelay: `${p.delay}s`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`
          }}
        >
          {p.useEmoji ? '🍿' : null}
        </span>
      ))}
    </div>,
    document.body
  );
};

export default PopcornBurst;
