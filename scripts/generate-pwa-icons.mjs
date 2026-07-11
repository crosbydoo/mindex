import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const outDir = 'public';
const favicon = readFileSync('public/favicon.svg');
const BG = { r: 3, g: 2, b: 19, alpha: 1 }; // #030213

async function makeRounded(size, filename) {
  // Scale favicon; keep alpha so rounded corners stay transparent
  await sharp(favicon, { density: Math.max(72, size * 3) })
    .resize(size, size, { fit: 'fill' })
    .ensureAlpha()
    .png()
    .toFile(join(outDir, filename));
}

async function makeMaskable(size, filename) {
  // Full-bleed brand color for Android splash / adaptive icon
  const inner = Math.round(size * 0.68);
  const pad = Math.round((size - inner) / 2);

  const icon = await sharp(favicon, { density: Math.max(72, inner * 3) })
    .resize(inner, inner, { fit: 'fill' })
    .ensureAlpha()
    .png()
    .toBuffer();

  // Composite rounded icon onto solid #030213 (matches main icon color)
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: icon, left: pad, top: pad }])
    .png()
    .toFile(join(outDir, filename));
}

await makeRounded(180, 'apple-touch-icon.png');
await makeRounded(192, 'pwa-192x192.png');
await makeRounded(512, 'pwa-512x512.png');
await makeMaskable(512, 'pwa-maskable-512x512.png');

console.log('PWA icons regenerated from favicon (rounded + #030213)');
