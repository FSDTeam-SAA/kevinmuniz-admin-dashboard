"use client";

import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  Crown,
  HandCoins,
  Megaphone,
  Target,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total Donations",
    value: "$128,420",
    change: "+12.4%",
    description: "Compared to last month",
    icon: CircleDollarSign,
    accent: "from-[#33BAFF] to-[#1A8CFF]",
  },
  {
    title: "Active Campaigns",
    value: "248",
    change: "+8.2%",
    description: "19 campaigns launched this week",
    icon: Megaphone,
    accent: "from-[#22C55E] to-[#16A34A]",
  },
  {
    title: "Top Backers",
    value: "1,842",
    change: "+5.1%",
    description: "Returning donors grew steadily",
    icon: Users,
    accent: "from-[#F59E0B] to-[#D97706]",
  },
  {
    title: "Success Rate",
    value: "74%",
    change: "+3.8%",
    description: "Campaigns reaching target goal",
    icon: Target,
    accent: "from-[#8B5CF6] to-[#7C3AED]",
  },
];

const donationData = [
  { month: "Jan", amount: 9200, goal: 10000 },
  { month: "Feb", amount: 11600, goal: 12000 },
  { month: "Mar", amount: 9800, goal: 11500 },
  { month: "Apr", amount: 14300, goal: 13000 },
  { month: "May", amount: 16800, goal: 15000 },
  { month: "Jun", amount: 15200, goal: 15500 },
  { month: "Jul", amount: 18700, goal: 17000 },
];

const topBackers = [
  {
    name: "Sophia Bennett",
    amount: "$18,500",
    campaigns: 14,
    focus: "Medical support",
  },
  {
    name: "Liam Carter",
    amount: "$15,240",
    campaigns: 11,
    focus: "Community relief",
  },
  {
    name: "Ava Thompson",
    amount: "$13,980",
    campaigns: 9,
    focus: "Education funds",
  },
  {
    name: "Noah Rodriguez",
    amount: "$12,410",
    campaigns: 8,
    focus: "Emergency aid",
  },
];

const topCampaigns = [
  {
    name: "Hope For Families Recovery Fund",
    raised: "$42,800",
    target: "$50,000",
    progress: 86,
    category: "Emergency",
  },
  {
    name: "Future Creators Scholarship Drive",
    raised: "$31,200",
    target: "$35,000",
    progress: 89,
    category: "Education",
  },
  {
    name: "Meals For Seniors Outreach",
    raised: "$24,150",
    target: "$30,000",
    progress: 81,
    category: "Community",
  },
  {
    name: "Care Beyond Borders Mission",
    raised: "$19,760",
    target: "$28,000",
    progress: 71,
    category: "Health",
  },
];

export default function DashboardOverviewPage() {
  const formatTooltipValue = (value: ValueType | undefined) => {
    const amount =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : Array.isArray(value)
            ? Number(value[0])
            : NaN;

    return [
      `$${Number.isFinite(amount) ? amount.toLocaleString() : String(value ?? "")}`,
      "",
    ] as const;
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="overflow-hidden rounded-[24px] border border-[#E8EEF6] bg-white shadow-[0px_18px_40px_rgba(15,23,42,0.06)]"
          >
            <CardContent className="p-0">
              <div className={`h-1.5 bg-gradient-to-r ${stat.accent}`} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">
                      {stat.title}
                    </p>
                    <h2 className="pt-3 text-[30px] font-bold leading-none text-[#111827]">
                      {stat.value}
                    </h2>
                  </div>
                  <div className={`rounded-2xl bg-gradient-to-br p-3 text-white ${stat.accent}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="pt-5">
                  <p className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-xs font-semibold text-[#027A48]">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {stat.change}
                  </p>
                  <p className="pt-2 text-sm text-[#6B7280]">
                    {stat.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card className="rounded-[24px] border border-[#E8EEF6] bg-white shadow-[0px_18px_40px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#33BAFF]">
                  <Activity className="h-4 w-4" />
                  Donation Report
                </p>
                <h3 className="pt-2 text-2xl font-bold text-[#111827]">
                  Donation trend across the last 7 months
                </h3>
              </div>
              <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B7280]">
                  Total Raised
                </p>
                <p className="pt-1 text-2xl font-bold text-[#111827]">$95,600</p>
              </div>
            </div>

            <div className="mt-8 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationData}>
                  <defs>
                    <linearGradient id="donationAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#33BAFF" stopOpacity={0.38} />
                      <stop offset="100%" stopColor="#33BAFF" stopOpacity={0.04} />
                    </linearGradient>
                    <linearGradient id="goalAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={formatTooltipValue}
                    contentStyle={{
                      borderRadius: "16px",
                      borderColor: "#E5E7EB",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="goal"
                    stroke="#A855F7"
                    strokeWidth={2}
                    fill="url(#goalAmount)"
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#33BAFF"
                    strokeWidth={3}
                    fill="url(#donationAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border border-[#E8EEF6] bg-white shadow-[0px_18px_40px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#FEF3C7] p-3 text-[#D97706]">
                <HandCoins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Top Backers</p>
                <h3 className="text-2xl font-bold text-[#111827]">Highest contributors</h3>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {topBackers.map((backer, index) => (
                <div
                  key={backer.name}
                  className="rounded-[20px] border border-[#EEF2F7] bg-[#FBFDFF] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">
                        {index + 1}. {backer.name}
                      </p>
                      <p className="pt-1 text-sm text-[#6B7280]">{backer.focus}</p>
                    </div>
                    <p className="text-base font-bold text-[#111827]">
                      {backer.amount}
                    </p>
                  </div>
                  <div className="pt-3 text-xs font-medium uppercase tracking-[0.16em] text-[#94A3B8]">
                    {backer.campaigns} campaigns supported
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="rounded-[24px] border border-[#E8EEF6] bg-white shadow-[0px_18px_40px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5CF6]">
                  <Crown className="h-4 w-4" />
                  Top Campaigns
                </p>
                <h3 className="pt-2 text-2xl font-bold text-[#111827]">
                  Best-performing campaigns this month
                </h3>
              </div>
              <div className="text-sm text-[#6B7280]">
                Sorted by contribution volume and completion progress
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {topCampaigns.map((campaign) => (
                <div
                  key={campaign.name}
                  className="rounded-[22px] border border-[#EEF2F7] bg-[#FBFDFF] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-lg font-semibold text-[#111827]">
                        {campaign.name}
                      </p>
                      <p className="pt-1 text-sm text-[#6B7280]">
                        Category: {campaign.category}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div>
                        <p className="text-[#6B7280]">Raised</p>
                        <p className="pt-1 text-base font-bold text-[#111827]">
                          {campaign.raised}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#6B7280]">Target</p>
                        <p className="pt-1 text-base font-bold text-[#111827]">
                          {campaign.target}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-[#E5EEF8]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#33BAFF] to-[#8B5CF6]"
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>
                    <div className="pt-2 text-right text-sm font-semibold text-[#111827]">
                      {campaign.progress}% funded
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
