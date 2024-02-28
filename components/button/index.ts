import template from "./template.js";
import { notesSansLoaded } from "../../fonts/index.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";
import { getElement } from "../../utils/get-element.js";
import { Subscription } from "rxjs";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			"cookies-button": { progress?: String };
		}
	}
}

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class Button extends HTMLElement {
	clickSubscription: Subscription | null = null;
	progress: String = "0";

	static get observedAttributes() {
		return ["progress"];
	}

	async connectedCallback() {
		await notesSansLoaded;
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		this.render();
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			const progress: string | null = this.getAttribute("progress");

			if (isProgressValid(progress)) {
				this.progress = progress === null
					? "0"
					: progress;
			}

			this.render();
		}
	}

	render() {
		const shadowRoot = getShadowRoot(this);
		const progress = getElement(shadowRoot, "#progress");
		progress.style.width = `${this.progress}%`;
	}

	disconnectedCallback() {
		this.clickSubscription?.unsubscribe();
	}
}

function isProgressValid(progress: string | null): boolean {
	if (progress === null) {
		return true;
	}

	const progressAsNumber: number = Number(progress);
	const rounded: number = Math.floor(progressAsNumber);

	return rounded == progressAsNumber
		&& Number.isInteger(rounded)
		&& Number.isFinite(rounded)
		&& rounded <= 100
		&& rounded >= 0;
}
