export function getShadowRoot(element: HTMLElement): ShadowRoot {
	if (!element.shadowRoot) {
		throw new Error("There is no shadow root on the element !");
	}

	return element.shadowRoot;
}
