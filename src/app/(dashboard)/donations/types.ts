export interface DonationCampaign {
    _id: string;
    title: string;
    shortDescription: string;
    location: string;
    image: string;
}

export interface DonationDonor {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
}

export type PaymentStatus = "paid" | "pending" | "failed";
export type RefundStatus = "pending" | "refunded" | null;

export interface Donation {
    _id: string;
    campaignId: DonationCampaign;
    donorId: DonationDonor;
    amount: number;
    stripePaymentIntentId: string | null;
    paymentStatus: PaymentStatus;
    refundStatus: RefundStatus;
    refundReason: string | null;
    refundRequestedAt: string | null;
    refundProcessedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface DonationPagination {
    currentPage: number;
    totalPages: number;
    totalData: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface DonationsResponse {
    donations: Donation[];
    pagination: DonationPagination;
}
