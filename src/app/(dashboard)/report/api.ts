import axios from "axios";
import type {
  CampaignReport,
  CampaignWiseResponse,
  UserReport,
  UserWiseResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCampaignWiseReport = async (
  token: string,
  page: number,
  limit: number
): Promise<CampaignWiseResponse> => {
  const response = await axios.get(`${API_URL}/admin/dashboard/campaign-wise`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data || response.data;
};

export const fetchUserWiseReport = async (
  token: string,
  page: number,
  limit: number
): Promise<UserWiseResponse> => {
  const response = await axios.get(`${API_URL}/admin/dashboard/user-wise`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data || response.data;
};

export function downloadCSV(filename: string, rows: string[][]): void {
  const csvContent = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function generateCampaignCSV(campaign: CampaignReport): void {
  const headers = [
    "Campaign Title",
    "Location",
    "Category",
    "Status",
    "Total Raised",
    "Total Donations",
    "Last Donation Date",
    "End Date",
  ];

  const row = [
    campaign.title,
    campaign.location,
    campaign.category,
    campaign.activeStatus,
    campaign.totalRaised.toString(),
    campaign.totalDonations.toString(),
    new Date(campaign.lastDonationAt).toLocaleDateString(),
    new Date(campaign.endDate).toLocaleDateString(),
  ];

  downloadCSV(`campaign-report-${campaign.campaignId}.csv`, [headers, row]);
}

export function generateUserCSV(user: UserReport): void {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Total Raised",
    "Total Donations",
    "Campaigns Supported",
    "Last Donation Date",
  ];

  const row = [
    user.firstName,
    user.lastName,
    user.email,
    user.totalRaised.toString(),
    user.totalDonations.toString(),
    user.totalCampaignsSupported.toString(),
    new Date(user.lastDonationAt).toLocaleDateString(),
  ];

  downloadCSV(`user-report-${user.donorId}.csv`, [headers, row]);
}
