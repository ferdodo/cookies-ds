import notesSansBase64 from "./notes-sans";
import poetsenOneBase64 from "./poetsen-one";

async function loadNotesSans() {
	const font: FontFace = new FontFace("ds-notes-sans", `url('${notesSansBase64}')`);
	await font.load();
	(document.fonts as any).add(font);
}

async function loadPoetsenOne() {
	const font: FontFace = new FontFace("ds-poetsen-one", `url('${poetsenOneBase64}')`);
	await font.load();
	(document.fonts as any).add(font);
}

export const notesSansLoaded = loadNotesSans();
export const poetsenOneLoaded = loadPoetsenOne();
