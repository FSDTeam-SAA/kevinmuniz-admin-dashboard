export type UserRole = "USER" | "CREATOR";

export interface UserAddress {
    country: string;
    cityState: string;
    roadArea: string;
    postalCode: string;
    taxId: string;
}

export interface UserCampaign {
    _id: string;
    title: string;
    shortDescription: string;
    category: { _id: string; name: string };
    location: string;
    image: string;
    approvalStatus: string;
    activeStatus: string;
    totalRaised: number;
    userTotalDonated?: number;
    createdAt: string;
    endDate: string;
}

export interface ManagedUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string | null;
    gender: string;
    role: UserRole;
    profileImage: string;
    isVerified: boolean;
    hasActiveSubscription: boolean;
    address: UserAddress;
    campaigns: UserCampaign[];
    createdAt: string;
    updatedAt: string;
}

export interface UsersPagination {
    currentPage: number;
    totalPages: number;
    totalData: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface UsersResponse {
    users: ManagedUser[];
    pagination: UsersPagination;
}
