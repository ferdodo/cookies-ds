import template from "./template";
import { Observable, fromEvent, merge, map, Subscription } from "rxjs";
import padlockBodyDataUrl from "./img/padlock-body";
import padlockShackleDataUrl from "./img/padlock-shackle";
import { getShadowRoot } from "../../utils/get-shadow-root";
import { getElement } from "../../utils/get-element";

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class Padlock extends HTMLElement {
	hoverPart1: boolean = false;
	hoverPart2: boolean = false;
	hoverPart3: boolean = false;
	shackleClickSubscription: Subscription | null = null;
	enter1Subscription: Subscription | null = null;
	enter2Subscription: Subscription | null = null;
	enter3Subscription: Subscription | null = null;
	out1Subscription: Subscription | null = null;
	out2Subscription: Subscription | null = null;
	out3Subscription: Subscription | null = null;

	static get observedAttributes() {
		return ["locked", "lockable"];
	}

	get shackleHover() {
		return this.hoverPart1 || this.hoverPart2 || this.hoverPart3;
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const padlockBody: HTMLElement = getElement(shadowRoot, "#padlock-body");
		padlockBody.style["background-image"] = `url("${padlockBodyDataUrl}")`;
		const shackle: HTMLElement = getElement(shadowRoot, "#shackle");
		shackle.style["background-image"] = `url("${padlockShackleDataUrl}")`;
		const shacklePart1: HTMLElement = getElement(shadowRoot, "#shackle-part-1");
		const shacklePart2: HTMLElement = getElement(shadowRoot, "#shackle-part-2");
		const shacklePart3: HTMLElement = getElement(shadowRoot, "#shackle-part-3");

		this.shackleClickSubscription = observeShackleClicks(this)
			.subscribe(() => {
				const event: CustomEvent = new CustomEvent("shackle-click");
				this.dispatchEvent(event);
			});

		this.enter1Subscription = fromEvent(shacklePart1, "mouseenter")
			.subscribe(() => {
				this.hoverPart1 = true;
				this.render();
			});

		this.enter2Subscription = fromEvent(shacklePart2, "mouseenter")
			.subscribe(() => {
				this.hoverPart2 = true;
				this.render();
			});

		this.enter3Subscription = fromEvent(shacklePart3, "mouseenter")
			.subscribe(() => {
				this.hoverPart3 = true;
				this.render();
			});

		this.out1Subscription = fromEvent(shacklePart1, "mouseout")
			.subscribe(() => {
				this.hoverPart1 = false;
				this.render();
			});

		this.out2Subscription = fromEvent(shacklePart2, "mouseout")
			.subscribe(() => {
				this.hoverPart2 = false;
				this.render();
			});

		this.out3Subscription = fromEvent(shacklePart3, "mouseout")
			.subscribe(() => {
				this.hoverPart3 = false;
				this.render();
			});

		this.render();
	}

	render() {
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		const shackle: HTMLElement = getElement(shadowRoot, "#shackle");
		const locked: string | null = this.getAttribute("locked");
		const lockable: string | null = this.getAttribute("lockable");
		const shacklePart1: HTMLElement = getElement(shadowRoot, "#shackle-part-1");
		const shacklePart2: HTMLElement = getElement(shadowRoot, "#shackle-part-2");
		const shacklePart3: HTMLElement = getElement(shadowRoot, "#shackle-part-3");
		shacklePart1.style.cursor = lockable === null ? "initial" : "pointer";
		shacklePart2.style.cursor = lockable === null ? "initial" : "pointer";
		shacklePart3.style.cursor = lockable === null ? "initial" : "pointer";

		if (locked === null) {
			shackle.style.top = "0.1%";

			if (this.shackleHover && lockable !== null) {
				shackle.style.top = "2%";
			}
		} else {
			shackle.style.top = "7.1%";
		}
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}

	disconnectedCallback() {
		this.shackleClickSubscription?.unsubscribe();
		this.enter1Subscription?.unsubscribe();
		this.enter2Subscription?.unsubscribe();
		this.enter3Subscription?.unsubscribe();
		this.out1Subscription?.unsubscribe();
		this.out2Subscription?.unsubscribe();
		this.out3Subscription?.unsubscribe();
	}
}

function observeShackleClicks(padlock: Padlock): Observable<undefined> {
	const shadowRoot: ShadowRoot = getShadowRoot(padlock);
	const shacklePart1: HTMLElement = getElement(shadowRoot, "#shackle-part-1");
	const shacklePart2: HTMLElement = getElement(shadowRoot, "#shackle-part-2");
	const shacklePart3: HTMLElement = getElement(shadowRoot, "#shackle-part-3");

	return merge(
		fromEvent(shacklePart1, "click"),
		fromEvent(shacklePart2, "click"),
		fromEvent(shacklePart3, "click")
	)
		.pipe(map(() => undefined));
}
