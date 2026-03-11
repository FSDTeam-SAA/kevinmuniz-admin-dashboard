import axios from "axios";

import type {
  ApiErrorResponse,
  ChangePasswordPayload,
  UpdateProfilePayload,
  UserProfile,
  UserProfileResponse,
} from "./types";

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : "Something went wrong";
};

export const getProfile = async (token: string) => {
  const response = await axios.get<UserProfileResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
    {
      headers: getAuthHeaders(token),
    },
  );

  return response.data.data;
};

export const updateProfile = async (
  token: string,
  payload: UpdateProfilePayload,
) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
    payload,
    {
      headers: getAuthHeaders(token),
    },
  );

  return response.data;
};

export const uploadAvatar = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/upload-avatar`,
    formData,
    {
      headers: getAuthHeaders(token),
    },
  );

  return response.data;
};

export const changePassword = async (
  token: string,
  payload: ChangePasswordPayload,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
    payload,
    {
      headers: getAuthHeaders(token),
    },
  );

  return response.data;
};

export const getFullName = (profile: UserProfile | undefined) =>
  profile?.name ||
  [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");

export const getUserName = (profile: UserProfile | undefined) => {
  if (!profile?._id) {
    return "";
  }

  const role = profile.role?.toLowerCase() || "user";
  return `${role}${profile._id.slice(-4)}`;
};

export const getFormattedDate = (value: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
