import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../ui/Input";
import Button from "../ui/Button";
import SelectInput from "../ui/SelectInput";
import { useCreate, useFetch } from "../../services/tanstack-helpers";
import Toast from "../../lib/Toast";
import { InventorySchema, type InventoryFormData } from "../../lib/schema";
import type { Category } from "../../pages/Categories";

const CreateInventory = ({ onComplete }: { onComplete: () => void }) => {
  const { mutate, isPending: isCreating } = useCreate("/inventory/");

  const { data, isPending, isError } = useFetch<{ results: Category[] }>(
    "/categories/"
  );

  const categories = data?.results;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InventoryFormData>({
    resolver: zodResolver(InventorySchema),
    mode: "onBlur",
  });

  const onSubmit = (data: InventoryFormData) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        Toast.success("Success", "Inventory item created successfully");
        reset();
        onComplete();
      },
      onError: () => {
        Toast.error(
          "Error",
          "An unexpected error occurred while creating inventory item"
        );
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-4">
      <InputField
        label="Name"
        type="text"
        {...register("name")}
        placeholder="Enter item name"
        error={errors?.name}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <SelectInput
            label="Category"
            value={field.value}
            options={categories!}
            isError={isError}
            isLoading={isPending}
            onChange={(val) => field.onChange(val)}
            optionMain={(option) => option.name}
            optionValue={(option) => option.id}
            placeholder="Select category"
            error={errors?.category}
          />
        )}
      />

      <InputField
        label="Quantity"
        type="number"
        {...register("quantity", { valueAsNumber: true })}
        placeholder="Enter current quantity"
        error={errors?.quantity}
      />

      <InputField
        label="Minimum Quantity"
        type="number"
        {...register("min_quantity", { valueAsNumber: true })}
        placeholder="Enter minimum stock level"
        error={errors?.min_quantity}
      />

      <InputField
        label="Unit"
        {...register("unit")}
        placeholder="Enter unit name"
        error={errors?.unit}
      />

      <InputField
        label="Cost Price"
        type="text"
        {...register("cost_price")}
        placeholder="Enter cost price (e.g. 150.00)"
        error={errors?.cost_price}
      />

      <InputField
        label="Selling Price"
        type="text"
        {...register("selling_price")}
        placeholder="Enter selling price (e.g. 200.00)"
        error={errors?.selling_price}
      />

      <Button
        disabled={isCreating}
        type="submit"
        className="text-white text-sm px-4 py-3"
      >
        {isCreating ? "Creating..." : "Create Item"}
      </Button>
    </form>
  );
};

export default CreateInventory;
