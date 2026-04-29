// Hand-drawn pixel-art SVG icons. Each icon is a 24x24 grid of 1x1 unit rects.
// "#" = filled pixel, "." or " " = empty. No external icon library.

type Props = { className?: string };
type FooterProps = Props & { animated?: boolean };

export function PixelOk({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="checked" shapeRendering="crispEdges">
      <rect x="1" y="6" width="2" height="2" fill="#1b6f3a" />
      <rect x="3" y="8" width="2" height="2" fill="#219653" />
      <rect x="5" y="10" width="2" height="2" fill="#27ae60" />
      <rect x="7" y="8" width="2" height="2" fill="#43d17a" />
      <rect x="9" y="6" width="2" height="2" fill="#5be38e" />
      <rect x="11" y="4" width="2" height="2" fill="#7cf3a8" />
      <rect x="13" y="2" width="2" height="2" fill="#b8ffd0" />
    </svg>
  );
}

export function PixelDoc({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="document" shapeRendering="crispEdges">
      <rect x="3" y="1" width="8" height="2" fill="#2f5d9f" />
      <rect x="3" y="3" width="2" height="11" fill="#2f5d9f" />
      <rect x="5" y="3" width="7" height="10" fill="#d8ecff" />
      <rect x="11" y="3" width="2" height="2" fill="#78b7ff" />
      <rect x="13" y="5" width="1" height="9" fill="#2f5d9f" />
      <rect x="5" y="13" width="8" height="1" fill="#2f5d9f" />
      <rect x="11" y="1" width="1" height="1" fill="#78b7ff" />
      <rect x="12" y="2" width="1" height="1" fill="#78b7ff" />
      <rect x="6" y="6" width="5" height="1" fill="#2f5d9f" />
      <rect x="6" y="9" width="4" height="1" fill="#2f5d9f" />
    </svg>
  );
}

export function PixelSpark({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="spark" shapeRendering="crispEdges">
      <rect x="7" y="1" width="2" height="4" fill="#f2a900" />
      <rect x="7" y="11" width="2" height="4" fill="#f2a900" />
      <rect x="1" y="7" width="4" height="2" fill="#f2a900" />
      <rect x="11" y="7" width="4" height="2" fill="#f2a900" />
      <rect x="6" y="6" width="4" height="4" fill="#ffe08a" />
      <rect x="3" y="3" width="1" height="1" fill="#ffd166" />
      <rect x="12" y="12" width="1" height="1" fill="#ffd166" />
    </svg>
  );
}

export function PixelHeart({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="heart" shapeRendering="crispEdges">
      <rect x="3" y="3" width="3" height="2" fill="#ff5c8a" />
      <rect x="10" y="3" width="3" height="2" fill="#ff5c8a" />
      <rect x="2" y="5" width="12" height="3" fill="#ff5c8a" />
      <rect x="3" y="8" width="10" height="2" fill="#e83f73" />
      <rect x="5" y="10" width="6" height="2" fill="#c92f62" />
      <rect x="7" y="12" width="2" height="2" fill="#a82453" />
      <rect x="4" y="4" width="1" height="1" fill="#ffd1df" />
    </svg>
  );
}

export function PixelWand({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="format" shapeRendering="crispEdges">
      <rect x="3" y="11" width="2" height="2" fill="#5c3b91" />
      <rect x="5" y="9" width="2" height="2" fill="#7b52c8" />
      <rect x="7" y="7" width="2" height="2" fill="#9b72f2" />
      <rect x="9" y="5" width="2" height="2" fill="#c5a8ff" />
      <rect x="12" y="2" width="1" height="3" fill="#f2a900" />
      <rect x="11" y="3" width="3" height="1" fill="#f2a900" />
      <rect x="2" y="3" width="1" height="2" fill="#ffd166" />
      <rect x="1" y="4" width="3" height="1" fill="#ffd166" />
    </svg>
  );
}

export function PixelMonoDoc({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="document" shapeRendering="crispEdges">
      <rect x="3" y="1" width="8" height="2" fill="currentColor" />
      <rect x="3" y="3" width="2" height="11" fill="currentColor" />
      <rect x="11" y="3" width="2" height="2" fill="currentColor" />
      <rect x="13" y="5" width="1" height="9" fill="currentColor" />
      <rect x="5" y="13" width="8" height="1" fill="currentColor" />
      <rect x="6" y="6" width="5" height="1" fill="currentColor" />
      <rect x="6" y="9" width="4" height="1" fill="currentColor" />
    </svg>
  );
}

