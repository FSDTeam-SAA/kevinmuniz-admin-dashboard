import axios from "axios";
import { DonationsResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDonations = async (
    token: string,
    page: number,
    limit: number
): Promise<DonationsResponse> => {
    const response = await axios.get(`${API_URL}/donation/all-donations`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
    });
    // Data structure from backend is typically wrapped in `data.data` based on existing patterns
    if (response.data.data) {
        return response.data.data;
    }
    return response.data; // fallback
};
