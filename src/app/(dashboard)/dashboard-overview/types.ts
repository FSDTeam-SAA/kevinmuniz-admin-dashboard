export interface DashboardStats {
  totalUsers: number;
  totalCampaigns: number;
  totalRaisedAmount: number;
  totalDonations: number;
}

export interface TopBacker {
  totalDonated: number;
  donorId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}

export interface TopCampaign {
  totalRaised: number;
  campaignId: string;
  title: string;
  shortDescription: string;
  image: string;
  location: string;
  activeStatus: string;
  approvalStatus: string;
  category: string;
}

export interface DashboardOverview {
  stats: DashboardStats;
  topBackers: TopBacker[];
  topCampaigns: TopCampaign[];
}

export interface DonationReport {
  year: number;
  report: Record<string, number>;
}
