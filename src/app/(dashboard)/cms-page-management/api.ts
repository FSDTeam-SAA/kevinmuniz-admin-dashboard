import axios from 'axios'
import type { CmsPage, CmsPageKey } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message
  }

  return error instanceof Error ? error.message : 'Something went wrong'
}

export const fetchAllCmsPages = async (token: string): Promise<CmsPage[]> => {
  const response = await axios.get<{ data: CmsPage[] }>(`${API_URL}/cms`, {
    headers: getAuthHeaders(token),
  })

  return response.data.data || []
}

export const fetchCmsPage = async (
  token: string,
  pageKey: CmsPageKey,
): Promise<CmsPage> => {
  const response = await axios.get<{ data: CmsPage }>(`${API_URL}/cms/${pageKey}`, {
    headers: getAuthHeaders(token),
  })

  return response.data.data
}

export const saveCmsPage = async (
  token: string,
  pageKey: CmsPageKey,
  description: string,
  isNew: boolean,
): Promise<CmsPage> => {
  const payload = {
    page: pageKey,
    description,
  }

  const response = isNew
    ? await axios.put<{ data: CmsPage }>(`${API_URL}/cms`, payload, {
        headers: getAuthHeaders(token),
      })
    : await axios.put<{ data: CmsPage }>(`${API_URL}/cms`, payload, {
        headers: getAuthHeaders(token),
      })

  return response.data.data
}
