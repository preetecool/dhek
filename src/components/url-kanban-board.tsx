"use client";

import { useCallback } from "react";
import { KanbanBoard } from "@/components/kanban-board/kanban-board";
import type { Tag, Task } from "@/components/kanban-board/types";
import { PageHeader } from "@/components/page-header";
import { AnchoredToastProvider } from "@/components/ui/toast";
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
        <PageHeader
          defaultName="Kanban Board"
          name={data.name}
          onNameChange={setName}
          shareUrl={shareUrl}
        />
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
