export interface RepresentationCampaign {
    _id: string;
    title: string;
    shortDescription: string;
    location: string;
    image: string;
}

export interface RepresentationUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
}

export type RepresentationStatus = "pending" | "approved" | "rejected";

export interface Representation {
    _id: string;
    campaignId: RepresentationCampaign;
    userId: RepresentationUser;
    firstName: string;
    lastName: string;
    productionCompany: string;
    imdbPageLink: string;
    cv: string;
    status: RepresentationStatus;
    createdAt: string;
    updatedAt: string;
}

export interface RepresentationPagination {
    currentPage: number;
    totalPages: number;
    totalData: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface RepresentationsResponse {
    representations: Representation[];
    pagination: RepresentationPagination;
}
