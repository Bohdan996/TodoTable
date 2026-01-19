import type { TaskId } from "./task";

export type ColumnId = string;

export interface ColumnType {
  id: ColumnId;
  title: string;
  order: number;
  color: string;
  taskIds: TaskId[];
}