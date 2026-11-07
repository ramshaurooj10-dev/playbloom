import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

// Helper to draw a circle with anti-aliasing approximation or smooth fill
function drawCircle(png, cx, cy, radius, color) {
  const r2 = radius * radius;
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(png.width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(png.height - 1, Math.ceil(cy + radius));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist2 = dx * dx + dy * dy;
      if (dist2 <= r2) {
        const idx = (png.width * y + x) << 2;
        png.data[idx] = color[0];
        png.data[idx + 1] = color[1];
        png.data[idx + 2] = color[2];
        png.data[idx + 3] = color[3];
      }
    }
  }
}

// Helper to fill rectangle
function drawRect(png, x0, y0, w, h, color) {
  const minX = Math.max(0, Math.floor(x0));
  const maxX = Math.min(png.width - 1, Math.floor(x0 + w));
  const minY = Math.max(0, Math.floor(y0));
  const maxY = Math.min(png.height - 1, Math.floor(y0 + h));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const idx = (png.width * y + x) << 2;
      png.data[idx] = color[0];
      png.data[idx + 1] = color[1];
      png.data[idx + 2] = color[2];
      png.data[idx + 3] = color[3];
    }
  }
}

// Helper to fill rounded rect
function drawRoundRect(png, x0, y0, w, h, r, color) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      if (x < 0 || x >= png.width || y < 0 || y >= png.height) continue;
      
      let inShape = true;
      // top-left corner
      if (x < x0 + r && y < y0 + r) {
        if ((x - (x0 + r)) ** 2 + (y - (y0 + r)) ** 2 > r ** 2) inShape = false;
      }
      // top-right corner
      else if (x > x0 + w - r && y < y0 + r) {
        if ((x - (x0 + w - r)) ** 2 + (y - (y0 + r)) ** 2 > r ** 2) inShape = false;
      }
      // bottom-left corner
      else if (x < x0 + r && y > y0 + h - r) {
        if ((x - (x0 + r)) ** 2 + (y - (y0 + h - r)) ** 2 > r ** 2) inShape = false;
      }
      // bottom-right corner
      else if (x > x0 + w - r && y > y0 + h - r) {
        if ((x - (x0 + w - r)) ** 2 + (y - (y0 + h - r)) ** 2 > r ** 2) inShape = false;
      }

      if (inShape) {
        const idx = (png.width * y + x) << 2;
        png.data[idx] = color[0];
        png.data[idx + 1] = color[1];
        png.data[idx + 2] = color[2];
        png.data[idx + 3] = color[3];
      }
    }
  }
}

function createIconPNG(size) {
  const png = new PNG({ width: size, height: size });

  // Sky blue background
  const skyColor = [14, 165, 233, 255]; // #0EA5E9
  drawRect(png, 0, 0, size, size, skyColor);

  // Soft rounded badge inside
  const margin = Math.round(size * 0.05);
  const badgeSize = size - margin * 2;
  const radius = Math.round(size * 0.22);
  const badgeColor = [254, 240, 138, 255]; // #FEF08A (soft warm yellow)
  drawRoundRect(png, margin, margin, badgeSize, badgeSize, radius, badgeColor);

  // Cute Golden Lion Face & Mane in center
  const cx = size / 2;
  const cy = size / 2 - size * 0.02;

  // Mane (dark orange)
  const maneRadius = size * 0.32;
  drawCircle(png, cx, cy, maneRadius, [180, 83, 9, 255]); // #B45309

  // Face (golden yellow)
  const faceRadius = size * 0.22;
  drawCircle(png, cx, cy, faceRadius, [245, 158, 11, 255]); // #F59E0B

  // Ears
  drawCircle(png, cx - faceRadius * 0.8, cy - faceRadius * 0.8, size * 0.07, [217, 119, 6, 255]);
  drawCircle(png, cx + faceRadius * 0.8, cy - faceRadius * 0.8, size * 0.07, [217, 119, 6, 255]);
  drawCircle(png, cx - faceRadius * 0.8, cy - faceRadius * 0.8, size * 0.035, [254, 243, 199, 255]);
  drawCircle(png, cx + faceRadius * 0.8, cy - faceRadius * 0.8, size * 0.035, [254, 243, 199, 255]);

  // Snout
  drawCircle(png, cx, cy + size * 0.05, size * 0.1, [254, 243, 199, 255]); // #FEF3C7

  // Eyes
  drawCircle(png, cx - size * 0.08, cy - size * 0.04, size * 0.035, [30, 41, 59, 255]);
  drawCircle(png, cx + size * 0.08, cy - size * 0.04, size * 0.035, [30, 41, 59, 255]);

  // White eye highlights
  drawCircle(png, cx - size * 0.07, cy - size * 0.05, size * 0.012, [255, 255, 255, 255]);
  drawCircle(png, cx + size * 0.09, cy - size * 0.05, size * 0.012, [255, 255, 255, 255]);

  // Nose (dark brown triangle approximation)
  drawCircle(png, cx, cy + size * 0.02, size * 0.028, [69, 26, 3, 255]);

  // Star in corner
  drawCircle(png, cx + size * 0.28, cy - size * 0.26, size * 0.06, [250, 204, 21, 255]); // gold star

  const buffer = PNG.sync.write(png);
  return buffer;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createIconPNG(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createIconPNG(512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createIconPNG(180));
fs.writeFileSync(path.join(publicDir, 'favicon.png'), createIconPNG(64));

console.log('Successfully generated Playroom icons!');
