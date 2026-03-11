import axios from "axios";
import { UserRole, UsersResponse, ManagedUser } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const response = await axios.get(`${API_URL}/admin/dashboard/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data || response.data;
};

export const deleteUser = async (token: string, id: string): Promise<void> => {
    await axios.delete(`${API_URL}/admin/dashboard/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
