import axios from "axios";
import { DashboardOverview, DonationReport } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDashboardOverview = async (
  token: string
): Promise<DashboardOverview> => {
  const response = await axios.get(`${API_URL}/admin/dashboard/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data || response.data;
};

export const fetchDonationReport = async (
  token: string,
  year: number
): Promise<DonationReport> => {
  const response = await axios.get(
    `${API_URL}/admin/dashboard/donation-report`,
    {
      params: { year },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data.data || response.data;
};
