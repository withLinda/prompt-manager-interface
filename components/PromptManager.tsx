// components/PromptManager.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Copy, Download, Upload, Search, X, Edit3, Check, 
  FolderPlus, Folder, FolderOpen, ChevronRight, 
  Move, Trash2, Home, Plus, FileText, File,
  Menu, ChevronLeft, PanelLeftClose, PanelLeft
} from 'lucide-react';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { Folder as FolderType, Prompt, PromptWithFolder, ExportData } from '@/types/prompt';
import { cn } from '@/lib/utils';

export default function PromptManager() {
  // Initialize with an uncategorized folder for backward compatibility
  const initialFolders: FolderType[] = [
    {
      id: 'uncategorized',
      name: 'Uncategorized',
      isDefault: true,
      createdAt: new Date().toISOString(),
      prompts: []
    }
  ];

  const [folders, setFolders] = useLocalStorage<FolderType[]>('prompt-folders', initialFolders);
  const [activeFolder, setActiveFolder] = useLocalStorage<string>('active-folder', 'uncategorized');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<'current' | 'all'>('current');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [movingPromptId, setMovingPromptId] = useState<number | null>(null);
  const [promptFileName, setPromptFileName] = useState('');
  
  // Responsive sidebar states
  const [isDesktop, setIsDesktop] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      
      if (desktop && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [mobileSidebarOpen]);

  // Ensure active folder exists
  useEffect(() => {
    if (!folders.find(f => f.id === activeFolder)) {
      setActiveFolder('uncategorized');
    }
  }, [folders, activeFolder, setActiveFolder]);

  // Determine if sidebar should be shown
  const sidebarVisible = isDesktop ? desktopSidebarOpen : mobileSidebarOpen;

  // Get current folder
  const currentFolder = folders.find(f => f.id === activeFolder);
  
  // Get all prompts across folders
  const getAllPrompts = (): PromptWithFolder[] => {
    return folders.flatMap(folder => 
      folder.prompts.map(prompt => ({
        ...prompt,
        folderId: folder.id,
        folderName: folder.name
      }))
    );
  };

  // Add a new prompt to current folder
  const handleSubmit = () => {
    if (inputText.trim()) {
      const newPrompt: Prompt = {
        id: Date.now(),
        text: inputText.trim(),
        fileName: promptFileName.trim() || null,
        timestamp: new Date().toISOString()
      };
      
      setFolders(folders.map(folder => 
        folder.id === activeFolder
          ? { ...folder, prompts: [newPrompt, ...folder.prompts] }
          : folder
      ));
      setInputText('');
      setPromptFileName('');
    }
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderType = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        createdAt: new Date().toISOString(),
        prompts: []
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowNewFolder(false);
      setActiveFolder(newFolder.id);
    }
  };

  // Delete folder (move prompts to uncategorized)
  const handleDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find(f => f.id === folderId);
    if (!folderToDelete || folderToDelete.isDefault) return;
    
    setFolders(folders.map(folder => {
      if (folder.id === 'uncategorized') {
        return {
          ...folder,
          prompts: [...folderToDelete.prompts, ...folder.prompts]
        };
      }
      return folder;
    }).filter(f => f.id !== folderId));
    
    if (activeFolder === folderId) {
      setActiveFolder('uncategorized');
    }
  };

  // Rename folder
  const handleRenameFolder = (folderId: string) => {
    if (editFolderName.trim()) {
      setFolders(folders.map(folder => 
        folder.id === folderId
          ? { ...folder, name: editFolderName.trim() }
          : folder
      ));
      setEditingFolderId(null);
      setEditFolderName('');
    }
  };

  // Move prompt to another folder
  const handleMovePrompt = (promptId: number, targetFolderId: string) => {
    let promptToMove: Prompt | null = null;
    
    const updatedFolders = folders.map(folder => {
      const promptIndex = folder.prompts.findIndex(p => p.id === promptId);
      if (promptIndex !== -1) {
        promptToMove = folder.prompts[promptIndex];
        return {
          ...folder,
          prompts: folder.prompts.filter(p => p.id !== promptId)
        };
      }
      return folder;
    });
    
    if (promptToMove) {
      setFolders(updatedFolders.map(folder => 
        folder.id === targetFolderId
          ? { ...folder, prompts: [promptToMove!, ...folder.prompts] }
          : folder
      ));
    }
    
    setMovingPromptId(null);
  };

  // Copy prompt to clipboard
  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Delete a prompt
  const handleDelete = (promptId: number) => {
    setFolders(folders.map(folder => ({
      ...folder,
      prompts: folder.prompts.filter(prompt => prompt.id !== promptId)
    })));
  };

  // Start editing a prompt
  const handleEdit = (id: number, text: string, fileName: string | null) => {
    setEditingId(id);
    setEditText(text);
    setPromptFileName(fileName || '');
  };

  // Save edited prompt
  const handleSaveEdit = () => {
    if (editText.trim()) {
      setFolders(folders.map(folder => ({
        ...folder,
        prompts: folder.prompts.map(prompt => 
          prompt.id === editingId 
            ? { ...prompt, text: editText.trim(), fileName: promptFileName.trim() || null }
            : prompt
        )
      })));
      setEditingId(null);
      setEditText('');
      setPromptFileName('');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setPromptFileName('');
  };

  // Export all data including folder structure
  const handleExport = () => {
    const exportData: ExportData = {
      version: '2.0',
      folders: folders,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompts_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data with backward compatibility
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          
          // Check if it's the new format with folders
          if (importedData.version === '2.0' && importedData.folders) {
            setFolders(importedData.folders);
            setActiveFolder(importedData.folders[0]?.id || 'uncategorized');
          } 
          // Backward compatibility for old format (flat array)
          else if (Array.isArray(importedData)) {
            setFolders([{
              id: 'uncategorized',
              name: 'Uncategorized',
              isDefault: true,
              createdAt: new Date().toISOString(),
              prompts: importedData
            }]);
            setActiveFolder('uncategorized');
          } else {
            alert('Invalid JSON format.');
          }
        } catch (error) {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setActiveFolder(folderId);
    if (!isDesktop) {
      setMobileSidebarOpen(false);
    }
  };

  // Filter prompts based on search query and scope
  const getFilteredPrompts = () => {
    if (searchScope === 'all') {
      return getAllPrompts().filter(prompt =>
        prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prompt.fileName && prompt.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else {
      return currentFolder?.prompts.filter(prompt =>
        prompt.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prompt.fileName && prompt.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || [];
    }
  };

  const filteredPrompts = getFilteredPrompts();
  const totalPromptCount = folders.reduce((sum, folder) => sum + folder.prompts.length, 0);

  return (
    <div className="h-screen flex relative overflow-hidden bg-gradient-to-br from-everforest-bgDim via-everforest-bgGreen to-everforest-bg0">
      {/* Mobile Sidebar Overlay */}
      {!isDesktop && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "h-full transition-all duration-300 flex flex-col overflow-hidden bg-everforest-bg0/95 border-r",
        isDesktop ? (desktopSidebarOpen ? 'w-64' : 'w-0') : (mobileSidebarOpen ? 'w-64' : 'w-0'),
        isDesktop ? 'relative' : 'fixed left-0 top-0 z-50',
        sidebarVisible ? 'border-everforest-grey0/40' : 'border-transparent'
      )}>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-everforest-aqua">
              <FolderPlus className="w-5 h-5 text-everforest-orange" />
              Folders
            </h2>
            <button
              onClick={() => {
                if (isDesktop) {
                  setDesktopSidebarOpen(false);
                } else {
                  setMobileSidebarOpen(false);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-black/10 transition-colors text-everforest-grey1"
              title={isDesktop ? "Hide Sidebar" : "Close"}
            >
              {isDesktop ? <PanelLeftClose className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
          
          {/* New Folder Input */}
          {showNewFolder ? (
            <div className="mb-4 p-2 rounded-lg bg-everforest-bgBlue/50">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="w-full px-2 py-1 rounded text-sm focus:outline-none bg-everforest-bg2/80 text-everforest-fg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') {
                    setShowNewFolder(false);
                    setNewFolderName('');
                  }
                }}
                autoFocus
              />
              <div className="flex gap-1 mt-2">
                <button
                  onClick={handleCreateFolder}
                  className="px-2 py-1 text-xs rounded bg-everforest-green/30 text-everforest-green"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewFolder(false);
                    setNewFolderName('');
                  }}
                  className="px-2 py-1 text-xs rounded bg-everforest-red/30 text-everforest-red"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewFolder(true)}
              className="w-full mb-4 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:shadow-md bg-gradient-to-r from-everforest-purple/30 to-everforest-blue/30 text-everforest-purple border border-everforest-purple/40"
            >
              <Plus className="w-4 h-4" />
              New Folder
            </button>
          )}
          
          {/* Folder List */}
          <div className="space-y-1">
            {folders.map((folder) => (
              <div key={folder.id}>
                {editingFolderId === folder.id ? (
                  <div className="p-2 rounded-lg bg-everforest-bgYellow/50">
                    <input
                      type="text"
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      className="w-full px-2 py-1 rounded text-sm focus:outline-none bg-everforest-bg2/80 text-everforest-fg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameFolder(folder.id);
                        if (e.key === 'Escape') {
                          setEditingFolderId(null);
                          setEditFolderName('');
                        }
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "group px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between transition-all",
                      activeFolder === folder.id 
                        ? "bg-everforest-bgVisual/80 shadow-md border-l-[3px] border-everforest-aqua text-everforest-aqua" 
                        : "bg-everforest-bg1/30 border-l-[3px] border-transparent text-everforest-fg"
                    )}
                    onClick={() => handleFolderSelect(folder.id)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {activeFolder === folder.id ? (
                        <FolderOpen className="w-4 h-4 text-everforest-orange" />
                      ) : (
                        <Folder className="w-4 h-4 text-everforest-yellow" />
                      )}
                      <span className="text-sm">{folder.name}</span>
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        activeFolder === folder.id 
                          ? "bg-everforest-blue/30 text-everforest-blue"
                          : "bg-everforest-bg2/50 text-everforest-grey1"
                      )}>
                        {folder.prompts.length}
                      </span>
                    </div>
                    {!folder.isDefault && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolderId(folder.id);
                            setEditFolderName(folder.name);
                          }}
                          className="p-1 rounded hover:bg-black/10 text-everforest-yellow"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete "${folder.name}"? Prompts will be moved to Uncategorized.`)) {
                              handleDeleteFolder(folder.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-black/10 text-everforest-red"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="mt-6 p-3 rounded-lg text-xs border bg-everforest-bgPurple/30 border-everforest-purple/30 text-everforest-purple">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-3 h-3" />
              <span>Total Prompts: {totalPromptCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <FolderOpen className="w-3 h-3" />
              <span>Folders: {folders.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8 flex items-center justify-between">
              {(!isDesktop || !desktopSidebarOpen) && (
                <button
                  onClick={() => {
                    if (isDesktop) {
                      setDesktopSidebarOpen(true);
                    } else {
                      setMobileSidebarOpen(true);
                    }
                  }}
                  className="p-2 rounded-lg transition-all hover:shadow-md bg-gradient-to-r from-everforest-blue/20 to-everforest-aqua/20 text-everforest-blue"
                  title={isDesktop ? "Show Sidebar" : "Open Folders"}
                >
                  {isDesktop ? <PanelLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
              
              <h1 className={cn(
                "text-2xl sm:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-everforest-green to-everforest-aqua bg-clip-text text-transparent",
                (!isDesktop || !desktopSidebarOpen) ? 'flex-1' : ''
              )}>
                PROMPT MANAGER
              </h1>
              
              {(!isDesktop || !desktopSidebarOpen) && <div className="w-9"></div>}
            </div>

            {/* Current Folder Indicator */}
            <div className="mb-3 sm:mb-4 px-3 sm:px-4 py-2 rounded-lg inline-flex items-center gap-2 border text-sm sm:text-base bg-gradient-to-r from-everforest-bgVisual/50 to-everforest-bgPurple/50 border-everforest-purple/30 text-everforest-purple">
              <FolderOpen className="w-4 h-4 text-everforest-orange" />
              <span className="font-medium truncate">{currentFolder?.name}</span>
              <span className="text-xs sm:text-sm text-everforest-blue">
                ({currentFolder?.prompts.length || 0})
              </span>
            </div>

            {/* Input Section */}
            <div className="mb-4 sm:mb-6">
              <div className="backdrop-blur-md rounded-xl shadow-xl p-3 sm:p-4 lg:p-6 border bg-everforest-bg1/30 border-everforest-grey0/40">
                {/* File Name Input */}
                <div className="mb-3 flex items-center gap-2">
                  <File className="w-4 h-4 flex-shrink-0 text-everforest-orange" />
                  <input
                    type="text"
                    value={promptFileName}
                    onChange={(e) => setPromptFileName(e.target.value)}
                    placeholder="Optional: File name (e.g., CLAUDE.md)"
                    className="flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-everforest-aqua/50 bg-everforest-bg0/50 text-everforest-red border border-everforest-red/30"
                  />
                </div>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Add prompt to "${currentFolder?.name}"...`}
                  className="w-full p-3 sm:p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-everforest-aqua/50 backdrop-blur text-sm sm:text-base bg-everforest-bg0/50 text-everforest-fg border border-everforest-grey0/30"
                  rows={8}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleSubmit}
                  className="mt-3 sm:mt-4 w-full px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base bg-gradient-to-r from-everforest-green to-everforest-aqua text-everforest-bg0"
                >
                  ADD PROMPT
                </button>
              </div>
            </div>

            {/* Controls Section */}
            <div className="backdrop-blur-md rounded-xl shadow-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border bg-everforest-bg1/30 border-everforest-grey0/40">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="w-full">
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setSearchScope('current')}
                      className={cn(
                        "px-2 sm:px-3 py-1 text-xs rounded-lg transition-all",
                        searchScope === 'current' 
                          ? "bg-gradient-to-r from-everforest-blue/40 to-everforest-aqua/40 text-everforest-aqua shadow-md"
                          : "bg-everforest-bg2/30 text-everforest-grey1"
                      )}
                    >
                      Current Folder
                    </button>
                    <button
                      onClick={() => setSearchScope('all')}
                      className={cn(
                        "px-2 sm:px-3 py-1 text-xs rounded-lg transition-all",
                        searchScope === 'all' 
                          ? "bg-gradient-to-r from-everforest-purple/40 to-everforest-blue/40 text-everforest-purple shadow-md"
                          : "bg-everforest-bg2/30 text-everforest-grey1"
                      )}
                    >
                      All Folders
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-everforest-blue" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search prompts or file names..."
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-everforest-blue/50 backdrop-blur bg-everforest-bg0/50 text-everforest-fg border border-everforest-blue/30"
                    />
                  </div>
                </div>

                {/* Export/Import Buttons */}
                <div className="flex gap-2 justify-center sm:justify-end">
                  <button
                    onClick={handleExport}
                    disabled={totalPromptCount === 0}
                    className={cn(
                      "px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 border hover:shadow-md text-sm sm:text-base",
                      "bg-gradient-to-r from-everforest-green/20 to-everforest-aqua/20 text-everforest-green border-everforest-green/40",
                      totalPromptCount === 0 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 border hover:shadow-md text-sm sm:text-base bg-gradient-to-r from-everforest-purple/20 to-everforest-orange/20 text-everforest-purple border-everforest-purple/40"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Import</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Prompts Display */}
            <div className="space-y-4">
              {filteredPrompts.length === 0 ? (
                <div className="backdrop-blur-md rounded-xl shadow-xl p-8 text-center border bg-everforest-bg1/30 border-everforest-grey0/40 text-everforest-grey2">
                  {searchQuery 
                    ? `No prompts found matching "${searchQuery}" in ${searchScope === 'all' ? 'all folders' : 'current folder'}.`
                    : `No prompts in "${currentFolder?.name}" yet. Add your first prompt above!`}
                </div>
              ) : (
                filteredPrompts.map((prompt) => (
                  <div 
                    key={prompt.id} 
                    className={cn(
                      "backdrop-blur-md rounded-xl shadow-xl p-3 sm:p-4 lg:p-6 group border transition-all duration-200 hover:shadow-2xl bg-everforest-bg1/30",
                      prompt.fileName 
                        ? "border-everforest-red/20 border-l-[3px] border-l-everforest-red"
                        : "border-everforest-grey0/40"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        {prompt.fileName && (
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 flex-shrink-0 text-everforest-red" />
                            <span className="text-xs sm:text-sm font-medium truncate text-everforest-red">
                              {prompt.fileName}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-everforest-grey1">
                          {new Date(prompt.timestamp).toLocaleString()}
                        </span>
                        {searchScope === 'all' && 'folderName' in prompt && (
                          <span className="ml-2 text-xs px-2 py-1 rounded inline-block mt-1 sm:mt-0 bg-everforest-orange/20 text-everforest-orange">
                            📁 {(prompt as PromptWithFolder).folderName}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 sm:gap-2 self-end sm:self-auto">
                        {movingPromptId === prompt.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs hidden sm:inline text-everforest-yellow">
                              Move to:
                            </span>
                            <select
                              onChange={(e) => handleMovePrompt(prompt.id, e.target.value)}
                              className="text-xs px-2 py-1 rounded bg-everforest-bg2/80 text-everforest-fg"
                              autoFocus
                            >
                              <option value="">Select...</option>
                              {folders
                                .filter(f => f.id !== ('folderId' in prompt ? prompt.folderId : activeFolder))
                                .map(folder => (
                                  <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                  </option>
                                ))
                              }
                            </select>
                            <button
                              onClick={() => setMovingPromptId(null)}
                              className="p-1 text-everforest-red"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : editingId === prompt.id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 bg-gradient-to-r from-everforest-green to-everforest-aqua text-everforest-bg0"
                            >
                              <Check className="w-3 sm:w-4 h-3 sm:h-4" />
                              <span className="hidden sm:inline">Save</span>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 sm:p-2 transition-colors text-everforest-red"
                            >
                              <X className="w-3 sm:w-4 h-3 sm:h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleCopy(prompt.text, prompt.id)}
                              className="p-1.5 sm:p-2 transition-colors text-everforest-grey1"
                              title="Copy"
                            >
                              {copiedId === prompt.id ? (
                                <span className="text-xs sm:text-sm font-medium text-everforest-aqua">✔</span>
                              ) : (
                                <Copy className="w-3 sm:w-4 h-3 sm:h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setMovingPromptId(prompt.id)}
                              className="p-1.5 sm:p-2 transition-colors text-everforest-aqua"
                              title="Move"
                            >
                              <Move className="w-3 sm:w-4 h-3 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(prompt.id, prompt.text, prompt.fileName)}
                              className="p-1.5 sm:p-2 transition-colors text-everforest-yellow"
                              title="Edit"
                            >
                              <Edit3 className="w-3 sm:w-4 h-3 sm:h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this prompt?')) {
                                  handleDelete(prompt.id);
                                }
                              }}
                              className="p-1.5 sm:p-2 transition-colors opacity-0 group-hover:opacity-100 text-everforest-red"
                              title="Delete"
                            >
                              <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {editingId === prompt.id ? (
                      <>
                        <div className="mb-3 flex items-center gap-2">
                          <File className="w-4 h-4 text-everforest-orange" />
                          <input
                            type="text"
                            value={promptFileName}
                            onChange={(e) => setPromptFileName(e.target.value)}
                            placeholder="Optional: File name (e.g., CLAUDE.md)"
                            className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-everforest-red/50 bg-everforest-bg0/50 text-everforest-red border border-everforest-red/30"
                          />
                        </div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-everforest-grey0/50 bg-everforest-bg0/50 text-everforest-fg border border-everforest-grey0/30"
                          style={{ minHeight: '100px', height: 'auto' }}
                          rows={Math.max(4, editText.split('\n').length + 1)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              handleSaveEdit();
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                        />
                      </>
                    ) : (
                      <pre className="p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono text-sm border bg-everforest-bg0/30 text-everforest-fg border-everforest-grey0/20">
                        {prompt.text.split(/(\S*\/\S+\.\w+|\b\w+\.\w+\b)/g).map((part, index) => {
                          if (/(\S*\/\S+\.\w+|\b\w+\.\w+\b)/.test(part)) {
                            return (
                              <span key={index} className="text-everforest-orange">
                                {part}
                              </span>
                            );
                          }
                          return part;
                        })}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Storage Note */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 backdrop-blur-md border rounded-xl bg-everforest-yellow/10 border-everforest-yellow/30">
              <p className="text-xs sm:text-sm text-everforest-yellow">
                <strong>Note:</strong> Data is stored locally using browser localStorage. Use Export to save your organized prompts and folders. Import supports both new folder format and legacy flat format.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}