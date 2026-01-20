"use client";

import { Check, Command, Plus, X } from "lucide-react";
import { memo, useCallback } from "react";
import { Checkbox, CheckboxIndicator } from "@/components/ui/checkbox";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import type { Subtask } from "../../types";

interface SubtasksListProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

export const SubtasksList = memo(function SubtasksList({
  subtasks,
  onSubtasksChange,
}: SubtasksListProps) {
  const addSubtask = useCallback(() => {
    const newSubtask: Subtask = {
      id: `subtask-${crypto.randomUUID()}`,
      title: "",
      completed: false,
    };
    onSubtasksChange([...subtasks, newSubtask]);
  }, [subtasks, onSubtasksChange]);

  const updateSubtask = useCallback(
    (id: string, updates: Partial<Subtask>) => {
      onSubtasksChange(
        subtasks.map((st) => (st.id === id ? { ...st, ...updates } : st))
      );
    },
    [subtasks, onSubtasksChange]
  );

  const removeSubtask = useCallback(
    (id: string) => {
      onSubtasksChange(subtasks.filter((st) => st.id !== id));
    },
    [subtasks, onSubtasksChange]
  );

  const handleCheckboxGroupChange = useCallback(
    (values: string[]) => {
      const updatedSubtasks = subtasks.map((subtask) => {
        const shouldBeCompleted = values.includes(subtask.id);
        if (subtask.completed !== shouldBeCompleted) {
          return { ...subtask, completed: shouldBeCompleted };
        }
        return subtask;
      });
      onSubtasksChange(updatedSubtasks);
    },
    [subtasks, onSubtasksChange]
  );

  return (
    <div className="mt-3 flex flex-col gap-1">
      <CheckboxGroup
        allValues={subtasks.map((st) => st.id)}
        aria-label="Subtasks"
        className="flex flex-col gap-0"
        onValueChange={handleCheckboxGroupChange}
        value={subtasks.filter((st) => st.completed).map((st) => st.id)}
      >
        {subtasks.map((subtask) => (
          <div
            className="group flex items-center gap-2 rounded-[var(--radius-sm)] py-1"
            key={subtask.id}
          >
            <Checkbox
              className={cn(
                "h-4 w-4 rounded-[0.25rem]",
                "data-[unchecked]:border-[oklch(from_var(--border)_l_c_h_/_0.6)]",
                "data-[checked]:border-primary data-[checked]:bg-primary"
              )}
              name={`subtask-${subtask.id}`}
              value={subtask.id}
            >
              <CheckboxIndicator>
                <Check aria-hidden="true" size={12} strokeWidth={3} />
              </CheckboxIndicator>
            </Checkbox>
            <input
              autoFocus={!subtask.title}
              className={cn(
                "flex-1 border-none bg-transparent py-1 text-foreground text-sm outline-none",
                "placeholder:text-muted-foreground placeholder:opacity-60",
                subtask.completed && "text-muted-foreground line-through"
              )}
              name={`subtask-title-${subtask.id}`}
              onChange={(e) =>
                updateSubtask(subtask.id, { title: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSubtask();
                }
                if (e.key === "Backspace" && !subtask.title) {
                  e.preventDefault();
                  removeSubtask(subtask.id);
                }
              }}
              placeholder="Subtask title..."
              value={subtask.title}
            />
            <button
              aria-label="Remove subtask"
              className="flex cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border-none bg-transparent p-1 text-muted-foreground opacity-0 transition-opacity duration-150 hover:text-destructive group-hover:opacity-100"
              onClick={() => removeSubtask(subtask.id)}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </CheckboxGroup>
      <button
        className="flex cursor-pointer items-center gap-2 border-none bg-transparent py-1.5 text-muted-foreground text-sm transition-colors duration-150 hover:text-foreground"
        onClick={addSubtask}
        type="button"
      >
        <Plus size={14} />
        <span>Add subtask</span>
        <Kbd className="ml-auto" size="sm">
          <Command size={10} />L
        </Kbd>
      </button>
    </div>
  );
});
