type Beam = {
  left: string;
  width: number;
  blur: number;
  delay: string;
  topOpacity: number;
  midOpacity: number;
};

const BEAMS: Beam[] = [
  { left: "6%", width: 140, blur: 30, delay: "0s", topOpacity: 0.24, midOpacity: 0.16 },
  { left: "34%", width: 200, blur: 38, delay: "1.3s", topOpacity: 0.14, midOpacity: 0.1 },
];

export function LightBeams({ count = 2 }: { count?: 1 | 2 }) {
  return (
    <>
      {BEAMS.slice(0, count).map((beam, index) => (
        <div
          key={index}
          className="animate-beam-breathe pointer-events-none absolute -top-[40%] h-[180%] rotate-[16deg]"
          style={{
            left: beam.left,
            width: beam.width,
            filter: `blur(${beam.blur}px)`,
            animationDelay: beam.delay,
            background: `linear-gradient(180deg, oklch(0.78 0.15 75 / ${beam.topOpacity}) 0%, oklch(0.87 0.22 125 / ${beam.midOpacity}) 45%, transparent 76%)`,
          }}
        />
      ))}
    </>
  );
}
