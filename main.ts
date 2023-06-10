import { Padlock } from "./components/padlock/index.js";
import { SmartPadlock } from "./components/smart-padlock/index.js";
import { Wheel } from "./components/wheel/index.js";
import { LcdScreen } from "./components/lcd-screen/index.js";
import { PadlockScreen } from "./components/padlock-screen/index.js";
import { Background } from "./components/background/index.js";
import { Panel } from "./components/panel/index.js";
import { P } from "./components/p/index.js";
import { H1 } from "./components/h1/index.js";
import { Info } from "./components/info/index.js";
import { DatetimePicker } from "./components/datetime-picker/index.js";
import { Breadcrumbs } from "./components/breadcrumbs/index.js";
import { SnackbarDock } from "./components/snackbar-dock/index.js";
import { A } from "./components/a/index.js";
import { Button } from "./components/button/index.js";

export { enqueueSnackbar } from "./components/snackbar-dock/index.js";
export { setFavicon } from "./set-favicon.js";

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
	.set("cookies-a", A)
	.set("cookies-button", Button);

for (const [name, element] of componentDefinitions) {
	customElements.define(name, element);
}
