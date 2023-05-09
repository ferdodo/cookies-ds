import faviconBase64 from "./favicon.js";

function getOrCreateLink(): HTMLLinkElement {
	const link = document.querySelector("link[rel*='icon']");

	if (link) {
		return link as HTMLLinkElement;
	}

	const newLink = document.createElement("link");
	newLink.rel = "icon";
	document.head.appendChild(newLink);
	return newLink;
}

export function setFavicon() {
	const link: HTMLLinkElement = getOrCreateLink();
	link.href = faviconBase64;
}
