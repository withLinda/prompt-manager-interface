import {
  Edit3,
  Folder,
  FolderOpen,
  FolderPlus,
  LibraryBig,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Folder as FolderType } from "@/types/prompt";
import { cn } from "@/lib/utils";

interface PromptSidebarProps {
  folders: FolderType[];
  activeFolder: string;
  totalPromptCount: number;
  isDesktop: boolean;
  showNewFolder: boolean;
  newFolderName: string;
  editingFolderId: string | null;
  editFolderName: string;
  onClose: () => void;
  onFolderSelect: (folderId: string) => void;
  onStartNewFolder: () => void;
  onNewFolderNameChange: (value: string) => void;
  onCreateFolder: () => void;
  onCancelNewFolder: () => void;
  onStartEditFolder: (folderId: string, folderName: string) => void;
  onEditFolderNameChange: (value: string) => void;
  onRenameFolder: (folderId: string) => void;
  onCancelEditFolder: () => void;
  onDeleteFolder: (folderId: string) => void;
}

export function PromptSidebar({
  folders,
  activeFolder,
  totalPromptCount,
  isDesktop,
  showNewFolder,
  newFolderName,
  editingFolderId,
  editFolderName,
  onClose,
  onFolderSelect,
  onStartNewFolder,
  onNewFolderNameChange,
  onCreateFolder,
  onCancelNewFolder,
  onStartEditFolder,
  onEditFolderNameChange,
  onRenameFolder,
  onCancelEditFolder,
  onDeleteFolder,
}: PromptSidebarProps) {
  return (
    <div className="flex h-full w-[88vw] max-w-[320px] flex-col border-r border-line/60 bg-[rgba(250,246,240,0.82)] px-4 py-4 shadow-[0_22px_54px_rgba(43,34,24,0.11)] backdrop-blur-2xl lg:w-[320px]">
      <div className="flex items-start justify-between gap-3 border-b border-line/70 pb-5">
        <div>
          <p className="pm-kicker">Workspace</p>
          <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-[-0.03em] text-ink">
            <LibraryBig className="h-5 w-5 text-accent" />
            Library
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">Organize prompts by folder.</p>
        </div>

        <button type="button" onClick={onClose} className="pm-icon-button" aria-label={isDesktop ? "Hide sidebar" : "Close sidebar"}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[12px] border border-line/60 bg-white/80 p-3 shadow-soft">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Prompts</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{totalPromptCount}</p>
        </div>
        <div className="rounded-[12px] border border-line/60 bg-[#fbf8f4] p-3 shadow-soft">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Folders</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{folders.length}</p>
        </div>
      </div>

      <div className="mt-5">
        {showNewFolder ? (
          <div className="rounded-[16px] border border-line/60 bg-white/86 p-4 shadow-soft">
            <label className="block">
              <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                <FolderPlus className="h-3.5 w-3.5" />
                New folder
              </span>
              <input
                type="text"
                value={newFolderName}
                onChange={(event) => onNewFolderNameChange(event.target.value)}
                placeholder="Folder name"
                className="pm-field"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onCreateFolder();
                  }
                  if (event.key === "Escape") {
                    onCancelNewFolder();
                  }
                }}
              />
            </label>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={onCreateFolder} className="pm-button-primary flex-1 justify-center">
                Create
              </button>
              <button type="button" onClick={onCancelNewFolder} className="pm-button-secondary flex-1 justify-center">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={onStartNewFolder} className="pm-button-primary w-full justify-center">
            <Plus className="h-4 w-4" />
            New folder
          </button>
        )}
      </div>

      <div className="pm-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Folders</p>
          <span className="inline-flex items-center gap-1 rounded-[8px] border border-line/60 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-muted shadow-soft">
            <Sparkles className="h-3 w-3 text-gold" />
            Local only
          </span>
        </div>

        <div className="space-y-2">
          {folders.map((folder) => {
            const isActive = activeFolder === folder.id;
            const isEditing = editingFolderId === folder.id;

            return (
              <div key={folder.id} className="rounded-[12px] border border-transparent">
                {isEditing ? (
                  <div className="rounded-[16px] border border-line/60 bg-white/86 p-4 shadow-soft">
                    <input
                      type="text"
                      value={editFolderName}
                      onChange={(event) => onEditFolderNameChange(event.target.value)}
                      className="pm-field"
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          onRenameFolder(folder.id);
                        }
                        if (event.key === "Escape") {
                          onCancelEditFolder();
                        }
                      }}
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onRenameFolder(folder.id)}
                        className="pm-button-primary flex-1 justify-center"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={onCancelEditFolder}
                        className="pm-button-secondary flex-1 justify-center"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "group relative flex items-center gap-2 rounded-[12px] border p-2 transition-all duration-300",
                      isActive
                        ? "border-[#cdbdab] bg-white/90 shadow-panel"
                        : "border-line/50 bg-white/60 shadow-soft hover:border-[#cbbdac] hover:bg-white/75",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onFolderSelect(folder.id)}
                      className={cn(
                        "flex flex-1 items-start gap-3 rounded-[10px] px-3 py-2.5 text-left",
                        !folder.isDefault && "sm:pr-12",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border",
                          isActive
                            ? "border-[#e0d4c7] bg-accentSoft text-accent"
                            : "border-line/70 bg-white/80 text-muted",
                        )}
                      >
                        {isActive ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="pm-clamp-2 block text-sm font-semibold leading-5 text-ink">
                          {folder.name}
                        </span>
                        <span className="mt-1.5 block text-xs text-muted">
                          {folder.prompts.length} prompt{folder.prompts.length === 1 ? "" : "s"}
                        </span>
                      </span>
                    </button>

                    {!folder.isDefault && (
                      <div className="flex shrink-0 gap-1 pr-1 opacity-100 transition-opacity sm:absolute sm:right-3 sm:top-1/2 sm:z-10 sm:-translate-y-1/2 sm:pr-0 sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto">
                        <button
                          type="button"
                          onClick={() => onStartEditFolder(folder.id, folder.name)}
                          className="pm-icon-button"
                          aria-label={`Rename ${folder.name}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete "${folder.name}"? Prompts will be moved to Uncategorized.`,
                              )
                            ) {
                              onDeleteFolder(folder.id);
                            }
                          }}
                          className="pm-icon-button text-danger hover:text-danger"
                          aria-label={`Delete ${folder.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
