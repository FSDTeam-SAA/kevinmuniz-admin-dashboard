/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Category {
  _id: string
  name: string
}

export interface CampaignCreator {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  profileImage?: string
}

export interface Campaign {
  _id: string
  title: string
  shortDescription: string
  category: Category
  location: string
  creatingDate: string
  endDate: string
  campaignDetails: string
  image: string
  createdBy: CampaignCreator
  approvalStatus: 'pending' | 'accepted' | 'rejected'
  activeStatus: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalData: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface CampaignsResponse {
  data: Campaign[]
  pagination: Pagination
}

export interface Donor {
  totalDonated: number
  donationCount: number
  lastDonatedAt: string
  donorId: string
  firstName: string
  lastName: string
  email: string
  profileImage: string
}

export interface CampaignDetail extends Campaign {}

export interface CampaignDetailResponse {
  campaign: CampaignDetail
  totalRaised: number
  totalDonations: number
  donors: Donor[]
  donorPagination: Pagination
}
