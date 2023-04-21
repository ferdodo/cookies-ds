import template from "./template";
import { notesSansLoaded } from "../../fonts";
import { getShadowRoot } from "../../utils/get-shadow-root";

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
