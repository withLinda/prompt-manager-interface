import { Menu, MoonStar, PanelLeft, PanelLeftClose, SunMedium } from "lucide-react";

interface PromptHeaderProps {
  sidebarVisible: boolean;
  theme: "dark" | "light";
  themeReady: boolean;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
}

export function PromptHeader({
  sidebarVisible,
  theme,
  themeReady,
  onToggleSidebar,
  onToggleTheme,
}: PromptHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-5 lg:mb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="pm-icon-button mt-1"
          aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
        >
          <span className="hidden lg:inline">{sidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}</span>
          <span className="lg:hidden">
            <Menu className="h-4 w-4" />
          </span>
        </button>

        <div>
          <p className="pm-kicker">Local-first prompt library</p>
          <h1 className="mt-2 font-display text-5xl italic leading-none tracking-[-0.04em] text-ink sm:text-6xl">
            Prompt Manager
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">Write, store, and reuse prompts in one calm workspace.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        className="pm-button-secondary self-start"
        aria-label={themeReady ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Switch theme"}
      >
        {theme === "dark" ? (
          <MoonStar className="h-4 w-4 text-accentGold" />
        ) : (
          <SunMedium className="h-4 w-4 text-accent" />
        )}
        <span className="whitespace-nowrap" suppressHydrationWarning>
          {themeReady ? `Theme: ${theme === "dark" ? "Dark" : "Light"}` : "Theme"}
        </span>
      </button>
    </header>
  );
}
