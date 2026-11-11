import { describe, expect, it } from "vite-plus/test";
import {
	getLocaleAlternates,
	getPreferredLocale,
	isLocale,
	localeSchema,
	localizedUrl,
	supportedLocales,
} from "./locale";

it.each([
	[["de-DE"], "de-DE"],
	[["unsupported", "fr-CA", "de-DE"], "fr-FR"],
	[["de-AT", "fr-FR"], "de-DE"],
	[["de-de"], "de-DE"],
	[["en-GB", "en-US"], "en-GB"],
	[["zu-ZA", "de-DE"], "de-DE"],
	[["zu-ZA"], "en-US"],
	[[], "en-US"],
])("matches ordered language preferences %j to %s", (languages, expected) => {
	expect(getPreferredLocale(languages)).toBe(expected);
});

it("keeps the testing catalog valid without counting it as a supported translation", () => {
	expect(isLocale("zu-ZA")).toBe(true);
	expect(localeSchema.options).toContain("zu-ZA");
	expect(supportedLocales).not.toContain("zu-ZA");
	expect(supportedLocales).toContain("de-DE");
	expect(getLocaleAlternates("https://lebenslauf2.florentin-one.de/")).toHaveLength(supportedLocales.length + 1);
});

describe("locale URLs", () => {
	it("keeps the default locale on the plain address and puts others in the locale parameter", () => {
		expect(localizedUrl("https://lebenslauf2.florentin-one.de/?locale=de-DE", "en-US")).toBe(
			"https://lebenslauf2.florentin-one.de/",
		);
		expect(localizedUrl("https://lebenslauf2.florentin-one.de/", "de-DE")).toBe(
			"https://lebenslauf2.florentin-one.de/?locale=de-DE",
		);
	});

	it("lists valid hreflang alternates without the pseudo-locale", () => {
		const alternates = getLocaleAlternates("https://lebenslauf2.florentin-one.de/");

		expect(alternates).toContainEqual({ hreflang: "x-default", href: "https://lebenslauf2.florentin-one.de/" });
		expect(alternates).toContainEqual({ hreflang: "sr", href: "https://lebenslauf2.florentin-one.de/?locale=sr-SP" });
		expect(alternates.map((alternate) => alternate.hreflang)).not.toContain("zu-ZA");
	});
});
