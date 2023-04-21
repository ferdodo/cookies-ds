export function copyAttribute(attrName: string, source: HTMLElement, target: HTMLElement) {
	const value: string | null = source.getAttribute(attrName);

	if (value === null) {
		if (target.hasAttribute(attrName)) {
			target.removeAttribute(attrName);
		}
	} else {
		target.setAttribute(attrName, value);
	}
}
