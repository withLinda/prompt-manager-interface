import { SearchX, Sparkles } from "lucide-react";

interface EmptyPromptStateProps {
  currentFolderName: string;
  searchQuery: string;
  searchScope: "current" | "all";
}

export function EmptyPromptState({
  currentFolderName,
  searchQuery,
  searchScope,
}: EmptyPromptStateProps) {
  const description = searchQuery
    ? `No prompts matched "${searchQuery}" in ${searchScope === "all" ? "all folders" : "the current folder"}.`
    : `There are no prompts in "${currentFolderName}" yet. Add one from the composer above.`;

  return (
    <div className="pm-surface flex flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-line/70 bg-white/85 shadow-soft">
        {searchQuery ? (
          <SearchX className="h-7 w-7 text-[#5d728d]" />
        ) : (
          <Sparkles className="h-7 w-7 text-gold" />
        )}
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-ink">Nothing here yet</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">{description}</p>
    </div>
  );
}
