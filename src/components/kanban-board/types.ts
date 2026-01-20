export type Priority = "low" | "medium" | "high" | "urgent";

export type Assignee = {
  id: string;
  name: string;
  avatar?: string;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: Priority;
  tagIds: string[];
  assigneeIds?: string[];
  subtasks?: Subtask[];
  dueDate?: string;
  createdAt: string;
};

export type Column = {
  id: string;
  name: string;
  order: number;
};

export type FilterConfig = {
  priority: Priority[];
  tags: string[];
};

export type GroupByField = "column" | "priority" | "tag";

export type KanbanData = {
  name?: string;
  tasks: Task[];
  columns: Column[];
  teamMembers: Assignee[];
  tags: Tag[];
};
