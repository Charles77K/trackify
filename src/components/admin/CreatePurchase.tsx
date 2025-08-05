import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemFormSchema, type ItemFormData } from "../../lib/schema";
import InputField from "../ui/Input";
import Button from "../ui/Button";
import { useCreate } from "../../services/tanstack-helpers";
import Toast from "../../lib/Toast";

const CreatePurchase = ({ onComplete }: { onComplete: () => void }) => {
  const { mutate, isPending } = useCreate("/purchases/");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: ItemFormData) => {
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
      <InputField
        label="Item"
        type="number"
        defaultValue={1}
        readOnly
        {...register("item", { valueAsNumber: true })}
        placeholder="Enter the item number e.g 1,2,3"
        error={errors?.item}
      />

      <InputField
        label="Quantity"
        type="number"
        {...register("quantity")}
        placeholder="Enter the quantity"
        error={errors?.quantity}
      />

      <InputField
        label="Supplier"
        {...register("supplier")}
        placeholder="Enter supplier name"
        error={errors?.supplier}
      />

      <InputField
        label="Cost"
        {...register("cost")}
        placeholder="Enter cost"
        error={errors?.cost}
      />

      <Button
        disabled={isPending}
        type="submit"
        className="text-white px-4 py-2"
      >
        {isPending ? "Submitting" : "Submit"}
      </Button>
    </form>
  );
};

export default CreatePurchase;
