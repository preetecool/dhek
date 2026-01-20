"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogOverlay,
  DialogPopup,
  DialogPortal,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TAG_COLOR_OPTIONS } from "../../project";
import type { Tag } from "../../types";

interface CreateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTag: (tag: Tag) => void;
}

export function CreateTagDialog({
  open,
  onOpenChange,
  onCreateTag,
}: CreateTagDialogProps) {
  const [newTagColor, setNewTagColor] = useState(TAG_COLOR_OPTIONS[0].value);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = (formData.get("tagName") as string)?.trim();

      if (!name) {
        return;
      }

      const newTag: Tag = {
        id: `tag-${crypto.randomUUID()}`,
        name,
        color: newTagColor,
      };

      onCreateTag(newTag);
      onOpenChange(false);
      setNewTagColor(TAG_COLOR_OPTIONS[0].value);
    },
    [onCreateTag, onOpenChange, newTagColor]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPortal>
        <DialogOverlay className="z-[200]" />
        <DialogPopup className="z-[201] max-w-[400px]">
          <h2 className="mb-1 font-semibold text-lg">Add new tag</h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Create a new tag to categorize tasks.
          </p>
          <form onSubmit={handleSubmit}>
            <Input autoFocus name="tagName" placeholder="Enter tag name..." />
            <div className="mt-4">
              <p className="mb-2 font-medium text-sm">Color</p>
              <div className="flex flex-wrap gap-2">
                {TAG_COLOR_OPTIONS.map((color) => (
                  <button
                    aria-label={color.label}
                    className={cn(
                      "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all",
                      newTagColor === color.value
                        ? "border-foreground"
                        : "border-transparent hover:border-muted-foreground/50"
                    )}
                    key={color.value}
                    onClick={() => setNewTagColor(color.value)}
                    type="button"
                  >
                    <span
                      className="h-5 w-5 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => onOpenChange(false)}
                size="sm"
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Create
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
