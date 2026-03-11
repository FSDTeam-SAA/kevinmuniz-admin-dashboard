"use client";

import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { ChangePasswordFormValues } from "../schema";

interface ChangePasswordDialogProps {
  form: UseFormReturn<ChangePasswordFormValues>;
  isOpen: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ChangePasswordFormValues) => void;
}

export default function ChangePasswordDialog({
  form,
  isOpen,
  isPending,
  onOpenChange,
  onSubmit,
}: ChangePasswordDialogProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-[44px] rounded-full border-[#BDBDBD] px-6 text-[16px] font-medium text-[#545454] hover:bg-[#F8FAFC]"
        >
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[480px] rounded-[32px] border-none p-0 shadow-2xl">
        <div className="rounded-[32px] bg-white p-8 md:p-10">
          <DialogHeader className="mb-8 text-center">
            <DialogTitle className="text-[18px] font-bold text-[#111827]">
              Change Password
            </DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px] font-medium text-[#111827]">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="-----"
                          className="h-[52px] rounded-[12px] border-none bg-[#F4F4F4] px-4 pr-12 text-[16px] text-[#111827] focus-visible:ring-[#33BAFF]"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showOldPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px] font-medium text-[#111827]">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="-----"
                          className="h-[52px] rounded-[12px] border-none bg-[#F4F4F4] px-4 pr-12 text-[16px] text-[#111827] focus-visible:ring-[#33BAFF]"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px] font-medium text-[#111827]">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="-----"
                          className="h-[52px] rounded-[12px] border-none bg-[#F4F4F4] px-4 pr-12 text-[16px] text-[#111827] focus-visible:ring-[#33BAFF]"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-[48px] min-w-[160px] rounded-[10px] bg-[#0052FF] px-8 text-[16px] font-semibold text-white hover:bg-blue-700"
                >
                  {isPending ? (
                    <>
                      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
