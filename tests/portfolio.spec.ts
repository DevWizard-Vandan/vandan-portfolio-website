import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { cameraPose, journeyAt } from "../components/journey";

const routes = [
  "/",
  "/work",
  "/research",
  "/about",
  "/work/indra",
  "/work/whisper-net",
  "/work/lithos",
  "/work/karyaphala",
  "/work/dcpa-praxis",
];
test("camera path is continuous at every chapter boundary", () => {
  for (let index = 0; index < 5; index++) {
    const departure = cameraPose(
      journeyAt(index, 1),
      false,
      index === 0 ? 100 : 65,
    );
    const arrival = cameraPose(journeyAt(index + 1, 0), false);
    for (let axis = 0; axis < 3; axis++) {
      expect(departure.camera[axis]).toBeCloseTo(arrival.camera[axis], 9);
      expect(departure.target[axis]).toBeCloseTo(arrival.target[axis], 9);
    }
  }
});
test("native scrolling approaches, traverses, reverses and stops the 3D camera", async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(75000);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
    recordVideo: {
      dir: "docs/implementation/scroll-recordings",
      size: { width: 1280, height: 800 },
    },
  });
  const page = await context.newPage();
  const video = page.video()!;
  try {
    await page.goto(`${baseURL}/`);
    const canvas = page.locator("canvas");
    await expect(page.locator(".canvas-interaction")).toHaveAttribute(
      "data-ready",
      "true",
    );
    await expect(canvas).toHaveAttribute("data-render-phase", "idle");
    const startZ = Number(await canvas.getAttribute("data-camera-z"));
    expect((await canvas.boundingBox())!.width).toBe(1280);
    await page.mouse.move(640, 360);
    await page.waitForTimeout(1000); // Let the recording show the arrival frame.
    await page.mouse.wheel(0, 640);
    await expect(page.locator(".experience")).toHaveAttribute(
      "data-passage",
      "inspect",
    );
    await expect(canvas).toHaveAttribute("data-render-phase", "idle");
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-camera-z")))
      .toBeLessThan(startZ - 1.5);
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-camera-x")))
      .toBeGreaterThan(1.5);
    await expect(canvas).toHaveAttribute("data-render-phase", "idle");
    await expect
      .poll(async () =>
        page
          .locator("#specimen .chapter-copy")
          .evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeLessThan(0.1);
    await page.waitForTimeout(1200);
    await page.mouse.wheel(0, 960);
    await expect(page.locator(".world-stage .laboratory")).toHaveAttribute(
      "data-scene",
      "indra",
    );
    await expect(canvas).toHaveAttribute("data-render-phase", "idle");
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-camera-z")))
      .toBeLessThan(-7);
    await expect(canvas).toHaveAttribute("data-render-phase", "idle");
    await page
      .getByRole("button", { name: "Disconnect the bridge ⤯", exact: true })
      .click();
    await expect(page.locator(".world-stage .lab-readout")).toContainText(
      "queued",
    );
    await page.waitForTimeout(1200);
    await page.mouse.move(640, 360);
    await page.mouse.wheel(0, -960);
    await expect(page.locator(".world-stage .laboratory")).toHaveAttribute(
      "data-scene",
      "specimen",
    );
    await expect(canvas).toHaveAttribute("data-render-phase", "idle");
    await page.waitForTimeout(900);
    await page.mouse.wheel(0, -640);
    await expect(canvas).toHaveAttribute("data-render-phase", "idle");
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-camera-z")))
      .toBeCloseTo(startZ, 1);
    await expect(canvas).toHaveAttribute("data-render-phase", "idle");
    await expect
      .poll(async () => {
        const stoppedFrame = await canvas.getAttribute("data-render-frame");
        await page.waitForTimeout(500);
        return (
          (await canvas.getAttribute("data-render-frame")) === stoppedFrame
        );
      })
      .toBe(true);
  } finally {
    await context.close();
    await video.saveAs("docs/implementation/scroll-journey-v3.webm");
  }
});

