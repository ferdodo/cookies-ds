import template from "./template.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class LcdScreen extends HTMLElement {
	connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
	}
}
