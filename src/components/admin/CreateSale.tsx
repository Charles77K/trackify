import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../ui/Input";
import Button from "../ui/Button";
import { useCreate, useFetch } from "../../services/tanstack-helpers";
import Toast from "../../lib/Toast";
import { SalesSchema, type SalesFormData } from "../../lib/schema";
import SelectInput from "../ui/SelectInput";

const CreateSale = ({ onComplete }: { onComplete: () => void }) => {
  const { data, isPending, isError } = useFetch("/outlets/");
  const { mutate, isPending: isCreating } = useCreate("/purchases/");
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
        control={control} // required
        render={({ field }) => (
          <SelectInput
            label="Outlet"
            value={field.value}
            options={data}
            isError={isError}
            onChange={field.onChange}
            optionMain={(option) => option as string}
            optionValue={(option) => option as string}
            isLoading={isPending}
            placeholder="Enter outlet ID"
            error={errors?.outlet}
          />
        )}
      />

      <InputField
        label="Item"
        type="number"
        defaultValue={1}
        readOnly
        {...register("item", { valueAsNumber: true })}
        placeholder="Enter item ID"
        error={errors?.item}
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
