import template from "./template.js";
import { notesSansLoaded } from "../../fonts/index.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";
import { getElement } from "../../utils/get-element.js";
import throwConfetti from "canvas-confetti";
import { fromEvent, throttleTime, Subscription, take } from "rxjs";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			"cookies-button": {
				confetti: boolean;
			};
		}
	}
}

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class Button extends HTMLElement {
	clickSubscription: Subscription | null = null;

	async connectedCallback() {
		await notesSansLoaded;
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const button = getElement(shadowRoot, "button");
		const confetti: string | null = this.getAttribute("confetti");

		if (confetti !== null) {
			const clickObservable = fromEvent(button, "click")
				.pipe(throttleTime(100), take(7));

			this.clickSubscription = clickObservable.subscribe(() => throwConfetti());
		}
	}

	disconnectedCallback() {
		this.clickSubscription?.unsubscribe();
	}
}