test("all pages and public evidence are available; unknown projects return 404", async ({
  request,
}) => {
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(await response.text(), route).toContain('<main id="main"');
  }
  for (const file of [
    "/evidence/whisper-net-paper.pdf",
    "/evidence/indra-technical-brief.pdf",
    "/evidence/indra-architecture.svg",
    "/Vandan-Sharma-Resume.pdf",
    "/sitemap.xml",
    "/robots.txt",
    "/opengraph-image",
  ]) {
    expect((await request.get(file)).status(), file).toBe(200);
  }
  expect((await request.get("/work/does-not-exist")).status()).toBe(404);
});
test("content remains useful without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/work/whisper-net`);
  await expect(
    page.getByRole("heading", { name: "Whisper-Net", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Research coauthors", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Read accepted manuscript · PDF ↗",
      exact: true,
    }),
  ).toHaveAttribute("href", "/evidence/whisper-net-paper.pdf");
  await context.close();
});
test("3D object picking, dragging, keyboard adjustment, and 2D round trip", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".canvas-interaction")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page
    .getByRole("button", { name: "Representations", exact: true })
    .click();
  const pickingBox = (await page.locator("canvas").boundingBox())!;
  await page.locator("canvas").click({
    position: { x: pickingBox.width * 0.73, y: pickingBox.height * 0.62 },
  });
  await expect(page.locator(".world-stage .lab-readout")).not.toContainText(
    "Representations layer selected",
  );
  await page.getByRole("button", { name: "Signals", exact: true }).click();
  const before = await page.locator("canvas").screenshot();
  const box = await page.locator("canvas").boundingBox();
  expect(box).toBeTruthy();
  await page.mouse.move(box!.x + box!.width * 0.45, box!.y + box!.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.7, box!.y + box!.height * 0.5, {
    steps: 12,
  });
  await page.mouse.up();
  const after = await page.locator("canvas").screenshot();
  expect(before.equals(after)).toBe(false);
  const slider = page.getByRole("slider", {
    name: "Layer separation",
    exact: true,
  });
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveValue("100");
  await page.getByRole("button", { name: "2D view ↗", exact: true }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".world-stage .lab-readout")).toContainText("100%");
  await page.getByRole("button", { name: "3D view ↗", exact: true }).click();
  await expect(page.locator("canvas")).toBeVisible();
  await expect(slider).toHaveValue("100");
  expect(errors).toEqual([]);
});
test("INDRA partitions and reconnects; scene state persists across chapters", async ({
  page,
}) => {
  await page.goto("/#indra");
  await page
    .getByRole("button", { name: "Disconnect the bridge ⤯", exact: true })
    .click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "queued",
  );
  await page.getByRole("button", { name: "05 Peer E", exact: true }).click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "Peer E",
  );
  await page.getByRole("link", { name: "02 whisper-net", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Follow the message →", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "01 indra", exact: true }).click();
  await page
    .getByRole("button", { name: "Reconnect peers ↔", exact: true })
    .click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "Peer E is connected",
  );
});
test("Whisper-Net pipeline, LITHOS distortion, evidence disputes and research presets", async ({
  page,
}) => {
  await page.goto("/#whisper-net");
  await page
    .getByRole("button", { name: "Follow the message →", exact: true })
    .click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "Encrypted payload",
  );
  await page.getByRole("link", { name: "03 lithos", exact: true }).click();
  const slider = page.getByRole("slider", {
    name: "Channel distortion",
    exact: true,
  });
  await slider.focus();
  await slider.press("End");
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "recovery is not guaranteed",
  );
  await page.getByRole("link", { name: "04 karyaphala", exact: true }).click();
  await page
    .getByRole("button", { name: "Add contradiction", exact: true })
    .click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "disputed",
  );
  await page
    .getByRole("button", { name: "Insufficient evidence", exact: true })
    .click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "abstains",
  );
  await page.getByRole("link", { name: "05 dcpa-praxis", exact: true }).click();
  await page
    .getByRole("button", { name: "DCPA: official", exact: true })
    .click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText("0/30");
  await page
    .getByRole("button", { name: "PRAXIS: internal", exact: true })
    .click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "not an ARC result",
  );
});
test("context loss leaves an interactive diagram and allows an explicit retry", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".canvas-interaction")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.getByRole("button", { name: "Evidence", exact: true }).click();
  await page
    .locator("canvas")
    .evaluate((canvas) =>
      (canvas as HTMLCanvasElement)
        .getContext("webgl2")
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext(),
    );
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "Evidence layer selected",
  );
  await page.getByRole("button", { name: "Signals", exact: true }).click();
  await expect(page.locator(".world-stage .lab-readout")).toContainText(
    "Signals layer selected",
  );
  await page.getByRole("button", { name: "Retry 3D ↗", exact: true }).click();
  await expect(page.locator("canvas")).toBeVisible();
});
test("full-motion chapter transitions keep each experiment usable at compact desktop size", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".canvas-interaction")).toHaveAttribute(
    "data-ready",
    "true",
  );
  for (const [chapter, experiment] of [
    ["01 indra", "Disconnect the bridge ⤯"],
    ["02 whisper-net", "Follow the message →"],
    ["03 lithos", "02 Unknown medium"],
    ["04 karyaphala", "Insufficient evidence"],
    ["05 dcpa-praxis", "PRAXIS: internal"],
  ]) {
    await page.getByRole("link", { name: chapter, exact: true }).click();
    const control = page.getByRole("button", { name: experiment, exact: true });
    await expect(control).toBeInViewport();
    const before = await page.locator("canvas").screenshot();
    await control.click();
    const after = await page.locator("canvas").screenshot();
    expect(before.equals(after), chapter).toBe(false);
    expect(
      (await page.locator("canvas").boundingBox())!.height,
      chapter,
    ).toBeGreaterThan(300);
  }
  expect(errors).toEqual([]);
});
test("project filters and support disclosures work", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("button", { name: "Signals", exact: true }).click();
  await expect(page.locator(".index-project")).toHaveCount(2);
  await page
    .getByRole("button", { name: "AI + synthesis", exact: true })
    .click();
  await expect(page.locator(".index-project")).toHaveCount(1);
  await page.locator("#triyantra summary").click();
  await expect(page.locator("#triyantra")).toHaveAttribute("open", "");
  await expect(
    page.getByText(
      "Ternary-weight bitplanes and lookup-table kernels across CPU architectures.",
      { exact: true },
    ),
  ).toBeVisible();
});
test("motion preference is respected and survives reload", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Reduced motion/ });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});
test("mobile navigation and experiment controls remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Toggle navigation", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Selected work", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Toggle navigation", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Enter the laboratory ↘", exact: true })
    .click();
  const disconnect = page.getByRole("button", {
    name: "Disconnect the bridge ⤯",
    exact: true,
  });
  await disconnect.scrollIntoViewIfNeeded();
  await disconnect.click();
  await expect(page.locator("#indra .lab-readout")).toContainText("queued");
  const sceneHeight = (await page.locator("#indra-experiment").boundingBox())!
    .height;
  await page.locator("#whisper-net-experiment").scrollIntoViewIfNeeded();
  await expect(page.locator("#indra-experiment")).toHaveJSProperty(
    "offsetHeight",
    Math.round(sceneHeight),
  );
  await page.locator("#indra-experiment").scrollIntoViewIfNeeded();
  await expect(page.locator("#indra .lab-readout")).toContainText("queued");
  expect(await page.locator("canvas").count()).toBeLessThanOrEqual(2);
});
test("responsive routes avoid horizontal overflow", async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const route of [
      "/",
      "/work",
      "/work/dcpa-praxis",
      "/research",
      "/about",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
    }
  }
});
test("touch controls inspect peers and adjust the channel", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/#indra`);
    const disconnect = page.getByRole("button", {
      name: "Disconnect the bridge ⤯",
      exact: true,
    });
    await disconnect.scrollIntoViewIfNeeded();
    await disconnect.tap();
    await page.getByRole("button", { name: "06 Peer F", exact: true }).tap();
    await expect(page.locator("#indra .lab-readout")).toContainText(
      "Peer F retains",
    );
    await page.goto(`${baseURL}/#lithos`);
    const slider = page.getByRole("slider", {
      name: "Channel distortion",
      exact: true,
    });
    await slider.scrollIntoViewIfNeeded();
    const box = await slider.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await page.touchscreen.tap(
      box!.x + box!.width * 0.86,
      box!.y + box!.height / 2,
    );
    expect(Number(await slider.inputValue())).toBeGreaterThan(35);
  } finally {
    await context.close();
  }
});
for (const width of [390, 1280])
  test(`accessibility scan at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of routes) {
      await page.goto(route);
      if (route.startsWith("/work/"))
        await expect(
          page.getByRole("button", { name: "Reset ↺", exact: true }),
        ).toBeVisible();
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        route,
      ).toEqual([]);
    }
  });
