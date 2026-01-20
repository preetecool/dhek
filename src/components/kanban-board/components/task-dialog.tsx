"use client";

import { Loader2, X } from "lucide-react";
import { useActionState, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPopup,
  DialogPortal,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  Assignee,
  Column,
  GroupByField,
  Priority,
  Subtask,
  Tag,
  Task,
} from "../types";
import { DeleteDialog } from "./delete-dialog";
import { AssigneesCombobox } from "./task-dialog/assignees-combobox";
import { ColumnSelect } from "./task-dialog/column-select";
import { CreateAssigneeDialog } from "./task-dialog/create-assignee-dialog";
import { CreateTagDialog } from "./task-dialog/create-tag-dialog";
import { DueDatePicker } from "./task-dialog/due-date-picker";
import { PrioritySelect } from "./task-dialog/priority-select";
import { SubtasksList } from "./task-dialog/subtasks-list";
import { TagsCombobox } from "./task-dialog/tags-combobox";

export interface TaskDialogProps {
  open: boolean;
  mode: "create" | "edit";
  task?: {
    title: string;
    description: string;
    priority: Priority;
    columnId: string;
    tags: string[];
    assignees?: Assignee[];
    subtasks?: Subtask[];
    dueDate?: string;
  };
  taskId?: string;
  columnId?: string;
  assignees: Assignee[];
  tags: Tag[];
  columns: Column[];
  groupBy: GroupByField;
  onClose: () => void;
  onSave: (
    taskData: Omit<Task, "id" | "createdAt">,
    existingId?: string
  ) => void;
  onDelete?: () => void;
  onCreateAssignee?: (assignee: Assignee) => void;
  onCreateTag?: (tag: Tag) => void;
}

interface FormState {
  status: "idle" | "error";
  error: string | null;
}

const initialFormState: FormState = {
  status: "idle",
  error: null,
};

