import axios from 'axios'
import type { Contact, ContactsResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

export const fetchContacts = async (
  token: string,
  page: number,
  limit: number,
): Promise<ContactsResponse> => {
  const response = await axios.get(`${API_URL}/contact`, {
    params: { page, limit },
    headers: getAuthHeaders(token),
  })

  return {
    data: response.data.data || [],
    pagination: response.data.pagination,
  }
}

export const fetchContactById = async (
  token: string,
  id: string,
): Promise<Contact> => {
  const response = await axios.get(`${API_URL}/contact/${id}`, {
    headers: getAuthHeaders(token),
  })

  return response.data.data
}

export const deleteContact = async (
  token: string,
  id: string,
): Promise<void> => {
  await axios.delete(`${API_URL}/contact/${id}`, {
    headers: getAuthHeaders(token),
  })
}
