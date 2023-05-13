import template from "./template.js";
import { notesSansLoaded } from "../../fonts/index.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";
import { linkColor, linkVisitedColor } from "../../colors.js";
import { copyAttribute } from "../../utils/copy-attribute.js";
import { getElement } from "../../utils/get-element.js";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			"cookies-a": {};
		}
	}
}

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
