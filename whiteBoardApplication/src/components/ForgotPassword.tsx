import { z } from "zod";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

import toast from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
interface ErrorResponse {
  error?: string;
}

const notifyError = (error: string) => toast.error(error);
const notifySuccess = () => toast.success("Email sent");
export function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      console.log("hello");

      const response = await axios.post(
        "http://localhost:5000/api/sendforgotpasswordemail",
        data,
        { withCredentials: true }
      );
      const success = response.data.sucess;
      console.log(response.data);
      if (success) {
        notifySuccess();
      }
    } catch (error) {
      console.log("hoi hoi");
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data?.error) {
        console.log("err.response.data.error", err.response.data.error);
        notifyError(err.response.data.error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <button> */}
        <a className="text-blue-600 text-sm hover:underline">
          Forgot Password?
        </a>
        {/* </button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col  space-y-4 justify-center "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid flex-1 gap-2 ">
            <Label htmlFor="link" className="sr-only">
              Email
            </Label>
            <input
              {...register("email")}
              type="text"
              className={`w-full text-sm border-b border-gray-300
               focus:border-blue-600 px-2 py-3 outline-none`}
              placeholder="Enter Email"

              // onChange={(e) =>
              //   // handleInputChange("password", e.target.value)
              // }
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Send
            </button>
          </div>
        </form>
        <DialogFooter className="sm:justify-start">
          {/* <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
