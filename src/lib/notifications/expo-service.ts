import prisma from "@/lib/prisma";

export async function sendPushNotification(title: string, body: string, data?: any) {
    try {
        const tokens = await prisma.pushToken.findMany({
            select: { token: true }
        });

        if (tokens.length === 0) return;

        const messages = tokens.map(({ token }) => ({
            to: token,
            sound: "default",
            title,
            body,
            data,
        }));

        // Send to Expo Push API
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
        });

        const result = await response.json();
        console.log("Push notification result:", result);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
}
