"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OtpForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = decodeURIComponent(searchParams.get("email") || "");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const { mutate: verifyOtp, isPending } = useMutation({
    mutationKey: ["verify-otp", email],
    mutationFn: async (payload: { otp: string; email: string }) => {
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "OTP verification failed");
        return;
      }

      toast.success(data?.message || "Verification successful");
      router.push(
        `/forgot-password/otp/reset-password?email=${encodeURIComponent(email)}`
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "OTP verification failed");
    },
  });

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationKey: ["resend-otp", email],
    mutationFn: async () => {
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forget-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Failed to resend code");
        return;
      }

      toast.success(data?.message || "Verification code resent");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resend code");
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(0, 1);
    setOtp(nextOtp);

    if (value && index < nextOtp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text/plain").trim();

    if (!/^\d{6}$/.test(pasted)) return;

    setOtp(pasted.split(""));
    inputRefs.current[otp.length - 1]?.focus();
  };

  const handleVerify = () => {
    const otpValue = otp.join("");

    if (!email) {
      toast.error("Missing email address for verification");
      return;
    }

    if (otpValue.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    verifyOtp({ otp: otpValue, email });
  };

  return (
    <div className="w-full max-w-[570px] rounded-[20px] border border-[#DCEEFE] bg-[#F7F7F7] p-6 shadow-[0px_18px_50px_rgba(46,171,252,0.12)] md:p-8">
      <div className="flex w-full items-center justify-center pb-6">
        <Link href="/signin">
          <Image
            src="/assets/images/logo.png"
            alt="auth logo"
            width={500}
            height={500}
            className="h-[136px] w-[136px] object-contain"
          />
        </Link>
      </div>

      <h3 className="text-center text-2xl font-bold leading-[120%] text-[#131313] md:text-[32px] lg:text-[40px]">
        Enter OTP
      </h3>
      <p className="pb-6 pt-2 text-center text-base font-normal leading-[150%] text-[#787878] md:text-lg">
        We sent a 6-digit verification code to <span className="font-semibold">{email}</span>.
      </p>

      <div className="flex w-full justify-center gap-3 md:gap-5">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="h-14 w-12 rounded-[8px] border border-transparent bg-[#E9E9E9] text-center text-xl font-semibold text-[#212121] focus-visible:border-[#2EABFC] focus-visible:ring-2 focus-visible:ring-[#2EABFC]/20 md:h-16 md:w-14"
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pb-5 pt-6">
        <span className="text-base font-medium leading-[120%] text-black">
          Didn&apos;t receive OTP?
        </span>
        <button
          type="button"
          onClick={() => resendOtp()}
          disabled={isResending || !email}
          className="text-base font-medium leading-[120%] text-[#2EABFC] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>
      </div>

        <Button
        onClick={handleVerify}
        disabled={isPending || !email}
        style={{ backgroundColor: "#2EABFC" }}
        className="h-[52px] w-full rounded-[8px] text-lg font-semibold text-[#F4F4F4] shadow-[0px_10px_24px_rgba(46,171,252,0.3)] hover:bg-[#2297e3]"
      >
        {isPending ? "Verifying..." : "Verify"}
      </Button>
    </div>
  );
}
