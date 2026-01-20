import { useForm, useWatch } from "react-hook-form";

import { useBoardStore } from "@/store/boardStore";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import type { ColumnFormValues } from "@/types/column";
import ErrorText from "@/components/ui/errorText";

import "./ColumnForm.scss";

type ColumnFormType = {
  type: "create" | "edit";
  defaultValues?: ColumnFormValues;
  closeAction: () => void
};

export default function ColumnForm({
  type,
  defaultValues,
  closeAction,
}: ColumnFormType) {
  const createColumn = useBoardStore(state => state.createColumn);
  const editColumn = useBoardStore(state => state.editColumn);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ColumnFormValues>({
    defaultValues: {
      title: "",
      color: "#E6E6E6",
      ...defaultValues,
    },
    mode: "onSubmit",
  });

  const color = useWatch({
    control,
    name: "color",
  });

  const onSubmit = (data: ColumnFormValues) => {
    const {title, color} = data;

    if (type === 'create') {
      createColumn(title, color)
    } else {
      if (defaultValues) {
        editColumn(
          defaultValues?.columnId, 
          data
        )
      }
    }
    closeAction()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ColumnForm">
      <div className="ColumnForm__input-wrpr">
        <Input
          variant="outline"
          fullWidth
          placeholder="Column title"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 2,
              message: "Minimum 2 characters",
            },
          })}
        />

        {errors.title?.message && (
          <ErrorText text={errors.title.message} />
        )}
      </div>

      <div className="ColumnForm__color">
        <label className="ColumnForm__color-label">
          Column color
        </label>

        <div className="ColumnForm__color-picker">
          <input
            type="color"
            className="ColumnForm__color-native"
            {...register("color")}
          />

          <div
            className="ColumnForm__color-preview"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      <Button
        content={type === "create" ? "Create" : "Save"}
        type="submit"
        variant="fill"
        color="primary"
        fullWidth
      />
    </form>
  );
}
