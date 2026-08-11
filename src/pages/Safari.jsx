import { useState, useContext } from "react";
import Page from "../components/ui/Page";
import { WindowManagerContext } from "../core/window/WindowManagerContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiFolder,
  FiFileText,
  FiCpu,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCw,
  FiPlus,
} from "react-icons/fi";
import githubLogo from "../assets/social/githubLogo.svg";
import linkedinLogo from "../assets/social/linkedinLogo.png";
import leetcodeLogo from "../assets/social/leetcodeLogo.png";
import codeforcesLogo from "../assets/social/codeforceslogo.png";
import resumePdf from "../assets/Keshav_Resume.pdf";

const favorites = [
  { title: "GitHub",     type: "image",     icon: githubLogo,     url: "https://github.com/Ksvxydv" },
  { title: "LinkedIn",   type: "image",     icon: linkedinLogo,   url: "https://linkedin.com" },
  { title: "LeetCode",   type: "image",     icon: leetcodeLogo,   url: "https://leetcode.com" },
  { title: "Codeforces", type: "image",     icon: codeforcesLogo, url: "https://codeforces.com" },
  { title: "Resume",     type: "component", icon: FiFileText,     url: resumePdf, query: "resume" },
  { title: "Projects",   type: "component", icon: FiFolder,       query: "projects" },
  { title: "Contact",    type: "component", icon: FiUser,         query: "contact" },
  { title: "Skills",     type: "component", icon: FiCpu,          query: "skills" },
];

const quickLinks = ["about", "skills", "education", "contact"];

