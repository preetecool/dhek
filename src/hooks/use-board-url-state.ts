"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import type { Column, KanbanData, Task } from "@/components/kanban-board/types";

const DEFAULT_COLUMNS: Column[] = [
  { id: "backlog", name: "Backlog", order: 0 },
  { id: "todo", name: "To Do", order: 1 },
  { id: "in-progress", name: "In Progress", order: 2 },
  { id: "done", name: "Done", order: 3 },
];

const DEFAULT_DATA: KanbanData = {
  name: "Kanban Board",
  columns: DEFAULT_COLUMNS,
  tasks: [],
  teamMembers: [],
  tags: [],
};

function encodeBoard(data: KanbanData): string {
  return btoa(
    encodeURIComponent(JSON.stringify(data)).replace(
      /%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode(Number.parseInt(p1, 16))
    )
  );
}

// Migrate old task format to new normalized format
function migrateTask(task: Record<string, unknown>): Task {
  const migrated = { ...task } as Task;

  // Migrate tags -> tagIds
  if ("tags" in task && !("tagIds" in task)) {
    migrated.tagIds = task.tags as string[];
  }

  // Migrate assignees -> assigneeIds (extract IDs from embedded objects)
  if ("assignees" in task && !("assigneeIds" in task)) {
    const assignees = task.assignees as Array<{ id: string }> | undefined;
    migrated.assigneeIds = assignees?.map((a) => a.id) ?? [];
  }

  // Clean up old properties
  if ("tags" in migrated && "tagIds" in migrated) {
    delete (migrated as Record<string, unknown>).tags;
  }
  if ("assignees" in migrated && "assigneeIds" in migrated) {
    delete (migrated as Record<string, unknown>).assignees;
  }

  return migrated;
}

function decodeBoard(encoded: string): KanbanData | null {
  try {
    const json = decodeURIComponent(
      atob(encoded)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );
    const parsed = JSON.parse(json);
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.columns) &&
      Array.isArray(parsed.tasks)
    ) {
      // Migrate tasks to new format
      const migratedTasks = parsed.tasks.map(migrateTask);

      return {
        name: parsed.name ?? "Kanban Board",
        columns: parsed.columns,
        tasks: migratedTasks,
        teamMembers: parsed.teamMembers ?? [],
        tags: parsed.tags ?? [],
      };
    }
    return null;
  } catch {
    return null;
  }
}

function getBoardFromUrl(): KanbanData {
  const params = new URLSearchParams(window.location.search);
  const boardParam = params.get("board");
  if (!boardParam) return DEFAULT_DATA;
  return decodeBoard(boardParam) ?? DEFAULT_DATA;
}

function updateUrlWithBoard(data: KanbanData): void {
  const encoded = encodeBoard(data);
  const url = new URL(window.location.href);
  url.searchParams.set("board", encoded);
  window.history.replaceState({}, "", url.toString());
}

let boardData: KanbanData = DEFAULT_DATA;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return boardData;
}

function getServerSnapshot() {
  return DEFAULT_DATA;
}

function setBoardData(newData: KanbanData) {
  boardData = newData;
  updateUrlWithBoard(newData);
  for (const listener of listeners) listener();
}

let initialized = false;
function initializeFromUrl() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    boardData = getBoardFromUrl();
  }
}

export function useBoardUrlState() {
  const initRef = useRef(false);
  if (!initRef.current && typeof window !== "undefined") {
    initRef.current = true;
    initializeFromUrl();
  }

  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setData = useCallback(
    (newData: KanbanData | ((prev: KanbanData) => KanbanData)) => {
      const updated =
        typeof newData === "function" ? newData(boardData) : newData;
      setBoardData(updated);
    },
    []
  );

  const setTasks = useCallback(
    (newTasks: Task[] | ((prev: Task[]) => Task[])) => {
      const tasks =
        typeof newTasks === "function" ? newTasks(boardData.tasks) : newTasks;
      setBoardData({ ...boardData, tasks });
    },
    []
  );

  const setTeamMembers = useCallback(
    (
      newMembers:
        | KanbanData["teamMembers"]
        | ((prev: KanbanData["teamMembers"]) => KanbanData["teamMembers"])
    ) => {
      const teamMembers =
        typeof newMembers === "function"
          ? newMembers(boardData.teamMembers)
          : newMembers;
      setBoardData({ ...boardData, teamMembers });
    },
    []
  );

  const setTags = useCallback(
    (
      newTags:
        | KanbanData["tags"]
        | ((prev: KanbanData["tags"]) => KanbanData["tags"])
    ) => {
      const tags =
        typeof newTags === "function" ? newTags(boardData.tags) : newTags;
      setBoardData({ ...boardData, tags });
    },
    []
  );

  const setName = useCallback((newName: string) => {
    setBoardData({ ...boardData, name: newName });
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const isLoading = typeof window === "undefined";

  return {
    data,
    setData,
    setTasks,
    setTeamMembers,
    setTags,
    setName,
    isLoading,
    shareUrl,
  };
}
