"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import DropZone from "./DropZone";
import ControlPanel, { type Settings } from "./ControlPanel";
import ImageCanvas from "./ImageCanvas";
import { processImage } from "@/lib/imageProcessor";
import { getPaletteById } from "@/lib/palettes";

const DEFAULT_SETTINGS: Settings = {
  paletteId: "ps1",
  scale: 0.25,
  dithering: "none",
  downscaleMethod: "nearest",
  colorMatchMethod: "rgb",
  brightness: 0,
  contrast: 0,
};

export default function RetroForge() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [outputCanvas, setOutputCanvas] = useState<HTMLCanvasElement | null>(
    null,
  );
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  // Dimensions labels
  const srcDims = sourceImage
    ? `${sourceImage.naturalWidth} × ${sourceImage.naturalHeight}`
    : undefined;
  const outDims = outputCanvas
    ? `${outputCanvas.width} × ${outputCanvas.height}`
    : undefined;

  // Run the processing pipeline whenever source or settings change
  useEffect(() => {
    if (!sourceImage) {
      setOutputCanvas(null);
      return;
    }

    // Debounce rapid setting changes
    const id = setTimeout(() => {
      if (processingRef.current) return;
      processingRef.current = true;
      setProcessing(true);

      // Run off the main thread tick so the UI can update first
      requestAnimationFrame(() => {
        try {
          const palette = getPaletteById(settings.paletteId);
          const result = processImage(sourceImage, {
            scale: settings.scale,
            palette,
            dithering: settings.dithering,
            downscaleMethod: settings.downscaleMethod,
            colorMatchMethod: settings.colorMatchMethod,
            brightness: settings.brightness,
            contrast: settings.contrast,
          });
          setOutputCanvas(result);
        } finally {
          processingRef.current = false;
          setProcessing(false);
        }
      });
    }, 80);

    return () => clearTimeout(id);
  }, [sourceImage, settings]);

  const handleImage = useCallback((img: HTMLImageElement) => {
    setSourceImage(img);
  }, []);

  const handleDownload = useCallback(() => {
    if (!outputCanvas) return;
    const link = document.createElement("a");
    link.download = "retroforge-output.png";
    link.href = outputCanvas.toDataURL("image/png");
    link.click();
  }, [outputCanvas]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Left panel */}
      <div className="flex h-full w-64 shrink-0 flex-col gap-0 border-r border-zinc-800 bg-zinc-950 p-5 overflow-y-auto">
        <ControlPanel
          settings={settings}
          onChange={setSettings}
          onDownload={handleDownload}
          hasOutput={!!outputCanvas}
        />
      </div>

      {/* Main workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex h-10 shrink-0 items-center gap-3 border-b border-zinc-800 px-4">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors mr-2"
            aria-label="Back to home"
          >
            ← Home
          </Link>
          <span className="text-zinc-800 select-none">|</span>
          <span className="text-xs font-mono text-zinc-600">
            {processing ? (
              <span className="text-violet-400 animate-pulse">Processing…</span>
            ) : sourceImage ? (
              <span className="text-zinc-500">Ready</span>
            ) : (
              <span className="text-zinc-700">No image loaded</span>
            )}
          </span>
        </div>

        {/* Canvas area */}
        <div className="flex flex-1 gap-4 overflow-hidden p-4">
          {!sourceImage ? (
            // Full-width drop zone when no image
            <div className="flex flex-1 flex-col gap-4">
              <DropZone onImage={handleImage} />
              <div className="flex flex-1 gap-4">
                <ImageCanvas source={null} label="Original" />
                <ImageCanvas source={null} label="Output" />
              </div>
            </div>
          ) : (
            // Side-by-side previews
            <div className="flex flex-1 flex-col gap-4 overflow-hidden">
              <DropZone onImage={handleImage} />
              <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
                <ImageCanvas
                  source={sourceImage}
                  label="Original"
                  dims={srcDims}
                />
                <ImageCanvas
                  source={outputCanvas}
                  label="Output"
                  dims={outDims}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
