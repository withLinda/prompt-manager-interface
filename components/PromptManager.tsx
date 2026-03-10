"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { Folder as FolderType, Prompt, PromptWithFolder, ExportData } from "@/types/prompt";
import { cn } from "@/lib/utils";
import { PromptComposer } from "@/components/prompt-manager/PromptComposer";
import { PromptHeader } from "@/components/prompt-manager/PromptHeader";
import { PromptSearchToolbar } from "@/components/prompt-manager/PromptSearchToolbar";
import { PromptSidebar } from "@/components/prompt-manager/PromptSidebar";
import { PromptCard } from "@/components/prompt-manager/PromptCard";
import { EmptyPromptState } from "@/components/prompt-manager/EmptyPromptState";

const initialFolders: FolderType[] = [
  {
    id: "uncategorized",
    name: "Uncategorized",
    isDefault: true,
    createdAt: new Date().toISOString(),
    prompts: [],
  },
];

export default function PromptManager() {
  const [folders, setFolders] = useLocalStorage<FolderType[]>("prompt-folders", initialFolders);
  const [activeFolder, setActiveFolder] = useLocalStorage<string>("active-folder", "uncategorized");
  const [draftText, setDraftText] = useState("");
  const [draftFileName, setDraftFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<"current" | "all">("current");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editFileName, setEditFileName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [movingPromptId, setMovingPromptId] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      if (desktop) {
        setMobileSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!folders.find((folder) => folder.id === activeFolder)) {
      setActiveFolder("uncategorized");
    }
  }, [folders, activeFolder, setActiveFolder]);

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileSidebarOpen]);

  const currentFolder = folders.find((folder) => folder.id === activeFolder);

  const getAllPrompts = (): PromptWithFolder[] => {
    return folders.flatMap((folder) =>
      folder.prompts.map((prompt) => ({
        ...prompt,
        folderId: folder.id,
        folderName: folder.name,
      })),
    );
  };

  const handleSubmit = () => {
    if (!draftText.trim()) {
      return;
    }

    const newPrompt: Prompt = {
      id: Date.now(),
      text: draftText.trim(),
      fileName: draftFileName.trim() || null,
      timestamp: new Date().toISOString(),
    };

    setFolders(
      folders.map((folder) =>
        folder.id === activeFolder
          ? { ...folder, prompts: [newPrompt, ...folder.prompts] }
          : folder,
      ),
    );
    setDraftText("");
    setDraftFileName("");
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      return;
    }

    const newFolder: FolderType = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      createdAt: new Date().toISOString(),
      prompts: [],
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setShowNewFolder(false);
    setActiveFolder(newFolder.id);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find((folder) => folder.id === folderId);
    if (!folderToDelete || folderToDelete.isDefault) {
      return;
    }

    setFolders(
      folders
        .map((folder) => {
          if (folder.id === "uncategorized") {
            return {
              ...folder,
              prompts: [...folderToDelete.prompts, ...folder.prompts],
            };
          }

          return folder;
        })
        .filter((folder) => folder.id !== folderId),
    );

    if (activeFolder === folderId) {
      setActiveFolder("uncategorized");
    }
  };

  const handleRenameFolder = (folderId: string) => {
    if (!editFolderName.trim()) {
      return;
    }

    setFolders(
      folders.map((folder) =>
        folder.id === folderId ? { ...folder, name: editFolderName.trim() } : folder,
      ),
    );
    setEditingFolderId(null);
    setEditFolderName("");
  };

  const handleMovePrompt = (promptId: number, targetFolderId: string) => {
    if (!targetFolderId) {
      return;
    }

    let promptToMove: Prompt | null = null;

    const updatedFolders = folders.map((folder) => {
      const promptIndex = folder.prompts.findIndex((prompt) => prompt.id === promptId);
      if (promptIndex === -1) {
        return folder;
      }

      promptToMove = folder.prompts[promptIndex];
      return {
        ...folder,
        prompts: folder.prompts.filter((prompt) => prompt.id !== promptId),
      };
    });

    if (promptToMove) {
      setFolders(
        updatedFolders.map((folder) =>
          folder.id === targetFolderId
            ? { ...folder, prompts: [promptToMove!, ...folder.prompts] }
            : folder,
        ),
      );
    }

    setMovingPromptId(null);
  };

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleDeletePrompt = (promptId: number) => {
    setFolders(
      folders.map((folder) => ({
        ...folder,
        prompts: folder.prompts.filter((prompt) => prompt.id !== promptId),
      })),
    );
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingId(prompt.id);
    setEditText(prompt.text);
    setEditFileName(prompt.fileName || "");
    setMovingPromptId(null);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) {
      return;
    }

    setFolders(
      folders.map((folder) => ({
        ...folder,
        prompts: folder.prompts.map((prompt) =>
          prompt.id === editingId
            ? { ...prompt, text: editText.trim(), fileName: editFileName.trim() || null }
            : prompt,
        ),
      })),
    );
    setEditingId(null);
    setEditText("");
    setEditFileName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditFileName("");
  };

  const handleExport = () => {
    const exportData: ExportData = {
      version: "2.0",
      folders,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `prompts_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const importedData = JSON.parse(loadEvent.target?.result as string);

        if (importedData.version === "2.0" && importedData.folders) {
          setFolders(importedData.folders);
          setActiveFolder(importedData.folders[0]?.id || "uncategorized");
        } else if (Array.isArray(importedData)) {
          setFolders([
            {
              id: "uncategorized",
              name: "Uncategorized",
              isDefault: true,
              createdAt: new Date().toISOString(),
              prompts: importedData,
            },
          ]);
          setActiveFolder("uncategorized");
        } else {
          window.alert("Invalid JSON format.");
        }
      } catch (error) {
        window.alert("Failed to parse JSON file.");
      }
    };

    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setActiveFolder(folderId);
    if (!isDesktop) {
      setMobileSidebarOpen(false);
    }
  };

  const filteredPrompts: Array<Prompt | PromptWithFolder> =
    searchScope === "all"
      ? getAllPrompts().filter(
          (prompt) =>
            prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (prompt.fileName && prompt.fileName.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : currentFolder?.prompts.filter(
          (prompt) =>
            prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (prompt.fileName && prompt.fileName.toLowerCase().includes(searchQuery.toLowerCase())),
        ) || [];

  const totalPromptCount = folders.reduce((sum, folder) => sum + folder.prompts.length, 0);
  const sidebarVisible = isDesktop ? desktopSidebarOpen : mobileSidebarOpen;

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-8rem] h-[22rem] w-[22rem] rounded-full bg-white/70 blur-3xl" />
        <div className="absolute right-[-6rem] top-[10rem] h-[20rem] w-[20rem] rounded-full bg-accentSoft/70 blur-3xl animate-drift" />
        <div className="absolute bottom-[-7rem] left-[20%] h-[18rem] w-[18rem] rounded-full bg-[#dce4ef]/80 blur-3xl animate-drift-reverse" />
      </div>

      {!isDesktop && mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-[#17120c]/30 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="relative flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[320px] overflow-hidden transition-[width,transform] duration-500 ease-out lg:relative lg:z-20 lg:max-w-none",
            isDesktop
              ? desktopSidebarOpen
                ? "translate-x-0 lg:w-[320px]"
                : "-translate-x-full lg:translate-x-0 lg:w-0"
              : mobileSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full",
          )}
        >
          <PromptSidebar
            folders={folders}
            activeFolder={activeFolder}
            totalPromptCount={totalPromptCount}
            isDesktop={isDesktop}
            showNewFolder={showNewFolder}
            newFolderName={newFolderName}
            editingFolderId={editingFolderId}
            editFolderName={editFolderName}
            onClose={() => {
              if (isDesktop) {
                setDesktopSidebarOpen(false);
              } else {
                setMobileSidebarOpen(false);
              }
            }}
            onFolderSelect={handleFolderSelect}
            onStartNewFolder={() => {
              setShowNewFolder(true);
              setEditingFolderId(null);
            }}
            onNewFolderNameChange={setNewFolderName}
            onCreateFolder={handleCreateFolder}
            onCancelNewFolder={() => {
              setShowNewFolder(false);
              setNewFolderName("");
            }}
            onStartEditFolder={(folderId, folderName) => {
              setEditingFolderId(folderId);
              setEditFolderName(folderName);
              setShowNewFolder(false);
            }}
            onEditFolderNameChange={setEditFolderName}
            onRenameFolder={handleRenameFolder}
            onCancelEditFolder={() => {
              setEditingFolderId(null);
              setEditFolderName("");
            }}
            onDeleteFolder={handleDeleteFolder}
          />
        </aside>

        <main className="relative z-10 flex-1">
          <div className="mx-auto flex min-h-screen w-full max-w-[1720px] flex-col px-4 pb-8 pt-4 sm:px-6 sm:pb-10 lg:px-10 lg:pb-12 lg:pt-8 xl:px-12">
            <div className="w-full max-w-[1360px]">
              <PromptHeader
                sidebarVisible={sidebarVisible}
                onToggleSidebar={() => {
                  if (isDesktop) {
                    setDesktopSidebarOpen((open) => !open);
                  } else {
                    setMobileSidebarOpen(true);
                  }
                }}
              />

              <PromptComposer
                currentFolderName={currentFolder?.name || "Uncategorized"}
                draftFileName={draftFileName}
                draftText={draftText}
                onDraftFileNameChange={setDraftFileName}
                onDraftTextChange={setDraftText}
                onSubmit={handleSubmit}
              />

              <PromptSearchToolbar
                fileInputRef={fileInputRef}
                searchQuery={searchQuery}
                searchScope={searchScope}
                totalPromptCount={totalPromptCount}
                onSearchQueryChange={setSearchQuery}
                onSearchScopeChange={setSearchScope}
                onExport={handleExport}
                onImport={handleImport}
              />

              <section className="mt-6 flex-1">
                {filteredPrompts.length === 0 ? (
                  <EmptyPromptState
                    currentFolderName={currentFolder?.name || "Uncategorized"}
                    searchQuery={searchQuery}
                    searchScope={searchScope}
                  />
                ) : (
                  <div className="space-y-4">
                    {filteredPrompts.map((prompt) => (
                      <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        folders={folders}
                        activeFolder={activeFolder}
                        searchScope={searchScope}
                        copiedId={copiedId}
                        movingPromptId={movingPromptId}
                        editingId={editingId}
                        editText={editText}
                        editFileName={editFileName}
                        onMovePrompt={handleMovePrompt}
                        onStartMovePrompt={setMovingPromptId}
                        onCancelMovePrompt={() => setMovingPromptId(null)}
                        onCopy={handleCopy}
                        onEdit={handleEditPrompt}
                        onDelete={handleDeletePrompt}
                        onEditTextChange={setEditText}
                        onEditFileNameChange={setEditFileName}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                      />
                    ))}
                  </div>
                )}
              </section>

              <footer className="mt-6 rounded-[16px] border border-line/60 bg-white/70 px-5 py-4 text-sm text-muted shadow-soft backdrop-blur-xl">
                Prompts stay private to this browser session. Export creates a portable JSON backup, and
                import works with both the current folder-based format and the older flat list.
              </footer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
