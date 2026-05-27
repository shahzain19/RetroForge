import Image from "next/image";
import Link from "next/link";

// ── Data ─────────────────────────────────────────────────────────────────────

const SAMPLES = [
  { src: "/sample-1.png", alt: "Retro output sample 1" },
  { src: "/sample-2.png", alt: "Retro output sample 2" },
  { src: "/sample-3.png", alt: "Retro output sample 3" },
  { src: "/sample-4.png", alt: "Retro output sample 4" },
  { src: "/sample-5.png", alt: "Retro output sample 5" },
];

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Custom Downscaling",
    body: "Two hand-rolled algorithms — nearest-neighbor for hard pixel edges, box-filter for smooth area averaging. No browser interpolation shortcuts.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="5" cy="5" r="2.5" fill="currentColor" />
        <circle cx="15" cy="5" r="2.5" fill="currentColor" />
        <circle cx="5" cy="15" r="2.5" fill="currentColor" />
        <circle cx="15" cy="15" r="2.5" fill="currentColor" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    title: "Palette Matching",
    body: "28 authentic retro palettes — PS1, GBA, SNES, NES, PICO-8, C64, and more. Every pixel snapped to the nearest color in RGB space.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="2" y="2" width="4" height="4" fill="currentColor" />
        <rect x="8" y="2" width="4" height="4" fill="currentColor" opacity="0.6" />
        <rect x="14" y="2" width="4" height="4" fill="currentColor" opacity="0.3" />
        <rect x="5" y="8" width="4" height="4" fill="currentColor" opacity="0.8" />
        <rect x="11" y="8" width="4" height="4" fill="currentColor" opacity="0.4" />
        <rect x="2" y="14" width="4" height="4" fill="currentColor" opacity="0.5" />
        <rect x="8" y="14" width="4" height="4" fill="currentColor" opacity="0.9" />
        <rect x="14" y="14" width="4" height="4" fill="currentColor" opacity="0.2" />
      </svg>
    ),
    title: "Floyd-Steinberg Dithering",
    body: "Error-diffusion dithering that spreads quantization error to neighboring pixels, giving you that classic retro gradient feel.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Instant Processing",
    body: "All processing runs in your browser via the Canvas API. No server round-trips, no waiting — results appear as you tweak settings.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M4 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Side-by-Side Preview",
    body: "Original and processed images displayed together at full resolution so you can judge the result before exporting.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M13 2H7a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V6l-5-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 12h4M8 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Export PNG",
    body: "Download the processed image at the downscaled resolution — pixel-perfect and ready for your game engine or asset pipeline.",
  },
];