/** Small nav button used in the toolbar — uses CSS vars for hover */
function NavBtn({ onClick, disabled, children, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-full p-2 transition-all duration-150 disabled:opacity-40"
      style={{ color: "var(--text)" }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}

export default function Safari() {
  const { openWindow } = useContext(WindowManagerContext);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabs, setTabs] = useState([{ id: 1, title: "Start Page", query: "", result: null }]);
  const [activeTab, setActiveTab] = useState(1);

  function updateActiveTab(data) {
    setTabs((prev) => prev.map((tab) => tab.id === activeTab ? { ...tab, ...data } : tab));
  }

  function isValidUrl(value) {
    return /^(https?:\/\/|www\.)/i.test(value) || /^[a-z0-9-]+(\.[a-z]{2,})+/i.test(value);
  }

  function handleSearch(searchText = query) {
    if (searchText.trim()) {
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push(searchText);
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }

    const q = searchText.trim().toLowerCase();

    updateActiveTab({
      query: searchText,
      title: searchText.trim().length > 0
        ? searchText.charAt(0).toUpperCase() + searchText.slice(1)
        : "Start Page",
    });

    if (isValidUrl(searchText)) {
      const url = searchText.startsWith("http") ? searchText : `https://${searchText.replace(/^www\./, "www.")}`;
      window.open(url, "_blank");
      const data = { title: "Opening Website", text: `Opening ${url}` };
      setResult(data);
      updateActiveTab({ result: data });
      return;
    }

    switch (q) {
      case "github":
      case "open github":
        window.open("https://github.com/Ksvxydv", "_blank");
        return;
      case "linkedin":
        window.open("https://linkedin.com", "_blank");
        return;
      case "resume":
      case "cv":
        window.open(resumePdf, "_blank");
        return;
      case "about": {
        const data = { title: "About Me", appId: "about", text: "I'm a Computer Science & Engineering student at MNNIT Allahabad with a passion for software engineering, UI/UX design, competitive programming, and building polished applications inspired by macOS." };
        setResult(data); updateActiveTab({ result: data }); return;
      }
      case "skills": {
        const data = { title: "Skills", appId: "skills", text: "Explore my Skills app to see the technologies and tools I work with." };
        setResult(data); updateActiveTab({ result: data }); return;
      }
      case "education": {
        const data = { title: "Education", appId: "education", text: "I'm currently pursuing B.Tech in Computer Science & Engineering at MNNIT Allahabad." };
        setResult(data); updateActiveTab({ result: data }); return;
      }
      case "projects": {
        const data = { title: "Projects", appId: "projects", text: "I'm currently building real-world projects. They'll appear here soon." };
        setResult(data); updateActiveTab({ result: data }); return;
      }
      case "contact": {
        const data = { title: "Contact", appId: "contact", text: "Open the Contact app from the Dock to get in touch with me." };
        setResult(data); updateActiveTab({ result: data }); return;
      }
      default: {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchText)}`;
        window.open(searchUrl, "_blank");
        const data = { title: "Searching Google", text: `Searching Google for "${searchText}"...` };
        setResult(data); updateActiveTab({ result: data });
      }
    }
  }

  function goBack() {
    if (historyIndex <= 0) return;
    const previous = history[historyIndex - 1];
    setHistoryIndex((i) => i - 1);
    setQuery(previous);
    handleSearch(previous);
  }

  function goForward() {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    setHistoryIndex((i) => i + 1);
    setQuery(next);
    handleSearch(next);
  }

  function newTab() {
    const id = Date.now();
    setTabs((prev) => [...prev, { id, title: "New Tab", query: "", result: null }]);
    setActiveTab(id);
    setQuery("");
    setResult(null);
    setHistory([]);
    setHistoryIndex(-1);
  }

  function openFavorite(item) {
    if (item.url) { window.open(item.url, "_blank"); return; }
    setQuery(item.query);
    setResult(null);
    handleSearch(item.query);
  }

  return (
    <Page className="p-0">
      <div
        className="relative flex h-full w-full flex-col overflow-hidden"
        style={{
          background: "var(--window-secondary)",
          color: "var(--text)",
        }}
      >
        <style>{`
          @keyframes pulseGlow {
            0%,100% { transform: scale(1); opacity:.45; }
            50% { transform: scale(1.18); opacity:.95; }
          }
        `}</style>

        {/* ── Tab bar ── */}
        <div
          className="flex items-end gap-1.5 overflow-x-auto px-4 pt-2.5 pb-0"
          style={{
            background: "color-mix(in srgb, var(--toolbar) 90%, transparent)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setQuery(tab.query || "");
                  setResult(tab.result || null);
                }}
                className="relative flex min-w-[160px] max-w-[220px] items-center justify-between rounded-t-xl px-4 py-2 text-[13px] font-medium transition-all duration-150"
                style={{
                  background: isActive
                    ? "var(--window-secondary)"
                    : "color-mix(in srgb, var(--toolbar) 60%, transparent)",
                  color: isActive ? "var(--text)" : "var(--text-secondary)",
                  borderTop: `1px solid ${isActive ? "var(--border)" : "transparent"}`,
                  borderLeft: `1px solid ${isActive ? "var(--border)" : "transparent"}`,
                  borderRight: `1px solid ${isActive ? "var(--border)" : "transparent"}`,
                  borderBottom: isActive ? "1px solid var(--window-secondary)" : "none",
                  marginBottom: isActive ? "-1px" : "0",
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <span className="truncate">{tab.title}</span>
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tabs.length === 1) return;
                    const remaining = tabs.filter((t) => t.id !== tab.id);
                    setTabs(remaining);
                    if (activeTab === tab.id) {
                      setActiveTab(remaining[0].id);
                      setQuery(remaining[0].query || "");
                      setResult(remaining[0].result || null);
                    }
                  }}
                  className="ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs transition-all duration-150"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  ×
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Toolbar / Address Bar ── */}
        <div
          className="flex shrink-0 items-center px-4 py-2.5 border-b"
          style={{
            background: "color-mix(in srgb, var(--toolbar) 92%, transparent)",
            borderColor: "var(--border)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
          }}
        >
          {/* Nav buttons */}
          <div className="flex items-center gap-1 mr-3">
            <NavBtn onClick={goBack} disabled={historyIndex <= 0} label="Go back">
              <FiChevronLeft size={18} />
            </NavBtn>
            <NavBtn onClick={goForward} disabled={historyIndex >= history.length - 1} label="Go forward">
              <FiChevronRight size={18} />
            </NavBtn>
            <NavBtn onClick={() => handleSearch(query)} label="Refresh">
              <FiRotateCw size={17} />
            </NavBtn>
          </div>

          {/* Address pill */}
          <div className="flex flex-1 justify-center">
            <div
              className="flex w-full max-w-xl xl:max-w-2xl items-center gap-3 rounded-full px-5 py-2 transition-all duration-300 focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_25%,transparent)]"
              style={{
                background: "color-mix(in srgb, var(--window-secondary) 80%, transparent)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(28px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)",
              }}
            >
              <FiSearch size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                placeholder="Search or enter website address"
                className="w-full bg-transparent text-[14px] font-medium outline-none"
                style={{
                  color: "var(--text)",
                  caretColor: "var(--accent)",
                }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-3">
            <NavBtn onClick={newTab} label="New tab">
              <FiPlus size={18} />
            </NavBtn>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[200px_1fr]">

          {/* Left sidebar */}
          <aside
            className="hidden lg:flex flex-col min-h-0 overflow-y-auto p-5 border-r"
            style={{
              background: "color-mix(in srgb, var(--sidebar) 94%, transparent)",
              borderColor: "var(--border)",
              backdropFilter: "blur(26px) saturate(170%)",
              WebkitBackdropFilter: "blur(26px) saturate(170%)",
            }}
          >
            <h2
              className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--text-muted)" }}
            >
              K-OS Browser
            </h2>
            <p className="mb-6 text-xs" style={{ color: "var(--text-secondary)" }}>
              Quick access to portfolio sections.
            </p>

            <section>
              <h3
                className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "var(--text-muted)" }}
              >
                Quick Links
              </h3>
              <div className="flex flex-col gap-0.5">
                {quickLinks.map((link) => (
                  <button
                    key={link}
                    onClick={() => { setQuery(link); handleSearch(link); }}
                    className="rounded-lg px-3 py-2 text-left text-[13px] font-medium capitalize transition-all duration-150"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover)"; e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </button>
                ))}
              </div>
            </section>
          </aside>

          {/* Main content */}
          <main
            className="relative flex flex-col min-h-0 overflow-hidden p-4 pb-6"
          >
            <section className="flex flex-1 flex-col min-h-0 mt-2">
              <div
                className="grid flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 gap-3
                  grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                  auto-rows-[100px] sm:auto-rows-[115px] lg:auto-rows-[128px]
                  content-start"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {favorites.map((item) => {
                  const hovered = hoveredCard === item.title;
                  return (
                    <div
                      key={item.title}
                      onClick={() => openFavorite(item)}
                      onMouseEnter={() => setHoveredCard(item.title)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-300"
                      style={{
                        background: hovered
                          ? "color-mix(in srgb, var(--window) 88%, var(--accent) 12%)"
                          : "color-mix(in srgb, var(--window) 72%, transparent)",
                        borderColor: hovered ? "color-mix(in srgb, var(--accent) 30%, var(--border))" : "var(--border)",
                        backdropFilter: "blur(20px)",
                        boxShadow: hovered
                          ? "0 8px 28px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.08)"
                          : "inset 0 1px 0 rgba(255,255,255,.04)",
                        transform: hovered
                          ? "perspective(1000px) rotateX(4deg) translateY(-4px) scale(1.03)"
                          : "perspective(1000px) rotateX(0deg)",
                        transition: "all .35s cubic-bezier(.22,1,.36,1)",
                      }}
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.icon}
                          alt={item.title}
                          className={`mx-auto mb-2 h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110${item.title === "GitHub" ? " github-logo" : ""}`}
                        />
                      ) : (
                        <div
                          className="mx-auto mb-2 flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: "color-mix(in srgb, var(--accent) 14%, var(--window))",
                            border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))",
                            color: "var(--accent)",
                          }}
                        >
                          <item.icon size={20} />
                        </div>
                      )}
                      <h4 className="text-xs sm:text-sm font-semibold" style={{ color: "var(--text)" }}>
                        {item.title}
                      </h4>
                      <p
                        className="mt-0.5 hidden text-[11px] sm:block"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.type === "image" ? "Website" : "Portfolio"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Result overlay */}
            <AnimatePresence>
              {result && (
                <div
                  className="absolute inset-0 z-50 flex items-center justify-center"
                  onClick={() => setResult(null)}
                  style={{
                    background: "rgba(0,0,0,.35)",
                    backdropFilter: "blur(40px) saturate(140%)",
                    WebkitBackdropFilter: "blur(40px) saturate(140%)",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="relative w-[92vw] max-w-xl overflow-hidden rounded-2xl border p-8"
                      style={{
                        background: "var(--glass)",
                        borderColor: "var(--glass-border)",
                        backdropFilter: "blur(32px) saturate(180%)",
                        WebkitBackdropFilter: "blur(32px) saturate(180%)",
                        boxShadow: "0 36px 100px rgba(0,0,0,.40), inset 0 1px 0 var(--glass-border)",
                        color: "var(--text)",
                      }}
                    >
                      {/* Close button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setResult(null); }}
                        className="absolute right-5 top-5 z-30 flex h-9 w-9 items-center justify-center rounded-full border text-[18px] leading-none transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background: "var(--hover)",
                          borderColor: "var(--border)",
                          color: "var(--text-secondary)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 14%, var(--hover))"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--hover)"; }}
                      >
                        ×
                      </button>

                      <h3 className="pr-12 text-2xl font-semibold tracking-tight">
                        {result.title}
                      </h3>
                      <p
                        className="mt-4 text-[15px] leading-7"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {result.text}
                      </p>

                      {result.appId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openWindow(result.appId);
                            setResult(null);
                          }}
                          className="mt-6 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                          style={{ background: "var(--accent)" }}
                        >
                          Open {result.title}
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Page>
  );
}