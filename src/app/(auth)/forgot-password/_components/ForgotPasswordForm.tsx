"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (values: { email: string }) => {
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
          body: JSON.stringify(values),
        }
      );

      return res.json();
    },
    onSuccess: (data, values) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }

      toast.success(data?.message || "Verification code sent");
      router.push(`/forgot-password/otp?email=${encodeURIComponent(values.email)}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send verification code");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <div className="w-full max-w-[570px] rounded-[20px] border border-[#DCEEFE] bg-[#F7F7F7] p-6 shadow-[0px_18px_50px_rgba(46,171,252,0.12)] md:p-8">
      <div className="flex w-full items-center justify-center pb-6">
        <Link href="/signin">
          <Image
            src="/assets/images/autoLogo.png"
            alt="auth logo"
            width={500}
            height={500}
            className="h-[136px] w-[136px] object-contain"
          />
        </Link>
      </div>

      <h3 className="text-center text-2xl font-bold leading-[120%] text-[#131313] md:text-[32px] lg:text-[40px]">
        Forgot Password
      </h3>
      <p className="pt-2 text-center text-base font-normal leading-[150%] text-[#787878] md:text-lg">
        Enter the admin email linked to your account. We&apos;ll send a
        verification code so you can reset the password.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 pt-5 md:pt-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold leading-[120%] text-[#2A2A2A]">
                  Email <sup className="text-[#2EABFC]">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-[50px] rounded-[8px] border border-transparent bg-[#E9E9E9] px-4 py-3 text-base font-medium text-[#131313] placeholder:text-[#9A9A9A] focus-visible:border-[#2EABFC] focus-visible:ring-2 focus-visible:ring-[#2EABFC]/20"
                    placeholder="Enter your mail address..."
                    {...field}
                  />
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
              {isPending ? "Sending..." : "Send Code"}
            </Button>
          </div>

          <p className="pt-2 text-center text-sm font-medium leading-[120%] text-[#363636]">
            Back to{" "}
            <Link className="text-[#2EABFC] underline" href="/signin">
              Sign In
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
