function PitchMarkings() {
  return (
    <g fill="none" stroke="oklch(0.96 0.01 260)" strokeOpacity={0.55} strokeWidth={0.35}>
      <rect x={1} y={1} width={66} height={103} />
      <line x1={1} y1={52.5} x2={67} y2={52.5} />
      <circle cx={34} cy={52.5} r={9.15} />
      <circle cx={34} cy={52.5} r={0.5} fill="oklch(0.96 0.01 260)" fillOpacity={0.55} />
      <rect x={13.84} y={1} width={40.32} height={16.5} />
      <rect x={24.84} y={1} width={18.32} height={5.5} />
      <circle cx={34} cy={12} r={0.45} fill="oklch(0.96 0.01 260)" fillOpacity={0.55} />
      <path d="M26.69 17.5 A9.15 9.15 0 0 0 41.31 17.5" />
      <rect x={13.84} y={87.5} width={40.32} height={16.5} />
      <rect x={24.84} y={98.5} width={18.32} height={5.5} />
      <circle cx={34} cy={93} r={0.45} fill="oklch(0.96 0.01 260)" fillOpacity={0.55} />
      <path d="M26.69 87.5 A9.15 9.15 0 0 1 41.31 87.5" />
      <path d="M1 2.2 A1.2 1.2 0 0 0 2.2 1" />
      <path d="M65.8 1 A1.2 1.2 0 0 0 67 2.2" />
      <path d="M1 102.8 A1.2 1.2 0 0 1 2.2 104" />
      <path d="M65.8 104 A1.2 1.2 0 0 1 67 102.8" />
      <rect x={30.34} y={-0.6} width={7.32} height={1.6} strokeOpacity={0.8} />
      <rect x={30.34} y={104} width={7.32} height={1.6} strokeOpacity={0.8} />
    </g>
  );
}

export function Pitch({ landscape = false }: { landscape?: boolean }) {
  if (landscape) {
    return (
      <svg viewBox="0 0 105 68" preserveAspectRatio="none" className="block h-full w-full overflow-hidden rounded-md">
        <defs>
          <linearGradient id="pitch-gradient-landscape" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0} stopColor="oklch(0.36 0.1 150)" />
            <stop offset={1} stopColor="oklch(0.26 0.08 150)" />
          </linearGradient>
        </defs>
        <rect width={105} height={68} fill="url(#pitch-gradient-landscape)" />
        <g fill="oklch(0.96 0.01 260)" opacity={0.035}>
          <rect x={0} y={0} width={10.5} height={68} />
          <rect x={21} y={0} width={10.5} height={68} />
          <rect x={42} y={0} width={10.5} height={68} />
          <rect x={63} y={0} width={10.5} height={68} />
          <rect x={84} y={0} width={10.5} height={68} />
        </g>
        <g transform="translate(0 68) rotate(-90)">
          <PitchMarkings />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 68 105" preserveAspectRatio="none" className="block h-full w-full overflow-hidden rounded-md">
      <defs>
        <linearGradient id="pitch-gradient-portrait" x1="0" y1="0" x2="0" y2="1">
          <stop offset={0} stopColor="oklch(0.36 0.1 150)" />
          <stop offset={1} stopColor="oklch(0.26 0.08 150)" />
        </linearGradient>
      </defs>
      <rect width={68} height={105} fill="url(#pitch-gradient-portrait)" />
      <g fill="oklch(0.96 0.01 260)" opacity={0.035}>
        <rect x={0} y={0} width={68} height={10.5} />
        <rect x={0} y={21} width={68} height={10.5} />
        <rect x={0} y={42} width={68} height={10.5} />
        <rect x={0} y={63} width={68} height={10.5} />
        <rect x={0} y={84} width={68} height={10.5} />
      </g>
      <PitchMarkings />
    </svg>
  );
}
