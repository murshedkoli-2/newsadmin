import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Detailed overview of your portal's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128,430</div>
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> +14.2% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">542,100</div>
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> +8.4% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">32.4%</div>
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <ArrowDownRight className="h-3 w-3" /> -2.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4m 32s</div>
                        <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> +12s from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { name: "Technology", views: "142k", growth: "+12%" },
                            { name: "Politics", views: "128k", growth: "+8%" },
                            { name: "Sports", views: "105k", growth: "+15%" },
                            { name: "Entertainment", views: "92k", growth: "+5%" },
                        ].map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.views} views total</p>
                                </div>
                                <div className="text-sm font-semibold text-emerald-500">{item.growth}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
