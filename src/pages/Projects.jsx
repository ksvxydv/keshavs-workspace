import Page from "../components/ui/Page";
import { HiCommandLine } from "react-icons/hi2";
import { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import desktop from "../assets/projects/desktop.png";
import finder from "../assets/projects/finder.png";
import about from "../assets/projects/about.png";
import resume from "../assets/projects/resume.png";
import contacts from "../assets/projects/contacts.png";
import settings from "../assets/projects/settings.png";
import darkmode from "../assets/projects/darkmode.png";
import multitasking from "../assets/projects/multitasking.png";

const screenshots = [
  { image: desktop, title: "Desktop" },
  { image: finder, title: "Finder" },
  { image: about, title: "About" },
  { image: resume, title: "Resume Preview" },
  { image: contacts, title: "Contacts" },
  { image: settings, title: "Settings" },
  { image: darkmode, title: "Dark Mode" },
  { image: multitasking, title: "Multi-window Experience" },
];

export default function Projects() {
  const [current, setCurrent] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const nextRef = useRef(() => {});

  const previous = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") previous();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setPreviewOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, previous]);

  useEffect(() => {
    if (paused || previewOpen) return;

    intervalRef.current = setInterval(() => {
      nextRef.current();
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [paused, previewOpen]);

  return (
    <Page>
      <div className="h-full overflow-y-auto">
        <div className="p-4 lg:p-5">
          <div
            className="rounded-[28px] border p-6 shadow-2xl backdrop-blur-2xl md:p-8"
            style={{
              background: "var(--window)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
        <div
  className="relative mb-8 overflow-hidden rounded-[28px] border p-8 shadow-2xl backdrop-blur-2xl lg:p-10"
  style={{
    background:
      "linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, var(--window-secondary) 90%), var(--window-secondary))",
    borderColor: "var(--border)",
  }}
>
  <div
    className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl"
    style={{
      background: "color-mix(in srgb, var(--accent) 28%, transparent)",
      opacity: 0.45,
    }}
  />

  <div
    className="absolute -left-24 bottom-0 h-64 w-64 rounded-full blur-3xl"
    style={{
      background: "color-mix(in srgb, var(--accent) 18%, transparent)",
      opacity: 0.3,
    }}
  />

  <div
    className="absolute inset-0 opacity-[0.035]"
    style={{
      backgroundImage:
        "radial-gradient(circle at 1px 1px, var(--text) 1px, transparent 0)",
      backgroundSize: "22px 22px",
    }}
  />

  <div
    className="pointer-events-none absolute inset-x-0 top-0 h-px"
    style={{
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)",
    }}
  />

  <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-center gap-6">
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full border shadow-xl backdrop-blur-2xl"
        style={{
          background: "color-mix(in srgb, var(--window-secondary) 88%, var(--accent) 12%)",
          borderColor: "var(--border)",
        }}
      >
        <HiCommandLine className="h-11 w-11" style={{ color: "var(--accent)" }} />
      </div>
      <div>
        <h1 className="text-3xl font-bold lg:text-5xl" style={{ color: "var(--text)" }}>
          K_OS Portfolio
        </h1>
        <p className="mt-3 max-w-2xl leading-7" style={{ color: "var(--text-secondary)" }}>
          A macOS Tahoe-inspired interactive desktop experience built with React, Vite, and modern frontend technologies.
        </p>
      </div>
    </div>

    <div className="flex flex-wrap gap-3">
      {['React','Vite','8 Screens','Desktop UI'].map((chip)=>(
        <span
          key={chip}
          className="rounded-full border px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background:"color-mix(in srgb, var(--window-secondary) 86%, var(--accent) 14%)",
            borderColor:"var(--border)",
            color:"var(--text)",
          }}
        >
          {chip}
        </span>
      ))}
    </div>
  </div>
</div>
        <div className="flex flex-col gap-8 xl:flex-row">
          <div className="w-full xl:w-3/5">
            <div
              className="group relative aspect-video w-full overflow-hidden rounded-2xl border flex items-center justify-center"
              style={{
                background: "var(--window-secondary)",
                borderColor: "var(--border)",
              }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <button
                onClick={previous}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
                aria-label="Previous screenshot"
              >
                <FiChevronLeft size={24} />
              </button>

              <div
                className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {screenshots.map((shot) => (
                  <img
                    key={shot.title}
                    src={shot.image}
                    alt={shot.title}
                    onClick={() => setPreviewOpen(true)}
                    className="h-full min-w-full cursor-zoom-in select-none object-contain transition-all duration-300 group-hover:scale-[1.025] group-hover:brightness-105"
                    draggable={false}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
                aria-label="Next screenshot"
              >
                <FiChevronRight size={24} />
              </button>

              <div className="absolute left-4 top-4 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-md select-none pointer-events-none">
                {screenshots[current].title}
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-3 w-3 rounded-full transition ${
                      index === current
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`Go to screenshot ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-3 overflow-x-auto pb-2 px-1">
              {screenshots.map((shot, index) => (
                <button
                  key={shot.title}
                  onClick={() => setCurrent(index)}
                  className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                    current === index
                      ? "ring-2 ring-[color:var(--accent)] scale-110 shadow-lg"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{ borderColor: "var(--border)" }}
                  aria-label={`Open ${shot.title}`}
                >
                  <img
                    src={shot.image}
                    alt={shot.title}
                    className="h-14 w-24 object-cover transition-transform duration-200"
                    draggable={false}
                  />
                </button>
              ))}
            </div>

          </div>

          <div className="flex flex-1 flex-col">

            <div className="mt-5 flex flex-wrap gap-2">
              {['React','JavaScript','Vite','HTML','CSS'].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full px-3 py-1 text-sm"
                  style={{
                    background: "var(--window-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className="mt-6 leading-7" style={{ color: "var(--text-secondary)" }}>
              A fully interactive macOS-inspired desktop portfolio featuring draggable windows, Finder, Dock, Control Center, Resume Preview, Settings, wallpaper customization, light/dark mode, and desktop-like interactions built with React and Vite.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://k-os-portfolio.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg px-5 py-2 font-medium text-white transition hover:brightness-110"
                style={{ background: "var(--accent)" }}
              >
                Live Demo
              </a>

              <a
                href="https://github.com/ksvxydv/keshavs-workspace"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border px-5 py-2 transition"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--toolbar)",
                  color: "var(--text)",
                }}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 pb-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            'Finder & Desktop',
            'Dock & Window Manager',
            'Resume Preview',
            'Contacts & About',
            'Theme & Wallpapers',
            'Responsive UI',
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                borderColor: "var(--border)",
                background: "var(--window-secondary)",
              }}
            >
              <h3 className="font-semibold">{feature}</h3>
            </div>
          ))}
        </div>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] transition-all duration-300 ease-out"
            style={{
              transform: previewOpen ? "scale(1)" : "scale(0.96)",
              opacity: previewOpen ? 1 : 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={screenshots[current].image}
              alt={screenshots[current].title}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl select-none cursor-zoom-out"
              onClick={() => setPreviewOpen(false)}
              draggable={false}
            />

            <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-md select-none">
              {screenshots[current].title}
            </div>

            <button
              onClick={previous}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition hover:scale-110 opacity-90 hover:opacity-100"
            >
              <FiChevronLeft size={24} />
            </button>

            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition hover:scale-110 opacity-90 hover:opacity-100"
            >
              <FiChevronRight size={24} />
            </button>

            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-2 text-sm text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Page>
  );
}
