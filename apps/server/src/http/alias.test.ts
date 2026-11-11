import { describe, expect, it, vi } from "vite-plus/test";

vi.mock("@reactive-resume/env/server", () => ({
	env: { APP_URL: "https://lebenslauf2.florentin-one.de", APP_ALIAS_URL: "https://cv2.florentin-one.de" },
}));

const { handleAlias, onAppDomain } = await import("./alias");

const visit = (path: string) => handleAlias(new Request(`https://cv2.florentin-one.de${path}`));

describe("the app's alias domain", () => {
	it.each(["/auth/login?redirect=%2Fdashboard", "/dashboard"])("moves %s to the app's own address for good", (path) => {
		const response = visit(path);
		expect(response?.status).toBe(301);
		expect(response?.headers.get("Location")).toBe(`https://lebenslauf2.florentin-one.de${path}`);
	});

	it.each(["/", "/api/rpc/flags/get", "/authors"])("serves %s itself", (path) => {
		expect(visit(path)).toBeNull();
	});

	it("keeps a path that looks like another host on the app's own address", () => {
		expect(onAppDomain(new URL("https://cv2.florentin-one.de//evil.example/login?next=1"))).toBe(
			"https://lebenslauf2.florentin-one.de//evil.example/login?next=1",
		);
	});
});
