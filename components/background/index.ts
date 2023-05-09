import template from "./template.js";
import { Observable, combineLatest, interval, tap, map, Subscription } from "rxjs";
import cookieImg from "./img/cookie.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";
import { acquireAnimationLock } from "../../utils/animation-lock.js";
import { primaryColor } from "../../colors.js";

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class Background extends HTMLElement {
	waitCookieImage: Promise<HTMLImageElement> = initCookieImage();
	cookies: Cookie[] = [];
	canvasSizeSubscription: Subscription | null = null;
	cookiesSubscription: Subscription | null = null;

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		const release = await acquireAnimationLock();
		shadowRoot.appendChild(templateNode.content.cloneNode(true));

		setTimeout(() => {
			const canvas = getBackgroundCanvas(this);
			canvas.style.opacity = "1";
			setTimeout(release, 800);
		}, 1);

		this.canvasSizeSubscription = observeCanvasSize(this)
			.subscribe(() => {
				const canvas = getBackgroundCanvas(this);
				const { width, height } = canvas.getBoundingClientRect();
				canvas.setAttribute("width", `${width}`);
				canvas.setAttribute("height", `${height - 10}`);
			});

		this.cookiesSubscription = observeCookies(this)
			.subscribe(cookies => {
				this.cookies = cookies;

				this.render()
					.catch(console.error);
			});

		await this.render();
	}

	async render() {
		const cookieImage = await this.waitCookieImage;
		const canvas = getBackgroundCanvas(this);
		const ctx: CanvasRenderingContext2D = getCanvasContext(this);
		ctx.fillStyle = primaryColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (const cookie of this.cookies) {
			ctx.save();
			ctx.translate(cookie.x, cookie.y);
			ctx.rotate(cookie.rotation * Math.PI / 180);
			ctx.drawImage(cookieImage, 0, 0);
			ctx.restore();
		}
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			this.render()
				.catch(console.error);
		}
	}

	disconnectedCallback() {
		this.canvasSizeSubscription?.unsubscribe();
		this.cookiesSubscription?.unsubscribe();
	}
}

function observeCanvasSize(background: Background): Observable<[number, number]> {
	return new Observable(function(subscriber) {
		const backgroundCanvas = getBackgroundCanvas(background);

		new ResizeObserver(function() {
			const canvas = getBackgroundCanvas(background);
			const { width, height } = canvas.getBoundingClientRect();
			subscriber.next([width, height]);
		})
			.observe(backgroundCanvas);
	});
}

interface Cookie {
	x: number;
	y: number;
	rotation: number;
	clockwiseRotation: boolean;
}

function createCookie(width: number, height: number): Cookie {
	return {
		x: Math.floor(Math.random() * width),
		y: Math.floor(Math.random() * height),
		rotation: Math.floor(Math.random() * 360),
		clockwiseRotation: Math.random() > 0.5
	};
}

function ajustCookiesQuantiy(cookiesInitial: Cookie[], width: number, height: number): Cookie[] {
	let cookies = [...cookiesInitial];
	const numberOfCookies: number = Math.ceil((width * height) / (500 * 500));

	while (cookies.length < numberOfCookies) {
		cookies = [...cookies, createCookie(width, height)];
	}

	cookies = cookies.splice(0, numberOfCookies);
	return cookies;
}

function observeCookies(background: Background): Observable<Cookie[]> {
	let cookies: Cookie[] = [];

	return combineLatest(
		observeCanvasSize(background)
			.pipe(tap(function([width, height]) {
				cookies = ajustCookiesQuantiy(cookies, width, height);
			})),
		interval(200)
	)
		.pipe(map(function(/*[width, height]*/) {
			return cookies = cookies.map(function(cookie) {
				const rotation = cookie.rotation + (cookie.clockwiseRotation ? 0.01 : -0.01);
				const newCookie: Cookie = { ...cookie, rotation };
				return newCookie;
			});
		}));
}

function initCookieImage(): Promise<HTMLImageElement> {
	return new Promise(function(resolve, reject) {
		const image = new Image();
		const timeout = setTimeout(reject, 10000, new Error("Timed out while to load image !"));

		image.addEventListener("load", function() {
			resolve(image);
			clearTimeout(timeout);
		});

		image.src = cookieImg;
	});
}

function getBackgroundCanvas(background: Background): HTMLCanvasElement {
	const shadowRoot = getShadowRoot(background);
	const canvas: HTMLElement | null = shadowRoot.querySelector("#background");

	if (canvas === null) {
		throw new Error("Background not found !");
	}

	if (canvas.tagName !== "CANVAS") {
		throw new Error("Element is not a canvas !");
	}

	return canvas as HTMLCanvasElement;
}

function getCanvasContext(background: Background): CanvasRenderingContext2D {
	const canvas: HTMLCanvasElement = getBackgroundCanvas(background);
	const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

	if (ctx === null) {
		throw new Error("Failed to get context !");
	}

	return ctx;
}
