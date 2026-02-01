"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export function GoogleAuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";

    if (!clientId || clientId === "YOUR_CLIENT_ID" || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
        console.warn("Google Client ID is missing or invalid. Google Auth will be disabled.");
        return <>{children}</>;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
    );
}
