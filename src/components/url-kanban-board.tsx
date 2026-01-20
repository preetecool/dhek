"use client";

import { Pencil, Share2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { KanbanBoard } from "@/components/kanban-board/kanban-board";
import type { Tag, Task } from "@/components/kanban-board/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AnchoredToastProvider, showCopiedToast } from "@/components/ui/toast";
import { useBoardUrlState } from "@/hooks/use-board-url-state";

export function UrlKanbanBoard() {
  const {
    data,
    setTasks,
    setTeamMembers,
    setTags,
    setName,
    isLoading,
    shareUrl,
  } = useBoardUrlState();
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const handleTasksChange = useCallback(
    (tasks: Task[]) => {
      setTasks(tasks);
    },
    [setTasks]
  );

  const handleTeamMembersChange = useCallback(
    (members: { id: string; name: string; avatar?: string }[]) => {
      setTeamMembers(members);
    },
    [setTeamMembers]
  );

  const handleTagsChange = useCallback(
    (tags: Tag[]) => {
      setTags(tags);
    },
    [setTags]
  );

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showCopiedToast(shareButtonRef.current);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showCopiedToast(shareButtonRef.current);
    }
  }, [shareUrl]);

  const handleStartEditing = useCallback(() => {
    setEditedName(data.name ?? "Kanban Board");
    setIsEditingName(true);
  }, [data.name]);

  const handleSaveName = useCallback(() => {
    const trimmed = editedName.trim();
    if (trimmed) {
      setName(trimmed);
    }
    setIsEditingName(false);
  }, [editedName, setName]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSaveName();
      } else if (e.key === "Escape") {
        setIsEditingName(false);
      }
    },
    [handleSaveName]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <AnchoredToastProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex items-center justify-between border-[oklch(from_var(--border)_l_c_h_/_0.3)] border-b px-4 py-2.5">
          {isEditingName ? (
            <input
              aria-label="Board name"
              autoFocus
              className="h-8 rounded-[var(--radius)] border-none bg-transparent px-1 font-medium text-foreground text-sm outline-none ring-1 ring-[oklch(from_var(--border)_l_c_h_/_0.5)] focus:ring-[oklch(from_var(--ring)_l_c_h_/_0.8)]"
              onBlur={handleSaveName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              value={editedName}
            />
          ) : (
            <button
              className="group flex h-8 cursor-pointer items-center gap-1.5 rounded-[var(--radius)] border-none bg-transparent px-1 font-medium text-foreground text-sm"
              onClick={handleStartEditing}
              type="button"
            >
              {data.name ?? "Kanban Board"}
              <Pencil
                aria-hidden="true"
                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                size={12}
              />
            </button>
          )}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              className="gap-2"
              onClick={handleShare}
              ref={shareButtonRef}
              size="sm"
              variant="ghost"
            >
              <Share2 aria-hidden="true" size={14} />
              Share
            </Button>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col" id="main-content">
          <KanbanBoard
            data={data}
            onTagsChange={handleTagsChange}
            onTasksChange={handleTasksChange}
            onTeamMembersChange={handleTeamMembersChange}
          />
        </main>
      </div>
    </AnchoredToastProvider>
  );
}
