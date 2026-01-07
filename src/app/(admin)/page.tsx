import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Newspaper,
    Users,
    Eye,
    TrendingUp,
    FileText,
    Clock,
    CheckCircle2
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
    const [articleCount, userCount, categoryCount, recentArticlesDb] = await Promise.all([
        prisma.post.count(),
        prisma.user.count(),
        prisma.category.count(),
        prisma.post.findMany({
            take: 4,
            orderBy: { createdAt: 'desc' },
            select: {
                title: true,
                status: true,
                createdAt: true,
            }
        })
    ]);

    const stats = [
        {
            title: "Total Articles",
            value: articleCount.toString(),
            description: "Real-time count",
            icon: Newspaper,
            color: "text-blue-500",
        },
        {
            title: "Active Users",
            value: userCount.toString(),
            description: "Registered accounts",
            icon: Users,
            color: "text-green-500",
        },
        {
            title: "Categories",
            value: categoryCount.toString(),
            description: "Content topics",
            icon: Eye,
            color: "text-purple-500",
        },
        {
            title: "System Status",
            value: "Online",
            description: "All services running",
            icon: TrendingUp,
            color: "text-orange-500",
        },
    ];

    const recentArticles = recentArticlesDb.map(article => ({
        title: article.title,
        status: article.status.charAt(0) + article.status.slice(1).toLowerCase(),
        date: formatDistanceToNow(new Date(article.createdAt), { addSuffix: true }),
        views: "0",
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentArticles.map((article, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {article.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {article.status === "Published" && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                            {article.status === "Draft" && <FileText className="h-3 w-3 text-zinc-400" />}
                                            {article.status === "Scheduled" && <Clock className="h-3 w-3 text-blue-400" />}
                                            <span>{article.status}</span>
                                            <span>•</span>
                                            <span>{article.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold">{article.views}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Views</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Published Rate</span>
                                    <span className="font-medium">78%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-full w-[78%] rounded-full bg-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Editorial Review</span>
                                    <span className="font-medium">45%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-full w-[45%] rounded-full bg-green-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Traffic Growth</span>
                                    <span className="font-medium">12%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-full w-[12%] rounded-full bg-purple-500" />
                                </div>
                            </div>
                            {recentArticles.length === 0 && (
                                <div className="text-center py-6">
                                    <p className="text-sm text-muted-foreground">No articles yet.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
