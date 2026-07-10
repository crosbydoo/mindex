import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const svg = readFileSync('public/favicon.svg');
const outDir = 'public';

async function makeIcon(size, filename, { padded = false } = {}) {
  if (!padded) {
    await sharp(svg).resize(size, size).png().toFile(join(outDir, filename));
    return;
  }

  const inner = Math.round(size * 0.7);
  const pad = Math.round((size - inner) / 2);
  const icon = await sharp(svg).resize(inner, inner).png().toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 3, g: 2, b: 19, alpha: 1 },
    },
  })
    .composite([{ input: icon, left: pad, top: pad }])
    .png()
    .toFile(join(outDir, filename));
}

await makeIcon(180, 'apple-touch-icon.png');
await makeIcon(192, 'pwa-192x192.png');
await makeIcon(512, 'pwa-512x512.png');
await makeIcon(512, 'pwa-maskable-512x512.png', { padded: true });

console.log('PWA icons generated in public/');
