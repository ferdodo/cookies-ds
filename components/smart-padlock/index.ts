import template from "./template";
import { fromEvent, merge, map, Observable, Subscription } from "rxjs";
import { getShadowRoot } from "../../utils/get-shadow-root";
import { getElement } from "../../utils/get-element";

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class SmartPadlock extends HTMLElement {
	hoverWheels: boolean = false;
	shackleClickSubscription: Subscription | null = null;
	hoverWheelsSubscription: Subscription | null = null;

	static get observedAttributes() {
		return ["locked", "lockable", "code", "unlockable", "release-timestamp"];
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const padlock: HTMLElement = getElement(shadowRoot, "#padlock");

		this.hoverWheelsSubscription = observeHoverElement(this, "#wheels-click-zone")
			.subscribe(hover => {
				this.hoverWheels = hover;
				this.render();
			});

		this.shackleClickSubscription = fromEvent(padlock, "shackle-click")
			.subscribe(() => {
				const event = new CustomEvent("shackle-click");
				this.dispatchEvent(event);
			});

		this.render();
	}

	render() {
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		applyOwnAttributeToElement(this, "#padlock", "locked");
		applyOwnAttributeToElement(this, "#padlock", "lockable");

		const wheels: HTMLElement[] = [
			getElement(shadowRoot, "#scroll-wheel-1"),
			getElement(shadowRoot, "#scroll-wheel-2"),
			getElement(shadowRoot, "#scroll-wheel-3"),
			getElement(shadowRoot, "#scroll-wheel-4"),
			getElement(shadowRoot, "#scroll-wheel-5")
		];

		for (let i = 0; i < wheels.length; i++) {
			const num: string | null = getNumberFromCode(this, i, 5);

			if (num === null) {
				wheels[i].removeAttribute("number");
			} else {
				wheels[i].setAttribute("number", num);
			}
		}

		const unlockable: string | null = this.getAttribute("unlockable");
		const wheelsClickZone: HTMLElement = getElement(shadowRoot, "#wheels-click-zone");
		wheelsClickZone.style.cursor = unlockable === null ? "initial" : "pointer";

		for (let i = 0; i < wheels.length; i++) {
			if (unlockable !== null && this.hoverWheels) {
				wheels[i].setAttribute("unlockable", "");
			} else {
				wheels[i].removeAttribute("unlockable");
			}
		}

		applyOwnAttributeToElement(this, "#padlock-screen", "release-timestamp");
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}

	disconnectedCallback() {
		this.shackleClickSubscription?.unsubscribe();
		this.hoverWheelsSubscription?.unsubscribe();
	}
}

function getNumberFromCode(smartPadlock: SmartPadlock, position: number, codeSize: number): string | null {
	const codeAttr: string | null = smartPadlock.getAttribute("code");

	if (codeAttr === null) {
		return null;
	}

	const code: number = Number.parseInt(codeAttr);

	if (Number.isInteger(code)) {
		const codeAsString: string = code
			.toString()
			.padStart(codeSize, "0");

		return codeAsString.charAt(position);
	} else {
		switch (codeAttr) {
			case "":
				return null;
			case "?":
				return "?";
			default:
				throw new Error("Unknown code attribute !");
		}
	}
}

function applyOwnAttributeToElement(smartPadLock: SmartPadlock, selector: string, attribute: string) {
	const shadowRoot: ShadowRoot = getShadowRoot(smartPadLock);
	const element: HTMLElement = getElement(shadowRoot, selector);
	const value: string | null = smartPadLock.getAttribute(attribute);

	if (value === null) {
		element.removeAttribute(attribute);
	} else {
		element.setAttribute(attribute, value);
	}
}

function observeHoverElement(padlock: SmartPadlock, selector: string): Observable<boolean> {
	const shadowRoot: ShadowRoot = getShadowRoot(padlock);
	const element: HTMLElement = getElement(shadowRoot, selector);

	return merge(
		fromEvent(element, "mouseenter")
			.pipe(map(() => true)),
		fromEvent(element, "mouseout")
			.pipe(map(() => false))
	);
}
