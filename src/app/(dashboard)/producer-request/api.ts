import axios from "axios";
import { Representation, RepresentationsResponse, RepresentationStatus } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchRepresentations = async (
    token: string,
    page: number,
    limit: number
): Promise<RepresentationsResponse> => {
    const response = await axios.get(`${API_URL}/representation/all`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const fetchRepresentationById = async (
    token: string,
    id: string
): Promise<Representation> => {
    const response = await axios.get(`${API_URL}/representation/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const deleteRepresentation = async (
    token: string,
    id: string
): Promise<void> => {
    await axios.delete(`${API_URL}/representation/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateRepresentationStatus = async (
    token: string,
    id: string,
    status: RepresentationStatus
): Promise<void> => {
    await axios.put(
        `${API_URL}/representation/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};
