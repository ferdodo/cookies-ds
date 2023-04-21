import template from "./template";
import { notesSansLoaded } from "../../fonts";
import { getShadowRoot } from "../../utils/get-shadow-root";
import { linkColor, linkVisitedColor } from "../../colors";
import { copyAttribute } from "../../utils/copy-attribute";
import { getElement } from "../../utils/get-element";

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

function addCssRuleToShadowRoot(shadowRoot: ShadowRoot, cssRule: string) {
	const styleElement = document.createElement("style");
	styleElement.textContent = cssRule;
	shadowRoot.appendChild(styleElement);
}

export class A extends HTMLElement {
	async connectedCallback() {
		await notesSansLoaded;
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const a = getElement(shadowRoot, "a");

		copyAttribute("href", this, a);

		addCssRuleToShadowRoot(
			shadowRoot,
			`a { color: ${linkColor}; }`
		);

		addCssRuleToShadowRoot(
			shadowRoot,
			`a:visited { color: ${linkVisitedColor}; }`
		);
	}
}
