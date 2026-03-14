export interface Contact {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  consent: boolean
  createdAt: string
  updatedAt: string
}

export interface ContactPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ContactsResponse {
  data: Contact[]
  pagination: ContactPagination
}
