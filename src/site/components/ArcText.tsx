"use client";

import { useId } from "react";

type Props = {
  lines: string[];
  /** viewBox width in px units */
  width?: number;
  /** line height in viewBox units */
  lineHeight?: number;
  /** font size in viewBox units */
  fontSize?: number;
  /** curve depth; positive = smile (arc up at ends), negative = frown */
  bend?: number;
  /** horizontal anchor */
  align?: "start" | "middle" | "end";
  /** fill: css color or "gradient" */
  fill?: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * Real, selectable text laid out along gentle arcs (SVG <textPath>).
 * Screen readers read <text> content; users can select/copy it.
 */
export function ArcText({
  lines,
  width = 320,
  lineHeight = 34,
  fontSize = 28,
  bend = 10,
  align = "end",
  fill = "currentColor",
  className,
  ariaLabel,
}: Props) {
  const id = useId().replace(/:/g, "");
  const pad = 6;
  const height = lineHeight * lines.length + pad * 2 + Math.abs(bend);
  const offset = align === "start" ? "0%" : align === "end" ? "100%" : "50%";
  const useGradient = fill === "gradient";

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel ?? lines.join(" ")}
      style={{ overflow: "visible" }}
    >
      <defs>
        {lines.map((_, i) => {
          const y = pad + Math.abs(bend) + lineHeight * (i + 0.8);
          // quadratic arc: endpoints at y, control point lifted by bend*2
          return (
            <path
              key={i}
              id={`${id}-p${i}`}
              d={`M 0 ${y} Q ${width / 2} ${y - bend * 2} ${width} ${y}`}
              fill="none"
            />
          );
        })}
        {useGradient && (
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-2)" />
            <stop offset="0.55" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-deep)" />
          </linearGradient>
        )}
      </defs>
      {lines.map((line, i) => (
        <text
          key={i}
          fontSize={fontSize}
          fill={useGradient ? `url(#${id}-g)` : fill}
          style={{ fontFamily: "var(--font-hand)", fontWeight: 500 }}
        >
          <textPath href={`#${id}-p${i}`} startOffset={offset} textAnchor={align}>
            {line}
          </textPath>
        </text>
      ))}
    </svg>
  );
}