export function PixelMonoPlayground({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="playground" shapeRendering="crispEdges">
      <rect x="2" y="4" width="12" height="8" fill="currentColor" />
      <rect x="3" y="5" width="10" height="6" fill="var(--bg)" />
      <rect x="4" y="7" width="4" height="2" fill="currentColor" />
      <rect x="5" y="6" width="2" height="4" fill="currentColor" />
      <rect x="10" y="6" width="2" height="2" fill="currentColor" />
      <rect x="9" y="8" width="2" height="2" fill="currentColor" />
      <rect x="6" y="12" width="4" height="1" fill="currentColor" />
    </svg>
  );
}

export function PixelBlocks({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="blocks" shapeRendering="crispEdges">
      <rect x="2" y="2" width="5" height="5" fill="#ffb000" />
      <rect x="9" y="2" width="5" height="5" fill="#6d5dfc" />
      <rect x="2" y="9" width="5" height="5" fill="#35c46b" />
      <rect x="9" y="9" width="5" height="5" fill="#78b7ff" />
      <rect x="4" y="4" width="1" height="1" fill="#fff2bd" />
      <rect x="11" y="4" width="1" height="1" fill="#d8d2ff" />
    </svg>
  );
}

export function PixelApi({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="api" shapeRendering="crispEdges">
      <rect x="1" y="4" width="3" height="2" fill="#78b7ff" />
      <rect x="4" y="6" width="2" height="2" fill="#2f5d9f" />
      <rect x="6" y="8" width="4" height="2" fill="#6d5dfc" />
      <rect x="10" y="6" width="2" height="2" fill="#2f5d9f" />
      <rect x="12" y="4" width="3" height="2" fill="#78b7ff" />
      <rect x="1" y="10" width="3" height="2" fill="#78b7ff" />
      <rect x="12" y="10" width="3" height="2" fill="#78b7ff" />
    </svg>
  );
}

export function PixelCli({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="cli" shapeRendering="crispEdges">
      <rect x="2" y="3" width="12" height="10" fill="#2f5d9f" />
      <rect x="3" y="5" width="10" height="7" fill="#111111" />
      <rect x="3" y="4" width="10" height="1" fill="#35c46b" />
      <rect x="4" y="7" width="2" height="1" fill="#f8f8f5" />
      <rect x="6" y="8" width="1" height="1" fill="#f8f8f5" />
      <rect x="8" y="10" width="4" height="1" fill="#f8f8f5" />
    </svg>
  );
}

export function PixelShield({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="validation" shapeRendering="crispEdges">
      <rect x="4" y="2" width="8" height="2" fill="#219653" />
      <rect x="3" y="4" width="10" height="4" fill="#35c46b" />
      <rect x="4" y="8" width="8" height="3" fill="#27ae60" />
      <rect x="6" y="11" width="4" height="2" fill="#1b6f3a" />
      <rect x="6" y="6" width="2" height="2" fill="#f8f8f5" />
      <rect x="8" y="8" width="2" height="1" fill="#f8f8f5" />
      <rect x="10" y="5" width="1" height="3" fill="#f8f8f5" />
    </svg>
  );
}

export function PixelRender({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="render" shapeRendering="crispEdges">
      <rect x="2" y="3" width="12" height="8" fill="#2f5d9f" />
      <rect x="3" y="4" width="10" height="6" fill="#d8ecff" />
      <rect x="5" y="12" width="6" height="1" fill="#2f5d9f" />
      <rect x="7" y="11" width="2" height="1" fill="#2f5d9f" />
      <rect x="5" y="6" width="2" height="2" fill="#ffb000" />
      <rect x="8" y="6" width="3" height="1" fill="#2f5d9f" />
      <rect x="8" y="8" width="2" height="1" fill="#2f5d9f" />
    </svg>
  );
}

export function PixelSwitch({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="switching" shapeRendering="crispEdges">
      <rect x="3" y="4" width="8" height="2" fill="#78b7ff" />
      <rect x="11" y="2" width="2" height="2" fill="#2f5d9f" />
      <rect x="13" y="4" width="1" height="2" fill="#2f5d9f" />
      <rect x="11" y="6" width="2" height="2" fill="#2f5d9f" />
      <rect x="5" y="10" width="8" height="2" fill="#ffb000" />
      <rect x="3" y="8" width="2" height="2" fill="#de7c00" />
      <rect x="2" y="10" width="1" height="2" fill="#de7c00" />
      <rect x="3" y="12" width="2" height="2" fill="#de7c00" />
    </svg>
  );
}

