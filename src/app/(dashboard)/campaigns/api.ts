import axios from "axios";
import {
    CampaignsResponse,
    CampaignDetailResponse,
    CampaignReward,
} from "./types";

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
        isFeatured?: boolean;
    }
): Promise<void> => {
    await axios.put(
        `${API_URL}/campaign/${id}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const updateCampaignControls = async (
    token: string,
    id: string,
    payload: {
        proposedFunding?: number;
        creatingDate?: string;
        endDate?: string;
    }
): Promise<void> => {
    await axios.put(`${API_URL}/campaign/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const createReward = async (
    token: string,
    payload: {
        campaignId: string
        title: string
        description: string
        price: number
        quantity: number | null
        estimatedDeliveryDate: string
    }
): Promise<CampaignReward> => {
    const response = await axios.post(`${API_URL}/admin/rewards`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data;
};

export const updateReward = async (
    token: string,
    rewardId: string,
    payload: {
        title: string
        description: string
        price: number
        quantity: number | null
        estimatedDeliveryDate: string
    }
): Promise<CampaignReward> => {
    const response = await axios.put(
        `${API_URL}/admin/rewards/${rewardId}`,
        payload,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return response.data.data;
};

export const deleteReward = async (
    token: string,
    rewardId: string
): Promise<void> => {
    await axios.delete(`${API_URL}/admin/rewards/${rewardId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const toggleReward = async (
    token: string,
    rewardId: string
): Promise<CampaignReward> => {
    const response = await axios.patch(
        `${API_URL}/admin/rewards/${rewardId}/toggle`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return response.data.data;
};
