import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createTasksSlice, type TasksSlice } from "./tasksSlice";
import { createColumnsSlice, type ColumnsSlice } from "./columnsSlice";
import type { ColumnId } from "@/types/column";
import type { TaskId, TaskType } from "@/types/task";


type BoardStore = TasksSlice &
  ColumnsSlice & {
    searchQuery: string;

    setSearchQuery: (query: string) => void;
    getFilteredTasksByColumn: (columnId: ColumnId) => TaskType[];
    moveTaskBetweenColumns: (
      taskId: string,
      fromColumnId: string,
      toColumnId: string
    ) => void;
    createTaskInColumn: (columnId: ColumnId, title: string) => void;
    deleteColumnWithTasks: (columnId: ColumnId) => void;
    fullRemoveTask:(columnId: ColumnId, taskId: TaskId) => void;
  };


export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get, api) => ({
      ...createTasksSlice(set, get, api),
      ...createColumnsSlice(set, get, api),

      searchQuery: '',

      setSearchQuery: (query: string) => 
        set({ searchQuery: query.toLowerCase().trim() }),
      
      getFilteredTasksByColumn: (columnId: ColumnId) => {
        const state = get();
        const column = state.columns.find((c) => c.id === columnId);
        
        if (!column) return [];
        
        const taskMap = new Map(state.tasks.map((t) => [t.id, t]));
        const tasks = column.taskIds
          .map((taskId) => taskMap.get(taskId))
          .filter(Boolean) as TaskType[];
        
        if (!state.searchQuery) return tasks;
        
        return tasks.filter((task) => {
          const searchLower = state.searchQuery;
          return (
            task.title?.toLowerCase().includes(searchLower)
          );
        });
      },

      createTaskInColumn: (columnId, title) => {
        const { createTask, addTaskToColumn } = get();

        const taskId = createTask(columnId, title);
        addTaskToColumn(columnId, taskId);
      },

      deleteColumnWithTasks: (columnId) => {
        const { deleteColumn, deleteTasks } = get();

        const taskIds = deleteColumn(columnId);
        deleteTasks(taskIds);
      },

      moveTaskBetweenColumns: (
        taskId,
        fromColumnId,
        toColumnId
      ) => {
        const {
          removeTaskFromColumn,
          addTaskToColumn,
          updateTaskColumn,
        } = get();

        removeTaskFromColumn(fromColumnId, taskId);
        addTaskToColumn(toColumnId, taskId);
        updateTaskColumn(taskId, toColumnId);
      },

      fullRemoveTask: (columnId, taskId) => {
        const { deleteTask, removeTaskFromColumn } = get();
        removeTaskFromColumn(columnId, taskId);
        deleteTask(taskId);
      }, 
    }),
    {
      name: "board-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        tasks: state.tasks,
        columns: state.columns,
      }),
    }
  )
);
