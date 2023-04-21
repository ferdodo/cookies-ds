export function getElement(shadowRoot: ShadowRoot, selector: string): HTMLElement {
	const element: HTMLElement | null = shadowRoot.querySelector(selector);

	if (!element) {
		throw new Error("Failed to find element ${ selector } !");
	}

	return element;
}
