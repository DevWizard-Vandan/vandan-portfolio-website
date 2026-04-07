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
          background: "#0b1020",
          color: "#f8fafc",
          fontFamily: "Arial"
        }}
      >
        <div style={{ fontSize: 28, color: "#7dd3fc" }}>Vandan Sharma</div>
        <div>
          <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>
            Systems Engineer & Applied AI Researcher
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 42, fontSize: 28 }}>
            <span>Patent holder</span>
            <span>Published researcher</span>
            <span>12.8M matches/sec</span>
            <span>8x H100 run</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
