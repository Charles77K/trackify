import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { outletFormSchema, type OutletFormData } from "../../lib/schema";
import InputField from "../ui/Input";
import Button from "../ui/Button";
import { useCreate } from "../../services/tanstack-helpers";
import Toast from "../../lib/Toast";

const CreateOutlet = ({ onComplete }: { onComplete: () => void }) => {
  const { mutate, isPending } = useCreate("/outlets/");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OutletFormData>({
    resolver: zodResolver(outletFormSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: OutletFormData) => {
    mutate(data, {
      onSuccess: () => {
        Toast.success("Success", "Outlet created successfully");
        reset();
        onComplete();
      },
      onError: () => {
        Toast.error("Error", "An error occurred while creating outlet");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-4">
      <InputField
        label="Outlet Name"
        {...register("name")}
        placeholder="Enter outlet name"
        error={errors?.name}
      />

      <InputField
        label="Location"
        {...register("location")}
        placeholder="Enter location (optional)"
        error={errors?.location}
      />

      <Button
        disabled={isPending}
        type="submit"
        className="text-white px-4 py-2"
      >
        {isPending ? "Submitting..." : "Create Outlet"}
      </Button>
    </form>
  );
};

export default CreateOutlet;
