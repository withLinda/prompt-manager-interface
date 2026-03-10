import { FileText, PenSquare } from "lucide-react";

interface PromptComposerProps {
  currentFolderName: string;
  draftFileName: string;
  draftText: string;
  onDraftFileNameChange: (value: string) => void;
  onDraftTextChange: (value: string) => void;
  onSubmit: () => void;
}

export function PromptComposer({
  currentFolderName,
  draftFileName,
  draftText,
  onDraftFileNameChange,
  onDraftTextChange,
  onSubmit,
}: PromptComposerProps) {
  return (
    <section className="pm-surface-strong p-5 sm:p-6 lg:p-7">
      <div className="mb-6">
        <div>
          <p className="pm-kicker">Compose</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
            Add a prompt to {currentFolderName}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Save quick snippets, long prompts, or file-based notes.</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            <FileText className="h-3.5 w-3.5" />
            Optional file name
          </span>
          <input
            type="text"
            name="draft-file-name"
            value={draftFileName}
            onChange={(event) => onDraftFileNameChange(event.target.value)}
            placeholder="Example: claude-system.md"
            className="pm-field"
          />
        </label>

        <label className="block">
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            <PenSquare className="h-3.5 w-3.5" />
            Prompt text
          </span>
          <textarea
            wrap="soft"
            rows={10}
            name="draft-prompt-text"
            value={draftText}
            onChange={(event) => onDraftTextChange(event.target.value)}
            placeholder={`Write a prompt for "${currentFolderName}"...`}
            className="pm-textarea y-auto-x-hidden wrap-anywhere"
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                onSubmit();
              }
            }}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-line/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Press Ctrl+Enter or Cmd+Enter to save quickly.</p>
        <button type="button" onClick={onSubmit} className="pm-button-primary">
          Save prompt
        </button>
      </div>
    </section>
  );
}
