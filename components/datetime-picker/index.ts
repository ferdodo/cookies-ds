import template from "./template.js";
import { notesSansLoaded } from "../../fonts/index.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";
import { getElement } from "../../utils/get-element.js";
import { fromEvent, Subscription } from "rxjs";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			"cookies-datetime-picker": {};
		}
	}
}

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class DatetimePicker extends HTMLElement {
	inputChangeSubscription: Subscription | null = null;

	async connectedCallback() {
		await notesSansLoaded;
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const datetimePicker = getElement(shadowRoot, "input");

		this.inputChangeSubscription = fromEvent(datetimePicker, "change")
			.subscribe((event: Event) => {
				const target: HTMLInputElement = getEventTarget(event);
				const detail: Number = target.valueAsNumber;
				const dispatched = new CustomEvent("change", { detail });
				this.dispatchEvent(dispatched);
			});
	}

	disconnectedCallback() {
		this.inputChangeSubscription?.unsubscribe();
	}
}

function getEventTarget(event): HTMLInputElement {
	if (event?.target?.tagName !== "INPUT") {
		throw new Error("Event target is not an input !");
	}

	return event.target as HTMLInputElement;
}
