"use client";

import { Camera, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";
import { UseFormReturn } from "react-hook-form";

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

import type { ProfileFormValues } from "../schema";
import type { UserProfile } from "../types";
import ChangePasswordDialog from "./ChangePasswordDialog";

interface ProfileDetailsFormProps {
  profile: UserProfile | undefined;
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  isSaving: boolean;
  isUploadingAvatar: boolean;
  isPasswordDialogOpen: boolean;
  isChangingPassword: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onEditToggle: () => void;
  onSubmit: (values: ProfileFormValues) => void;
  onAvatarClick: () => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordDialogOpenChange: (open: boolean) => void;
  onPasswordSubmit: (values: import("../schema").ChangePasswordFormValues) => void;
  passwordForm: UseFormReturn<import("../schema").ChangePasswordFormValues>;
}

const fieldClassName =
  "h-[52px] rounded-[10px] border border-transparent bg-[#F4F4F4] px-4 text-[16px] text-[#3B3B3B] shadow-none focus-visible:ring-1 focus-visible:ring-[#33BAFF] read-only:cursor-default";

export default function ProfileDetailsForm({
  profile,
  form,
  isEditing,
  isSaving,
  isUploadingAvatar,
  isPasswordDialogOpen,
  isChangingPassword,
  fileInputRef,
  onEditToggle,
  onSubmit,
  onAvatarClick,
  onAvatarChange,
  onPasswordDialogOpenChange,
  onPasswordSubmit,
  passwordForm,
}: ProfileDetailsFormProps) {
  return (
    <div className="rounded-[2px] bg-white p-6 md:p-10 shadow-sm">
      <div className="flex flex-col gap-6 border-b border-[#F0F0F0] pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full border-2 border-[#DCEEFE]">
            <Image
              src={profile?.profileImage || "/assets/images/autoLogo.png"}
              alt="Profile"
              fill
              sizes="100px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={onAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100 disabled:opacity-60"
              aria-label="Upload profile image"
            >
              {isUploadingAvatar ? (
                <LoaderCircle className="h-6 w-6 animate-spin" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </div>

          <div>
            <h2 className="text-[18px] font-semibold text-[#1E1E1E]">
              {profile?.name || "Admin User"}
            </h2>
            <p className="pt-1 text-[16px] text-[#909090]">
              {form.watch("userName") ? `@${form.watch("userName")}` : "@admin"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ChangePasswordDialog
            form={passwordForm}
            isOpen={isPasswordDialogOpen}
            isPending={isChangingPassword}
            onOpenChange={onPasswordDialogOpenChange}
            onSubmit={onPasswordSubmit}
          />

          <Button
            type="button"
            onClick={onEditToggle}
            disabled={isSaving}
            className={`h-[44px] rounded-full border px-6 text-[16px] font-medium transition-all ${isEditing
              ? "border-red-500 bg-white text-red-500 hover:bg-red-50"
              : "bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
              }`}
          >
            {isEditing ? "Cancel Update" : "Update Profile"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-8">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium text-[#999999]">
                    User Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className={fieldClassName} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium text-[#999999]">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className={fieldClassName} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium text-[#999999]">
                    Gender
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={!isEditing}
                      className={fieldClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium text-[#999999]">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={!isEditing}
                      className={fieldClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium text-[#999999]">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={!isEditing}
                      className={fieldClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium text-[#999999]">
                    City/State
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={!isEditing}
                      className={fieldClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roadArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium text-[#999999]">
                    Road/Area
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={!isEditing}
                      className={fieldClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] font-medium text-[#999999]">
                    Postal Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={!isEditing}
                      className={fieldClassName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="h-[48px] min-w-[160px] rounded-[10px] bg-[#0052FF] px-8 text-[16px] font-semibold text-white hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
