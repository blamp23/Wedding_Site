// Decorative laurel wreath (two mirrored branches with a gap at top and bottom).
// Purely ornamental — rendered behind the couple's names on the hero.

type Leaf = { x: number; y: number; rot: number };

const CX = 100;
const CY = 100;
const R = 70;

function branch(from: number, to: number, count: number): Leaf[] {
  const leaves: Leaf[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const deg = from + (to - from) * t;
    const a = (deg * Math.PI) / 180;
    leaves.push({
      x: CX + R * Math.sin(a),
      y: CY - R * Math.cos(a),
      rot: deg,
    });
  }
  return leaves;
}

// Right side (top gap at 25°, bottom gap at 155°) and mirrored left side.
const right = branch(25, 155, 8);
const left = branch(-25, -155, 8);
const leaves = [...right, ...left];

function arcPath(from: number, to: number) {
  const a1 = (from * Math.PI) / 180;
  const a2 = (to * Math.PI) / 180;
  const x1 = CX + R * Math.sin(a1);
  const y1 = CY - R * Math.cos(a1);
  const x2 = CX + R * Math.sin(a2);
  const y2 = CY - R * Math.cos(a2);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export default function Laurel({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      aria-hidden
    >
      <path d={arcPath(25, 155)} fill="none" strokeWidth={0.6} />
      <path d={arcPath(-25, -155)} fill="none" strokeWidth={0.6} />
      {leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx={3.1}
          ry={8.5}
          stroke="none"
          transform={`rotate(${l.rot} ${l.x} ${l.y})`}
        />
      ))}
    </svg>
  );
}
