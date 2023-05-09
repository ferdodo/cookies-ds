import template from "./template.js";
import { notesSansLoaded } from "../../fonts/index.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class P extends HTMLElement {
	async connectedCallback() {
		await notesSansLoaded;
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
	}
}
