import template from "./template.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			"cookies-lcd-screen": {};
		}
	}
}

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class LcdScreen extends HTMLElement {
	connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
	}
}
