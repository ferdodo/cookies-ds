import template from "./template.js";
import digitalFont from "./fonts/digital.js";
import { getElement } from "../../utils/get-element.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			"cookies-padlock-screen": { "release-timestamp"?: string };
		}
	}
}

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class PadlockScreen extends HTMLElement {
	static get observedAttributes() {
		return ["release-timestamp"];
	}

	async connectedCallback() {
		const font: FontFace = new FontFace("digital", `url('${digitalFont}')`);
		await font.load();
		(document.fonts as any).add(font);
		this.attachShadow({ mode: "open" });
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		this.render();
	}

	render() {
		const [canvas, canvasContext] = createCanvasAndContext();
		canvasContext.font = "44px digital";
		const [releaseDateLabel, releaseHoursLabel] = getReleaseDateLabels(this);
		canvasContext.fillText(releaseDateLabel, 48, 78);
		canvasContext.fillText(releaseHoursLabel, 68, 132);
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		const releaseDate: HTMLElement = getElement(shadowRoot, "#release-date");
		const dataUrl: string = canvas.toDataURL();
		releaseDate.style.backgroundImage = `url("${dataUrl}")`;
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}
}

function getReleaseDateLabels(padlockScreen: PadlockScreen): [string, string] {
	const releaseTimestampString: string | null = padlockScreen.getAttribute("release-timestamp");

	if (releaseTimestampString === null) {
		throw new Error("release-timestamp attribute is required !");
	}

	const releaseTimestamp: number = Number(releaseTimestampString);

	if (Number.isInteger(releaseTimestamp) === false) {
		throw new Error("release-timestamp attribute is not an integer !");
	}

	const releaseDate: Date = new Date(releaseTimestamp);

	const [date, hours] = releaseDate
		.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "medium" })
		.split(" ");

	return [date, hours];
}

function createCanvasAndContext(): [HTMLCanvasElement, CanvasRenderingContext2D] {
	const canvas = document.createElement("canvas");
	const canvasContext: CanvasRenderingContext2D | null = canvas.getContext("2d");

	if (canvasContext === null) {
		throw new Error("Failed to get canvas context");
	}

	return [canvas, canvasContext];
}
