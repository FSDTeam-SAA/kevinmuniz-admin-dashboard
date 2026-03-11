import { z } from "zod";

export const profileFormSchema = z.object({
  userName: z.string(),
  phoneNumber: z.string().optional(),
  gender: z.string().min(1, "Gender is required."),
  bio: z.string().optional(),
  country: z.string().optional(),
  cityState: z.string().optional(),
  roadArea: z.string().optional(),
  postalCode: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters."),
    confirmNewPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match.",
  });

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
