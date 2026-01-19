import { useMemo } from "react";
import { useBoardStore } from "./boardStore";
import type { ColumnId } from "@/types/column";
import type { TaskType } from "@/types/task";

export const useColumns = () =>
  useBoardStore((s) => s.columns);


export const useTasksByColumn = (columnId: ColumnId): TaskType[] => {
  const getFilteredTasks = useBoardStore(
    (state) => state.getFilteredTasksByColumn
  );
  
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const tasks = useBoardStore((state) => state.tasks);

  return useMemo(
    () => getFilteredTasks(columnId),
    [
      getFilteredTasks, 
      columnId, 
      searchQuery, 
      tasks
    ]
  );
};


