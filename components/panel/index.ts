import template from "./template.js";
import { getElement } from "../../utils/get-element.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";
import { appReady } from "../../utils/app-ready.js";
import { acquireAnimationLock } from "../../utils/animation-lock.js";

declare global {
	export namespace JSX {
		export interface IntrinsicElements {
			"cookies-panel": {};
		}
	}
}

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class Panel extends HTMLElement {
	contentTimeoutElapsed: boolean = false;
	contentLoaded: boolean = false;
	connected: boolean = false;
	loading: string = "100";

	static get observedAttributes() {
		return ["loading", "panel-title"];
	}

	async connectedCallback() {
		this.attachShadow({ mode: "open" });
		await appReady;
		const release = await acquireAnimationLock();
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const loading: string | null = this.getAttribute("loading");

		if (loading !== null && isLoadingValid(loading)) {
			this.loading = loading;
		}

		setTimeout(() => {
			const panelContainer: HTMLElement = getElement(shadowRoot, "#panel-container");
			panelContainer.style.gridTemplateColumns = "1rem 1fr 1rem";
			panelContainer.style.gridTemplateRows = "1rem 1fr 1rem";
			const panel: HTMLElement = getElement(shadowRoot, "#panel");
			panel.style.backgroundColor = "#ffffff40";
			this.render();
		}, 10);

		setTimeout(() => {
			this.contentTimeoutElapsed = true;
			this.render();
		}, 400);

		setTimeout(release, 600);
		this.connected = true;
		this.render();
	}

	render() {
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		const panelContent: HTMLElement = getElement(shadowRoot, "#panel-content");
		const panelLoading: HTMLElement = getElement(shadowRoot, "#panel-loading");
		const panel: HTMLElement = getElement(shadowRoot, "#panel");
		const panelTitleContent: HTMLElement = getElement(shadowRoot, "#panel-title-content");

		if (this.contentTimeoutElapsed && isLoaded(this.loading)) {
			panelContent.style.visibility = "visible";
			panelContent.style.opacity = "1";
			panel.style.overflow = "auto";	
		} else {
			panelContent.style.visibility = "collapse";
			panelContent.style.opacity = "0";
			panel.style.overflow = "hidden";
		}

		panelLoading.style.width = `${this.loading}%`;

		const panelTitle: HTMLElement = getElement(shadowRoot, "#panel-title");

		if (this.loading === "100" && this.getAttribute("panel-title")) {
			setTimeout(() => {
				panelTitle.style.opacity = "1";
				panelTitleContent.innerHTML = this.getAttribute("panel-title");
				panelContent.style.paddingTop = "2.5rem";
			}, 10);
		} else {
			panelContent.style.paddingTop = "inherit";
			panelTitle.style.opacity = "0";
		}
	}

	attributeChangedCallback() {
		if (this.shadowRoot && this.connected) {
			const loading: string | null = this.getAttribute("loading");

			if (loading !== null && isLoadingValid(loading)) {
				this.loading = loading;
			} else if (loading === null) {
				this.loading = "100";
			}

			this.render();
		}
	}
}

function isLoadingValid(loading: string | null): boolean {
	const loadingAsNumber: number = Number(loading);
	const rounded: number = Math.floor(loadingAsNumber);

	return rounded == loadingAsNumber
		&& Number.isInteger(rounded)
		&& Number.isFinite(rounded)
		&& rounded <= 100
		&& rounded >= 0;
}

function isLoaded(loading: string | null): boolean {
	return loading === null || loading === "100";
}
