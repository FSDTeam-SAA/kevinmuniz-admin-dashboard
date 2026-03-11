"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from 'next/image'

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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  rememberMe: z.boolean(),
});

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (searchParams.get("error") === "ADMIN_ONLY") {
      toast.error("Only admin can access this admin dashboard");
    }
  }, [searchParams]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const callbackUrl = searchParams.get("callbackUrl") || "/";

      const res = await signIn("credentials", {
        email: values?.email,
        password: values?.password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        if (res.error === "ADMIN_ONLY") {
          toast.error("Only admin can access this admin dashboard");
          return;
        }

        if (res.error === "INVALID_CREDENTIALS") {
          toast.error("Email or Password wrong");
          return;
        }

        toast.error("Login failed");
        return;
      }
      toast.success("Login successful!");
      router.push(res?.url || callbackUrl);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="w-full rounded-[20px] border border-[#DCEEFE] bg-[#F7F7F7] p-6 shadow-[0px_18px_50px_rgba(46,171,252,0.12)] md:w-[570px] md:p-8">
        <div className="flex w-full items-center justify-center pb-5">
          <Link href="/">
            <Image src="/assets/images/autoLogo.png" alt="auth logo" width={500} height={500} className="h-[136px] w-[136px] object-contain" />
          </Link>
        </div>

        <h3 className="text-2xl md:text-[32px] lg:text-[40px] font-bold text-[#131313] text-center leading-[120%] ">
          Welcome Back!
        </h3>
        <p className="text-base md:text-lg font-normal text-[#787878] leading-[150%] text-center pt-2">
          Enter to get unlimited data & information
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-5 md:pt- lg:pt-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">
                    Password <sup className="text-[#2EABFC]">*</sup>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="h-[50px] rounded-[8px] border border-transparent bg-[#E9E9E9] px-4 py-3 pr-11 text-base font-medium text-[#131313] placeholder:text-[#9A9A9A] focus-visible:border-[#2EABFC] focus-visible:ring-2 focus-visible:ring-[#2EABFC]/20"
                        placeholder="Enter Password..."
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-3.5 text-[#9A9A9A]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="w-full flex items-center justify-between">
                  <FormItem className="flex items-center gap-[10px]">
                    <FormControl className="mt-1">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-[#2EABFC] data-[state=checked]:bg-[#2EABFC] data-[state=checked]:text-white"
                      />
                    </FormControl>
                    <Label
                      className="text-sm font-medium text-[#2A2A2A] leading-[120%]"
                      htmlFor="rememberMe"
                    >
                      Remember Me
                    </Label>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                  <Link
                    className="cursor-pointer text-sm font-medium leading-[120%] text-[#2EABFC] hover:underline"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
            />
            <div className="pt-2">
              <Button
                disabled={isLoading}
                style={{ backgroundColor: "#2EABFC" }}
                className={`h-[51px] w-full cursor-pointer rounded-[8px] py-4 text-base font-medium leading-[120%] text-white shadow-[0px_10px_24px_rgba(46,171,252,0.3)] hover:bg-[#2297e3] ${isLoading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                type="submit"
              >
                {isLoading ? "Sign In ..." : "Sign In"}
              </Button>
            </div>

            <p className="pt-1 text-center text-sm font-medium text-[#4B4B4B]">
              Don&apos;t have an account?{" "}
              <span className="text-[#2EABFC] underline">Register Here</span>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignInForm;
