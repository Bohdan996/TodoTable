import type { ColumnId } from "@/types/column";
import type { TaskType, TaskId } from "@/types/task";
import type { StateCreator } from "zustand";

export type TasksSlice = {
  tasks: TaskType[];
  selectedTaskIds: TaskId[];
  isSelectedAllTasks: boolean;

  createTask: (columnId: ColumnId, title: string) => TaskId;
  updateTask: (data: Partial<TaskType>) => void;
  deleteTask: (taskId: TaskId) => void;
  deleteTasks: (taskIds: TaskId[]) => void;
  changeTaskSelectStatus: (taskId: TaskId) => void;
};

export const createTasksSlice: StateCreator<
  TasksSlice,
  [],
  [],
  TasksSlice
> = (set) => ({
  tasks: [],
  selectedTaskIds: [],
  isSelectedAllTasks: false,

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
        },
      ],
    }));

    return id;
  },

  updateTask: (data: Partial<TaskType>) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === data.id ? { ...t, ...data } : t
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

  changeTaskSelectStatus: (taskId) =>
    set((state) => ({
      selectedTaskIds: state.selectedTaskIds?.includes(taskId)
      ? state.selectedTaskIds?.filter((id) => id !== taskId)
      : [...state.selectedTaskIds, taskId],
      isSelectedAllTasks: false,
    })),
});
