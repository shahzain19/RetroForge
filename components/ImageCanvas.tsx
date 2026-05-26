"use client";

import { useEffect, useRef } from "react";

interface ImageCanvasProps {
  /** The source to draw — either an HTMLImageElement or a processed canvas */
  source: HTMLImageElement | HTMLCanvasElement | null;
  label: string;
  /** Optional pixel dimensions label shown below */
  dims?: string;
}

export default function ImageCanvas({ source, label, dims }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!source) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const srcW =
      source instanceof HTMLImageElement ? source.naturalWidth : source.width;
    const srcH =
      source instanceof HTMLImageElement ? source.naturalHeight : source.height;

    canvas.width = srcW;
    canvas.height = srcH;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(source, 0, 0);
  }, [source]);

  return (
    <div className="flex flex-col gap-2 min-w-0 flex-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {label}
        </span>
        {dims && (
          <span className="text-[10px] font-mono text-zinc-600">{dims}</span>
        )}
      </div>
      <div className="relative flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
        {/* Checkerboard background to show transparency */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#1a1a1a 0% 25%, #111 0% 50%)",
            backgroundSize: "16px 16px",
          }}
        />
        {source ? (
          <canvas
            ref={canvasRef}
            className="relative z-10 h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <div className="relative z-10 flex h-full min-h-[280px] items-center justify-center">
            <span className="text-xs text-zinc-700 font-mono">
              No image loaded
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
