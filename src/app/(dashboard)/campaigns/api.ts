import axios from "axios";
import { CampaignsResponse, CampaignDetailResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCampaigns = async (
    token: string,
    page: number,
    limit: number
): Promise<CampaignsResponse> => {
    const response = await axios.get(`${API_URL}/campaign`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const fetchCampaignById = async (
    token: string,
    id: string,
    page: number = 1
): Promise<CampaignDetailResponse> => {
    const response = await axios.get(`${API_URL}/campaign/${id}`, {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const deleteCampaign = async (
    token: string,
    id: string
): Promise<void> => {
    await axios.delete(`${API_URL}/campaign/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateCampaignStatus = async (
    token: string,
    id: string,
    payload: {
        approvalStatus?: "accepted" | "rejected";
        activeStatus?: "active" | "inactive";
    }
): Promise<void> => {
    await axios.put(
        `${API_URL}/campaign/${id}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
