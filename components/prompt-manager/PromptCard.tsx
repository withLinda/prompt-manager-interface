import { Check, Copy, Edit3, FileText, FolderOpen, Move, Trash2, X } from "lucide-react";
import { Folder as FolderType, Prompt, PromptWithFolder } from "@/types/prompt";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  prompt: Prompt | PromptWithFolder;
  folders: FolderType[];
  activeFolder: string;
  searchScope: "current" | "all";
  copiedId: number | null;
  movingPromptId: number | null;
  editingId: number | null;
  editText: string;
  editFileName: string;
  onMovePrompt: (promptId: number, targetFolderId: string) => void;
  onStartMovePrompt: (promptId: number | null) => void;
  onCancelMovePrompt: () => void;
  onCopy: (text: string, id: number) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (promptId: number) => void;
  onEditTextChange: (value: string) => void;
  onEditFileNameChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

function isPromptWithFolder(prompt: Prompt | PromptWithFolder): prompt is PromptWithFolder {
  return "folderId" in prompt && "folderName" in prompt;
}

function renderHighlightedText(text: string) {
  const splitter = /(\S*\/\S+\.\w+|\b\w+\.\w+\b)/g;
  const tokenPattern = /^(\S*\/\S+\.\w+|\b\w+\.\w+\b)$/;

  return text.split(splitter).map((part, index) => {
    if (tokenPattern.test(part)) {
      return (
        <span key={`${part}-${index}`} className="font-semibold text-accentGold">
          {part}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export function PromptCard({
  prompt,
  folders,
  activeFolder,
  searchScope,
  copiedId,
  movingPromptId,
  editingId,
  editText,
  editFileName,
  onMovePrompt,
  onStartMovePrompt,
  onCancelMovePrompt,
  onCopy,
  onEdit,
  onDelete,
  onEditTextChange,
  onEditFileNameChange,
  onSaveEdit,
  onCancelEdit,
}: PromptCardProps) {
  const isEditing = editingId === prompt.id;
  const isMoving = movingPromptId === prompt.id;
  const sourceFolderId = isPromptWithFolder(prompt) ? prompt.folderId : activeFolder;
  const promptDate = new Date(prompt.timestamp).toLocaleString();
  const lineCount = prompt.text.split("\n").length;
  const characterCount = prompt.text.length;

  return (
    <article className="pm-surface group p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {prompt.fileName && (
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-accent/25 bg-accent/18 px-3 py-1 text-xs font-medium text-accent">
                <FileText className="h-3.5 w-3.5" />
                <span className="max-w-[16rem] truncate">{prompt.fileName}</span>
              </span>
            )}
            {searchScope === "all" && isPromptWithFolder(prompt) && (
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-line/60 bg-surfaceStrong/88 px-3 py-1 text-xs font-medium text-muted">
                <FolderOpen className="h-3.5 w-3.5 text-accentGold" />
                {prompt.folderName}
              </span>
            )}
            <span className="rounded-[8px] border border-line/60 bg-surfaceNested/78 px-3 py-1 text-xs font-medium text-muted">
              {lineCount} lines
            </span>
            <span className="rounded-[8px] border border-line/60 bg-surfaceNested/78 px-3 py-1 text-xs font-medium text-muted">
              {characterCount} chars
            </span>
          </div>

          <p className="mt-3 text-sm text-muted">{promptDate}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isMoving ? (
            <>
              <select
                onChange={(event) => onMovePrompt(prompt.id, event.target.value)}
                className="pm-field min-w-[180px] text-sm"
                defaultValue=""
                autoFocus
              >
                <option value="" disabled>
                  Move to folder...
                </option>
                {folders
                  .filter((folder) => folder.id !== sourceFolderId)
                  .map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
              </select>
              <button type="button" onClick={onCancelMovePrompt} className="pm-icon-button" aria-label="Cancel move">
                <X className="h-4 w-4" />
              </button>
            </>
          ) : isEditing ? (
            <>
              <button type="button" onClick={onSaveEdit} className="pm-button-primary">
                <Check className="h-4 w-4" />
                Save
              </button>
              <button type="button" onClick={onCancelEdit} className="pm-button-secondary">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => onCopy(prompt.text, prompt.id)} className="pm-icon-button" aria-label="Copy prompt">
                {copiedId === prompt.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => onStartMovePrompt(prompt.id)} className="pm-icon-button" aria-label="Move prompt">
                <Move className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => onEdit(prompt)} className="pm-icon-button" aria-label="Edit prompt">
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this prompt?")) {
                    onDelete(prompt.id);
                  }
                }}
                className="pm-icon-button text-danger hover:text-danger"
                aria-label="Delete prompt"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-line/70 pt-4">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editFileName}
              onChange={(event) => onEditFileNameChange(event.target.value)}
              placeholder="Optional file name"
              className="pm-field"
            />
            <textarea
              wrap="soft"
              value={editText}
              onChange={(event) => onEditTextChange(event.target.value)}
              rows={Math.max(5, editText.split("\n").length + 1)}
              className="pm-textarea y-auto-x-hidden wrap-anywhere font-mono text-[13px] leading-6 sm:text-sm"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  onSaveEdit();
                }
                if (event.key === "Escape") {
                  onCancelEdit();
                }
              }}
            />
          </div>
        ) : (
          <pre
            className={cn(
              "overflow-x-auto rounded-[12px] border border-line/60 bg-surfaceSubtle/92 p-4 font-mono text-[13px] leading-6 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:text-sm",
              "pm-scrollbar whitespace-pre-wrap break-words",
            )}
          >
            {renderHighlightedText(prompt.text)}
          </pre>
        )}
      </div>
    </article>
  );
}