export function TaskDialog({
  open,
  mode,
  task,
  taskId,
  columnId,
  assignees,
  tags: availableTags,
  columns,
  groupBy,
  onClose,
  onSave,
  onDelete,
  onCreateAssignee,
  onCreateTag,
}: TaskDialogProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateAssigneeDialog, setShowCreateAssigneeDialog] =
    useState(false);
  const [showCreateTagDialog, setShowCreateTagDialog] = useState(false);

  const [subtasks, setSubtasks] = useState<Subtask[]>(
    () => task?.subtasks ?? []
  );
  const [dueDate, setDueDate] = useState(() =>
    task?.dueDate ? task.dueDate.split("T")[0] : ""
  );

  const [localAssignees, setLocalAssignees] = useState<Assignee[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>(
    () => task?.assignees ?? []
  );

  const [localTags, setLocalTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(() => {
    const taskTagIds = task?.tags ?? [];
    return availableTags.filter((t) => taskTagIds.includes(t.id));
  });

  const allAssignees = [...assignees, ...localAssignees];
  const allTags = [...availableTags, ...localTags];

  const defaultColumnId = columns[0]?.id ?? "";
  const defaultPriority = task?.priority ?? "medium";
  const defaultSelectedColumnId = task?.columnId ?? columnId ?? defaultColumnId;

  const submitAction = useCallback(
    (_prevState: FormState, formData: FormData): FormState => {
      const title = (formData.get("title") as string)?.trim();

      if (!title) {
        return { status: "error", error: "Title is required" };
      }

      const description = (formData.get("description") as string) ?? "";
      const priority = (formData.get("priority") as Priority) ?? "medium";
      const taskColumnId =
        (formData.get("columnId") as string) ?? defaultSelectedColumnId;

      const taskData: Omit<Task, "id" | "createdAt"> = {
        title,
        description,
        priority,
        columnId: taskColumnId,
        tags: selectedTags.map((t) => t.id),
        assignees: selectedAssignees,
        subtasks: subtasks.filter((st) => st.title.trim()),
        dueDate: dueDate || undefined,
      };

      onSave(taskData, taskId);
      return { status: "idle", error: null };
    },
    [
      defaultSelectedColumnId,
      selectedAssignees,
      selectedTags,
      subtasks,
      dueDate,
      onSave,
      taskId,
    ]
  );

  const [formState, formAction, isPending] = useActionState(
    submitAction,
    initialFormState
  );

  const handleCreateAssignee = useCallback(
    (newAssignee: Assignee) => {
      if (!onCreateAssignee) {
        setLocalAssignees((prev) => [...prev, newAssignee]);
      }
      setSelectedAssignees((prev) => [...prev, newAssignee]);
      onCreateAssignee?.(newAssignee);
    },
    [onCreateAssignee]
  );

  const handleCreateTag = useCallback(
    (newTag: Tag) => {
      if (!onCreateTag) {
        setLocalTags((prev) => [...prev, newTag]);
      }
      setSelectedTags((prev) => [...prev, newTag]);
      onCreateTag?.(newTag);
    },
    [onCreateTag]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "l") {
      e.preventDefault();
      setSubtasks((prev) => [
        ...prev,
        {
          id: `subtask-${crypto.randomUUID()}`,
          title: "",
          completed: false,
        },
      ]);
    }
  }, []);

  if (!open) {
    return null;
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && onClose()} open>
      <DialogPortal>
        <DialogOverlay />
        <DialogPopup
          className="max-w-[660px] overflow-visible p-5"
          data-kanban-dialog
          onKeyDown={handleKeyDown}
        >
          <form action={formAction} className="mt-0 flex flex-col gap-1">
            <Input
              aria-invalid={formState.error ? "true" : "false"}
              autoFocus
              className={cn(
                "rounded-none py-2 font-semibold text-xl leading-[1.3] tracking-[-0.01em]",
                "placeholder:font-semibold placeholder:text-muted-foreground placeholder:text-xl placeholder:opacity-60",
                "h-auto border-none bg-transparent p-0 shadow-none",
                "focus:border-transparent focus:shadow-none focus:outline-none",
                "focus-visible:border-transparent focus-visible:shadow-none focus-visible:outline-none"
              )}
              data-variant="borderless"
              defaultValue={task?.title ?? ""}
              disabled={isPending}
              name="title"
              placeholder={mode === "create" ? "New task..." : "Task title..."}
            />
            {formState.error ? (
              <p className="m-0 text-destructive text-xs">{formState.error}</p>
            ) : null}

            <Input
              className={cn(
                "min-h-10 rounded-none py-1.5 text-muted-foreground text-sm",
                "placeholder:text-sm placeholder:opacity-70",
                "h-auto border-none bg-transparent p-0 shadow-none",
                "focus:border-transparent focus:shadow-none focus:outline-none",
                "focus-visible:border-transparent focus-visible:shadow-none focus-visible:outline-none"
              )}
              data-variant="borderless"
              defaultValue={task?.description ?? ""}
              disabled={isPending}
              name="description"
              placeholder="Add description..."
            />

            <SubtasksList onSubtasksChange={setSubtasks} subtasks={subtasks} />

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PrioritySelect defaultValue={defaultPriority} name="priority" />

              {groupBy === "column" ? (
                <ColumnSelect
                  columns={columns}
                  defaultValue={defaultSelectedColumnId}
                  name="columnId"
                />
              ) : null}

              <TagsCombobox
                onAddTagClick={() => setShowCreateTagDialog(true)}
                onValueChange={setSelectedTags}
                selectedTags={selectedTags}
                tags={allTags}
              />

              <AssigneesCombobox
                assignees={allAssignees}
                onAddAssigneeClick={() => setShowCreateAssigneeDialog(true)}
                onValueChange={setSelectedAssignees}
                selectedAssignees={selectedAssignees}
              />

              <DueDatePicker onChange={setDueDate} value={dueDate} />
            </div>

            <div className="-mx-5 mt-6 flex items-center justify-between gap-2 border-t-[0.5px] border-t-[oklch(from_var(--border)_l_c_h_/_0.4)] px-5 pt-4">
              {mode === "edit" ? (
                <Button
                  className="!transition-none text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_0_1px_var(--destructive)]"
                  onClick={() => setShowDeleteDialog(true)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Delete
                </Button>
              ) : null}
              <div className="ml-auto flex items-center gap-1.5">
                <Button disabled={isPending} size="sm" type="submit">
                  {isPending ? (
                    <Loader2
                      aria-hidden="true"
                      className="animate-spin"
                      size={14}
                    />
                  ) : null}
                  {mode === "create" ? "Create" : "Save"}
                </Button>
              </div>
            </div>
          </form>

          <Button
            aria-label="Close dialog"
            className="absolute top-3 right-3 opacity-50 transition-opacity duration-150 hover:opacity-100"
            render={<DialogClose />}
            size="icon"
            variant="ghost"
          >
            <X aria-hidden="true" size={16} />
          </Button>

          <DeleteDialog
            onConfirm={onDelete}
            onOpenChange={setShowDeleteDialog}
            open={showDeleteDialog}
          />

          <CreateAssigneeDialog
            onCreateAssignee={handleCreateAssignee}
            onOpenChange={setShowCreateAssigneeDialog}
            open={showCreateAssigneeDialog}
          />

          <CreateTagDialog
            onCreateTag={handleCreateTag}
            onOpenChange={setShowCreateTagDialog}
            open={showCreateTagDialog}
          />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
