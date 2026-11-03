// Namma School ERP logo — a graduation cap in Kannada flag colors (Kesari + Haldi).
// Pure SVG so it stays crisp at any size and needs no image file.

export function Logo({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Namma School ERP logo"
    >
      <defs>
        <linearGradient
          id="capGrad"
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E63329" />
          <stop offset="1" stopColor="#FFB300" />
        </linearGradient>
      </defs>
      {/* rounded badge background */}
      <rect width="48" height="48" rx="12" fill="url(#capGrad)" />
      {/* graduation cap (mortarboard) */}
      <path d="M24 13L8 20L24 27L40 20L24 13Z" fill="white" />
      <path
        d="M14 23.5V30C14 30 18 33 24 33C30 33 34 30 34 30V23.5L24 28L14 23.5Z"
        fill="white"
        fillOpacity="0.85"
      />
      {/* tassel */}
      <path
        d="M40 20V28"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="40" cy="29.5" r="1.8" fill="white" />
    </svg>
  );
}

// Wordmark: logo + "Namma School ERP" text, used in headers.
export function Wordmark({
  size = 36,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={size} />
      <div className="leading-tight">
        <div
          className={`font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}
        >
          Namma<span className="text-kesari">School</span>
        </div>
        <div
          className={`text-[10px] font-semibold uppercase tracking-wider ${light ? "text-white/70" : "text-slate-400"}`}
        >
          ERP
        </div>
      </div>
    </div>
  );
}
