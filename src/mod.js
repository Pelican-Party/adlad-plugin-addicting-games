/**
 * @param {Object} options
 * @param {string} options.apiKey
 * @param {boolean} [options.adsEnabled]
 */
export function addictingGamesPlugin({
	apiKey,
	adsEnabled = true,
}) {
	let initializeCalled = false;

	/** @type {SWAGAPI} */
	let apiInstance;

	/** @satisfies {import("$adlad").AdLadPlugin} */
	const plugin = /** @type {const} */ ({
		name: "addictinggames",
		async initialize(ctx) {
			if (initializeCalled) {
				throw new Error("Addicting Games plugin is being initialized more than once");
			}
			initializeCalled = true;

			await ctx.loadScriptTag("https://swagapi.shockwave.com/dist/swag-api.js");
			const linkEl = document.createElement("link");
			linkEl.rel = "stylesheet";
			linkEl.type = "text/css";
			linkEl.href = "https://swagapi.shockwave.com/dist/swag-api.css";
			document.body.append(linkEl);

			// The swag api adds 'position: relative' to the wrapper element that we provide,
			// but we really need it to be 'position: absolute'. So we have to create
			// an extra wrapper around the element that we provide.
			const wrapperContainer = document.createElement("div");
			wrapperContainer.style.position = "absolute";
			wrapperContainer.style.inset = "0";
			wrapperContainer.style.display = "none";
			document.body.append(wrapperContainer);

			const wrapper = document.createElement("div");
			wrapperContainer.append(wrapper);

			apiInstance = SWAGAPI.getInstance({
				wrapper,
				api_key: apiKey,
				debug: ctx.useTestAds,
				theme: "shockwave",
			});
			let warningTimeout;
			if (location.hostname == "localhost" || location.hostname == "127.0.0.1") {
				warningTimeout = setTimeout(() => {
					const visitUrl = new URL(location.href);
					visitUrl.host = "local.shockwave.com";
					console.warn(
						`Addicting games plugin initialization timed out. For local development please add the following to your hosts file:

	127.0.0.1	local.shockwave.com

Then visit ${visitUrl.href} in your browser.`,
					);
				}, 3_000);
			}
			await apiInstance.startSession();
			clearTimeout(warningTimeout);
		},
		async gameplayStart() {
			await apiInstance.startGame();
		},
		async gameplayStop() {
			await apiInstance.endGame();
		},
		showFullScreenAd: adsEnabled
			? async function () {
				await apiInstance.showAd();
				return {
					didShowAd: null,
					errorReason: null,
				};
			}
			: undefined,
	});

	return plugin;
}
