"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = decodeURIComponent(searchParams.get("email") || "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password", email],
    mutationFn: async (values: { email: string; newPassword: string }) => {
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      return res.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Password reset failed");
        return;
      }

      toast.success(data?.message || "Password reset successfully");
      router.push("/signin");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Password reset failed");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!email) {
      toast.error("Missing email address for password reset");
      return;
    }

    mutate({
      email,
      newPassword: values.password,
    });
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
        New Password
      </h3>
      <p className="pt-2 text-center text-base font-normal leading-[150%] text-[#787878] md:text-lg">
        Set a new password for the admin account.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 pt-5 md:pt-8"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold leading-[120%] text-[#2A2A2A]">
                  Password <sup className="text-[#2EABFC]">*</sup>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="h-[50px] rounded-[8px] border border-transparent bg-[#E9E9E9] px-4 py-3 pr-12 text-base font-medium text-[#131313] placeholder:text-[#9A9A9A] focus-visible:border-[#2EABFC] focus-visible:ring-2 focus-visible:ring-[#2EABFC]/20"
                      placeholder="Enter Password..."
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-3.5 text-[#9A9A9A]"
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold leading-[120%] text-[#2A2A2A]">
                  Confirm Password <sup className="text-[#2EABFC]">*</sup>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-[50px] rounded-[8px] border border-transparent bg-[#E9E9E9] px-4 py-3 pr-12 text-base font-medium text-[#131313] placeholder:text-[#9A9A9A] focus-visible:border-[#2EABFC] focus-visible:ring-2 focus-visible:ring-[#2EABFC]/20"
                      placeholder="Confirm Password..."
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="absolute right-4 top-3.5 text-[#9A9A9A]"
                    >
                      {showConfirmPassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button
              disabled={isPending}
              style={{ backgroundColor: "#2EABFC" }}
              className="h-[51px] w-full rounded-[8px] py-4 text-base font-medium leading-[120%] text-white shadow-[0px_10px_24px_rgba(46,171,252,0.3)] hover:bg-[#2297e3]"
              type="submit"
            >
              {isPending ? "Saving..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
