export type CmsPageKey = 'privacy_policy' | 'terms_conditions'

export interface CmsPage {
  _id: string
  page: CmsPageKey
  description: string
  createdAt: string
  updatedAt: string
}
