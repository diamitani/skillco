"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  TrendingUp, 
  DollarSign, 
  Download, 
  Star,
  Package,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice, formatDate } from "@/lib/utils"

// Mock data for seller dashboard
const mockStats = {
  totalRevenue: 45678,
  totalDownloads: 3420,
  averageRating: 4.8,
  totalSkills: 12,
  monthlyRevenue: [
    { month: "Jan", amount: 3200 },
    { month: "Feb", amount: 4100 },
    { month: "Mar", amount: 3800 },
    { month: "Apr", amount: 5200 },
    { month: "May", amount: 6100 },
    { month: "Jun", amount: 5800 },
  ],
}

const mockSkills = [
  {
    id: "1",
    name: "React Component Generator",
    status: "published",
    price: 0,
    downloads: 1240,
    rating: 4.8,
    revenue: 0,
    lastUpdated: "2024-07-15",
  },
  {
    id: "2",
    name: "API Security Scanner",
    status: "published",
    price: 4900,
    downloads: 890,
    rating: 4.9,
    revenue: 43610,
    lastUpdated: "2024-07-20",
  },
  {
    id: "3",
    name: "Email Marketing Automation",
    status: "published",
    price: 2900,
    downloads: 456,
    rating: 4.6,
    revenue: 13224,
    lastUpdated: "2024-06-30",
  },
  {
    id: "4",
    name: "Data Pipeline Builder",
    status: "draft",
    price: 9900,
    downloads: 0,
    rating: 0,
    revenue: 0,
    lastUpdated: "2024-07-25",
  },
]

const mockTransactions = [
  { id: "txn_1", skill: "API Security Scanner", amount: 4900, date: "2024-07-28", status: "completed" },
  { id: "txn_2", skill: "API Security Scanner", amount: 4900, date: "2024-07-28", status: "completed" },
  { id: "txn_3", skill: "Email Marketing Automation", amount: 2900, date: "2024-07-27", status: "completed" },
  { id: "txn_4", skill: "API Security Scanner", amount: 4900, date: "2024-07-27", status: "completed" },
  { id: "txn_5", skill: "Email Marketing Automation", amount: 2900, date: "2024-07-26", status: "completed" },
]

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: { 
  title: string
  value: string
  change?: { value: string; positive: boolean }
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card className="border-graphite">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-mist">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-mist" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-snow">{value}</div>
        {change && (
          <p className="text-xs text-mist mt-1 flex items-center">
            {change.positive ? (
              <ArrowUpRight className="h-3 w-3 text-success mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-error mr-1" />
            )}
            <span className={change.positive ? "text-success" : "text-error"}>
              {change.value}
            </span>
            <span className="ml-1">from last month</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function SalesDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-snow">
            Creator Dashboard
          </h1>
          <p className="text-mist mt-1">
            Manage your skills, track earnings, and grow your business
          </p>
        </div>
        <Link href="/pal">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Skill
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatPrice(mockStats.totalRevenue)}
          change={{ value: "12.5%", positive: true }}
          icon={DollarSign}
        />
        <StatCard
          title="Total Downloads"
          value={mockStats.totalDownloads.toLocaleString()}
          change={{ value: "8.2%", positive: true }}
          icon={Download}
        />
        <StatCard
          title="Average Rating"
          value={mockStats.averageRating.toString()}
          icon={Star}
        />
        <StatCard
          title="Total Skills"
          value={mockStats.totalSkills.toString()}
          icon={Package}
        />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">My Skills</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Chart Placeholder */}
          <Card className="border-graphite">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Your earnings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end gap-2">
                {mockStats.monthlyRevenue.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-violet/20 rounded-t"
                      style={{ height: `${(month.amount / 6100) * 100}%` }}
                    >
                      <div 
                        className="w-full bg-violet rounded-t transition-all"
                        style={{ height: "100%" }}
                      />
                    </div>
                    <span className="text-xs text-mist">{month.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-graphite">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.slice(0, 5).map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">{txn.skill}</TableCell>
                      <TableCell>{formatPrice(txn.amount)}</TableCell>
                      <TableCell>{formatDate(txn.date)}</TableCell>
                      <TableCell>
                        <Badge variant="success">{txn.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="border-graphite">
            <CardHeader>
              <CardTitle>My Skills</CardTitle>
              <CardDescription>Manage and update your published skills</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSkills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={skill.status === "published" ? "success" : "secondary"}
                        >
                          {skill.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{skill.price === 0 ? "Free" : formatPrice(skill.price)}</TableCell>
                      <TableCell>{skill.downloads.toLocaleString()}</TableCell>
                      <TableCell>
                        {skill.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-vivid text-vivid" />
                            <span>{skill.rating}</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>{formatPrice(skill.revenue)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="border-graphite">
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>Complete history of your sales</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                      <TableCell>{txn.skill}</TableCell>
                      <TableCell>{formatPrice(txn.amount)}</TableCell>
                      <TableCell>{formatDate(txn.date)}</TableCell>
                      <TableCell>
                        <Badge variant="success">{txn.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="border-graphite">
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>Connect your Stripe account to receive payouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#635BFF] flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-snow">Stripe Connect</h4>
                    <p className="text-sm text-mist">Not connected</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-snow">Payout Schedule</h4>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between p-3 bg-slate rounded-lg">
                    <span className="text-sm text-snow">Current Balance</span>
                    <span className="font-medium">{formatPrice(1234)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate rounded-lg">
                    <span className="text-sm text-snow">Next Payout</span>
                    <span className="font-medium">Aug 1, 2026</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
