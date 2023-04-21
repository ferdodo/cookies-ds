import template from "./template";
import { getElement } from "../../utils/get-element";
import { getShadowRoot } from "../../utils/get-shadow-root";
import { appReady } from "../../utils/app-ready";
import { acquireAnimationLock } from "../../utils/animation-lock";

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
