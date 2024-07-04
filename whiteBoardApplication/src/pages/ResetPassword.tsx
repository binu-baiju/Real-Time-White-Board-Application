// components/ResetPassword.tsx
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { register } from "module";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type resetPasswordData = z.infer<typeof resetPasswordSchema>;
interface ErrorResponse {
  error?: string;
}

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm<resetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");

  const onSubmit = async (data: resetPasswordData) => {
    try {
      console.log("hello hai");

      const response = await axios.post(
        "http://localhost:5000/api/resetpassword",
        { password, token }
      );
      console.log("response Data:", response);
      if (response.data.success) {
        toast.success("Password reset Successfull");
      }
      // Show success message to the user
    } catch (error) {
      console.log(error);
      toast.error("Error to reset Password");

      // Show error message to the user
    }
  };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:5000/api/resetpassword",
  //         { password, token }
  //       );
  //       if (response.data) {
  //         toast.success("Password reset Successfull");
  //       }
  //       // Show success message to the user
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Error to reset Password");
  //       // Show error message to the user
  //     }
  //   };

  return (
    <>
      {/* <form onSubmit={handleSubmit}>
        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form> */}
      <Toaster />

      <Dialog open={true}>
        <DialogTrigger asChild>
          {/* <button> */}
          <a className="text-blue-600 text-sm hover:underline">
            Forgot Password?
          </a>
          {/* </button> */}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col  space-y-4 justify-center "
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid flex-1 gap-2 ">
              <Label htmlFor="link" className="sr-only">
                New Password
              </Label>
              <input
                {...register("password")}
                type="password"
                className={`w-full text-sm border-b border-gray-300
               focus:border-blue-600 px-2 py-3 outline-none`}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required

                // onChange={(e) =>
                //   // handleInputChange("password", e.target.value)
                // }
              />
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Reset Password
              </button>
            </div>
          </form>

          <DialogFooter className="sm:justify-start">
            <Link to="/login">Go to Login Page</Link>

            {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResetPassword;