export function PixelLoop({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="phases" shapeRendering="crispEdges">
      <rect x="4" y="3" width="6" height="2" fill="#6d5dfc" />
      <rect x="10" y="4" width="2" height="2" fill="#6d5dfc" />
      <rect x="12" y="6" width="1" height="3" fill="#6d5dfc" />
      <rect x="10" y="9" width="2" height="2" fill="#35c46b" />
      <rect x="5" y="11" width="6" height="2" fill="#35c46b" />
      <rect x="3" y="9" width="2" height="2" fill="#35c46b" />
      <rect x="2" y="6" width="1" height="3" fill="#35c46b" />
      <rect x="4" y="5" width="2" height="1" fill="#6d5dfc" />
    </svg>
  );
}

export function PixelQuestion({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} role="img" aria-label="faq" shapeRendering="crispEdges">
      <rect x="5" y="2" width="6" height="2" fill="#ffb000" />
      <rect x="11" y="4" width="2" height="3" fill="#de7c00" />
      <rect x="8" y="7" width="3" height="2" fill="#ffb000" />
      <rect x="7" y="9" width="2" height="2" fill="#ffb000" />
      <rect x="7" y="13" width="2" height="2" fill="#de7c00" />
      <rect x="3" y="4" width="2" height="2" fill="#ffd166" />
      <rect x="4" y="3" width="1" height="1" fill="#fff2bd" />
    </svg>
  );
}

function pixelIcon(grid: string) {
  const rows = grid.replace(/^\n|\n$/g, "").split("\n");
  const rects: Array<{ x: number; y: number }> = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === "#") rects.push({ x, y });
    });
  });
  return rects;
}

