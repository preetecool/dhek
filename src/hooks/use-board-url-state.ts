"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Column, KanbanData, Task } from "@/components/kanban-board/types";

const DEFAULT_COLUMNS: Column[] = [
  { id: "backlog", name: "Backlog", order: 0 },
  { id: "todo", name: "To Do", order: 1 },
  { id: "in-progress", name: "In Progress", order: 2 },
  { id: "done", name: "Done", order: 3 },
];

const DEFAULT_DATA: KanbanData = {
  columns: DEFAULT_COLUMNS,
  tasks: [],
  teamMembers: [],
};

function encodeBoard(data: KanbanData): string {
  const json = JSON.stringify(data);
  if (typeof window === "undefined") {
    return Buffer.from(json).toString("base64");
  }
  return btoa(
    encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(Number.parseInt(p1, 16))
    )
  );
}

function decodeBoard(encoded: string): KanbanData | null {
  try {
    let json: string;
    if (typeof window === "undefined") {
      json = Buffer.from(encoded, "base64").toString("utf-8");
    } else {
      json = decodeURIComponent(
        atob(encoded)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    }
    const parsed = JSON.parse(json);
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.columns) &&
      Array.isArray(parsed.tasks)
    ) {
      return {
        columns: parsed.columns,
        tasks: parsed.tasks,
        teamMembers: parsed.teamMembers ?? [],
      };
    }
    return null;
  } catch {
    return null;
  }
}

function getBoardFromUrl(): KanbanData {
  if (typeof window === "undefined") {
    return DEFAULT_DATA;
  }
  const params = new URLSearchParams(window.location.search);
  const boardParam = params.get("board");
  if (!boardParam) {
    return DEFAULT_DATA;
  }
  const decoded = decodeBoard(boardParam);
  return decoded ?? DEFAULT_DATA;
}

function updateUrlWithBoard(data: KanbanData): void {
  if (typeof window === "undefined") {
    return;
  }
  const encoded = encodeBoard(data);
  const url = new URL(window.location.href);
  url.searchParams.set("board", encoded);
  window.history.replaceState({}, "", url.toString());
}

export function useBoardUrlState() {
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setDataInternal] = useState<KanbanData>(DEFAULT_DATA);

  // Load initial data from URL on mount
  useEffect(() => {
    setIsClient(true);
    const initialData = getBoardFromUrl();
    setDataInternal(initialData);
    setIsInitialized(true);
  }, []);

  // Update URL when data changes (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      updateUrlWithBoard(data);
    }
  }, [data, isInitialized]);

  const setData = useCallback(
    (newData: KanbanData | ((prev: KanbanData) => KanbanData)) => {
      setDataInternal((prev) => {
        const updated = typeof newData === "function" ? newData(prev) : newData;
        return updated;
      });
    },
    []
  );

  const setTasks = useCallback(
    (newTasks: Task[] | ((prev: Task[]) => Task[])) => {
      setDataInternal((prev) => {
        const tasks =
          typeof newTasks === "function" ? newTasks(prev.tasks) : newTasks;
        return { ...prev, tasks };
      });
    },
    []
  );

  const shareUrl = useMemo(() => {
    if (!isClient) {
      return "";
    }
    return window.location.href;
  }, [isClient, data]);

  return {
    data,
    setData,
    setTasks,
    isLoading: !isClient,
    shareUrl,
  };
}
