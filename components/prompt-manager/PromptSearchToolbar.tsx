import React from "react";
import { Download, Search, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptSearchToolbarProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  searchScope: "current" | "all";
  totalPromptCount: number;
  onSearchQueryChange: (value: string) => void;
  onSearchScopeChange: (scope: "current" | "all") => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PromptSearchToolbar({
  fileInputRef,
  searchQuery,
  searchScope,
  totalPromptCount,
  onSearchQueryChange,
  onSearchScopeChange,
  onExport,
  onImport,
}: PromptSearchToolbarProps) {
  return (
    <section className="pm-surface mt-6 p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex-1">
          <p className="pm-kicker">Search</p>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              name="prompt-search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search prompt text or file names..."
              className="pm-field pl-11"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="inline-flex rounded-[12px] border border-line/60 bg-white/75 p-0.5 shadow-soft">
            <button
              type="button"
              onClick={() => onSearchScopeChange("current")}
              className={cn("pm-tab", searchScope === "current" && "pm-tab-active")}
            >
              Current folder
            </button>
            <button
              type="button"
              onClick={() => onSearchScopeChange("all")}
              className={cn("pm-tab", searchScope === "all" && "pm-tab-active")}
            >
              All folders
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onExport}
              disabled={totalPromptCount === 0}
              className="pm-button-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="pm-button-secondary"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
