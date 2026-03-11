import axios from "axios";
import { CategoriesResponse, Category } from "./types";
import { CategoryFormValues } from "./schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCategories = async (
    token: string,
    page: number,
    limit: number
): Promise<CategoriesResponse> => {
    const response = await axios.get(
        `${API_URL}/category/get-all-categories`,
        {
            params: { page, limit },
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.data;
};

export const fetchCategoryById = async (
    token: string,
    id: string
): Promise<Category> => {
    const response = await axios.get(`${API_URL}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const createCategory = async (
    token: string,
    payload: CategoryFormValues
): Promise<Category> => {
    const response = await axios.post(`${API_URL}/category`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const updateCategory = async (
    token: string,
    id: string,
    payload: CategoryFormValues
): Promise<Category> => {
    const response = await axios.put(`${API_URL}/category/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const deleteCategory = async (
    token: string,
    id: string
): Promise<void> => {
    await axios.delete(`${API_URL}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
