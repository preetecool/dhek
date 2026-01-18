import type {
  Column,
  FilterConfig,
  GroupByField,
  Priority,
  Tag,
  Task,
} from "./types";
import type { KanbanItemProps } from "./use-kanban-dnd";

export const PRIORITY_ORDER = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
} as const;

export const PRIORITY_COLUMNS: Column[] = [
  { id: "urgent", name: "Urgent", order: 0 },
  { id: "high", name: "High Priority", order: 1 },
  { id: "medium", name: "Medium Priority", order: 2 },
  { id: "low", name: "Low Priority", order: 3 },
];

export const PRIORITY_ITEMS: { value: Priority; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const TAG_COLOR_OPTIONS = [
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#eab308", label: "Yellow" },
  { value: "#22c55e", label: "Green" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
  { value: "#6b7280", label: "Gray" },
];

export const GROUP_BY_ITEMS: { value: GroupByField; label: string }[] = [
  { value: "column", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "tag", label: "Tag" },
];

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function filterTasks(tasks: Task[], filters: FilterConfig): Task[] {
  return tasks.filter((task) => {
    if (
      filters.priority.length > 0 &&
      !filters.priority.includes(task.priority)
    ) {
      return false;
    }
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        task.tags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }
    return true;
  });
}

export function sortItemsByPriority<T extends KanbanItemProps>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) =>
      (PRIORITY_ORDER[a.priority as Priority] ?? 999) -
      (PRIORITY_ORDER[b.priority as Priority] ?? 999)
  );
}

export function getTasksForGroup<T extends KanbanItemProps>(
  items: T[],
  groupId: string,
  groupBy: GroupByField
): T[] {
  let filtered: T[];
  if (groupBy === "column") {
    filtered = items.filter((item) => item.columnId === groupId);
  } else if (groupBy === "priority") {
    filtered = items.filter((item) => item.priority === groupId);
  } else {
    filtered = items.filter((item) => {
      const tags = (item as unknown as { tags?: string[] }).tags;
      return tags?.includes(groupId) ?? false;
    });
  }
  return sortItemsByPriority(filtered);
}

export function getTagColumns(tasks: Task[], tags: Tag[]): Column[] {
  const tagSet = new Set<string>();
  for (const task of tasks) {
    for (const tag of task.tags) {
      tagSet.add(tag);
    }
  }
  return tags
    .filter((tag) => tagSet.has(tag.id))
    .map((tag, index) => ({
      id: tag.id,
      name: capitalize(tag.name),
      order: index,
    }));
}

export function getDisplayColumns(
  groupBy: GroupByField,
  columns: Column[],
  tasks: Task[],
  tags: Tag[]
): Column[] {
  if (groupBy === "column") {
    return columns;
  }
  if (groupBy === "priority") {
    return PRIORITY_COLUMNS;
  }
  return getTagColumns(tasks, tags);
}

export function getTargetColumnId<
  T extends { id: string; columnId: string },
  C extends { id: string },
>(overId: string, items: T[], columns: C[]): string | null {
  const isOverColumn = columns.some((col) => col.id === overId);
  if (isOverColumn) {
    return overId;
  }
  const overItem = items.find((item) => item.id === overId);
  return overItem?.columnId ?? null;
}

export function getColumnName<C extends { id: string; name: string }>(
  columnId: string,
  columns: C[]
): string {
  const column = columns.find((col) => col.id === columnId);
  return column?.name ?? columnId;
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
