import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BridgeAI - AI-Powered Requirements Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #341BAB 0%, #8080F2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
          }}
        >
          BridgeAI
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          AI-Powered Requirements Engineering Platform
        </div>
      </div>
    ),
    { ...size }
  );
}
