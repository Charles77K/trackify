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
    console.log(data);
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
    <div className="p-4 min-h-screen">
      <main className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* login form section */}
        <section className="flex-1 flex-col-center">
          <div className="max-w-md mx-auto w-full">
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

              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-3"
              >
                <p>{isPending ? "Logging In" : "Login"} </p>
              </Button>
            </form>
          </div>
        </section>

        {/* hero section */}
        <section className="flex-1 hidden md:flex rounded-xl relative overflow-hidden">
          <img
            src="/vector.jpg"
            className="h-full w-full object-cover rounded-xl"
            alt="Hotel management"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent rounded-xl"></div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12">
            <div className="text-white max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-tight">
                Streamline Your Hotel Operations
              </h2>
              <p className="text-lg md:text-xl mb-6 text-white/90 leading-relaxed">
                Manage inventory, track bookings, and optimize your hotel's
                performance with our comprehensive management system.
              </p>

              {/* Feature highlights */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/95">
                    Real-time inventory tracking
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/95">
                    Automated booking management
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-white/95">
                    Comprehensive analytics dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
