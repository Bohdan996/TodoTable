import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createTasksSlice, type TasksSlice } from "./tasksSlice";
import { createColumnsSlice, type ColumnsSlice } from "./columnsSlice";
import type { ColumnId } from "@/types/column";
import type { TaskId, TaskType } from "@/types/task";

type TaskFilter = "all" | "completed" | "incompleted";

type BoardStore = TasksSlice &
  ColumnsSlice & {
    searchQuery: string;
    isSelectedAllTasksInColumn: boolean;
    globalTaskFilter: TaskFilter;
    columnTaskFilters: Record<ColumnId, TaskFilter>;

    setSearchQuery: (query: string) => void;
    setGlobalTaskFilter: (filter: TaskFilter) => void;
    setColumnTaskFilter: (columnId: ColumnId, filter: TaskFilter) => void;
    getFilteredTasksByColumn: (columnId: ColumnId) => TaskType[];
    createTaskInColumn: (columnId: ColumnId, title: string) => void;
    deleteColumnWithTasks: (columnId: ColumnId) => void;
    fullRemoveTask: (columnId: ColumnId, taskId: TaskId) => void;
    selectAllTasks: () => void;
    selectAllTasksInColumn: (columnId: ColumnId) => void;
    clearSelection: () => void;
    moveTask: (
      taskId: TaskId, 
      sourceColumnId: ColumnId, 
      destinationColumnId: ColumnId, 
      destinationIndex: number
    ) => void;
    reorderColumn: (sourceIndex: number, destinationIndex: number) => void;
    reorderTasksInColumn: (
      columnId: ColumnId, 
      sourceIndex: number, 
      destinationIndex: number
    ) => void;
    completeAllSelectedTasks: () => void;
    incompleteAllSelectedTasks: () => void;
    deleteAllSelectedTasks: () => void;
    moveSelectedTasksToColumn: (destinationColumnId: ColumnId) => void;
  };

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get, api) => ({
      ...createTasksSlice(set, get, api),
      ...createColumnsSlice(set, get, api),

      searchQuery: '',
      isSelectedAllTasksInColumn: false,
      globalTaskFilter: "all",
      columnTaskFilters: {},
      
      setSearchQuery: (query: string) => 
        set({ searchQuery: query.toLowerCase().trim() }),

      setGlobalTaskFilter: (filter: TaskFilter) =>
        set({ globalTaskFilter: filter }),

      setColumnTaskFilter: (columnId: ColumnId, filter: TaskFilter) =>
        set((state) => ({
          columnTaskFilters: {
            ...state.columnTaskFilters,
            [columnId]: filter,
          },
        })),
      
      getFilteredTasksByColumn: (columnId: ColumnId) => {
        const state = get();
        const column = state.columns.find((c) => c.id === columnId);

        if (!column) return [];

        const taskMap = new Map(state.tasks.map((t) => [t.id, t]));
        const seen = new Set<string>();

        let tasks = column.taskIds
          .map((taskId) => taskMap.get(taskId))
          .filter((task): task is TaskType => {
            if (!task) return false;
            if (seen.has(task.id)) return false;
            seen.add(task.id);
            return true;
          });

        if (state.searchQuery) {
          const searchLower = state.searchQuery.toLowerCase();
          tasks = tasks.filter((task) => task.title?.toLowerCase().includes(searchLower));
        }

        const filterToApply = state.columnTaskFilters[columnId] || state.globalTaskFilter;
        
        if (filterToApply === "completed") {
          tasks = tasks.filter((task) => task.completed);
        } else if (filterToApply === "incompleted") {
          tasks = tasks.filter((task) => !task.completed);
        }

        return tasks;
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

      fullRemoveTask: (columnId, taskId) => {
        const { deleteTask, removeTaskFromColumn } = get();
        removeTaskFromColumn(columnId, taskId);
        deleteTask(taskId);
      },

      selectAllTasks: () => 
        set((state) => {
          const allVisibleTaskIds = state.columns.flatMap((column) => {
            const filteredTasks = get().getFilteredTasksByColumn(column.id);
            return filteredTasks.map((task) => task.id);
          });
          
          return { 
            selectedTaskIds: allVisibleTaskIds,
            isSelectedAllTasks: true,
          };
        }),

      clearSelection: () =>
        set((state) => {
          const allVisibleTaskIds = state.columns.flatMap((column) => {
            const filteredTasks = get().getFilteredTasksByColumn(column.id);
            return filteredTasks.map((task) => task.id);
          });
            
          const remainingSelected = state.selectedTaskIds.filter(
            (id) => !allVisibleTaskIds.includes(id)
          );
          
          return { 
            selectedTaskIds: remainingSelected,
            isSelectedAllTasks: false,
          };
        }),

      selectAllTasksInColumn: (columnId) => 
        set((state) => {
          const column = state.columns.find((c) => c.id === columnId);
          if (!column) return {
            isSelectedAllTasksInColumn: !state.isSelectedAllTasksInColumn,
          };

          const visibleTasksInColumn = get().getFilteredTasksByColumn(columnId).map((task) => task.id);

          let newSelectedArr = [ ...state.selectedTaskIds];

          if (state.isSelectedAllTasksInColumn) {
            newSelectedArr = newSelectedArr.filter((t) => !visibleTasksInColumn?.includes(t))
          } else {
            const ids = [...state.selectedTaskIds, ...visibleTasksInColumn];
            newSelectedArr = [...new Set(ids)];
          }

          return { 
            selectedTaskIds: newSelectedArr,
            isSelectedAllTasksInColumn: !state.isSelectedAllTasksInColumn,
          };
        }),

      moveTask: (taskId, sourceColumnId, destinationColumnId, destinationIndex) => 
        set((state) => {
          const sourceColumn = state.columns.find((c) => c.id === sourceColumnId);
          const destColumn = state.columns.find((c) => c.id === destinationColumnId);

          if (!sourceColumn || !destColumn) return state;

          const newColumns = state.columns.map((col) => {
            if (col.id === sourceColumnId) {
              return {
                ...col,
                taskIds: col.taskIds.filter((id) => id !== taskId),
              };
            }
            if (col.id === destinationColumnId) {
              const newTaskIds = [...col.taskIds];
              newTaskIds.splice(destinationIndex, 0, taskId);
              return {
                ...col,
                taskIds: newTaskIds,
              };
            }
            return col;
          });

          const newTasks = state.tasks.map((task) =>
            task.id === taskId ? { ...task, columnId: destinationColumnId } : task
          );

          return {
            columns: newColumns,
            tasks: newTasks,
          };
        }),

      reorderColumn: (sourceIndex, destinationIndex) =>
        set((state) => {
          const newColumns = [...state.columns];
          const [removed] = newColumns.splice(sourceIndex, 1);
          newColumns.splice(destinationIndex, 0, removed);

          return { columns: newColumns };
        }),

      reorderTasksInColumn: (columnId, sourceIndex, destinationIndex) =>
        set((state) => {
          const column = state.columns.find((c) => c.id === columnId);
          if (!column) return {};

          const newTaskIds = [...column.taskIds];
          const [removed] = newTaskIds.splice(sourceIndex, 1);
          newTaskIds.splice(destinationIndex, 0, removed);

          const newColumns = state.columns.map((col) =>
            col.id === columnId ? { ...col, taskIds: newTaskIds } : col
          );

          return {
            columns: newColumns,
          };
        }),

        completeAllSelectedTasks: () =>
        set((state) => {
          const selectedIds = new Set(state.selectedTaskIds);
          
          return {
            tasks: state.tasks.map((task) =>
              selectedIds.has(task.id)
                ? { ...task, completed: true }
                : task
            ),
          };
        }),

      incompleteAllSelectedTasks: () =>
        set((state) => {
          const selectedIds = new Set(state.selectedTaskIds);
          
          return {
            tasks: state.tasks.map((task) =>
              selectedIds.has(task.id)
                ? { ...task, completed: false }
                : task
            ),
          };
        }),

      deleteAllSelectedTasks: () =>
        set((state) => {
          const selectedIds = new Set(state.selectedTaskIds);
          
          const remainingTasks = state.tasks.filter(
            (task) => !selectedIds.has(task.id)
          );
          
          const updatedColumns = state.columns.map((column) => ({
            ...column,
            taskIds: column.taskIds.filter(
              (taskId) => !selectedIds.has(taskId)
            ),
          }));
          
          return {
            tasks: remainingTasks,
            columns: updatedColumns,
            selectedTaskIds: [],
            isSelectedAllTasks: false,
            isSelectedAllTasksInColumn: false,
          };
        }),
      
      moveSelectedTasksToColumn: (destinationColumnId) =>
        set((state) => {
          const selectedIds = new Set(state.selectedTaskIds);

          if (selectedIds.size === 0) return {};

          const destinationColumn = state.columns.find(
            (c) => c.id === destinationColumnId
          );

          if (!destinationColumn) return {};

          const orderedSelectedTasks = state.tasks
            .filter((t) => selectedIds.has(t.id))
            .map((t) => t.id);

          const updatedColumns = state.columns.map((column) => {
            const filteredTaskIds = column.taskIds.filter(
              (id) => !selectedIds.has(id)
            );

            if (column.id === destinationColumnId) {
              return {
                ...column,
                taskIds: [...filteredTaskIds, ...orderedSelectedTasks],
              };
            }

            return {
              ...column,
              taskIds: filteredTaskIds,
            };
          });

          const updatedTasks = state.tasks.map((task) =>
            selectedIds.has(task.id)
              ? { ...task, columnId: destinationColumnId }
              : task
          );

          return {
            columns: updatedColumns,
            tasks: updatedTasks,
            isSelectedAllTasksInColumn: false,
          };
        }),
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