import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vandan Sharma portfolio";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07090d",
          color: "#f8fafc",
          fontFamily: "Arial"
        }}
      >
        <div style={{ fontSize: 28, color: "#56d6ff" }}>
          Vandan Sharma / Systems / Applied AI / Quant
        </div>
        <div>
          <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>
            Built for pressure.
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 42, fontSize: 28 }}>
            <span>12.8M matches/sec</span>
            <span>Global Rank 20</span>
            <span>WorldQuant Gold</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
