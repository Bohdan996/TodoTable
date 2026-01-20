import type { ColumnId } from "./column";

export type TaskId = string;

export interface TaskType {
  id: TaskId;
  title: string;
  completed: boolean;
  columnId: ColumnId;
}