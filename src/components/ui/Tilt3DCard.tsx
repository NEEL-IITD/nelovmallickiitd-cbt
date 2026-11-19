import React, { useRef, useState, useCallback, useEffect } from 'react';

interface Tilt3DCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  glare?: boolean;
  scale?: number;
}

export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  maxTilt = 7,
  perspective = 1000,
  glare = true,
  scale = 1.015,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 65%)'
  });
  const [canTilt, setCanTilt] = useState(true);

  useEffect(() => {
    // Check for reduced motion or touch device
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReducedMotion || isTouch) {
      setCanTilt(false);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xRatio = x / rect.width - 0.5; // -0.5 to +0.5
    const yRatio = y / rect.height - 0.5; // -0.5 to +0.5

    const rotX = (-yRatio * (maxTilt * 2)).toFixed(2);
    const rotY = (xRatio * (maxTilt * 2)).toFixed(2);

    const glareX = ((xRatio + 0.5) * 100).toFixed(1);
    const glareY = ((yRatio + 0.5) * 100).toFixed(1);

    setTransformStyle({
      transform: `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 0.08s ease-out'
    });

    if (glare) {
      setGlareStyle({
        opacity: 1,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)`,
        transition: 'opacity 0.2s ease-out'
      });
    }
  }, [canTilt, maxTilt, perspective, scale, glare]);

  const handlePointerLeave = useCallback(() => {
    if (!canTilt) return;

    setTransformStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    });

    if (glare) {
      setGlareStyle(prev => ({
        ...prev,
        opacity: 0,
        transition: 'opacity 0.4s ease-out'
      }));
    }
  }, [canTilt, perspective, glare]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative select-none ${className}`}
      style={{
        ...style,
        ...transformStyle,
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      {...props}
    >
      {/* Specular Glare Overlay */}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 overflow-hidden"
          style={glareStyle}
        />
      )}
      {children}
    </div>
  );
};
