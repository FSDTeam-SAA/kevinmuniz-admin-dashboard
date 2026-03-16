export type NotificationType =
  | 'CAMPAIGN_APPROVED'
  | 'DONATION_RECEIVED'
  | 'DONATION_CONFIRMED'
  | 'REFUND_SUBMITTED'
  | 'REFUND_REVIEW'
  | 'REFUND_PROCESSED'
  | 'REPRESENTATION_SUBMITTED'
  | 'REPRESENTATION_APPROVED'
  | 'REPRESENTATION_REJECTED'

export interface Notification {
  _id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
}
