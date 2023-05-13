import template from "./template.js";
import { getElement } from "../../utils/get-element.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";
import { appReady } from "../../utils/app-ready.js";
import { acquireAnimationLock } from "../../utils/animation-lock.js";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			"cookies-panel": {};
		}
	}
}

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class Panel extends HTMLElement {
	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		await appReady;
		const release = await acquireAnimationLock();
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));

		setTimeout(function() {
			const panelContainer: HTMLElement = getElement(shadowRoot, "#panel-container");
			panelContainer.style.gridTemplateColumns = "1rem 1fr 1rem";
			panelContainer.style.gridTemplateRows = "1rem 1fr 1rem";
			const panel: HTMLElement = getElement(shadowRoot, "#panel");
			panel.style.backgroundColor = "#ffffff80";
		}, 10);

		setTimeout(function() {
			const panelContent: HTMLElement = getElement(shadowRoot, "#panel-content");
			panelContent.style.visibility = "visible";
			panelContent.style.opacity = "1";
		}, 400);

		setTimeout(release, 600);
	}
}
