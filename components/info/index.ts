import template from "./template";
import { getShadowRoot } from "../../utils/get-shadow-root";
import { getElement } from "../../utils/get-element";
import { copyAttribute } from "../../utils/copy-attribute";

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class Info extends HTMLElement {
	static get observedAttributes() {
		return ["visited"];
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const svg = getElement(shadowRoot, "svg");
		copyAttribute("title", this, svg);
		this.render();
	}

	render() {
		const shadowRoot = getShadowRoot(this);
		const svg = getElement(shadowRoot, "svg");
		const visited: string | null = this.getAttribute("visited");
		svg.style.opacity = visited === null ? "initial" : "0.25";
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}
}
