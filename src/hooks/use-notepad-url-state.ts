"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

export interface NotepadData {
  name: string;
  text: string;
}

const DEFAULT_DATA: NotepadData = {
  name: "Notepad",
  text: "",
};

function encodeNotepad(data: NotepadData): string {
  return btoa(
    encodeURIComponent(JSON.stringify(data)).replace(
      /%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode(Number.parseInt(p1, 16))
    )
  );
}

function decodeNotepad(encoded: string): NotepadData | null {
  try {
    const json = decodeURIComponent(
      atob(encoded)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    const parsed = JSON.parse(json);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.text === "string"
    ) {
      return {
        name: parsed.name ?? "Notepad",
        text: parsed.text,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function getNotepadFromUrl(): NotepadData {
  const params = new URLSearchParams(window.location.search);
  const notepadParam = params.get("data");
  if (!notepadParam) {
    return DEFAULT_DATA;
  }
  return decodeNotepad(notepadParam) ?? DEFAULT_DATA;
}

function updateUrlWithNotepad(data: NotepadData): void {
  const encoded = encodeNotepad(data);
  const url = new URL(window.location.href);
  url.searchParams.set("data", encoded);
  window.history.replaceState({}, "", url.toString());
}

let notepadData: NotepadData = DEFAULT_DATA;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return notepadData;
}

function getServerSnapshot() {
  return DEFAULT_DATA;
}

function setNotepadData(newData: NotepadData) {
  notepadData = newData;
  updateUrlWithNotepad(newData);
  for (const listener of listeners) {
    listener();
  }
}

let initialized = false;
function initializeFromUrl() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    notepadData = getNotepadFromUrl();
  }
}

export function useNotepadUrlState() {
  const initRef = useRef(false);
  if (!initRef.current && typeof window !== "undefined") {
    initRef.current = true;
    initializeFromUrl();
  }

  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setData = useCallback(
    (newData: NotepadData | ((prev: NotepadData) => NotepadData)) => {
      const updated =
        typeof newData === "function" ? newData(notepadData) : newData;
      setNotepadData(updated);
    },
    []
  );

  const setText = useCallback((newText: string) => {
    setNotepadData({ ...notepadData, text: newText });
  }, []);

  const setName = useCallback((newName: string) => {
    setNotepadData({ ...notepadData, name: newName });
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const isLoading = typeof window === "undefined";

  return {
    data,
    setData,
    setText,
    setName,
    isLoading,
    shareUrl,
  };
}
