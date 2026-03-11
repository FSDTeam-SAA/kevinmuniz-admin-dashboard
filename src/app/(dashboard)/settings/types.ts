export interface UserAddress {
  country: string;
  cityState: string;
  roadArea: string;
  postalCode: string;
  taxId: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dob: string | null;
  gender: string;
  role: string;
  profileImage: string;
  bio: string;
  language: string;
  isVerified: boolean;
  hasActiveSubscription: boolean;
  address: UserAddress;
}

export interface UserProfileResponse {
  status: boolean;
  message: string;
  data: UserProfile;
}

export interface UpdateProfilePayload {
  name?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  bio?: string;
  dob?: string | null;
  address?: Partial<UserAddress>;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ApiErrorResponse {
  message?: string;
}
