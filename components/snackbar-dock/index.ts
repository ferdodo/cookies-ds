import template from "./template.js";
import { poetsenOneLoaded } from "../../fonts/index.js";
import { getShadowRoot } from "../../utils/get-shadow-root.js";
import { getElement } from "../../utils/get-element.js";
import { Subject, Observable, Subscription, fromEvent } from "rxjs";

interface Snackbar {
	message: string;
}

const closeCurrentSnackbar$ = new Subject();
const enqueueSnackbar$ = new Subject<Snackbar>();

const currentSnackbar$: Observable<Snackbar | null> = new Observable(function(subscriber) {
	const snackbarStore: Snackbar[] = [];
	let currentSnackbar: Snackbar | null = null;

	const enqueueSnackbarSubscription = enqueueSnackbar$.subscribe({
		next(snackbar: Snackbar) {
			if (currentSnackbar === null) {
				currentSnackbar = snackbar;
				subscriber.next(currentSnackbar);
			} else {
				snackbarStore.push(snackbar);
			}
		},
		complete() {
			enqueueSnackbarSubscription.unsubscribe();
		}
	});

	const closeCurrentSnackbarSubscription = closeCurrentSnackbar$.subscribe({
		next() {
			currentSnackbar = snackbarStore.shift() || null;
			subscriber.next(currentSnackbar);
		},
		complete() {
			closeCurrentSnackbarSubscription.unsubscribe();
		}
	});
});

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export function enqueueSnackbar(snackbar: Snackbar) {
	enqueueSnackbar$.next(snackbar);
}

export class SnackbarDock extends HTMLElement {
	currentSnackbar: Snackbar | null = null;
	currentSnackbarSubscription: Subscription | null = null;
	clickSubscription: Subscription | null = null;

	async connectedCallback() {
		await poetsenOneLoaded;
		this.attachShadow({ mode: "open" });
		const shadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		const snackbarContainer = getElement(shadowRoot, "#snackbar-container");

		this.clickSubscription = fromEvent(snackbarContainer, "click")
			.subscribe(() => {
				closeCurrentSnackbar$.next(null);
			});

		this.currentSnackbarSubscription = currentSnackbar$.subscribe(snackbar => {
			this.currentSnackbar = snackbar;
			this.render();
		});

		this.render();
	}

	render() {
		const shadowRoot = getShadowRoot(this);
		const p = getElement(shadowRoot, "p");
		const snackbarContainer = getElement(shadowRoot, "#snackbar-container");
		p.innerHTML = this.currentSnackbar?.message || "";

		setTimeout(() => {
			if (this.currentSnackbar) {
				snackbarContainer.classList.add("down");
			} else {
				snackbarContainer.classList.remove("down");
			}
		}, 10);
	}

	async disconnectedCallback() {
		this.currentSnackbarSubscription?.unsubscribe();
		this.clickSubscription?.unsubscribe();
	}
}
