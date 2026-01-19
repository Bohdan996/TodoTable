import type { ColumnId } from "@/types/column";
import type { TaskType, TaskId, TaskFormValues } from "@/types/task";
import type { StateCreator } from "zustand";

export type TasksSlice = {
  tasks: TaskType[];

  createTask: (columnId: ColumnId, title: string) => TaskId;
  updateTask: (data: TaskFormValues) => void;
  updateTaskColumn: (taskId: TaskId, columnId: ColumnId) => void;
  deleteTask: (taskId: TaskId) => void;
  deleteTasks: (taskIds: TaskId[]) => void;
};

export const createTasksSlice: StateCreator<
  TasksSlice,
  [],
  [],
  TasksSlice
> = (set) => ({
  tasks: [],

  createTask: (columnId, title) => {
    const id = crypto.randomUUID();

    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id,
          title,
          completed: false,
          columnId,
          order: 0,
        },
      ],
    }));

    return id;
  },

  updateTask: (data: TaskFormValues) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === data.taskId ? { ...t, ...data } : t
      ),
    })),


  updateTaskColumn: (taskId, columnId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId } : t
      ),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),

  deleteTasks: (taskIds) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => !taskIds.includes(t.id)),
    })),
});
