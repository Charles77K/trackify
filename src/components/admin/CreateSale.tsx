import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../ui/Input";
import Button from "../ui/Button";
import { useCreate, useFetch } from "../../services/tanstack-helpers";
import Toast from "../../lib/Toast";
import { SalesSchema, type SalesFormData } from "../../lib/schema";
import SelectInput from "../ui/SelectInput";
import type { OutletItem } from "../../pages/Outlets";
import type { InventoryItem } from "../../pages/Inventory";

const CreateSale = ({ onComplete }: { onComplete: () => void }) => {
  const { data, isPending, isError } = useFetch<{ results: OutletItem[] }>(
    "/outlets/"
  );
  const {
    data: item,
    isPending: isItemPending,
    isError: itemError,
  } = useFetch<{ results: InventoryItem[] }>("/inventory/");

  const inventory = item?.results;
  const outlets = data?.results;
  const { mutate, isPending: isCreating } = useCreate("/sales/");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SalesFormData>({
    resolver: zodResolver(SalesSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: SalesFormData) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        Toast.success("Success", "Purchase created successfully");
        reset();
        onComplete();
      },
      onError: () => {
        Toast.error(
          "Error",
          "An unexpected error occurred while creating purchase"
        );
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-4">
      <Controller
        name="outlet"
        control={control}
        render={({ field }) => (
          <SelectInput
            label="Outlet"
            value={field.value}
            options={outlets!}
            isError={isError}
            isLoading={isPending}
            onChange={(val) => field.onChange(Number(val))}
            optionMain={(option) => option.name}
            optionValue={(option) => option.id as number}
            placeholder="Enter outlet"
            error={errors?.outlet}
          />
        )}
      />

      <Controller
        name="item"
        control={control}
        render={({ field }) => (
          <SelectInput
            label="Item"
            value={field.value}
            options={inventory!}
            isError={itemError}
            isLoading={isItemPending}
            onChange={(val) => field.onChange(Number(val))}
            optionMain={(option) => option.name}
            optionValue={(option) => option.id as number}
            placeholder="Enter item"
            error={errors?.outlet}
          />
        )}
      />
      <InputField
        label="Quantity"
        type="number"
        {...register("quantity", { valueAsNumber: true })}
        placeholder="Enter quantity"
        error={errors?.quantity}
      />

      <InputField
        label="Total Price"
        type="text"
        defaultValue={60}
        readOnly
        {...register("total_price")}
        placeholder="Enter total price (e.g. 250.00)"
        error={errors?.total_price}
      />

      <Button
        disabled={isCreating}
        type="submit"
        className="text-white px-4 py-2"
      >
        {isCreating ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};

export default CreateSale;
