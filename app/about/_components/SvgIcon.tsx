"use client";

import { useEffect, useState } from "react";

export default function SvgIcon({
  src,
  size = 46,
  className = "",
  title,
}: {
  src: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let alive = true;

    fetch(src)
      .then((r) => r.text())
      .then((t) => {
        if (!alive) return;

        // ensure width/height are controlled by us
        const patched = t
          .replace(/<svg\b([^>]*)>/i, `<svg$1 width="${size}" height="${size}">`);

        setSvg(patched);
      });

    return () => {
      alive = false;
    };
  }, [src, size]);

  return (
    <span
      className={className}
      style={{ width: size, height: size, display: "inline-block" }}
      aria-label={title}
      role="img"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
