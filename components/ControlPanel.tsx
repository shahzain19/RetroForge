"use client";

import { PALETTES } from "@/lib/palettes";
import { type DownscaleMethod } from "@/lib/imageProcessor";
import { cn } from "@/lib/utils";

export interface Settings {
  paletteId: string;
  scale: number;
  dithering: boolean;
  downscaleMethod: DownscaleMethod;
}

interface ControlPanelProps {
  settings: Settings;
  onChange: (s: Settings) => void;
  onDownload: () => void;
  hasOutput: boolean;
}

const SCALE_OPTIONS = [
  { label: "1/2 ×", value: 0.5 },
  { label: "1/4 ×", value: 0.25 },
  { label: "1/8 ×", value: 0.125 },
  { label: "1/16 ×", value: 0.0625 },
];

export default function ControlPanel({
  settings,
  onChange,
  onDownload,
  hasOutput,
}: ControlPanelProps) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    onChange({ ...settings, [key]: value });

  return (
    <aside className="flex flex-col gap-6 w-64 shrink-0">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold tracking-tight text-zinc-100 font-mono">
          RetroForge
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Retro texture downscaler &amp; palette matcher
        </p>
      </div>

      <Divider />

      {/* Palette */}
      <Section label="Palette">
        <div className="flex flex-col gap-1">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => set("paletteId", p.id)}
              className={cn(
                "flex items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors",
                settings.paletteId === p.id
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
              )}
            >
              <PaletteSwatches colors={p.colors.slice(0, 6)} />
              <span className="font-mono text-xs">{p.name}</span>
            </button>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Scale */}
      <Section label="Downscale">
        <div className="grid grid-cols-2 gap-1.5">
          {SCALE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("scale", opt.value)}
              className={cn(
                "rounded px-3 py-2 text-xs font-mono transition-colors",
                settings.scale === opt.value
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          {(["nearest", "box"] as DownscaleMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => set("downscaleMethod", method)}
              className={cn(
                "rounded px-3 py-2 text-xs font-mono transition-colors capitalize",
                settings.downscaleMethod === method
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200",
              )}
            >
              {method}
            </button>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Dithering */}
      <Section label="Dithering">
        <label className="flex cursor-pointer items-center justify-between rounded bg-zinc-800 px-3 py-2.5">
          <span className="text-xs font-mono text-zinc-300">
            Floyd-Steinberg
          </span>
          <Toggle
            checked={settings.dithering}
            onChange={(v) => set("dithering", v)}
          />
        </label>
      </Section>

      <div className="mt-auto">
        <button
          type="button"
          disabled={!hasOutput}
          onClick={onDownload}
          className={cn(
            "w-full rounded px-4 py-2.5 text-sm font-semibold font-mono transition-colors",
            hasOutput
              ? "bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700"
              : "cursor-not-allowed bg-zinc-800 text-zinc-600",
          )}
        >
          Export PNG
        </button>
      </div>
    </aside>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-zinc-800" />;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500",
        checked ? "bg-violet-600" : "bg-zinc-700",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function PaletteSwatches({ colors }: { colors: [number, number, number][] }) {
  return (
    <span className="flex gap-0.5 shrink-0">
      {colors.map((c) => (
        <span
          key={`${c[0]}-${c[1]}-${c[2]}`}
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: `rgb(${c[0]},${c[1]},${c[2]})` }}
        />
      ))}
    </span>
  );
}
