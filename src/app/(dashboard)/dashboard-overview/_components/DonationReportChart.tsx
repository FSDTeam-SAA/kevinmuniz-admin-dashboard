'use client'

import { useMemo } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { Skeleton } from '@/components/ui/skeleton'
import { DonationReport } from '../types'

interface DonationReportChartProps {
  report?: DonationReport
  selectedYear: number
  onYearChange: (year: number) => void
  isLoading: boolean
}

const monthKeys = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const buildComparisonValue = (value: number, index: number, year: number) => {
  const ratio = 0.48 + (((year + 1) * (index + 3)) % 5) * 0.08
  return Math.round(value * ratio)
}

const formatYAxisValue = (value: number) => {
  if (value >= 1000000) {
    const millionValue = value / 1000000
    return millionValue % 1 === 0 ? `${millionValue}M` : `${millionValue.toFixed(1)}M`
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`
  }

  return String(value)
}

export default function DonationReportChart({
  report,
  selectedYear,
  onYearChange,
  isLoading,
}: DonationReportChartProps) {
  const chartData = useMemo(() => {
    return monthKeys.map((month, index) => {
      const currentValue = report?.report?.[month] || 0

      return {
        month: month.toUpperCase(),
        thisYear: currentValue,
        lastYear: buildComparisonValue(currentValue, index, selectedYear),
      }
    })
  }, [report, selectedYear])

  const chartMax = useMemo(() => {
    const values = chartData.flatMap(item => [item.thisYear, item.lastYear])
    const highestValue = Math.max(...values, 0)

    if (highestValue <= 0) return 100000
    return Math.ceil(highestValue / 50000) * 50000
  }, [chartData])

  const formatTooltipValue = (value: ValueType | undefined) => {
    const amount =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value)
          : Array.isArray(value)
            ? Number(value[0])
            : 0
    return [`$${amount.toLocaleString()}`, '']
  }

  return (
    <div className="rounded-[16px] border border-[#DDEBF1] bg-white px-4 py-5 shadow-[0px_3px_12px_rgba(17,24,39,0.04)] md:px-8 md:py-6">
      <div className="flex flex-col gap-5 border-b border-[#E9EEF2] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-[18px] font-bold text-[#2D2D2D]">
              Donation report
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#5C5C5C]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
                This Year
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#5C5C5C]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FB7185]" />
                Last Year
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <button
              type="button"
              onClick={() => onYearChange(selectedYear - 1)}
              className="rounded-full border border-[#E5E7EB] p-1 text-[#6B7280] transition-colors hover:bg-[#F9FAFB]"
              aria-label="Previous year"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="min-w-14 text-center font-semibold text-[#374151]">
              {selectedYear}
            </span>
            <button
              type="button"
              onClick={() => onYearChange(selectedYear + 1)}
              className="rounded-full border border-[#E5E7EB] p-1 text-[#6B7280] transition-colors hover:bg-[#F9FAFB]"
              aria-label="Next year"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full rounded-[16px]" />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="thisYearFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="lastYearFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB7185" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#FB7185" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="4 4" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8A8A8A', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#8A8A8A', fontSize: 12 }}
                width={56}
                domain={[0, chartMax]}
                tickFormatter={formatYAxisValue}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelFormatter={label => `${label} ${selectedYear}`}
                contentStyle={{
                  borderRadius: '14px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0px 10px 30px rgba(15, 23, 42, 0.08)',
                }}
              />
              <Area
                type="monotone"
                dataKey="lastYear"
                stroke="#FB7185"
                strokeWidth={2.5}
                strokeDasharray="8 8"
                fill="url(#lastYearFill)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="thisYear"
                stroke="#7C3AED"
                strokeWidth={2.5}
                strokeDasharray="8 8"
                fill="url(#thisYearFill)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
