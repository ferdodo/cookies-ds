import template from "./template";
import { notesSansLoaded } from "../../fonts";
import { getShadowRoot } from "../../utils/get-shadow-root";
import { getElement } from "../../utils/get-element";
import { fromEvent, Subscription } from "rxjs";

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
