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
	confetti: boolean = false;

	static get observedAttributes() {
		return ["confetti"];
	}

	async connectedCallback() {
		await notesSansLoaded;
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const button = getElement(shadowRoot, "button");
		this.confetti = this.getAttribute("confetti") !== null;

		const clickObservable = fromEvent(button, "click")
			.pipe(throttleTime(100), take(7));

		this.clickSubscription = clickObservable.subscribe(() => {
			if (this.confetti) {
				throwConfetti();
			}
		});
	}

	attributeChangedCallback() {
		this.confetti = this.getAttribute("confetti") !== null;
	}

	disconnectedCallback() {
		this.clickSubscription?.unsubscribe();
	}
}
