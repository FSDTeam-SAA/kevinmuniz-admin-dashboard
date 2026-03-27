import jsPDF from 'jspdf'
import type { Donation } from '@/app/(dashboard)/donations/types'

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const drawLabelValue = (
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  valueColor: [number, number, number] = [45, 45, 45],
) => {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(125, 138, 151)
  doc.text(label, 18, y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...valueColor)
  const wrappedValue = doc.splitTextToSize(value, 108)
  doc.text(wrappedValue, 18, y + 7)

  return y + 7 + wrappedValue.length * 6
}

export function downloadDonationReceipt(donation: Donation): void {
  const doc = new jsPDF()
  const donorName =
    [donation.donorId?.firstName, donation.donorId?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() || 'Backer'

  const transactionId =
    donation.stripePaymentIntentId || donation._id || 'Not available'
  const rewardLabel = donation.reward
    ? `${donation.reward.title} (Min $${donation.reward.price.toFixed(2)})`
    : 'No Reward Selected'

  doc.setFillColor(244, 251, 255)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFillColor(46, 171, 252)
  doc.roundedRect(14, 14, 182, 28, 8, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('Donation Receipt', 20, 31)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Hierarchy of visionaries', 148, 24)
  doc.text('Admin donation proof record', 144, 31)

  doc.setDrawColor(185, 206, 255)
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(14, 50, 182, 100, 8, 8, 'FD')

  let currentY = 65
  currentY = drawLabelValue(doc, 'Campaign', donation.campaignId.title, currentY)
  currentY = drawLabelValue(doc, 'Transaction ID', transactionId, currentY + 12)
  drawLabelValue(doc, 'Date', formatDate(donation.createdAt), currentY + 12)

  doc.setFillColor(236, 253, 243)
  doc.setDrawColor(121, 216, 155)
  doc.roundedRect(138, 64, 44, 30, 6, 6, 'FD')
  doc.setTextColor(14, 159, 110)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Amount', 145, 75)
  doc.setFontSize(18)
  doc.text(`$${donation.amount.toFixed(2)}`, 145, 86)

  drawLabelValue(
    doc,
    'Payment Status',
    donation.paymentStatus === 'paid' ? 'Completed' : donation.paymentStatus,
    162,
    donation.paymentStatus === 'paid' ? [14, 159, 110] : [45, 45, 45],
  )
  drawLabelValue(doc, 'Payment Method', 'Stripe', 187)
  drawLabelValue(
    doc,
    'Reward',
    rewardLabel,
    212,
    donation.reward ? [140, 92, 255] : [107, 114, 128],
  )
  drawLabelValue(doc, 'Donor', donorName, 237)
  drawLabelValue(doc, 'Email', donation.donorId?.email || 'Not available', 262)

  doc.setDrawColor(215, 232, 255)
  doc.line(18, 279, 192, 279)

  doc.setTextColor(119, 119, 119)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(
    'This receipt serves as donation proof for admin record keeping.',
    18,
    289,
  )
  doc.text(`Receipt ID: ${donation._id}`, 18, 296)

  doc.save(`donation-receipt-${donation._id}.pdf`)
}
