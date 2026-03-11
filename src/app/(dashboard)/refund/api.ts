import axios from "axios";
import { RefundResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchRefundRequests = async (
    token: string,
    status: "refunded" | "pending" | "review",
    page: number,
    limit: number
): Promise<RefundResponse> => {
    const response = await axios.get(
        `${API_URL}/donation/refund-requests?status=${status}&page=${page}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const updateRefundStatus = async (
    token: string,
    id: string,
    status: "review" | "refunded" | "pending"
): Promise<void> => {
    await axios.put(
        `${API_URL}/donation/${id}/refund-status`,
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
