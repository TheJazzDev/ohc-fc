const GRAIN_URL =
  "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22160%22%20height=%22160%22%3E%3Cfilter%20id=%22g%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.85%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22160%22%20height=%22160%22%20filter=%22url(%23g)%22/%3E%3C/svg%3E";

export function Grain({ opacity = 0.45 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-soft-light"
      style={{ backgroundImage: `url('${GRAIN_URL}')`, backgroundSize: "160px 160px", opacity }}
    />
  );
}
