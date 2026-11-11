/** Explicit Android package intent bypasses disabled App Links, retaining the registered HTTPS OAuth response. */
export function androidCallbackIntent(search: string): string {
	const callback = new URL("https://lebenslauf2.florentin-one.de/auth/native-callback");
	callback.search = search;
	return `intent://${callback.host}${callback.pathname}${callback.search}#Intent;scheme=https;package=me.lebenslauf2;end`;
}
