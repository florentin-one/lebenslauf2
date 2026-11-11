import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from "@tanstack/react-router";
import { renderToStaticMarkup } from "react-dom/server";
import { Share } from "./share";

afterEach(() => vi.unstubAllGlobals());

describe("landing share address", () => {
	it.each([
		{
			origin: "https://lebenslauf2.florentin-one.de",
			aliasUrl: "https://cv2.florentin-one.de",
			address: "cv2.florentin-one.de/laura-beier",
		},
		{
			origin: "https://lebenslauf2.florentin-one.de",
			aliasUrl: undefined,
			address: "lebenslauf2.florentin-one.de/laura-beier",
		},
		{ origin: "http://localhost:3000", aliasUrl: undefined, address: "localhost:3000/laura-beier" },
	])("shows $address", async ({ origin, aliasUrl, address }) => {
		vi.stubGlobal("window", { location: { origin } });
		const router = createRouter({
			routeTree: createRootRoute({ beforeLoad: () => ({ flags: { aliasUrl } }) }),
			history: createMemoryHistory({ initialEntries: ["/"] }),
		});
		await router.load();
		i18n.loadAndActivate({ locale: "en-US", messages: {} });

		const html = renderToStaticMarkup(
			<RouterContextProvider router={router}>
				<I18nProvider i18n={i18n}>
					<Share />
				</I18nProvider>
			</RouterContextProvider>,
		);

		expect(html).toContain(`<span class="sr-only">${address}</span>`);
	});

	it("falls back to lebenslauf2.me when prerendering without deployment configuration", () => {
		const router = createRouter({
			routeTree: createRootRoute(),
			history: createMemoryHistory({ initialEntries: ["/"] }),
		});
		i18n.loadAndActivate({ locale: "en-US", messages: {} });

		const html = renderToStaticMarkup(
			<RouterContextProvider router={router}>
				<I18nProvider i18n={i18n}>
					<Share />
				</I18nProvider>
			</RouterContextProvider>,
		);

		expect(html).toContain('<span class="sr-only">lebenslauf2.me/laura-beier</span>');
	});
});
