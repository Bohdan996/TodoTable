import type { TaskId } from "./task";

export type ColumnId = string;

export type ColumnFormValues = {
  columnId: ColumnId;
  title: string;
  color: string;
}

export interface ColumnType {
  id: ColumnId;
  title: string;
  order: number;
  color: string;
  taskIds: TaskId[];
}