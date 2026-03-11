export interface RefundCampaign {
    _id: string;
    title: string;
    shortDescription: string;
    location: string;
    image: string;
}

export interface RefundDonor {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
}

export type RefundStatus = "pending" | "review" | "refunded";

export interface RefundDonation {
    _id: string;
    campaignId: RefundCampaign;
    donorId: RefundDonor;
    amount: number;
    stripePaymentIntentId: string | null;
    paymentStatus: string;
    refundStatus: RefundStatus;
    refundReason: string | null;
    refundRequestedAt: string | null;
    refundProcessedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RefundPagination {
    currentPage: number;
    totalPages: number;
    totalData: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface RefundResponse {
    donations: RefundDonation[];
    pagination: RefundPagination;
}
