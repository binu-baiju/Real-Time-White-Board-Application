import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

import { ForgotPassword } from "../components/ForgotPassword";

// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Infer the type from the schema
type LoginData = z.infer<typeof loginSchema>;

// Define the ErrorResponse interface
interface ErrorResponse {
  error?: string;
}

const notifyError = (error: string) => toast.error(error);
const notifySuccess = () => toast.success("Login Successfull");

export default function Login() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize useForm with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  // Handle form submission
  const onSubmit = async (data: LoginData) => {
    try {
      console.log("hello");

      setServerError(null);
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        { withCredentials: true }
      );
      const token = response.data.token;
      console.log(token);
      if (token) {
        Cookies.set("token", token, { expires: 7, secure: true });
        notifySuccess();
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.log("hoi hoi");
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data?.error) {
        console.log("err.response.data.error", err.response.data.error);
        notifyError(err.response.data.error);
        setServerError(err.response.data.error);
      } else {
        setServerError("Something went wrong");
      }
    }
  };

  // Handle input change to clear server error
  // const handleInputChange = (name: keyof LoginData, value: string) => {
  //   setValue(name, value);
  //   setServerError(null);

  //   try {
  //     const parsedValue = loginSchema.parse({ [name]: value });
  //     if (parsedValue[name] === value) {
  //       clearErrors(name);
  //     }
  //   } catch (error) {
  //     setError(name, {
  //       type: "manual",
  //       message: (error as Error).message,
  //     });
  //   }
  // };
  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4">
        <Toaster />

        <div className="grid justify-center max-w-md mx-auto">
          <div>
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full object-cover"
              alt="login-image"
            />
          </div>
          <form
            className="bg-white rounded-2xl p-6 -mt-24 relative z-10 shadow-[0_2px_16px_-3px_rgba(6,81,237,0.3)]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-10">
              <h3 className="text-3xl font-extrabold text-blue-600"> Login</h3>
            </div>
            <div>
              <div className="relative flex items-center">
                <input
                  {...register("email")}
                  type="text"
                  className={`w-full text-sm border-b ${
                    errors.email ? "border-red-600" : "border-gray-300"
                  } focus:border-blue-600 px-2 py-3 outline-none`}
                  placeholder="Enter email"

                  // onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-[18px] h-[18px] absolute right-2"
                  viewBox="0 0 682.667 682.667"
                >
                  <defs>
                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                      <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                    </clipPath>
                  </defs>
                  <g
                    clip-path="url(#a)"
                    transform="matrix(1.33 0 0 -1.33 0 682.667)"
                  >
                    <path
                      fill="none"
                      stroke-miterlimit="10"
                      stroke-width="40"
                      d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                      data-original="#000000"
                    ></path>
                  </g>
                </svg>
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="mt-8">
              <div className="relative flex items-center">
                <input
                  {...register("password")}
                  type="password"
                  className={`w-full text-sm border-b ${
                    errors.password ? "border-red-600" : "border-gray-300"
                  } focus:border-blue-600 px-2 py-3 outline-none`}
                  placeholder="Enter password"
                  // onChange={(e) =>
                  //   // handleInputChange("password", e.target.value)
                  // }
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                  viewBox="0 0 128 128"
                >
                  <path
                    d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 mt-6">
              {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm">
                Remember me
              </label>
            </div> */}
              <div>
                {/* <a
                  href="jajvascript:void(0);"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot Password?
                </a> */}

                <ForgotPassword />
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Login
              </button>
              <p className="text-sm text-center mt-6">
                Don't have an account{" "}
                <a
                  href="/signup"
                  className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
