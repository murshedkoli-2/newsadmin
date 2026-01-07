import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Save, Globe, Shield, Bell, Layout } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Configure your news portal settings and preferences.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <CardTitle>General Settings</CardTitle>
                        </div>
                        <CardDescription>Basic information about your news portal.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input id="siteName" defaultValue="NewsAdmin" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Site Description</Label>
                            <Textarea id="description" placeholder="A brief description of your portal" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>SEO & Social</CardTitle>
                        </div>
                        <CardDescription>How your site appears in search engines and social media.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fb_url">Facebook URL</Label>
                            <Input id="fb_url" placeholder="https://facebook.com/..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tw_url">Twitter URL</Label>
                            <Input id="tw_url" placeholder="https://twitter.com/..." />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
