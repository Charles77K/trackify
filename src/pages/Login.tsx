/* eslint-disable @typescript-eslint/no-explicit-any */
import InputField from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import Button from "../components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../lib/schema";
import { useNavigate } from "react-router-dom";
import { useCreate } from "../services/tanstack-helpers";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { login } from "../store/slices/authSlice";
import Toast from "../lib/Toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { mutate, isPending } = useCreate<LoginSchema>("/auth/login/");

  // hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginSchema) => {
    mutate(data, {
      onSuccess: (data: any) => {
        dispatch(login(data));
        Toast.success("Success", "Login successful");
        navigate("/");
      },
      onError: (err: any) => {
        console.log("Error", err);
        Toast.error("Error", "An unexpected error occurred please try again");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Form container with shadow and background */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          <div className="mb-10">
            <h1 className="font-semibold text-sidebar text-center text-2xl md:text-3xl mb-3">
              Welcome back to SmartQ
            </h1>
            <p className="font-inter text-center text-text-primary font-light text-sm">
              Enter your username and password to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
              {...register("username")}
              label="Username"
              placeholder="Enter your username"
              error={errors.username}
              autoComplete="username"
            />

            <PasswordInput
              {...register("password")}
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              autoComplete="current-password"
            />

            <Button type="submit" disabled={isPending} className="w-full py-3">
              <p>{isPending ? "Logging In" : "Login"} </p>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
