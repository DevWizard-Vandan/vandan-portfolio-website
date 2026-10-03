import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Vandan Sharma portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#080d12",
        color: "#e6ece8",
        fontFamily: "Arial",
      }}
    >
      <div style={{ fontSize: 28, color: "#7dd3fc" }}>
        Vandan Sharma / Systems & Applied AI
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          <span>Engineering</span>
          <span>the invisible.</span>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 42, fontSize: 28 }}>
          <span>Whisper-Net · Accepted at WiCOMM 2026</span>
        </div>
      </div>
    </div>,
    size,
  );
}
