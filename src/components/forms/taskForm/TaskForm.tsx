import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { useBoardStore } from "@/store/boardStore";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import type { TaskType } from "@/types/task";

import "./TaskForm.scss";
import ErrorText from "@/components/ui/errorText";

type TaskFormType = {
  type: 'create' | 'edit';
  columnId: string;
  defaultValues?: Partial<TaskType>;
  closeAction: () => void;
};

export default function TaskForm({
  type,
  columnId,
  defaultValues,
  closeAction,
}: TaskFormType) {
  const formRef = useRef<HTMLFormElement | null>(null);

  const createTask = useBoardStore((s) => s.createTaskInColumn);
  const updateTask = useBoardStore((s) => s.updateTask);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ title: string }>({
    mode: "onSubmit",
    defaultValues: {
      title: defaultValues?.title || ""
    },
  });

  const onSubmit = (data: { title: string}) => {
    if (type === "create") {
      createTask(columnId, data?.title);
    } else if (type === "edit" && defaultValues) {
      updateTask({
        ...data,
        id: defaultValues?.id
      });
    }
    closeAction();
  };

  useEffect(() => {
    if (defaultValues) {
      setValue("title", defaultValues.title || "");
    }
  }, [defaultValues, setValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        closeAction();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeAction]);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="TaskForm">
      <div className="TaskForm__input-wrpr">
        <Input
          variant="transparent"
          fullWidth
          placeholder="Task title"
          {...register("title", {
            required: "Title is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
          })}
        />
        
        {errors.title?.message && (
          <ErrorText text={errors.title.message} />
        )}
      </div>

      <Button
        content={type === "create" ? "Create" : "Save"}
        type="submit"
        variant="outline"
        color="primary"
        fullWidth
      />
    </form>
  );
}
