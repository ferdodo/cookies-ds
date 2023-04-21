import { Padlock } from "./components/padlock";
import { SmartPadlock } from "./components/smart-padlock";
import { Wheel } from "./components/wheel";
import { LcdScreen } from "./components/lcd-screen";
import { PadlockScreen } from "./components/padlock-screen";
import { Background } from "./components/background";
import { Panel } from "./components/panel";
import { P } from "./components/p";
import { H1 } from "./components/h1";
import { Info } from "./components/info";
import { DatetimePicker } from "./components/datetime-picker";
import { Breadcrumbs } from "./components/breadcrumbs";
import { SnackbarDock } from "./components/snackbar-dock";
import { A } from "./components/a";

export { enqueueSnackbar } from "./components/snackbar-dock";
export { setFavicon } from "./set-favicon";

const componentDefinitions = new Map<string, CustomElementConstructor>()
	.set("cookies-smart-padlock", SmartPadlock)
	.set("cookies-padlock", Padlock)
	.set("cookies-wheel", Wheel)
	.set("cookies-lcd-screen", LcdScreen)
	.set("cookies-padlock-screen", PadlockScreen)
	.set("cookies-background", Background)
	.set("cookies-panel", Panel)
	.set("cookies-p", P)
	.set("cookies-h1", H1)
	.set("cookies-info", Info)
	.set("cookies-datetime-picker", DatetimePicker)
	.set("cookies-breadcrumbs", Breadcrumbs)
	.set("cookies-snackbar-dock", SnackbarDock)
	.set("cookies-a", A);

for (const [name, element] of componentDefinitions) {
	customElements.define(name, element);
}
