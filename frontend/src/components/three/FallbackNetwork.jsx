/**
 * Fallback 2D SVG & CSS Network
 * Displayed when WebGL is unavailable, on low-end mobile devices, or when reduced motion is preferred.
 */
export default function FallbackNetwork({ className }) {
  return (
    <div className={`relative w-full h-[380px] sm:h-[460px] flex items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-teal-950/20 via-surface-dark/40 to-cyan-950/20 border border-teal-500/20 ${className || ''}`}>
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* SVG Connected Nodes Graphic */}
      <svg className="w-full h-full max-w-[500px] p-6 drop-shadow-[0_0_20px_rgba(45,212,191,0.3)]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow Filters */}
        <defs>
          <filter id="fallback-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbit Ring */}
        <circle cx="250" cy="250" r="160" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.35" />
        <circle cx="250" cy="250" r="100" stroke="#14B8A6" strokeWidth="1" opacity="0.25" />

        {/* Dynamic Connection Strands */}
        <line x1="250" y1="250" x2="250" y2="90" stroke="#2DD4BF" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />
        <line x1="250" y1="250" x2="390" y2="170" stroke="#06B6D4" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />
        <line x1="250" y1="250" x2="370" y2="350" stroke="#10B981" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />
        <line x1="250" y1="250" x2="250" y2="410" stroke="#F59E0B" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />
        <line x1="250" y1="250" x2="130" y2="350" stroke="#F43F5E" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />
        <line x1="250" y1="250" x2="110" y2="170" stroke="#38BDF8" strokeWidth="2" opacity="0.6" strokeDasharray="4 4" />

        {/* Orbit interconnects */}
        <polygon points="250,90 390,170 370,350 250,410 130,350 110,170" stroke="#2DD4BF" strokeWidth="1" opacity="0.2" fill="none" />

        {/* Center Community Node */}
        <circle cx="250" cy="250" r="32" fill="#0D2622" stroke="#2DD4BF" strokeWidth="3" filter="url(#fallback-glow)" />
        <circle cx="250" cy="250" r="14" fill="#2DD4BF" opacity="0.9" />
        <text x="250" y="254" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">HUB</text>

        {/* Surrounding Nodes */}
        {/* 1. People / Requesters (Top) */}
        <g transform="translate(250, 90)">
          <circle r="18" fill="#0A1F1C" stroke="#38BDF8" strokeWidth="2" filter="url(#fallback-glow)" />
          <text y="4" textAnchor="middle" fill="#E0F2FE" fontSize="9" fontWeight="bold" fontFamily="sans-serif">PEOPLE</text>
        </g>

        {/* 2. NGOs (Top Right) */}
        <g transform="translate(390, 170)">
          <circle r="18" fill="#0A1F1C" stroke="#06B6D4" strokeWidth="2" filter="url(#fallback-glow)" />
          <text y="4" textAnchor="middle" fill="#CFFAFE" fontSize="9" fontWeight="bold" fontFamily="sans-serif">NGOS</text>
        </g>

        {/* 3. Volunteers (Bottom Right) */}
        <g transform="translate(370, 350)">
          <circle r="18" fill="#0A1F1C" stroke="#10B981" strokeWidth="2" filter="url(#fallback-glow)" />
          <text y="4" textAnchor="middle" fill="#D1FAE5" fontSize="8" fontWeight="bold" fontFamily="sans-serif">VOLUNTEER</text>
        </g>

        {/* 4. Donations (Bottom) */}
        <g transform="translate(250, 410)">
          <circle r="18" fill="#0A1F1C" stroke="#F59E0B" strokeWidth="2" filter="url(#fallback-glow)" />
          <text y="4" textAnchor="middle" fill="#FEF3C7" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DONATION</text>
        </g>

        {/* 5. Hospitals (Bottom Left) */}
        <g transform="translate(130, 350)">
          <circle r="18" fill="#0A1F1C" stroke="#F43F5E" strokeWidth="2" filter="url(#fallback-glow)" />
          <text y="4" textAnchor="middle" fill="#FFE4E6" fontSize="8" fontWeight="bold" fontFamily="sans-serif">HOSPITAL</text>
        </g>

        {/* 6. Requests (Top Left) */}
        <g transform="translate(110, 170)">
          <circle r="18" fill="#0A1F1C" stroke="#2DD4BF" strokeWidth="2" filter="url(#fallback-glow)" />
          <text y="4" textAnchor="middle" fill="#CCFBF1" fontSize="9" fontWeight="bold" fontFamily="sans-serif">HELP</text>
        </g>
      </svg>
    </div>
  );
}
