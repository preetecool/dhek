"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogOverlay,
  DialogPopup,
  DialogPortal,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Assignee } from "../../types";

interface CreateAssigneeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAssignee: (assignee: Assignee) => void;
}

export function CreateAssigneeDialog({
  open,
  onOpenChange,
  onCreateAssignee,
}: CreateAssigneeDialogProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = (formData.get("assigneeName") as string)?.trim();

      if (!name) {
        return;
      }

      const newAssignee: Assignee = {
        id: `assignee-${crypto.randomUUID()}`,
        name,
      };

      onCreateAssignee(newAssignee);
      onOpenChange(false);
    },
    [onCreateAssignee, onOpenChange]
  );

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogPortal>
        <DialogOverlay className="z-[200]" />
        <DialogPopup className="z-[201] max-w-[400px]">
          <h2 className="mb-1 font-semibold text-lg">Add new assignee</h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Create a new team member to assign tasks to.
          </p>
          <form onSubmit={handleSubmit}>
            <Input autoFocus name="assigneeName" placeholder="Enter name..." />
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
