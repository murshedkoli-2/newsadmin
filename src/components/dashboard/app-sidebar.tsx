"use client";

import * as React from "react";
import {
    LayoutDashboard,
    Newspaper,
    LayoutGrid,
    Users,
    BarChart3,
    Settings,
    ChevronRight,
    LogOut,
    Bell,
    Moon,
    Sun,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = {
    user: {
        name: "Admin User",
        email: "admin@example.com",
        avatar: "/avatars/admin.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: LayoutDashboard,
        },
        {
            title: "News",
            url: "/news",
            icon: Newspaper,
            items: [
                { title: "All Articles", url: "/news" },
                { title: "Create New", url: "/news/create" },
                { title: "Scheduled", url: "/news/scheduled" },
            ],
        },
        {
            title: "Categories",
            url: "/categories",
            icon: LayoutGrid,
        },
        {
            title: "Users",
            url: "/users",
            icon: Users,
        },
        {
            title: "Analytics",
            url: "/analytics",
            icon: BarChart3,
        },
    ],
    secondary: [
        {
            title: "Settings",
            url: "/settings",
            icon: Settings,
        },
    ],
};

export function AppSidebar() {
    const { data: session } = useSession();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const user = {
        name: session?.user?.name || "Admin",
        email: session?.user?.email || "",
        role: (session?.user as any)?.role || "CONTRIBUTOR",
    };

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Newspaper className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">NewsAdmin</span>
                        <span className="text-xs text-muted-foreground">v1.0.0</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                                >
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                                {item.items && (
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                    <Link href={subItem.url}>{subItem.title}</Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel>System</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.secondary.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={pathname === item.url}
                                >
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                tooltip="Toggle Theme"
                            >
                                {!mounted ? (
                                    <Moon className="h-4 w-4" />
                                ) : resolvedTheme === "dark" ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                                <span>{mounted ? (resolvedTheme === "dark" ? "Light Mode" : "Dark Mode") : "Toggle Theme"}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarFallback className="rounded-lg bg-zinc-800 text-zinc-400">
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                    <ChevronRight className="ml-auto h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarFallback className="rounded-lg bg-zinc-800 text-zinc-400">
                                                {user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
