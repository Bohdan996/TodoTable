import type { StateCreator } from "zustand";

import { todoColumns } from "@/assets/data/column";
import type { 
  ColumnType, 
  ColumnId, 
  ColumnFormValues 
} from "@/types/column";
import type { TaskId } from "@/types/task";

export type ColumnsSlice = {
  columns: ColumnType[];

  createColumn: (title: string, color: string) => ColumnId;
  editColumn: (
    columnId: ColumnId,
    data: ColumnFormValues
  ) => void;
  addTaskToColumn: (columnId: ColumnId, taskId: TaskId) => void;
  removeTaskFromColumn: (columnId: ColumnId, taskId: TaskId) => void;
  deleteColumn: (columnId: ColumnId) => TaskId[];
};

export const createColumnsSlice: StateCreator<
  ColumnsSlice,
  [],
  [],
  ColumnsSlice
> = (set, get) => ({
  columns: todoColumns,

  createColumn: (title, color) => {
    const id = crypto.randomUUID();
    
    set((state) => ({
      columns: [
        ...state.columns,
        {
          id,
          title,
          order: state.columns.length + 1,
          color,
          taskIds: [],
        },
      ],
    }));

    return id;
  },

  editColumn: (columnId, data) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              ...(data.title !== undefined && { title: data.title }),
              ...(data.color !== undefined && { color: data.color }),
            }
          : col
      ),
    })),


  addTaskToColumn: (columnId, taskId) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, taskIds: [...col.taskIds, taskId] }
          : col
      ),
    })),

  removeTaskFromColumn: (columnId, taskId) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              taskIds: col.taskIds.filter((id) => id !== taskId),
            }
          : col
      ),
    })),

  deleteColumn: (columnId) => {
    const column = get().columns.find((c) => c.id === columnId);
    const taskIds = column?.taskIds ?? [];

    set((state) => ({
      columns: state.columns.filter((c) => c.id !== columnId),
    }));

    return taskIds;
  },
});
