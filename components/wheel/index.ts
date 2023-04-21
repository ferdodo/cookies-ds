import template from "./template";
import wheelImgNumber0 from "./img/wheel-number-0";
import wheelImgNumber1 from "./img/wheel-number-1";
import wheelImgNumber2 from "./img/wheel-number-2";
import wheelImgNumber3 from "./img/wheel-number-3";
import wheelImgNumber4 from "./img/wheel-number-4";
import wheelImgNumber5 from "./img/wheel-number-5";
import wheelImgNumber6 from "./img/wheel-number-6";
import wheelImgNumber7 from "./img/wheel-number-7";
import wheelImgNumber8 from "./img/wheel-number-8";
import wheelImgNumber9 from "./img/wheel-number-9";
import wheelImgNumberUnknown from "./img/wheel-number-unknown";
import wheelImg from "./img/wheel";
import { getElement } from "../../utils/get-element";
import { getShadowRoot } from "../../utils/get-shadow-root";

const templateNode: HTMLTemplateElement = document.createElement("template");
templateNode.innerHTML = template;

export class Wheel extends HTMLElement {
	static get observedAttributes() {
		return ["unlockable", "number"];
	}

	connectedCallback() {
		this.attachShadow({ mode: "open" });
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		shadowRoot.appendChild(templateNode.content.cloneNode(true));
		this.render();
	}

	render() {
		const shadowRoot: ShadowRoot = getShadowRoot(this);
		const wheel: HTMLElement = getElement(shadowRoot, "#wheel");
		wheel.style.backgroundImage = `url('${wheelImg}')`;
		const unlockable: string | null = this.getAttribute("unlockable");
		const number1: HTMLElement = getElement(shadowRoot, "#number-1");
		const number2: HTMLElement = getElement(shadowRoot, "#number-2");
		const number3: HTMLElement = getElement(shadowRoot, "#number-3");
		const [n1, n2, n3] = parseNumbers(this);
		number1.style.backgroundImage = getNumberImage(n1);
		number2.style.backgroundImage = getNumberImage(n2);
		number3.style.backgroundImage = getNumberImage(n3);

		if (unlockable !== null) {
			wheel.style.filter = "contrast(1.5)";
		} else {
			wheel.style.filter = "none";
		}
	}

	attributeChangedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}
}

function parseNumbers(wheel: Wheel): [string, string, string] {
	const numberAttr: string | null = wheel.getAttribute("number");

	switch (numberAttr) {
		case null:
			return ["", "", ""];
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
		case "0":
			return [
				String((9 + Number(numberAttr)) % 10),
				numberAttr,
				String((11 + Number(numberAttr)) % 10)
			];
		case "?":
			return ["?", "?", "?"];
		default:
			throw new Error("unknwown number attribute !");
	}
}

function getNumberImage(numberTxt: string) {
	switch (numberTxt) {
		case "1":
			return `url('${wheelImgNumber1}')`;
		case "2":
			return `url('${wheelImgNumber2}')`;
		case "3":
			return `url('${wheelImgNumber3}')`;
		case "4":
			return `url('${wheelImgNumber4}')`;
		case "5":
			return `url('${wheelImgNumber5}')`;
		case "6":
			return `url('${wheelImgNumber6}')`;
		case "7":
			return `url('${wheelImgNumber7}')`;
		case "8":
			return `url('${wheelImgNumber8}')`;
		case "9":
			return `url('${wheelImgNumber9}')`;
		case "0":
			return `url('${wheelImgNumber0}')`;
		case "?":
			return `url('${wheelImgNumberUnknown}')`;
		case "":
			return "unset";
		default:
			throw new Error("Unknown wheel number !");
	}
}
