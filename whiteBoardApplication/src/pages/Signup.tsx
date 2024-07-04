import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

// Define the validation schema using Zod
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Infer the type from the schema
type SignupData = z.infer<typeof signupSchema>;

// Define the ErrorResponse interface
interface ErrorResponse {
  error?: string;
}

export default function Signup() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize useForm with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors, // Import clearErrors function
    setError,
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  // Handle form submission
  const onSubmit = async (data: SignupData) => {
    try {
      setServerError(null);
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data,
        { withCredentials: true }
      );
      console.log(response.data.message);
      if (response.data.success) {
        navigate(`/login`);
      }
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data?.error) {
        console.log(err.response?.data);
        setServerError(err.response.data.error);
      } else {
        setServerError("Something went wrong");
      }
    }
  };

  // Handle input change to clear server error
  // const handleInputChange = (name: keyof SignupData, value: string) => {
  //   setValue(name, value); // Set the input value using setValue
  //   setServerError(null); // Clear the server error

  //   // Validate input value against Zod schema
  //   try {
  //     const parsedValue = signupSchema.parse({ [name]: value });
  //     console.log("hello");

  //     if (parsedValue[name] === value) {
  //       // If the parsed value matches the input value, clear errors
  //       clearErrors(name);
  //     }
  //   } catch (error) {
  //     console.log("showing errors");
  //     // If parsing fails, set the error message
  //     setError(name, {
  //       type: "manual",
  //       message: (error as Error).message,
  //     });
  //   }
  // };

  return (
    <div className="flex justify-center items-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4">
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
            <h3 className="text-3xl font-extrabold text-blue-600">Sign Up</h3>
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
                // onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Sign Up
            </button>
          </div>
          {serverError && (
            <p className="text-red-600 text-sm mt-4">{serverError}</p>
          )}
        </form>
      </div>
    </div>
  );
}
