import { useMemo } from 'react';
import { cn } from '../utils/cn';

const SIZE_MAP = {
  sm: 48,
  md: 64,
  lg: 80,
  xl: 96,
};

function RobotIcon({ size }) {
  const s = size * 0.55;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}
    >
      {/* Antenna left */}
      <line x1="22" y1="8" x2="22" y2="16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="6" r="3" fill="#fff" />

      {/* Antenna right */}
      <line x1="42" y1="8" x2="42" y2="16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="6" r="3" fill="#fff" />

      {/* Head */}
      <rect x="12" y="14" width="40" height="30" rx="10" fill="#fff" />

      {/* Left ear */}
      <rect x="6" y="22" width="6" height="14" rx="3" fill="#fff" />

      {/* Right ear */}
      <rect x="52" y="22" width="6" height="14" rx="3" fill="#fff" />

      {/* Left eye */}
      <circle cx="24" cy="30" r="3.5" fill="#0F766E" />

      {/* Right eye */}
      <circle cx="40" cy="30" r="3.5" fill="#0F766E" />

      {/* Smile */}
      <path
        d="M26 37 Q32 42 38 37"
        stroke="#0F766E"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function AIChatOrb({ size = 'md', onClick, pulsing = false, className }) {
  const px = SIZE_MAP[size] || SIZE_MAP.md;

  const orbStyle = useMemo(
    () => ({
      width: px,
      height: px,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 25%, #5EEAD4 0%, #14B8A6 25%, #0F766E 60%, #0A3A37 100%)',
      boxShadow: [
        'inset 0 8px 20px rgba(255,255,255,0.5)',
        'inset 0 -8px 20px rgba(0,0,0,0.3)',
        'inset 4px 0 15px rgba(255,255,255,0.3)',
        '0 10px 30px rgba(20,184,166,0.4)',
        '0 0 0 1px rgba(255,255,255,0.2) inset',
      ].join(', '),
      position: 'relative',
      overflow: 'hidden',
    }),
    [px]
  );

  const highlightStyle = useMemo(
    () => ({
      position: 'absolute',
      top: '8%',
      left: '15%',
      width: '70%',
      height: '45%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 60%, transparent 100%)',
      borderRadius: '50% / 100% 100% 0 0',
      filter: 'blur(0.5px)',
      transform: 'rotate(-15deg)',
      pointerEvents: 'none',
    }),
    []
  );

  const innerShadowStyle = useMemo(
    () => ({
      position: 'absolute',
      bottom: '10%',
      left: '20%',
      width: '60%',
      height: '30%',
      background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      pointerEvents: 'none',
    }),
    []
  );

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } : undefined}
      style={{
        animation: 'ai-orb-float 3.2s ease-in-out infinite',
        transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.boxShadow = '0 0 40px rgba(20,184,166,0.6), 0 10px 30px rgba(20,184,166,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.96)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
      }}
    >
      {/* Pulsing rings */}
      {pulsing && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: '2px solid #14B8A6',
              opacity: 0.4,
              animation: 'ai-orb-ping 2s cubic-bezier(0,0,0.2,1) infinite',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: -16,
              borderRadius: '50%',
              border: '1px solid #2DD4BF',
              opacity: 0.2,
              animation: 'ai-orb-ping 2s 0.5s cubic-bezier(0,0,0.2,1) infinite',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      {/* Orb */}
      <div style={orbStyle}>
        <div style={highlightStyle} />
        <div style={innerShadowStyle} />

        {/* Robot icon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RobotIcon size={px} />
        </div>
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes ai-orb-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes ai-orb-ping {
          0% { transform: scale(1); opacity: 0.4; }
          75%, 100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
