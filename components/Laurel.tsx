// Decorative laurel wreath: two mirrored branches with leaves growing along
// each stem, sweeping toward an opening at the top. Purely ornamental.

const CX = 100;
const CY = 104;
const R = 66;
const FROM = 24; // degrees from top (right branch start, near the opening)
const TO = 156; // right branch end (near the bottom)
const LEAF_COUNT = 9;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

function pointAt(theta: number) {
  return { x: CX + R * Math.sin(rad(theta)), y: CY - R * Math.cos(rad(theta)) };
}

// One (right) branch; the left branch is this mirrored via SVG transform.
const leaves = Array.from({ length: LEAF_COUNT }, (_, i) => {
  const t = i / (LEAF_COUNT - 1);
  const theta = FROM + (TO - FROM) * t;
  const { x, y } = pointAt(theta);
  // Tip points "up the branch" (toward the top opening).
  const tangentUp = deg(Math.atan2(-Math.cos(rad(theta)), Math.sin(rad(theta))));
  const tilt = i % 2 === 0 ? 20 : -14; // fan leaves to both sides of the stem
  const scale = 0.72 + 0.4 * Math.sin(Math.PI * t); // fuller in the middle
  return { x, y, rot: tangentUp + tilt, scale };
});

const start = pointAt(FROM);
const end = pointAt(TO);
const stem = `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${R} ${R} 0 0 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;

// Almond leaf, base at origin, tip up.
const LEAF = "M0 0 C3 -3 3.4 -9 0 -14 C-3.4 -9 -3 -3 0 0 Z";

function Branch() {
  return (
    <g>
      <path d={stem} fill="none" stroke="currentColor" strokeWidth={0.9} strokeLinecap="round" />
      {leaves.map((l, i) => (
        <path
          key={i}
          d={LEAF}
          transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)}) scale(${l.scale.toFixed(2)})`}
        />
      ))}
    </g>
  );
}

export default function Laurel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="currentColor" aria-hidden>
      <Branch />
      <g transform={`translate(${2 * CX} 0) scale(-1 1)`}>
        <Branch />
      </g>
    </svg>
  );
}
