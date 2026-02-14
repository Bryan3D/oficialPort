import fs from "node:fs";
import path from "node:path";

const skillsDir = path.join(process.cwd(), "public", "skills");

if (!fs.existsSync(skillsDir)) {
  console.error("❌ Folder not found:", skillsDir);
  process.exit(1);
}

const files = fs.readdirSync(skillsDir).filter((f) => f.toLowerCase().endsWith(".svg"));

const replaceFillStroke = (svg) => {
  let out = svg;

  // Ensure root svg has fill="currentColor" if missing
  out = out.replace(/<svg\b([^>]*)>/i, (m, attrs) => {
    const hasFill = /\bfill\s*=\s*["'][^"']+["']/i.test(attrs);
    // keep existing fill on root if it is already currentColor; otherwise enforce
    if (!hasFill) return `<svg${attrs} fill="currentColor">`;
    // If root fill exists but not currentColor, set it to currentColor
    return `<svg${attrs.replace(/\bfill\s*=\s*["'][^"']+["']/i, 'fill="currentColor"')}>`;
  });

  // Remove inline style fills like style="fill:#000" or "fill: rgb(...)"
  out = out.replace(/style\s*=\s*["'][^"']*fill\s*:\s*[^;"']+;?[^"']*["']/gi, (m) => {
    // remove only fill from style, keep rest
    const inside = m.slice(m.indexOf('"') + 1, m.lastIndexOf('"'));
    const cleaned = inside
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.toLowerCase().startsWith("fill:"))
      .join("; ");
    return cleaned ? `style="${cleaned}"` : "";
  });

  // Replace any fill="something" (except none/currentColor) with currentColor
  out = out.replace(/\bfill\s*=\s*["'](?!none\b|currentColor\b)[^"']+["']/gi, 'fill="currentColor"');

  // Replace any stroke="something" (except none/currentColor) with currentColor
  out = out.replace(/\bstroke\s*=\s*["'](?!none\b|currentColor\b)[^"']+["']/gi, 'stroke="currentColor"');

  return out;
};

let changed = 0;

for (const f of files) {
  const full = path.join(skillsDir, f);
  const raw = fs.readFileSync(full, "utf8");
  const next = replaceFillStroke(raw);

  if (next !== raw) {
    fs.writeFileSync(full, next, "utf8");
    console.log("✅ Converted:", f);
    changed++;
  } else {
    console.log("— Skipped (no changes):", f);
  }
}

console.log(`\nDone. Updated ${changed}/${files.length} SVG(s).`);
