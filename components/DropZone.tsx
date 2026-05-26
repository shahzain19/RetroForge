"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onImage: (img: HTMLImageElement) => void;
}

export default function DropZone({ onImage }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        onImage(img);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [onImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) loadFile(file);
    },
    [loadFile],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) loadFile(file);
          break;
        }
      }
    },
    [loadFile],
  );

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer select-none",
        dragging
          ? "border-violet-500 bg-violet-500/10"
          : "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800/60",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      aria-label="Upload image"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) loadFile(file);
          e.target.value = "";
        }}
      />
      <Upload
        size={28}
        className={cn(
          "transition-colors",
          dragging ? "text-violet-400" : "text-zinc-500",
        )}
      />
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-300">
          Drop image here or click to browse
        </p>
        <p className="mt-1 flex items-center justify-center gap-1 text-xs text-zinc-500">
          <Clipboard size={12} />
          Paste from clipboard also works
        </p>
      </div>
    </div>
  );
}
