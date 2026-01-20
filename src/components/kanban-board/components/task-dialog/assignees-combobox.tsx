"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Plus, Users } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxPortal,
  ComboboxPositioner,
} from "@/components/ui/combobox";
import type { Assignee } from "../../types";

interface AssigneesComboboxProps {
  assignees: Assignee[];
  selectedAssignees: Assignee[];
  onValueChange: (assignees: Assignee[]) => void;
  onAddAssigneeClick: () => void;
}

export const AssigneesCombobox = memo(function AssigneesCombobox({
  assignees,
  selectedAssignees,
  onValueChange,
  onAddAssigneeClick,
}: AssigneesComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Combobox<Assignee, true>
      items={assignees}
      multiple
      name="assignees"
      onOpenChange={setOpen}
      onValueChange={onValueChange}
      open={open}
      value={selectedAssignees}
    >
      <ComboboxPrimitive.Trigger
        render={
          <Button
            className="inline-flex items-center gap-2 whitespace-nowrap shadow-[0_0_0_1px_oklch(from_var(--border)_l_c_h_/_0.4)]"
            size="sm"
            variant="outline"
          />
        }
      >
        <span className="flex items-center justify-center text-muted-foreground">
          <Users size={14} />
        </span>
        <ComboboxPrimitive.Value>
          {(value) =>
            Array.isArray(value) && value.length > 0
              ? `${value.length} assignee${value.length > 1 ? "s" : ""}`
              : "Assignees"
          }
        </ComboboxPrimitive.Value>
      </ComboboxPrimitive.Trigger>
      <ComboboxPortal>
        <ComboboxPositioner side="bottom" sideOffset={6}>
          <ComboboxPopup className="min-w-[200px]">
            <ComboboxInput
              className="!rounded-none !bg-transparent !shadow-[inset_0_-1px_0_0_oklch(from_var(--border)_l_c_h_/_0.8)] focus:!shadow-[inset_0_-1px_0_0_oklch(from_var(--border)_l_c_h_/_0.8)]"
              placeholder="Search assignees..."
            />
            <ComboboxEmpty>No users found</ComboboxEmpty>
            <div className="h-1 w-full shrink-0" />
            <ComboboxList>
              {(assignee: Assignee) => (
                <ComboboxItem
                  indicatorPosition="right"
                  key={assignee.id}
                  value={assignee}
                >
                  <span style={{ flex: 1 }}>{assignee.name}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
            <div className="h-1 w-full shrink-0" />
            <div className="px-1 shadow-[inset_0_1px_0_0_oklch(from_var(--border)_l_c_h_/_0.8)]">
              <div className="h-1 w-full shrink-0" />
              <button
                className="flex w-full cursor-pointer items-center gap-2 rounded-[calc(var(--radius)-4px)] border-none bg-transparent px-2 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-[var(--accent)] hover:text-foreground"
                onClick={() => {
                  setOpen(false);
                  onAddAssigneeClick();
                }}
                type="button"
              >
                <Plus size={14} />
                <span>Add assignee</span>
              </button>
            </div>
          </ComboboxPopup>
        </ComboboxPositioner>
      </ComboboxPortal>
    </Combobox>
  );
});
