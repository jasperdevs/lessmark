// Pixel-style SVGs hand-drawn on a 16x16 grid (rendered crisp at any size).
// Stroke + fill done with 1-unit pixels — no anti-aliased curves.

type Props = { className?: string; size?: number };

function Frame({ children, size = 96, className }: Props & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// solid 1x1 squares — the fundamental "pixel"
function P({ x, y, fill = "currentColor" }: { x: number; y: number; fill?: string }) {
  return <rect x={x} y={y} width="1" height="1" fill={fill} />;
}

// horizontal/vertical strips — convenience
function HStrip({ x, y, w, fill = "currentColor" }: { x: number; y: number; w: number; fill?: string }) {
  return <rect x={x} y={y} width={w} height="1" fill={fill} />;
}
function VStrip({ x, y, h, fill = "currentColor" }: { x: number; y: number; h: number; fill?: string }) {
  return <rect x={x} y={y} width="1" height={h} fill={fill} />;
}

/** A document with typed tags inside — represents schema-first blocks */
export function PixelSchema(props: Props) {
  return (
    <Frame {...props}>
      {/* page outline — 10 wide x 13 tall, top-left corner clipped */}
      <HStrip x={3} y={1} w={8} />
      <HStrip x={11} y={2} w={1} />
      <VStrip x={12} y={2} h={11} />
      <HStrip x={3} y={13} w={10} />
      <VStrip x={3} y={2} h={11} />
      {/* dog-ear corner */}
      <P x={11} y={1} />
      <P x={12} y={2} />
      {/* @-tag glyph */}
      <HStrip x={5} y={4} w={3} />
      <P x={5} y={5} />
      <P x={7} y={5} />
      <P x={5} y={6} />
      <HStrip x={5} y={7} w={3} />
      {/* attr line */}
      <HStrip x={9} y={5} w={2} />
      <HStrip x={9} y={6} w={2} />
      {/* body lines */}
      <HStrip x={5} y={9} w={6} />
      <HStrip x={5} y={11} w={4} />
    </Frame>
  );
}

/** A tree — represents the stable JSON AST */
export function PixelTree(props: Props) {
  return (
    <Frame {...props}>
      {/* root node */}
      <HStrip x={7} y={2} w={2} />
      <HStrip x={7} y={3} w={2} />
      {/* trunk */}
      <VStrip x={8} y={4} h={2} />
      {/* horizontal bar connecting branches */}
      <HStrip x={3} y={6} w={11} />
      {/* branches dropping to children */}
      <VStrip x={3} y={7} h={2} />
      <VStrip x={8} y={7} h={2} />
      <VStrip x={13} y={7} h={2} />
      {/* child nodes */}
      <HStrip x={2} y={9} w={3} />
      <HStrip x={2} y={10} w={3} />
      <HStrip x={7} y={9} w={3} />
      <HStrip x={7} y={10} w={3} />
      <HStrip x={12} y={9} w={3} />
      <HStrip x={12} y={10} w={3} />
      {/* small grandchildren ticks */}
      <P x={3} y={12} />
      <P x={8} y={12} />
      <P x={13} y={12} />
      <P x={3} y={13} />
      <P x={8} y={13} />
      <P x={13} y={13} />
    </Frame>
  );
}

/** A shield with a slash through unsafe input — represents no raw HTML/JSX */
export function PixelShield(props: Props) {
  return (
    <Frame {...props}>
      {/* shield outline */}
      <HStrip x={5} y={1} w={6} />
      <P x={4} y={2} />
      <P x={11} y={2} />
      <VStrip x={3} y={3} h={4} />
      <VStrip x={12} y={3} h={4} />
      <P x={3} y={7} />
      <P x={12} y={7} />
      <P x={4} y={8} />
      <P x={11} y={8} />
      <P x={4} y={9} />
      <P x={11} y={9} />
      <P x={5} y={10} />
      <P x={10} y={10} />
      <P x={6} y={11} />
      <P x={9} y={11} />
      <P x={7} y={12} />
      <P x={8} y={12} />
      {/* inner X mark */}
      <P x={6} y={4} />
      <P x={9} y={4} />
      <P x={7} y={5} />
      <P x={8} y={5} />
      <P x={7} y={6} />
      <P x={8} y={6} />
      <P x={6} y={7} />
      <P x={9} y={7} />
    </Frame>
  );
}
