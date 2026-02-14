import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const videoDir = path.join(process.cwd(), "public", "videos");
try {
  execSync("ffmpeg -version", { stdio: "ignore" });
} catch {
  console.log("FFmpeg not found. Skipping video compression.");
  process.exit(0);
}


if (!fs.existsSync(videoDir)) {
  console.log("No public/videos folder found, skipping.");
  process.exit(0);
}

const files = fs.readdirSync(videoDir);

for (const file of files) {
  if (!file.toLowerCase().endsWith(".mp4")) continue;
  if (file.toLowerCase().includes("-web.mp4")) continue;

  const input = path.join(videoDir, file);
  const output = path.join(videoDir, file.replace(/\.mp4$/i, "-web.mp4"));

  if (fs.existsSync(output)) continue;

  console.log(`Compressing ${file} -> ${path.basename(output)} ...`);

  execSync(
    `ffmpeg -i "${input}" -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 21 -tune film -movflags +faststart -c:a aac -b:a 128k "${output}"`,
    { stdio: "inherit" }
  );
}
