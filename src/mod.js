/**
 * @param {Object} options
 * @param {string} options.apiKey
 */
export function addictingGamesPlugin({
	apiKey,
}) {
	let initializeCalled = false;

	/** @type {SWAGAPI} */
	let apiInstance;

	const plugin = /** @type {const} @satisfies {import("$adlad").AdLadPlugin} */ ({
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
			await apiInstance.startSession();
		},
		async gameplayStart() {
			await apiInstance.startGame();
		},
		async gameplayStop() {
			await apiInstance.endGame();
		},
		async showFullScreenAd() {
			await apiInstance.showAd();
			return {
				didShowAd: null,
				errorReason: null,
			};
		},
	});

	return plugin;
}
