import { fromEvent, Observable, filter, map, mapTo, combineLatest, merge, first } from "rxjs";

function isWindowVisible(): boolean {
	return !document.hidden;
}

function visibleAndFocusedObservable(): Observable<boolean> {
	const visibilityChange$ = fromEvent(document, "visibilitychange");

	const focus$ = fromEvent(window, "focus")
		.pipe(mapTo(true));

	const blur$ = fromEvent(window, "blur")
		.pipe(mapTo(false));

	const focused$ = merge(focus$, blur$);

	return combineLatest(visibilityChange$, focused$)
		.pipe(
			map(([, focused]) => isWindowVisible() && focused),
			filter(visible => visible),
			first()
		);
}

async function waitVisible() {
	if (isWindowVisible()) {
		return;
	}

	await visibleAndFocusedObservable()
		.toPromise();
}

async function waitAppReady() {
	await new Promise(r => setTimeout(r, 400));
	await waitVisible();
	await new Promise(r => setTimeout(r, 400));
}

export const appReady = waitAppReady();
