import type { Palette } from "./palettes";

export type DownscaleMethod = "nearest" | "box";

export interface ProcessOptions {
  scale: number; // e.g. 0.5 = half, 0.25 = quarter
  palette: Palette;
  dithering: boolean;
  downscaleMethod: DownscaleMethod;
}

/**
 * Custom nearest-neighbor downscale.
 * For each destination pixel, samples the single source pixel whose center
 * is closest — no blending, pure pixel-pick.
 */
function downscaleNearest(
  src: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): Uint8ClampedArray {
  const dst = new Uint8ClampedArray(dstW * dstH * 4);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let dy = 0; dy < dstH; dy++) {
    const sy = Math.floor(dy * yRatio);
    for (let dx = 0; dx < dstW; dx++) {
      const sx = Math.floor(dx * xRatio);
      const si = (sy * srcW + sx) * 4;
      const di = (dy * dstW + dx) * 4;
      dst[di] = src[si];
      dst[di + 1] = src[si + 1];
      dst[di + 2] = src[si + 2];
      dst[di + 3] = src[si + 3];
    }
  }

  return dst;
}

/**
 * Custom box-filter (area-average) downscale.
 * Each destination pixel is the average of all source pixels that fall
 * within its corresponding source rectangle — gives a softer, more
 * natural-looking result than nearest-neighbor.
 */
function downscaleBox(
  src: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): Uint8ClampedArray {
  const dst = new Uint8ClampedArray(dstW * dstH * 4);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let dy = 0; dy < dstH; dy++) {
    const y0 = dy * yRatio;
    const y1 = y0 + yRatio;
    const iy0 = Math.floor(y0);
    const iy1 = Math.min(Math.ceil(y1), srcH);

    for (let dx = 0; dx < dstW; dx++) {
      const x0 = dx * xRatio;
      const x1 = x0 + xRatio;
      const ix0 = Math.floor(x0);
      const ix1 = Math.min(Math.ceil(x1), srcW);

      let r = 0, g = 0, b = 0, a = 0, weight = 0;

      for (let sy = iy0; sy < iy1; sy++) {
        // Fractional row coverage at the edges
        const wy =
          Math.min(sy + 1, y1) - Math.max(sy, y0);

        for (let sx = ix0; sx < ix1; sx++) {
          const wx =
            Math.min(sx + 1, x1) - Math.max(sx, x0);

          const w = wx * wy;
          const si = (sy * srcW + sx) * 4;
          r += src[si] * w;
          g += src[si + 1] * w;
          b += src[si + 2] * w;
          a += src[si + 3] * w;
          weight += w;
        }
      }

      const di = (dy * dstW + dx) * 4;
      dst[di] = Math.round(r / weight);
      dst[di + 1] = Math.round(g / weight);
      dst[di + 2] = Math.round(b / weight);
      dst[di + 3] = Math.round(a / weight);
    }
  }

  return dst;
}


function nearestColor(
  r: number,
  g: number,
  b: number,
  colors: [number, number, number][],
): [number, number, number] {
  let best = colors[0];
  let bestDist = Infinity;

  for (const c of colors) {
    const dr = r - c[0];
    const dg = g - c[1];
    const db = b - c[2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }

  return best;
}

/**
 * Clamp a value to [0, 255].
 */
function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/**
 * Process an ImageData in-place:
 * 1. Quantize each pixel to the nearest palette color.
 * 2. Optionally apply Floyd-Steinberg dithering.
 */
function quantizeImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  palette: Palette,
  dithering: boolean,
): void {
  // Work on a float buffer so dithering errors accumulate correctly
  const buf = new Float32Array(width * height * 4);
  for (let i = 0; i < data.length; i++) {
    buf[i] = data[i];
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      const oldR = buf[idx];
      const oldG = buf[idx + 1];
      const oldB = buf[idx + 2];

      const [newR, newG, newB] = nearestColor(
        clamp(oldR),
        clamp(oldG),
        clamp(oldB),
        palette.colors,
      );

      buf[idx] = newR;
      buf[idx + 1] = newG;
      buf[idx + 2] = newB;
      // alpha stays unchanged

      if (dithering) {
        const errR = oldR - newR;
        const errG = oldG - newG;
        const errB = oldB - newB;

        // Floyd-Steinberg kernel:
        //         X   7/16
        //   3/16  5/16  1/16
        const distribute = (dx: number, dy: number, factor: number) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) return;
          const ni = (ny * width + nx) * 4;
          buf[ni] += errR * factor;
          buf[ni + 1] += errG * factor;
          buf[ni + 2] += errB * factor;
        };

        distribute(1, 0, 7 / 16);
        distribute(-1, 1, 3 / 16);
        distribute(0, 1, 5 / 16);
        distribute(1, 1, 1 / 16);
      }
    }
  }

  // Write back to Uint8ClampedArray (clamping is automatic)
  for (let i = 0; i < data.length; i++) {
    data[i] = clamp(buf[i]);
  }
}

/**
 * Main processing function.
 * Returns a new canvas with the processed image at the downscaled resolution.
 */
export function processImage(
  source: HTMLImageElement | HTMLCanvasElement,
  options: ProcessOptions,
): HTMLCanvasElement {
  const { scale, palette, dithering, downscaleMethod } = options;

  const srcW =
    source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const srcH =
    source instanceof HTMLImageElement ? source.naturalHeight : source.height;

  const dstW = Math.max(1, Math.round(srcW * scale));
  const dstH = Math.max(1, Math.round(srcH * scale));

  // --- Step 1: Read source pixels into a flat array ---
  const readCanvas = document.createElement("canvas");
  readCanvas.width = srcW;
  readCanvas.height = srcH;
  const readCtx = readCanvas.getContext("2d")!;
  readCtx.drawImage(source, 0, 0);
  const srcData = readCtx.getImageData(0, 0, srcW, srcH).data;

  // --- Step 2: Custom downscale ---
  const downPixels =
    downscaleMethod === "box"
      ? downscaleBox(srcData, srcW, srcH, dstW, dstH)
      : downscaleNearest(srcData, srcW, srcH, dstW, dstH);

  // --- Step 3: Write downscaled pixels to a canvas ---
  const downCanvas = document.createElement("canvas");
  downCanvas.width = dstW;
  downCanvas.height = dstH;
  const downCtx = downCanvas.getContext("2d")!;
  // Copy into a Uint8ClampedArray backed by a plain ArrayBuffer so the
  // ImageData constructor receives the exact type it requires (TypeScript
  // strict mode rejects Uint8ClampedArray<ArrayBufferLike> here).
  const pixelsBuf = new Uint8ClampedArray(new ArrayBuffer(downPixels.length));
  pixelsBuf.set(downPixels);
  const imageData = new ImageData(pixelsBuf, dstW, dstH);

  // --- Step 4: Quantize pixels ---
  quantizeImageData(imageData.data, dstW, dstH, palette, dithering);
  downCtx.putImageData(imageData, 0, 0);

  return downCanvas;
}

/**
 * Draw a processed canvas onto a display canvas, scaled up with pixel-perfect
 * nearest-neighbor rendering so the pixel grid is visible.
 */
export function renderToDisplay(
  source: HTMLCanvasElement,
  target: HTMLCanvasElement,
): void {
  const ctx = target.getContext("2d")!;
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, target.width, target.height);
}
