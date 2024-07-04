import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const VerifyEmail = () => {
  const { verificationCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // const token = Cookies.get("token");

      try {
        const result = await axios.get(
          `http://localhost:5000/api/verify-email/${verificationCode}`,
          {
            // headers: { Authorization: token },
          }
        );
        if (result.data.success) {
          setSuccess(true);
          toast.success("Email verified successfully");
        }
      } catch (error) {
        setSuccess(false);
        toast.error("Verification failed, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [verificationCode]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (success) {
    return (
      <div>
        <Toaster />
        <h1>Email Verification</h1>
        <p>Email verified successfully, you can now log in.</p>
      </div>
    );
  } else {
    return (
      <div>
        <Toaster />
        <h1>Email Verification</h1>
        <p>Email verified failed, try again</p>
      </div>
    );
  }
};

export default VerifyEmail;
