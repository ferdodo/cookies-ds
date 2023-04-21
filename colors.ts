// from material palette generator "tools for picking color" using #0084ff as primary
const primary = { "600": "#0084ff", "900": "#1e3eb9" };
const complementary = { "900": "#ff7b00" };
const analogousA = { "200": "#00dee6" };
const analogousB = { "700": "#0004ff" };
const triadicA = { "500": "#7b00ff", "800": "#4700ec" };
const triadicB = { "400": "#ff0084" };

// main colors, with same level of "intensity", as
// defined by material palette generator
export const primaryColor = primary["600"];
export const secondaryColor = complementary["900"];
export const tertiaryColor = analogousA["200"];
export const quaternaryColor = analogousB["700"];
export const quinaryColor = triadicA["500"];
export const senaryColor = triadicB["400"];

// darker and lighter variations
export const primaryDarker = primary["900"];
export const quinaryDarker = triadicA["800"];

// meaningful usage
export const infoColor = tertiaryColor;
export const linkColor = primaryDarker;
export const linkVisitedColor = quinaryDarker;
export const neutralColor = primaryColor;
export const successColor = tertiaryColor;
export const errorColor = senaryColor;
export const warningColor = secondaryColor;
export const dangerColor = senaryColor;
