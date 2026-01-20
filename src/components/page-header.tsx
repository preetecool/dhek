"use client";

import { Pencil, Share2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { showCopiedToast } from "@/components/ui/toast";

interface PageHeaderProps {
  name?: string;
  onNameChange: (name: string) => void;
  shareUrl: string;
  defaultName?: string;
  maxWidth?: boolean;
}

export function PageHeader({
  name,
  onNameChange,
  shareUrl,
  defaultName = "Untitled",
  maxWidth = false,
}: PageHeaderProps) {
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

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
    setEditedName(name ?? defaultName);
    setIsEditingName(true);
  }, [name, defaultName]);

  const handleSaveName = useCallback(() => {
    const trimmed = editedName.trim();
    if (trimmed) {
      onNameChange(trimmed);
    }
    setIsEditingName(false);
  }, [editedName, onNameChange]);

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

  return (
    <header className="border-[oklch(from_var(--border)_l_c_h_/_0.3)] border-b px-4 py-2.5">
      <div
        className={`mx-auto flex items-center justify-between ${maxWidth ? "max-w-4xl" : ""}`}
      >
        {isEditingName ? (
          <input
            aria-label="Page name"
            autoFocus
            className="h-8 rounded-[var(--radius)] border-none bg-transparent px-1 font-medium text-foreground text-sm outline-none"
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
            {name ?? defaultName}
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
      </div>
    </header>
  );
}
