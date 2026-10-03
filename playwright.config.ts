import { defineConfig } from "@playwright/test";
const baseURL = process.env.PORTFOLIO_TEST_URL || "http://localhost:3100";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 2,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["json", { outputFile: "test-results/report.json" }]],
  use: {
    baseURL,
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
    launchOptions: {
      args: [
        "--enable-webgl",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `node node_modules/next/dist/bin/next start -p ${new URL(baseURL).port || "3100"}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 45000,
  },
});
