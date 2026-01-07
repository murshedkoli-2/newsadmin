"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Globe, Shield, Smartphone, Loader2, Copy } from "lucide-react";
import { getSettings, updateSettings } from "@/actions/settings";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [apiUrl, setApiUrl] = useState("");

    useEffect(() => {
        // Set API URL on client side
        setApiUrl(`${window.location.origin}/api/public`);

        // Fetch settings
        getSettings().then((data) => {
            setSettings(data);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateSettings(settings);
            if (!result.success) {
                console.error(result.error);
            }
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiUrl);
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

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
                            <Input
                                id="siteName"
                                value={settings.site_name || ""}
                                onChange={(e) => handleChange("site_name", e.target.value)}
                                placeholder="NewsAdmin"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Site Description</Label>
                            <Textarea
                                id="description"
                                value={settings.site_description || ""}
                                onChange={(e) => handleChange("site_description", e.target.value)}
                                placeholder="A brief description of your portal"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <CardTitle>Mobile App Integration</CardTitle>
                        </div>
                        <CardDescription>Connect your mobile application to this admin panel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label>API Base URL</Label>
                            <div className="flex gap-2">
                                <Input value={apiUrl} readOnly className="font-mono bg-muted" />
                                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Use this URL in your mobile app configuration.
                            </p>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Enable Mobile API</Label>
                                <p className="text-sm text-muted-foreground">
                                    Allow the mobile app to fetch content from this server.
                                </p>
                            </div>
                            <Switch
                                checked={settings.mobile_api_enabled === "true"}
                                onCheckedChange={(checked) => handleChange("mobile_api_enabled", String(checked))}
                            />
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
                            <Input
                                id="fb_url"
                                value={settings.facebook_url || ""}
                                onChange={(e) => handleChange("facebook_url", e.target.value)}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tw_url">Twitter URL</Label>
                            <Input
                                id="tw_url"
                                value={settings.twitter_url || ""}
                                onChange={(e) => handleChange("twitter_url", e.target.value)}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