const PALETTES_PREVIEW = [
  { name: "PS1", colors: ["#000", "#800000", "#008000", "#000080", "#808000", "#800080"] },
  { name: "NES", colors: ["#626262", "#001fb2", "#e43b44", "#63c74d", "#feae34", "#8b3f96"] },
  { name: "PICO-8", colors: ["#000000", "#1d2b53", "#7e2553", "#008751", "#ff004d", "#29adff"] },
  { name: "Game Boy", colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"] },
  { name: "CGA", colors: ["#000", "#0000aa", "#00aa00", "#aa0000", "#aa00aa", "#aaaaaa"] },
  { name: "C64", colors: ["#000000", "#ffffff", "#883932", "#67b6bd", "#8b3f96", "#55a049"] },
  { name: "ENDESGA 32", colors: ["#be4a2f", "#feae34", "#63c74d", "#0099db", "#ff0044", "#262b44"] },
  { name: "Sweetie 16", colors: ["#1a1c2c", "#b13e53", "#ffcd75", "#38b764", "#41a6f6", "#f4f4f4"] },
  { name: "Neon Nights", colors: ["#000000", "#ff0080", "#00ffff", "#8000ff", "#00ff80", "#ffff00"] },
];

const STEPS = [
  {
    n: "01",
    title: "Drop your image",
    desc: "Drag and drop, click to browse, or paste from clipboard. Any browser-readable image format works.",
  },
  {
    n: "02",
    title: "Pick a palette & scale",
    desc: "Choose from 28 authentic retro palettes and select your downscale factor — from 1/2× down to 1/16×.",
  },
  {
    n: "03",
    title: "Choose your algorithm",
    desc: "Nearest-neighbor for hard pixel edges, box-filter for smooth area averaging. Toggle Floyd-Steinberg dithering for extra depth.",
  },
  {
    n: "04",
    title: "Export",
    desc: "Hit Export PNG to download your pixel-perfect retro asset at the downscaled resolution.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* ── Nav ── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-zinc-100 tracking-tight">
              RetroForge
            </span>
            <span className="hidden rounded border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-mono text-violet-400 sm:inline">
              v1.0
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/shahzain19/RetroForge"
              className="hidden text-xs font-mono text-zinc-500 transition-colors hover:text-zinc-300 sm:block"
            >
              GitHub
            </a>
            <Link
              href="/forge"
              className="rounded bg-violet-600 px-4 py-1.5 text-xs font-semibold font-mono text-white transition-colors hover:bg-violet-500 active:bg-violet-700"
            >
              Open Tool →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-14">
        {/* Grid bg */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/8 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/4 top-1/3 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/8 blur-[100px]"
        />

        <div className="relative z-10 flex flex-col items-center gap-7 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-mono text-violet-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            Runs entirely in your browser — zero uploads
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Turn any image into{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              retro game art
            </span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
            Downscale, palette-match, and dither any image into authentic
            pixel-art textures. 28 retro palettes. Two downscale algorithms.
            Floyd-Steinberg dithering. Free, forever.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/forge"
              className="group inline-flex items-center gap-2 rounded-lg bg-violet-600 px-7 py-3 text-sm font-semibold font-mono text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500 hover:shadow-violet-800/50 active:bg-violet-700"
            >
              Launch RetroForge
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="https://github.com/shahzain19/RetroForge"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-7 py-3 text-sm font-semibold font-mono text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View Source
            </a>
          </div>
        </div>

        {/* Sample gallery */}
        <div className="relative z-10 mt-20 w-full max-w-4xl">
          <p className="mb-4 text-center text-[10px] font-mono uppercase tracking-widest text-zinc-600">
            Real outputs from RetroForge
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SAMPLES.map((s, i) => (
              <div
                key={s.src}
                className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-lg transition-all hover:border-violet-500/50 hover:shadow-violet-900/20"
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Checkerboard bg */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-conic-gradient(#1a1a1a 0% 25%, #111 0% 50%)",
                    backgroundSize: "8px 8px",
                  }}
                />
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={150}
                  height={84}
                  className="relative z-10 transition-transform group-hover:scale-105"
                  style={{ imageRendering: "pixelated" }}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-700">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em]">scroll</span>
          <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden>
            <path d="M6 1v10M2 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ── Palette strip ── */}
      <section className="border-y border-zinc-800/60 bg-zinc-900/20 py-10 overflow-hidden">
        <p className="mb-6 text-center text-[10px] font-mono uppercase tracking-widest text-zinc-600">
          28 retro palettes included
        </p>
        <div className="flex flex-wrap justify-center gap-3 px-6">
          {PALETTES_PREVIEW.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 transition-colors hover:border-zinc-700"
            >
              <div className="flex gap-0.5">
                {p.colors.map((c) => (
                  <span
                    key={c}
                    className="inline-block h-3.5 w-3.5 rounded-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-zinc-600">{p.name}</span>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-zinc-800/50 bg-zinc-900/40 px-3 py-2.5">
            <span className="text-xs font-mono text-zinc-600">+19 more</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-3 text-zinc-500">
            Built for game devs, pixel artists, and anyone who loves the retro aesthetic.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/70"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-violet-400 transition-colors group-hover:border-violet-500/40 group-hover:bg-violet-500/10">
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold text-zinc-100 font-mono text-sm">
                {f.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="border-t border-zinc-800 bg-zinc-900/20 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              See it in action
            </h2>
            <p className="mt-3 text-zinc-500">
              These were processed directly in RetroForge — no post-editing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SAMPLES.map((s, i) => (
              <div key={s.src} className="flex flex-col gap-2">
                <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/20">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-conic-gradient(#1a1a1a 0% 25%, #111 0% 50%)",
                      backgroundSize: "8px 8px",
                    }}
                  />
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={150}
                    height={84}
                    className="relative z-10 h-auto w-full transition-transform group-hover:scale-105"
                    style={{ imageRendering: "pixelated" }}
                    unoptimized
                  />
                </div>
                <span className="text-center text-[10px] font-mono text-zinc-600">
                  Sample {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-zinc-500">Four steps from image to retro asset.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700"
              >
                <span className="mb-4 block font-mono text-3xl font-bold text-zinc-800">
                  {s.n}
                </span>
                <h3 className="mb-2 font-semibold text-zinc-100 font-mono">{s.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-zinc-800 px-6 py-32 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[100px]"
        />
        <div className="relative z-10 mx-auto max-w-xl">
          <h2 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Ready to forge some pixels?
          </h2>
          <p className="mt-4 text-zinc-500">
            No sign-up. No upload. No cost. Just open the tool and start creating.
          </p>
          <Link
            href="/forge"
            className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-10 py-4 text-sm font-semibold font-mono text-white shadow-xl shadow-violet-900/40 transition-all hover:bg-violet-500 hover:shadow-violet-800/50 active:bg-violet-700"
          >
            Open RetroForge
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs font-mono text-zinc-600 sm:flex-row">
          <span className="text-zinc-500 font-semibold">RetroForge</span>
          <span>Built with Next.js · All processing runs in your browser</span>
          <a
            href="https://github.com"
            className="transition-colors hover:text-zinc-400"
          >
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
}
