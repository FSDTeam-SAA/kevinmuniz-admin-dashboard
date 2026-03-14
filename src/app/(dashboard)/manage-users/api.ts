import axios from "axios";
import { UserRole, UsersResponse, ManagedUser } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UserDetailResponse = {
    user: Omit<ManagedUser, "campaigns"> & {
        role: UserRole;
    };
    campaigns?: ManagedUser["campaigns"];
    donations?: Array<{
        _id: string;
        amount: number;
        createdAt: string;
        campaignId?: {
            _id: string;
            title: string;
            shortDescription: string;
            location: string;
            image: string;
        } | null;
    }>;
};

const normalizeUserDetail = (payload: UserDetailResponse): ManagedUser => {
    const creatorCampaigns = payload.campaigns?.map((campaign) => ({
            ...campaign,
            totalRaised: campaign.totalRaised || 0,
            userTotalDonated: campaign.userTotalDonated || 0,
        })) || [];

    const donatedCampaignsMap = new Map<string, ManagedUser["campaigns"][number]>();

    payload.donations
        ?.filter((donation) => donation.campaignId?._id)
        .forEach((donation) => {
            const campaign = donation.campaignId!;
            const existingCampaign = donatedCampaignsMap.get(campaign._id);

            if (existingCampaign) {
                existingCampaign.userTotalDonated =
                    (existingCampaign.userTotalDonated || 0) + donation.amount;
                return;
            }

            donatedCampaignsMap.set(campaign._id, {
                _id: campaign._id,
                title: campaign.title || "Untitled campaign",
                shortDescription: campaign.shortDescription || "",
                location: campaign.location || "",
                image: campaign.image || "",
                totalRaised: 0,
                userTotalDonated: donation.amount,
                createdAt: donation.createdAt,
            });
        });

    const campaigns =
        creatorCampaigns.length > 0
            ? creatorCampaigns
            : Array.from(donatedCampaignsMap.values());

    return {
        ...payload.user,
        campaigns,
    };
};

export const fetchUsersByRole = async (
    token: string,
    role: UserRole,
    page: number,
    limit: number
): Promise<UsersResponse> => {
    const response = await axios.get(`${API_URL}/admin/dashboard/users-by-role`, {
        params: { role, page, limit },
        headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.data) {
        return response.data.data;
    }
    return response.data;
};

export const fetchUserById = async (
    token: string,
    id: string
): Promise<ManagedUser> => {
    const response = await axios.get(`${API_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const payload = response.data.data || response.data;
    return normalizeUserDetail(payload);
};

export const deleteUser = async (token: string, id: string): Promise<void> => {
    await axios.delete(`${API_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const suspendUser = async (token: string, id: string): Promise<void> => {
    await axios.put(
        `${API_URL}/admin/dashboard/suspend-user/${id}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};