function PixelArt({
  grid,
  className,
  label,
}: {
  grid: string;
  className?: string;
  label: string;
}) {
  const rects = pixelIcon(grid);
  if (rects.length === 0) {
    return <svg viewBox="0 0 1 1" className={className} role="img" aria-label={label} />;
  }
  // Crop to a square viewBox around the content so every icon renders at the
  // same final visual size and sits at the same vertical center, regardless of
  // how its grid was authored.
  const xs = rects.map((r) => r.x);
  const ys = rects.map((r) => r.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const size = Math.max(w, h);
  const offsetX = (size - w) / 2 - minX;
  const offsetY = (size - h) / 2 - minY;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      {rects.map((p, i) => (
        <rect
          key={i}
          x={p.x + offsetX}
          y={p.y + offsetY}
          width="1"
          height="1"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

// Source file in a tiny editor window. Stands for "open source".
const SOURCE_GRID = `
........................
....################....
....################....
....##............##....
....##..##..##....##....
....##............##....
....##..######....##....
....##............##....
....##..##..##..####....
....##............##....
....##..######....##....
....##............##....
....################....
....################....
..........####..........
..........####..........
........########........
.......##########.......
........................
.....##..........##.....
......##........##......
.......##########.......
........................
........................
`;

// Terminal window with a small agent face. Stands for "agents and humans".
const TERMINAL_GRID = `
........................
..####################..
..####################..
..##................##..
..##..##............##..
..##...##...........##..
..##..##............##..
..##.......######...##..
..##......########..##..
..##......##..##....##..
..##......########..##..
..##........####....##..
..##................##..
..####################..
..####################..
.......##......##.......
.......##......##.......
......####....####......
........................
.........######.........
........########........
........................
........................
........................
`;

// Small deploy/network mark. Stands for "adopt anywhere".
const AST_GRID = `
........................
........................
..........####..........
.........######.........
........########........
.......###....###.......
......###......###......
.....###........###.....
.....###........###.....
.....####......####.....
......#####..#####......
........########........
..........####..........
..........####..........
....######....######....
...########..########...
...##....##..##....##...
...##....##..##....##...
...########..########...
....######....######....
..........####..........
.........######.........
........########........
........................
`;

export function SourceIcon({ className }: Props) {
  return <PixelArt grid={SOURCE_GRID} className={className} label="Source" />;
}

export function TerminalIcon({ className }: Props) {
  return <PixelArt grid={TERMINAL_GRID} className={className} label="Terminal" />;
}

export function AstIcon({ className }: Props) {
  return <PixelArt grid={AST_GRID} className={className} label="tree" />;
}

export function FooterMark({ className, animated }: FooterProps) {
  const stars = [
    [58, 15],
    [83, 24],
    [112, 12],
    [246, 14],
    [276, 24],
    [306, 13],
  ];
  const grass = [
    28, 36, 45, 55, 66, 78, 91, 104, 118, 133, 149, 164, 180, 196, 211, 227, 242, 257, 272, 286, 300, 314, 327,
  ];

  return (
    <svg
      viewBox="0 0 360 92"
      className={className}
      data-animated={animated ? "true" : "false"}
      role="img"
      aria-label="Lessmark logo character standing in a pixel night scene"
      shapeRendering="crispEdges"
    >
      <g className="pixel-moon" fill="currentColor" opacity="0.42">
        <rect x="42" y="12" width="3" height="3" />
        <rect x="45" y="15" width="3" height="3" />
        <rect x="42" y="18" width="3" height="3" />
      </g>

      <g className="pixel-stars" fill="currentColor" opacity="0.28">
        {stars.map(([x, y], i) => (
          <g key={`star-${i}`}>
            <rect x={x + 2} y={y} width="2" height="6" />
            <rect x={x} y={y + 2} width="6" height="2" />
          </g>
        ))}
      </g>

      <g className="pixel-clouds" fill="currentColor" opacity="0.22">
        <rect x="22" y="31" width="50" height="2" />
        <rect x="288" y="31" width="50" height="2" />
        <rect x="72" y="43" width="32" height="2" />
        <rect x="256" y="43" width="32" height="2" />
      </g>

      <g className="pixel-hill" fill="currentColor" opacity="0.32">
        <rect x="96" y="76" width="168" height="4" />
        <rect x="116" y="72" width="128" height="4" />
      </g>

      <g className="pixel-character">
        <g fill="currentColor">
          <rect x="120" y="28" width="120" height="8" />
          <rect x="112" y="36" width="8" height="36" />
          <rect x="240" y="36" width="8" height="36" />
          <rect x="120" y="72" width="120" height="8" />
        </g>
        <g fill="var(--surface)">
          <rect x="124" y="36" width="112" height="36" />
        </g>

        <g className="pixel-arm-left" fill="currentColor">
          <rect x="96" y="52" width="16" height="5" />
          <rect x="88" y="57" width="8" height="5" />
        </g>
        <g className="pixel-arm-right" fill="currentColor">
          <rect x="248" y="52" width="16" height="5" />
          <rect x="264" y="47" width="8" height="5" />
        </g>

        <g fill="currentColor">
          <rect x="143" y="50" width="9" height="5" />
          <rect x="152" y="45" width="9" height="5" />
          <rect x="161" y="40" width="9" height="5" />
          <rect x="152" y="55" width="9" height="5" />
          <rect x="161" y="60" width="9" height="5" />

          <rect x="180" y="41" width="9" height="24" />
          <rect x="189" y="46" width="5" height="9" />
          <rect x="194" y="52" width="5" height="8" />
          <rect x="199" y="46" width="5" height="9" />
          <rect x="204" y="41" width="9" height="24" />
          <rect x="213" y="41" width="9" height="24" />
        </g>

        <g className="pixel-feet" fill="currentColor">
          <rect x="152" y="80" width="6" height="7" />
          <rect x="144" y="87" width="16" height="3" />
          <rect x="202" y="80" width="6" height="7" />
          <rect x="202" y="87" width="16" height="3" />
        </g>
      </g>

      <g fill="currentColor" opacity="0.32">
        <rect x="0" y="84" width="360" height="3" />
        <rect x="0" y="88" width="360" height="1" />
      </g>

      <g className="pixel-grass" fill="currentColor">
        {grass.map((x, i) => (
          <g key={`grass-${i}`} opacity={i % 2 === 0 ? 0.58 : 0.36}>
            <rect x={x} y="80" width="1" height="4" />
            <rect x={x + 1} y="78" width="1" height="6" />
            <rect x={x + 2} y="81" width="1" height="3" />
          </g>
        ))}
      </g>
    </svg>
  );
}
