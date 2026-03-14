export interface CampaignReport {
  totalRaised: number;
  totalDonations: number;
  lastDonationAt: string;
  campaignId: string;
  title: string;
  image: string;
  location: string;
  approvalStatus: string;
  activeStatus: string;
  category: string;
  endDate: string;
}

export interface UserReport {
  totalRaised: number;
  totalDonations: number;
  lastDonationAt: string;
  donorId: string;
  totalCampaignsSupported: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}

export interface ReportPagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CampaignWiseResponse {
  campaigns: CampaignReport[];
  pagination: ReportPagination;
}

export interface UserWiseResponse {
  users: UserReport[];
  pagination: ReportPagination;
}
