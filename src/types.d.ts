type GetInstanceOptions = {
	wrapper: HTMLElement;
	api_key?: string;
	theme?: string;
	debug: boolean;
};

declare class SWAGAPI {
	static getInstance(options: GetInstanceOptions): SWAGAPI;
	startSession(): Promise<void>;
	startGame(): Promise<void>;
	endGame(): Promise<void>;
	showAd(): Promise<void>;
}
