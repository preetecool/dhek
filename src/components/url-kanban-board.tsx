"use client";

import { Share2 } from "lucide-react";
import { useCallback, useRef } from "react";
import { KanbanBoard } from "@/components/kanban-board/kanban-board";
import type { Task } from "@/components/kanban-board/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AnchoredToastProvider, showCopiedToast } from "@/components/ui/toast";
import { useBoardUrlState } from "@/hooks/use-board-url-state";

export function UrlKanbanBoard() {
  const { data, setTasks, isLoading, shareUrl } = useBoardUrlState();
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  const handleTasksChange = useCallback(
    (tasks: Task[]) => {
      setTasks(tasks);
    },
    [setTasks]
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
        <header className="flex items-center justify-between border-border border-b px-4 py-3">
          <h1 className="font-semibold text-lg">Kanban Board</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              className="gap-2"
              onClick={handleShare}
              ref={shareButtonRef}
              size="sm"
              variant="outline"
            >
              <Share2 aria-hidden="true" size={14} />
              Share
            </Button>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col" id="main-content">
          <KanbanBoard data={data} onTasksChange={handleTasksChange} />
        </main>
      </div>
    </AnchoredToastProvider>
  );
}
